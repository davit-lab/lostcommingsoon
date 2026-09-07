-- ============================================================================
-- REELS: add `link` column so each Reel can point to a room, service or page.
--   • Alters the table (idempotent ADD COLUMN IF NOT EXISTS)
--   • Extends ll_admin_save_reel to persist the link
--   • Backfills seed reels with sensible links
-- ============================================================================

ALTER TABLE public.lostlock_reels
  ADD COLUMN IF NOT EXISTS link TEXT NOT NULL DEFAULT '';

-- Extend admin save RPC to write the link field (kept drop/readd so both old and
-- new clients work: old clients omit p_link -> defaults to existing value).
CREATE OR REPLACE FUNCTION public.ll_admin_save_reel(
  p_username TEXT, p_password TEXT,
  p_id UUID,
  p_reel_id TEXT, p_position INT, p_title TEXT, p_description TEXT,
  p_video TEXT, p_thumbnail TEXT, p_likes INT,
  p_link TEXT DEFAULT NULL
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
    INSERT INTO public.lostlock_reels (reel_id, position, title, description, video, thumbnail, likes, link)
    VALUES (p_reel_id, coalesce(p_position, 0), coalesce(p_title,''), coalesce(p_description,''),
            coalesce(p_video,''), coalesce(p_thumbnail,''), coalesce(p_likes,0), coalesce(p_link,''))
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
        likes = coalesce(p_likes, likes),
        link = coalesce(p_link, link)
    WHERE id = p_id
    RETURNING *;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.ll_admin_save_reel(TEXT, TEXT, UUID, TEXT, INT, TEXT, TEXT, TEXT, TEXT, INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ll_admin_save_reel(TEXT, TEXT, UUID, TEXT, INT, TEXT, TEXT, TEXT, TEXT, INT, TEXT) TO anon;

-- Backfill seed reels with links to their rooms / pages.
UPDATE public.lostlock_reels SET link = '#marao'   WHERE reel_id = 'marao'    AND link = '';
UPDATE public.lostlock_reels SET link = '#train'   WHERE reel_id = 'train'    AND link = '';
UPDATE public.lostlock_reels SET link = '#balls'   WHERE reel_id = 'ball-pit' AND link = '';
UPDATE public.lostlock_reels SET link = '#sawdust' WHERE reel_id = 'sawdust'  AND link = '';
UPDATE public.lostlock_reels SET link = '#contact' WHERE reel_id = 'about'    AND link = '';