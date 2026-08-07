-- NAHJ AI — Integrity Hardening
-- Database-authoritative progression, reward idempotency, and quiz grading.

CREATE TABLE IF NOT EXISTS public.progression_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_key text NOT NULL,
  event_type text NOT NULL,
  xp_awarded integer NOT NULL DEFAULT 0,
  coins_awarded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_key)
);
ALTER TABLE public.progression_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.progression_events FROM anon, authenticated;
GRANT ALL ON public.progression_events TO service_role;

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  score_percent integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quiz_attempts_user_quiz_idx
  ON public.quiz_attempts(user_id, quiz_id, created_at DESC);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "own quiz attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));
REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM anon, authenticated;
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;

-- Learners receive a question projection without the answer key or explanation.
DROP VIEW IF EXISTS public.quiz_questions_public;
CREATE VIEW public.quiz_questions_public AS
SELECT q.id, q.quiz_id, q.kind, q.prompt, q.options, q.position
FROM public.quiz_questions q
JOIN public.quizzes z ON z.id = q.quiz_id
WHERE z.published = true;
REVOKE ALL ON public.quiz_questions_public FROM anon, authenticated;
GRANT SELECT ON public.quiz_questions_public TO anon, authenticated;
REVOKE ALL ON public.quiz_questions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO service_role;

-- Browser clients can read their progression but cannot mint or alter it.
REVOKE INSERT, UPDATE, DELETE ON public.user_progress FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_missions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_avatar_items FROM anon, authenticated;
GRANT SELECT ON public.user_progress, public.user_missions, public.user_achievements, public.user_avatar_items TO authenticated;

DROP POLICY IF EXISTS "own progress" ON public.user_progress;
CREATE POLICY "own progress" ON public.user_progress
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));
DROP POLICY IF EXISTS "own missions" ON public.user_missions;
CREATE POLICY "own missions" ON public.user_missions
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));
DROP POLICY IF EXISTS "own achievements" ON public.user_achievements;
CREATE POLICY "own achievements" ON public.user_achievements
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));
DROP POLICY IF EXISTS "own avatar items" ON public.user_avatar_items;
CREATE POLICY "own avatar items" ON public.user_avatar_items
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));

-- Protect authoritative profile fields even if an authenticated client has UPDATE privilege.
CREATE OR REPLACE FUNCTION public.protect_profile_authority()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_user IN ('postgres', 'service_role') OR public.has_role((select auth.uid()), 'admin') THEN
    RETURN NEW;
  END IF;

  IF (select auth.uid()) IS NULL OR (select auth.uid()) <> OLD.user_id THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  IF NEW.xp IS DISTINCT FROM OLD.xp
     OR NEW.coins IS DISTINCT FROM OLD.coins
     OR NEW.level IS DISTINCT FROM OLD.level
     OR NEW.streak IS DISTINCT FROM OLD.streak
     OR NEW.last_active_date IS DISTINCT FROM OLD.last_active_date
     OR NEW.suspended IS DISTINCT FROM OLD.suspended THEN
    RAISE EXCEPTION 'authoritative progression fields are server-managed';
  END IF;

  IF length(coalesce(NEW.display_name, '')) > 80
     OR length(coalesce(NEW.scholar_title, '')) > 120 THEN
    RAISE EXCEPTION 'profile text is too long';
  END IF;

  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_profile_authority ON public.profiles;
CREATE TRIGGER protect_profile_authority
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_authority();

-- Internal reward primitive. It is deliberately not executable by API roles.
CREATE OR REPLACE FUNCTION public.apply_progression_reward(
  p_user_id uuid,
  p_event_key text,
  p_event_type text,
  p_xp integer,
  p_coins integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted integer;
  v_profile public.profiles%ROWTYPE;
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_yesterday date := ((now() AT TIME ZONE 'UTC')::date - 1);
  v_streak integer;
  v_level integer := 1;
BEGIN
  IF p_xp < 0 OR p_coins < 0 OR p_event_key IS NULL OR length(p_event_key) > 200 THEN
    RAISE EXCEPTION 'invalid reward';
  END IF;

  INSERT INTO public.progression_events(user_id, event_key, event_type, xp_awarded, coins_awarded)
  VALUES (p_user_id, p_event_key, p_event_type, p_xp, p_coins)
  ON CONFLICT (user_id, event_key) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  SELECT * INTO v_profile
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;

  IF v_inserted = 0 THEN
    RETURN jsonb_build_object('rewarded', false, 'xp', 0, 'coins', 0,
      'level', v_profile.level, 'streak', v_profile.streak);
  END IF;

  v_streak := v_profile.streak;
  IF v_profile.last_active_date IS DISTINCT FROM v_today THEN
    v_streak := CASE
      WHEN v_profile.last_active_date = v_yesterday THEN v_profile.streak + 1
      ELSE 1
    END;
  END IF;

  -- Mirrors src/lib/gamification.ts: level n starts at 100 * (n - 1)^1.35 XP.
  WHILE v_level < 99 AND round(100 * power(v_level, 1.35)) <= v_profile.xp + p_xp LOOP
    v_level := v_level + 1;
  END LOOP;

  UPDATE public.profiles
  SET xp = xp + p_xp,
      coins = coins + p_coins,
      level = v_level,
      streak = v_streak,
      last_active_date = v_today
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'rewarded', true,
    'xp', p_xp,
    'coins', p_coins,
    'level', v_level,
    'levelUp', v_level > v_profile.level,
    'streak', v_streak
  );
END;
$$;
REVOKE ALL ON FUNCTION public.apply_progression_reward(uuid, text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_progression_reward(uuid, text, text, integer, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.grant_achievement_internal(p_user_id uuid, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achievement public.achievements%ROWTYPE;
  v_inserted integer;
BEGIN
  SELECT * INTO v_achievement FROM public.achievements WHERE code = p_code;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO public.user_achievements(user_id, achievement_id)
  VALUES (p_user_id, v_achievement.id)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF v_inserted = 1 THEN
    PERFORM public.apply_progression_reward(
      p_user_id,
      'achievement:' || p_code,
      'achievement',
      v_achievement.xp_reward,
      v_achievement.coin_reward
    );
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
REVOKE ALL ON FUNCTION public.grant_achievement_internal(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_achievement_internal(uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.bump_mission_internal(
  p_user_id uuid,
  p_code text,
  p_amount integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mission public.missions%ROWTYPE;
  v_period text;
  v_progress integer := 0;
  v_completed boolean := false;
  v_xp integer := 0;
  v_coins integer := 0;
BEGIN
  IF p_amount <= 0 OR p_amount > 100 THEN RAISE EXCEPTION 'invalid mission amount'; END IF;
  SELECT * INTO v_mission FROM public.missions WHERE code = p_code AND active = true;
  IF NOT FOUND THEN RETURN jsonb_build_object('updated', false); END IF;

  v_period := CASE
    WHEN v_mission.cadence = 'weekly' THEN to_char((now() AT TIME ZONE 'UTC')::date, 'IYYY-"W"IW')
    ELSE (now() AT TIME ZONE 'UTC')::date::text
  END;

  INSERT INTO public.user_missions(user_id, mission_id, progress, completed, period_key)
  VALUES (p_user_id, v_mission.id, least(v_mission.target, p_amount), p_amount >= v_mission.target, v_period)
  ON CONFLICT (user_id, mission_id, period_key) DO UPDATE
  SET progress = least(v_mission.target, public.user_missions.progress + p_amount),
      completed = public.user_missions.completed OR public.user_missions.progress + p_amount >= v_mission.target,
      updated_at = now()
  RETURNING progress, completed INTO v_progress, v_completed;

  IF v_completed THEN
    v_xp := v_mission.xp_reward;
    v_coins := v_mission.coin_reward;
    PERFORM public.apply_progression_reward(
      p_user_id,
      'mission:' || v_mission.code || ':' || v_period,
      'mission',
      v_xp,
      v_coins
    );
  END IF;

  RETURN jsonb_build_object('updated', true, 'completed', v_completed,
    'progress', v_progress, 'xp', v_xp, 'coins', v_coins);
END;
$$;
REVOKE ALL ON FUNCTION public.bump_mission_internal(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bump_mission_internal(uuid, text, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.complete_document(p_document_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := (select auth.uid());
  v_doc public.documents%ROWTYPE;
  v_progress_id uuid;
  v_reward jsonb;
  v_count integer;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT * INTO v_doc FROM public.documents WHERE id = p_document_id AND published = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'document not found'; END IF;

  INSERT INTO public.user_progress(user_id, document_id, completed, percent, last_read_at)
  VALUES (v_user, p_document_id, true, 100, now())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_progress_id;
  IF v_progress_id IS NULL THEN
    RETURN jsonb_build_object('completed', false, 'rewarded', false);
  END IF;

  v_reward := public.apply_progression_reward(
    v_user, 'document:' || p_document_id, 'document',
    v_doc.xp_reward, greatest(1, round(v_doc.xp_reward / 4.0))::integer
  );
  PERFORM public.bump_mission_internal(v_user, 'daily_read', 1);
  PERFORM public.grant_achievement_internal(v_user, 'first_read');

  SELECT count(*) INTO v_count
  FROM public.user_progress
  WHERE user_id = v_user AND completed = true AND document_id IS NOT NULL;
  IF v_count >= 5 THEN PERFORM public.grant_achievement_internal(v_user, 'five_reads'); END IF;

  RETURN v_reward || jsonb_build_object('completed', true, 'documentId', p_document_id);
END;
$$;
REVOKE ALL ON FUNCTION public.complete_document(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_document(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.complete_path_item(p_path_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := (select auth.uid());
  v_item public.path_items%ROWTYPE;
  v_progress_id uuid;
  v_reward jsonb;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT i.* INTO v_item
  FROM public.path_items i
  JOIN public.learning_paths p ON p.id = i.path_id
  WHERE i.id = p_path_item_id AND p.published = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'path item not found'; END IF;

  INSERT INTO public.user_progress(user_id, path_item_id, completed, percent, last_read_at)
  VALUES (v_user, p_path_item_id, true, 100, now())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_progress_id;
  IF v_progress_id IS NULL THEN
    RETURN jsonb_build_object('completed', false, 'rewarded', false);
  END IF;

  v_reward := public.apply_progression_reward(
    v_user, 'path_item:' || p_path_item_id, 'path_item',
    v_item.xp_reward, greatest(1, round(v_item.xp_reward / 4.0))::integer
  );
  PERFORM public.bump_mission_internal(v_user, 'daily_lesson', 1);
  RETURN v_reward || jsonb_build_object('completed', true, 'pathItemId', p_path_item_id);
END;
$$;
REVOKE ALL ON FUNCTION public.complete_path_item(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_path_item(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_quiz(p_quiz_id uuid, p_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := (select auth.uid());
  v_quiz public.quizzes%ROWTYPE;
  v_correct integer := 0;
  v_total integer := 0;
  v_percent integer := 0;
  v_passed boolean := false;
  v_reward jsonb := '{}'::jsonb;
  v_previous public.quiz_attempts%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  IF jsonb_typeof(p_answers) <> 'array' THEN RAISE EXCEPTION 'answers must be an array'; END IF;

  SELECT * INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id AND published = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'quiz not found'; END IF;

  SELECT * INTO v_previous
  FROM public.quiz_attempts
  WHERE user_id = v_user AND quiz_id = p_quiz_id AND passed = true
  ORDER BY created_at DESC LIMIT 1;
  IF FOUND THEN
    RETURN jsonb_build_object('alreadyPassed', true, 'correct', v_previous.correct_count,
      'total', v_previous.total_count, 'scorePercent', v_previous.score_percent,
      'passed', true, 'xp', 0, 'coins', 0);
  END IF;

  SELECT count(*) INTO v_total FROM public.quiz_questions WHERE quiz_id = p_quiz_id;
  IF v_total = 0 THEN RAISE EXCEPTION 'quiz has no questions'; END IF;

  SELECT count(*) INTO v_correct
  FROM public.quiz_questions q
  WHERE q.quiz_id = p_quiz_id
    AND lower(trim(q.answer)) = lower(trim(coalesce((
      SELECT a.value->>'answer'
      FROM jsonb_array_elements(p_answers) a
      WHERE a.value->>'question_id' = q.id::text
      LIMIT 1
    ), '')));

  v_percent := floor((v_correct::numeric * 100) / v_total)::integer;
  v_passed := v_percent >= 70;

  INSERT INTO public.quiz_attempts(user_id, quiz_id, answers, correct_count, total_count, score_percent, passed)
  VALUES (v_user, p_quiz_id, p_answers, v_correct, v_total, v_percent, v_passed);

  IF v_passed THEN
    v_reward := public.apply_progression_reward(
      v_user, 'quiz:' || p_quiz_id, 'quiz',
      v_quiz.xp_reward, greatest(1, round(v_quiz.xp_reward / 4.0))::integer
    );
    PERFORM public.bump_mission_internal(v_user, 'weekly_quiz', 1);
    PERFORM public.grant_achievement_internal(v_user, 'first_quiz');
  END IF;

  RETURN jsonb_build_object(
    'alreadyPassed', false,
    'correct', v_correct,
    'total', v_total,
    'scorePercent', v_percent,
    'passed', v_passed,
    'xp', coalesce((v_reward->>'xp')::integer, 0),
    'coins', coalesce((v_reward->>'coins')::integer, 0)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.submit_quiz(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_my_profile(
  p_display_name text DEFAULT NULL,
  p_scholar_title text DEFAULT NULL,
  p_avatar_config jsonb DEFAULT NULL,
  p_disclaimer_accepted boolean DEFAULT NULL
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := (select auth.uid());
  v_profile public.profiles;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  UPDATE public.profiles
  SET display_name = coalesce(p_display_name, display_name),
      scholar_title = coalesce(p_scholar_title, scholar_title),
      avatar_config = coalesce(p_avatar_config, avatar_config),
      disclaimer_accepted = coalesce(p_disclaimer_accepted, disclaimer_accepted)
  WHERE user_id = v_user
  RETURNING * INTO v_profile;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile not found'; END IF;
  RETURN v_profile;
END;
$$;
REVOKE ALL ON FUNCTION public.update_my_profile(text, text, jsonb, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_profile(text, text, jsonb, boolean) TO authenticated;

-- Internal functions are callable only by trusted database/server code.
REVOKE EXECUTE ON FUNCTION public.grant_achievement_internal(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_mission_internal(uuid, text, integer) FROM PUBLIC, anon, authenticated;
