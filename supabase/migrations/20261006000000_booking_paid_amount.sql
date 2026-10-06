-- Save the amount a client has already paid and update it together with the live check.

ALTER TABLE public.lostlock_bookings
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC NOT NULL DEFAULT 0
  CHECK (paid_amount >= 0);

CREATE OR REPLACE FUNCTION public.ll_admin_set_check(
  p_username TEXT,
  p_password TEXT,
  p_id UUID,
  p_items JSONB,
  p_paid_amount NUMERIC
)
RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.lostlock_bookings
  SET
    live_items = p_items,
    paid_amount = GREATEST(COALESCE(p_paid_amount, 0), 0)
  WHERE public.ll_admin_authorized(p_username, p_password)
    AND id = p_id;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_set_check(TEXT, TEXT, UUID, JSONB, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_set_check(TEXT, TEXT, UUID, JSONB, NUMERIC) TO anon;

-- Make newly created bookings store the deposit immediately.
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
    ref_code, event_date, session_hour, kids_count, extra_kids,
    base_price, extra_kids_cost, menu_items, menu_total, services,
    services_total, total_price, parent_name, phone, notes, status, paid_amount
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
    'new',
    greatest(coalesce((p_booking->>'paid_amount')::numeric, 0), 0)
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_create_booking(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_create_booking(TEXT, TEXT, JSONB) TO anon;
