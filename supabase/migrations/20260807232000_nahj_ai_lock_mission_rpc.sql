-- Mission progression is a consequence of trusted domain actions.
-- Learners must not be able to call bump_mission directly with arbitrary amounts.
REVOKE EXECUTE ON FUNCTION public.bump_mission(text, integer) FROM PUBLIC, anon, authenticated;
