
-- Singleton table holding all site content as JSON
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  assets JSONB NOT NULL DEFAULT '{}'::jsonb,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content (public website)
CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

-- Anyone can update / insert (admin auth is app-level for now)
CREATE POLICY "Anyone can insert site content"
  ON public.site_content FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update site content"
  ON public.site_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Touch updated_at automatically
CREATE OR REPLACE FUNCTION public.touch_site_content_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Realtime
ALTER TABLE public.site_content REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;

-- Seed singleton row if missing
INSERT INTO public.site_content (id, assets, translations)
VALUES ('main', '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
