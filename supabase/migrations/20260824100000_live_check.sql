-- Live event check (POS): manager adds bar/kitchen orders + walk-in kids during the event.

ALTER TABLE public.lostlock_bookings
  ADD COLUMN IF NOT EXISTS live_items JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.ll_admin_set_live_items(p_username TEXT, p_password TEXT, p_id UUID, p_items JSONB)
RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.lostlock_bookings
  SET live_items = p_items
  WHERE public.ll_admin_authorized(p_username, p_password)
    AND id = p_id;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_set_live_items(TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_set_live_items(TEXT, TEXT, UUID, JSONB) TO anon;
