DROP POLICY IF EXISTS "Site content is publicly readable" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can update site content" ON public.site_content;

CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert site content"
  ON public.site_content FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update site content"
  ON public.site_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_site_content_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_content_set_updated_at ON public.site_content;
CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_site_content_updated_at();

ALTER TABLE public.site_content REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'site_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
  END IF;
END
$$;

INSERT INTO public.site_content (id, assets, translations)
VALUES ('main', '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
