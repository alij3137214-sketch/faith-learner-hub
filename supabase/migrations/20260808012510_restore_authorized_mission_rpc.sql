CREATE OR REPLACE FUNCTION public.bump_mission(p_code text, p_amount integer DEFAULT 1)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := (select auth.uid());
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  RETURN public.bump_mission_internal(v_user, p_code, p_amount);
END;
$$;
REVOKE ALL ON FUNCTION public.bump_mission(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bump_mission(text, integer) TO authenticated;
