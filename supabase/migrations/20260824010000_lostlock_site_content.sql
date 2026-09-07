-- Lost Lock site content (namespaced to avoid clashing with other apps sharing this DB).

CREATE TABLE IF NOT EXISTS public.lostlock_site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  assets JSONB NOT NULL DEFAULT '{}'::jsonb,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lostlock_site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lostlock site content is publicly readable" ON public.lostlock_site_content;
CREATE POLICY "Lostlock site content is publicly readable"
  ON public.lostlock_site_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert lostlock site content" ON public.lostlock_site_content;
CREATE POLICY "Anyone can insert lostlock site content"
  ON public.lostlock_site_content FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update lostlock site content" ON public.lostlock_site_content;
CREATE POLICY "Anyone can update lostlock site content"
  ON public.lostlock_site_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lostlock_site_content TO anon;
GRANT ALL ON public.lostlock_site_content TO service_role;

CREATE OR REPLACE FUNCTION public.ll_touch_site_content_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ll_site_content_set_updated_at ON public.lostlock_site_content;
CREATE TRIGGER ll_site_content_set_updated_at
  BEFORE UPDATE ON public.lostlock_site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.ll_touch_site_content_updated_at();

ALTER TABLE public.lostlock_site_content REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'lostlock_site_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lostlock_site_content;
  END IF;
END
$$;

INSERT INTO public.lostlock_site_content (id, assets, translations)
VALUES ('main', '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
