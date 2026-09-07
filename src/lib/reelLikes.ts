// ============================================================================
// REEL LIKES — DEVICE-LOCAL STATE + BACKEND SEAM
// ============================================================================
// Likes are intentionally kept device-local for now:
//   • The visitor's `liked` flags are persisted in localStorage so a refresh
//     keeps their like.
//   • Seed counts come from `src/config/reels.ts`.
//
// BACKEND / DATABASE INTEGRATION (when you want global, real like counts):
//   The site already ships with Supabase. To make likes server-side:
//
//   1) Create a table + RPC, e.g.:
//        create table public.lostlock_reel_likes (
//          reel_id    text primary key,
//          like_count integer not null default 0
//        );
//        alter table public.lostlock_reel_likes enable row level security;
//        create policy "read likes" on public.lostlock_reel_likes
//          for select using (true);
//        create or replace function public.ll_add_reel_like(p_reel_id text, p_delta integer)
//        returns integer language plpgsql security definer set search_path = public
//        as $$
//          insert into public.lostlock_reel_likes as l (reel_id, like_count)
//          values (p_reel_id, greatest(p_delta, 0))
//          on conflict (reel_id) do update set like_count = greatest(l.like_count + p_delta, 0)
//          returning like_count
//        $$;
//        grant execute on function public.ll_add_reel_like(text, integer) to anon;
//
//   2) Import the supabase client here and implement the two functions below.
//      `syncReelLike(reelId, liked)` is already called by the viewer on every
//      toggle — wire it up and server counts become the source of truth.
// ============================================================================

const STORAGE_KEY = 'lostlock_reel_likes_v1';

export function readLikedState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function persistLikedState(state: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode / quota) — likes just won't persist
  }
}

/**
 * Called by the viewer whenever a Like is toggled.
 * Currently a no-op placeholder — the backend integration point.
 */
export async function syncReelLike(reelId: string, liked: boolean): Promise<void> {
  void reelId;
  void liked;
}