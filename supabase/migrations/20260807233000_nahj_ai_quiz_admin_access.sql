-- Preserve the admin publishing workflow while keeping answer keys out of learner queries.
-- Learners use quiz_questions_public; authenticated admins may manage the source table.
REVOKE ALL ON public.quiz_questions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;

DROP POLICY IF EXISTS "quiz questions readable" ON public.quiz_questions;
CREATE POLICY "quiz questions admin read" ON public.quiz_questions
  FOR SELECT TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'));

DROP POLICY IF EXISTS "quiz questions admin manage" ON public.quiz_questions;
CREATE POLICY "quiz questions admin manage" ON public.quiz_questions
  FOR ALL TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'))
  WITH CHECK (public.has_role((select auth.uid()), 'admin'));
