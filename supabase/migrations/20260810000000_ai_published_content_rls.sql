-- AI grounding reads published source material through the publishable client.
-- Keep public reads independent of the admin role-check helper; admin writes remain protected.
DROP POLICY IF EXISTS "published documents readable" ON public.documents;
CREATE POLICY "published documents readable" ON public.documents
  FOR SELECT
  USING (published);

DROP POLICY IF EXISTS "published scholars readable" ON public.scholars;
CREATE POLICY "published scholars readable" ON public.scholars
  FOR SELECT
  USING (published);
