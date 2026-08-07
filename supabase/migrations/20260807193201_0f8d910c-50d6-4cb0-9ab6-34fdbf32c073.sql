REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "published scholars readable" ON public.scholars;
CREATE POLICY "published scholars readable" ON public.scholars FOR SELECT USING (published);
CREATE POLICY "admins read all scholars" ON public.scholars FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY "published documents readable" ON public.documents;
CREATE POLICY "published documents readable" ON public.documents FOR SELECT USING (published);
CREATE POLICY "admins read all documents" ON public.documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY "published paths readable" ON public.learning_paths;
CREATE POLICY "published paths readable" ON public.learning_paths FOR SELECT USING (published);
CREATE POLICY "admins read all paths" ON public.learning_paths FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY "published quizzes readable" ON public.quizzes;
CREATE POLICY "published quizzes readable" ON public.quizzes FOR SELECT USING (published);
CREATE POLICY "admins read all quizzes" ON public.quizzes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
