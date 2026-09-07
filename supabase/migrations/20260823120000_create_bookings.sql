CREATE TABLE IF NOT EXISTS public.lostlock_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code TEXT NOT NULL UNIQUE,
  event_date DATE,
  session_hour TEXT,
  kids_count INT NOT NULL DEFAULT 20,
  extra_kids INT NOT NULL DEFAULT 0,
  base_price NUMERIC NOT NULL DEFAULT 0,
  extra_kids_cost NUMERIC NOT NULL DEFAULT 0,
  menu_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  menu_total NUMERIC NOT NULL DEFAULT 0,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  services_total NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lostlock_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create lostlock bookings" ON public.lostlock_bookings;
CREATE POLICY "Anyone can create lostlock bookings"
  ON public.lostlock_bookings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can manage lostlock bookings" ON public.lostlock_bookings;
CREATE POLICY "Authenticated can manage lostlock bookings"
  ON public.lostlock_bookings FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update lostlock bookings" ON public.lostlock_bookings;
CREATE POLICY "Authenticated can update lostlock bookings"
  ON public.lostlock_bookings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT INSERT ON public.lostlock_bookings TO anon;
GRANT SELECT, UPDATE, DELETE ON public.lostlock_bookings TO authenticated;
GRANT ALL ON public.lostlock_bookings TO service_role;

CREATE OR REPLACE FUNCTION public.ll_touch_bookings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ll_bookings_set_updated_at ON public.lostlock_bookings;
CREATE TRIGGER ll_bookings_set_updated_at
  BEFORE UPDATE ON public.lostlock_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.ll_touch_bookings_updated_at();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'lostlock_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lostlock_bookings;
  END IF;
END
$$;
