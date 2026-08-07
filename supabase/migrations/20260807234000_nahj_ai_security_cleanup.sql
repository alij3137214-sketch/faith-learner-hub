-- NAHJ AI — security cleanup and query-performance hardening.
-- Applied to the connected Supabase project before this migration was synchronized to GitHub.

-- Learners must use get_quiz_questions_public(); the source table contains answer keys.
DROP POLICY IF EXISTS "quiz questions readable" ON public.quiz_questions;

-- Cover the quiz_id foreign key used by quiz attempt queries and joins.
CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_id_idx
  ON public.quiz_attempts(quiz_id);

-- Keep auth.uid() in the RLS initplan for profile policies.
DROP POLICY IF EXISTS "own profile insert" ON public.profiles;
CREATE POLICY "own profile insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "own profile update" ON public.profiles;
CREATE POLICY "own profile update" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'))
  WITH CHECK ((select auth.uid()) = user_id OR public.has_role((select auth.uid()), 'admin'));

DROP POLICY IF EXISTS "admin delete profile" ON public.profiles;
CREATE POLICY "admin delete profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'));
