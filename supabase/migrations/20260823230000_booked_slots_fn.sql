-- Public availability check: returns only date+hour pairs of ACTIVE Lost Lock bookings.
-- Keeps guest names/phones private (anon cannot SELECT the table itself).

CREATE OR REPLACE FUNCTION public.ll_get_booked_slots(from_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (event_date DATE, session_hour TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.event_date, b.session_hour
  FROM public.lostlock_bookings b
  WHERE b.event_date >= from_date
    AND b.status <> 'cancelled'
    AND b.session_hour IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.ll_get_booked_slots(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_get_booked_slots(DATE) TO anon, authenticated;
