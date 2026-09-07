-- Phone notifications (Telegram), settings storage, and auto-complete automation.

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- ================= SETTINGS STORAGE =================
create table if not exists public.lostlock_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.lostlock_settings enable row level security;
-- no policies: accessible only through SECURITY DEFINER functions below

create or replace function public.ll_admin_get_setting(p_username text, p_password text, p_key text)
returns jsonb
language sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT value FROM public.lostlock_settings
  WHERE key = p_key AND public.ll_admin_authorized(p_username, p_password);
$$;

create or replace function public.ll_admin_set_setting(p_username text, p_password text, p_key text, p_value jsonb)
returns void
language sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.lostlock_settings (key, value)
  VALUES (p_key, p_value)
  ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = now()
  WHERE public.ll_admin_authorized(p_username, p_password);
$$;

-- send arbitrary message using stored telegram config (for the test button)
create or replace function public.ll_admin_send_telegram(p_username text, p_password text, p_text text)
returns text
language plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
  req bigint;
BEGIN
  IF NOT public.ll_admin_authorized(p_username, p_password) THEN
    RETURN 'unauthorized';
  END IF;
  SELECT value INTO cfg FROM public.lostlock_settings WHERE key = 'telegram';
  IF cfg IS NULL OR coalesce(cfg->>'bot_token','') = '' OR coalesce(cfg->>'chat_id','') = '' THEN
    RETURN 'not_configured';
  END IF;
  SELECT id INTO req FROM net.http_post(
    url := 'https://api.telegram.org/bot' || cfg->>'bot_token' || '/sendMessage',
    body := jsonb_build_object('chat_id', cfg->>'chat_id', 'text', p_text)
  );
  RETURN 'sent';
END $$;

-- ================= NEW BOOKING -> TELEGRAM PUSH =================
create or replace function public.ll_notify_booking_created()
returns trigger
language plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg jsonb;
  msg text;
BEGIN
  SELECT value INTO cfg FROM public.lostlock_settings WHERE key = 'telegram';
  IF cfg IS NULL OR coalesce(cfg->>'bot_token','') = '' OR coalesce(cfg->>'chat_id','') = '' THEN
    RETURN NEW; -- not configured yet: skip silently
  END IF;

  msg := format(
    E'<b>ახალი ჯავშანი · Lost Lock</b>\n' ||
    '№ <b>%s</b>\n' ||
    '<b>%s</b> · %s\n' ||
    '%s ბავშვი\n' ||
    '%s — %s\n' ||
    'სულ: <b>%s ₾</b>',
    NEW.ref_code,
    NEW.parent_name,
    NEW.phone,
    NEW.kids_count,
    to_char(NEW.event_date, 'DD Month YYYY'),
    coalesce(NEW.session_hour, '—'),
    round(NEW.total_price)::text
  );

  BEGIN
    PERFORM net.http_post(
      url := 'https://api.telegram.org/bot' || cfg->>'bot_token' || '/sendMessage',
      body := jsonb_build_object('chat_id', cfg->>'chat_id', 'text', msg, 'parse_mode', 'HTML')
    );
  EXCEPTION WHEN others THEN
    NULL; -- never block a booking because of notify failures
  END;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS ll_bookings_notify ON public.lostlock_bookings;
CREATE TRIGGER ll_bookings_notify
  AFTER INSERT ON public.lostlock_bookings
  FOR EACH ROW EXECUTE FUNCTION public.ll_notify_booking_created();

-- ================= AUTO-COMPLETE PASSED EVENTS =================
DO $$
BEGIN
  PERFORM cron.unschedule('ll-autocomplete');
EXCEPTION WHEN others THEN NULL;
END $$;

SELECT cron.schedule('ll-autocomplete', '7 * * * *', $$
  UPDATE public.lostlock_bookings
  SET status = 'completed'
  WHERE status = 'confirmed'
    AND ((event_date)::text || ' ' || coalesce(session_hour, '00:00'))::timestamp
        < now() - interval '2 hours'
$$);
