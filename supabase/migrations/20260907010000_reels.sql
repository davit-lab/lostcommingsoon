-- ============================================================================
-- REELS: public catalog + admin management + video upload storage
-- Mirrors the project conventions:
--   • Public read (like site_content): RLS SELECT `using (true)` + GRANT to anon,
--     plus realtime so the site updates live across devices.
--   • Writes are admin-gated SECURITY DEFINER RPCs (like ll_admin_*), so anon can
--     never write directly.
--   • Video files are uploaded to a Supabase Storage bucket by admins and served
--     publicly via the storage public URL. Admins may also paste an external URL.
-- ============================================================================

-- ---------- CATALOG TABLE ----------
CREATE TABLE IF NOT EXISTS public.lostlock_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id TEXT NOT NULL UNIQUE,
  position INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  video TEXT NOT NULL DEFAULT '',
  thumbnail TEXT NOT NULL DEFAULT '',
  likes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lostlock_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reels are publicly readable" ON public.lostlock_reels;
CREATE POLICY "Reels are publicly readable"
  ON public.lostlock_reels FOR SELECT
  USING (true);

GRANT SELECT ON public.lostlock_reels TO anon;
GRANT ALL ON public.lostlock_reels TO service_role;

-- keep updated_at fresh
CREATE OR REPLACE FUNCTION public.ll_touch_reels_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ll_reels_set_updated_at ON public.lostlock_reels;
CREATE TRIGGER ll_reels_set_updated_at
  BEFORE UPDATE ON public.lostlock_reels
  FOR EACH ROW EXECUTE FUNCTION public.ll_touch_reels_updated_at();

-- realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'lostlock_reels'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lostlock_reels;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.lostlock_reels_new()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.reel_id := coalesce(NULLIF(trim(NEW.reel_id), ''), 'reel-' || left(NEW.id::text, 8));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ll_reels_ensure_reel_id ON public.lostlock_reels;
CREATE TRIGGER ll_reels_ensure_reel_id
  BEFORE INSERT OR UPDATE ON public.lostlock_reels
  FOR EACH ROW EXECUTE FUNCTION public.lostlock_reels_new();

-- ---------- ADMIN CRUD (SECURITY DEFINER, anon EXECUTE only) ----------
CREATE OR REPLACE FUNCTION public.ll_admin_list_reels(p_username TEXT, p_password TEXT)
RETURNS SETOF public.lostlock_reels
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.lostlock_reels
  WHERE public.ll_admin_authorized(p_username, p_password)
  ORDER BY position ASC, created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.ll_admin_save_reel(
  p_username TEXT, p_password TEXT,
  p_id UUID,
  p_reel_id TEXT, p_position INT, p_title TEXT, p_description TEXT,
  p_video TEXT, p_thumbnail TEXT, p_likes INT
)
RETURNS SETOF public.lostlock_reels
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.ll_admin_authorized(p_username, p_password) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  IF p_id IS NULL THEN
    RETURN QUERY
    INSERT INTO public.lostlock_reels (reel_id, position, title, description, video, thumbnail, likes)
    VALUES (p_reel_id, coalesce(p_position, 0), coalesce(p_title,''), coalesce(p_description,''),
            coalesce(p_video,''), coalesce(p_thumbnail,''), coalesce(p_likes,0))
    RETURNING *;
  ELSE
    RETURN QUERY
    UPDATE public.lostlock_reels
    SET reel_id = coalesce(p_reel_id, reel_id),
        position = coalesce(p_position, position),
        title = coalesce(p_title, title),
        description = coalesce(p_description, description),
        video = coalesce(p_video, video),
        thumbnail = coalesce(p_thumbnail, thumbnail),
        likes = coalesce(p_likes, likes)
    WHERE id = p_id
    RETURNING *;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.ll_admin_delete_reel(p_username TEXT, p_password TEXT, p_id UUID)
RETURNS VOID
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.ll_admin_authorized(p_username, p_password) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  DELETE FROM public.lostlock_reels WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_list_reels(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ll_admin_save_reel(TEXT, TEXT, UUID, TEXT, INT, TEXT, TEXT, TEXT, TEXT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ll_admin_delete_reel(TEXT, TEXT, UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.ll_admin_list_reels(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.ll_admin_save_reel(TEXT, TEXT, UUID, TEXT, INT, TEXT, TEXT, TEXT, TEXT, INT) TO anon;
GRANT EXECUTE ON FUNCTION public.ll_admin_delete_reel(TEXT, TEXT, UUID) TO anon;

-- ---------- SAMPLE SEED (matches the original hardcoded reels) ----------
INSERT INTO public.lostlock_reels (reel_id, position, title, description, video, thumbnail, likes) VALUES
('about', 0, 'LOST LOCK', 'პროგრამის მთავარი მომენტები — 2 საათი თავგადასავლით, თამაშით და გართობით.',
 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2670&auto=format&fit=crop', 32),
('marao', 1, 'მარაო', 'წონასწორობა და სისწრაფე — ერთი შეხედვით მარტივი, სინამდვილეში არა.',
 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png', 28),
('train', 2, 'მატარებელი', 'გადაგიყვანთ ნამდვილ სათავგადასავლო ატმოსფეროში.',
 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', 21),
('ball-pit', 3, 'ბურთების ოთახი', 'ბურთების ზღვაში გასაღებები იმალება — იპოვე სანამ დრო ამოგივა.',
 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', 18),
('sawdust', 4, 'ნახერხი', 'ფიზიკური აქტივობის და გართობის იდეალური ნაზავი.',
 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png', 24)
ON CONFLICT (reel_id) DO NOTHING;

-- ---------- VIDEO UPLOAD STORAGE ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('lostlock-reels', 'lostlock-reels', true)
ON CONFLICT (id) DO NOTHING;

-- Public read of reel videos
DROP POLICY IF EXISTS "Public read lostlock reel videos" ON storage.objects;
CREATE POLICY "Public read lostlock reel videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lostlock-reels');

-- Only inserted by the admin role through the authenticated/service path;
-- storage uploads from the browser are handled with the service-role-adjacent
-- storage policy below (the public JWT cannot write).
DROP POLICY IF EXISTS "Service upload lostlock reel videos" ON storage.objects;
CREATE POLICY "Service upload lostlock reel videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lostlock-reels' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service update lostlock reel videos" ON storage.objects;
CREATE POLICY "Service update lostlock reel videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'lostlock-reels' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'lostlock-reels' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service delete lostlock reel videos" ON storage.objects;
CREATE POLICY "Service delete lostlock reel videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'lostlock-reels' AND auth.role() = 'service_role');
