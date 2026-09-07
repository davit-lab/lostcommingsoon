-- Admin RPCs for managing Lost Lock bookings.
-- The site uses client-side admin auth (no Supabase accounts), so these SECURITY DEFINER
-- functions verify the same credentials server-side before touching personal data.

CREATE OR REPLACE FUNCTION public.ll_admin_authorized(p_username TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_username = 'lostlock' AND p_password = 'lostlock2013';
$$;

CREATE OR REPLACE FUNCTION public.ll_admin_get_bookings(p_username TEXT, p_password TEXT)
RETURNS SETOF public.lostlock_bookings
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.lostlock_bookings
  WHERE public.ll_admin_authorized(p_username, p_password)
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.ll_admin_set_booking_status(p_username TEXT, p_password TEXT, p_id UUID, p_status TEXT)
RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.lostlock_bookings
  SET status = p_status
  WHERE public.ll_admin_authorized(p_username, p_password)
    AND id = p_id
    AND p_status IN ('new', 'confirmed', 'completed', 'cancelled');
$$;

CREATE OR REPLACE FUNCTION public.ll_admin_delete_booking(p_username TEXT, p_password TEXT, p_id UUID)
RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.lostlock_bookings
  WHERE public.ll_admin_authorized(p_username, p_password)
    AND id = p_id;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_authorized(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ll_admin_get_bookings(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ll_admin_set_booking_status(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ll_admin_delete_booking(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_get_bookings(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.ll_admin_set_booking_status(TEXT, TEXT, UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.ll_admin_delete_booking(TEXT, TEXT, UUID) TO anon;
