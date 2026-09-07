-- Admin-only booking creation.
-- Mirrors the existing ll_admin_* pattern: credentials are checked inside a
-- SECURITY DEFINER function so the anon role can never read or write the table
-- directly, yet the admin panel (which has no Supabase Auth session) can create
-- bookings and get back the inserted row.

CREATE OR REPLACE FUNCTION public.ll_admin_create_booking(p_username TEXT, p_password TEXT, p_booking JSONB)
RETURNS SETOF public.lostlock_bookings
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.ll_admin_authorized(p_username, p_password) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  INSERT INTO public.lostlock_bookings (
    ref_code,
    event_date,
    session_hour,
    kids_count,
    extra_kids,
    base_price,
    extra_kids_cost,
    menu_items,
    menu_total,
    services,
    services_total,
    total_price,
    parent_name,
    phone,
    notes,
    status
  )
  VALUES (
    p_booking->>'ref_code',
    (p_booking->>'event_date')::date,
    p_booking->>'session_hour',
    coalesce((p_booking->>'kids_count')::int, 20),
    coalesce((p_booking->>'extra_kids')::int, 0),
    coalesce((p_booking->>'base_price')::numeric, 0),
    coalesce((p_booking->>'extra_kids_cost')::numeric, 0),
    coalesce(p_booking->'menu_items', '[]'::jsonb),
    coalesce((p_booking->>'menu_total')::numeric, 0),
    coalesce(p_booking->'services', '[]'::jsonb),
    coalesce((p_booking->>'services_total')::numeric, 0),
    coalesce((p_booking->>'total_price')::numeric, 0),
    p_booking->>'parent_name',
    p_booking->>'phone',
    coalesce(p_booking->>'notes', ''),
    'new'
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_create_booking(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_create_booking(TEXT, TEXT, JSONB) TO anon;

-- Closing the leftover public write path: bookings are now created exclusively
-- through the admin-gated function above. The public site still learns which
-- slots are taken via ll_get_booked_slots (no PII exposed).
DROP POLICY IF EXISTS "Anyone can create lostlock bookings" ON public.lostlock_bookings;
REVOKE INSERT ON public.lostlock_bookings FROM anon;