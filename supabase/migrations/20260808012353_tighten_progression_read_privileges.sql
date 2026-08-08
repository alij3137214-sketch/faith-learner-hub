REVOKE SELECT ON public.quiz_attempts, public.user_progress, public.user_missions, public.user_achievements, public.user_avatar_items FROM anon;
GRANT SELECT ON public.quiz_attempts, public.user_progress, public.user_missions, public.user_achievements, public.user_avatar_items TO authenticated;
REVOKE SELECT ON public.quiz_questions FROM anon, authenticated;
GRANT SELECT ON public.quiz_questions_public TO anon, authenticated;
