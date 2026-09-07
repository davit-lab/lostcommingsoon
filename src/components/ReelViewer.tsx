import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, X, Play, Check, Volume2, VolumeX, Loader2, Home, ExternalLink } from 'lucide-react';
import { Reel } from '@/types';
import { readLikedState, persistLikedState, syncReelLike } from '@/lib/reelLikes';
import { REELS_COPIED_LABEL, REELS_SHARE_LABEL } from '@/config/reels';

interface ReelViewerProps {
  reels: Reel[];
  initialId: string;
  onClose: () => void;
  onGoHome?: () => void;
}

const reelUrl = (id: string) => `${window.location.origin}${window.location.pathname}#/reels/${id}`;

/* ------------------------------------------------------------------ */
/*  Small round icon button                                            */
/* ------------------------------------------------------------------ */
const RoundBtn: React.FC<{ label: string; onClick?: () => void; pressed?: boolean; children: React.ReactNode }> = ({
  label, onClick, pressed, children,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={pressed}
    className={`group flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border backdrop-blur-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-105 ${
      pressed ? 'border-white/40 bg-white/30 text-[#ff5a5f]' : 'border-white/15 bg-black/55 text-white hover:bg-black/75'
    }`}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  Like                                                               */
/* ------------------------------------------------------------------ */
const LikeAction: React.FC<{ liked: boolean; likes: number; onToggle: () => void }> = ({ liked, likes, onToggle }) => (
  <div className="flex flex-col items-center gap-1.5">
    <RoundBtn label="Like" onClick={onToggle} pressed={liked}>
      <motion.span key={liked ? 'on' : 'off'} initial={{ scale: liked ? 0.5 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
        <Heart size={24} className={liked ? 'fill-[#ff5a5f] text-[#ff5a5f]' : 'text-white'} />
      </motion.span>
    </RoundBtn>
    <span aria-hidden="true" className="text-[10px] font-bold tabular-nums text-white/90">{likes}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Share                                                              */
/* ------------------------------------------------------------------ */
const ShareAction: React.FC<{ reel: Reel }> = ({ reel }) => {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = reelUrl(reel.id);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: reel.title, text: reel.description, url });
      } catch (e) {
        const err = e as { name?: string };
        if (err?.name !== 'AbortError') console.error('[reel] share failed', e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('[reel] copy failed', e);
      }
    }
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <RoundBtn label="Share" onClick={share}>
        {copied ? <Check size={22} className="text-emerald-400" /> : <Share2 size={22} />}
      </RoundBtn>
      <span aria-hidden="true" className="text-[10px] font-bold text-white/90 whitespace-nowrap">
        {copied ? REELS_COPIED_LABEL : REELS_SHARE_LABEL}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  One snap slide                                                     */
/* ------------------------------------------------------------------ */
interface ReelSlideProps {
  reel: Reel;
  index: number;
  total: number;
  active: boolean;
  nearby: boolean;
  liked: boolean;
  likes: number;
  muted: boolean;
  onToggleLike: () => void;
  onClose: () => void;
  onGoHome: () => void;
  onToggleMuted: () => void;
}

const ReelSlide: React.FC<ReelSlideProps> = ({
  reel, index, total, active, nearby, liked, likes, muted, onToggleLike, onClose, onGoHome, onToggleMuted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [playing, setPlaying] = useState(false);
  const src = active || nearby ? reel.video : undefined;

  // Reset per-reel state when switching
  useEffect(() => {
    setFailed(false);
    setBuffering(true);
    setPlaying(false);
  }, [reel.id]);

  // Autoplay the active Reel; pause everything else.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!active) {
      v.pause();
      setPlaying(false);
      return;
    }
    const onLoaded = () => {
      setBuffering(false);
      const p = v.play();
      if (p) p.then(() => setPlaying(true)).catch(() => setFailed(true));
    };
    const tryPlay = () => {
      v.muted = muted;
      if (v.readyState >= 2) {
        onLoaded();
      } else {
        v.addEventListener('loadeddata', onLoaded);
      }
    };
    tryPlay();
    return () => v.removeEventListener('loadeddata', onLoaded);
  }, [active, muted, reel.id]);

  // Manual play/pause on tap of the video area.
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setFailed(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      data-reel-slide
      data-reel-id={reel.id}
      className="group relative h-screen supports-[height:100dvh]:h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
    >
      {/* close + counter */}
      <div
        className="absolute z-40 flex items-center gap-2"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)', left: 'calc(env(safe-area-inset-left, 0px) + 12px)', right: 'calc(env(safe-area-inset-right, 0px) + 12px)' }}
      >
        <button
          type="button"
          onClick={onGoHome}
          aria-label="Back to Home"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white border border-white/15 backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Home size={18} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white border border-white/15 backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X size={20} />
        </button>
        <span className="ml-auto rounded-full bg-black/50 px-3.5 py-1.5 text-[11px] font-bold tabular-nums text-white/80 backdrop-blur-sm">
          {index + 1} / {total}
        </span>
      </div>

      {/* centered 9:16 stage — full-bleed on phones, contained portrait on desktop */}
      <div className="relative mx-auto flex h-full w-full items-center justify-center">
        <div className="relative aspect-[9/16] h-full w-full max-h-[100dvh] bg-black md:aspect-[9/16] md:h-[92dvh] md:max-h-none md:w-auto md:max-w-full md:shrink-0 md:overflow-hidden md:rounded-[32px] md:shadow-2xl">
          {/* poster while buffering or on failure */}
          {!failed && (
            <img src={reel.thumbnail} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {src && (
            <video
              ref={videoRef}
              src={src}
              poster={reel.thumbnail}
              loop
              muted={muted}
              playsInline
              preload={active ? 'auto' : 'metadata'}
              autoPlay={false}
              onError={() => setFailed(true)}
              onWaiting={() => setBuffering(true)}
              onPlaying={() => { setBuffering(false); setPlaying(true); }}
              onPause={() => setPlaying(false)}
              onCanPlay={() => setBuffering(false)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* failed state */}
          {(!src || failed) && (
            <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white/80 border border-white/10 backdrop-blur-sm">
                <Play size={20} className="ml-0.5" />
              </span>
            </div>
          )}

          {/* tap anywhere on the video toggles play/pause */}
          <div className="absolute inset-0 z-10" onClick={togglePlay} role="button" aria-label="Play / Pause" />

          {/* tapping again re-shows controls; show big center play when paused */}
          {!active && !playing && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white/90 border border-white/15 backdrop-blur-sm">
                <Play size={24} className="ml-1" />
              </span>
            </div>
          )}

          {/* buffering spinner */}
          {active && buffering && !failed && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-white/80" />
            </div>
          )}

          {/* legibility gradient + caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 pr-20 md:pr-24"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
          >
            <h3 className="text-xl md:text-2xl font-vintage text-white uppercase tracking-wide leading-none drop-shadow-lg">{reel.title}</h3>
            <p className="max-w-sm text-[13px] md:text-sm font-semibold text-white/90 leading-snug drop-shadow">{reel.description}</p>
          </div>

          {/* action rail */}
          <div
            className="absolute right-3 md:right-4 z-30 flex flex-col items-center gap-3 md:gap-4"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 104px)' }}
          >
            <LikeAction liked={liked} likes={likes} onToggle={onToggleLike} />
            <ShareAction reel={reel} />
            {reel.link && (
              <div className="flex flex-col items-center gap-1.5">
                <a
                  href={reel.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open link"
                  className="group flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/75 hover:scale-105"
                >
                  <ExternalLink size={22} />
                </a>
                <span aria-hidden="true" className="text-[10px] font-bold text-white/90">
                  ლინკი
                </span>
              </div>
            )}
            {/* sound toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <RoundBtn label={muted ? 'Unmute' : 'Mute'} onClick={onToggleMuted} pressed={!muted}>
                {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </RoundBtn>
              <span aria-hidden="true" className="text-[10px] font-bold text-white/90">
                {muted ? 'გახმა' : 'ხმა'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Viewer                                                             */
/* ------------------------------------------------------------------ */
const ReelViewer: React.FC<ReelViewerProps> = ({ reels, initialId, onClose, onGoHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const startId = reels.some((r) => r.id === initialId) ? initialId : reels[0]?.id;

  const [activeId, setActiveId] = useState<string>(startId);
  const [likedState, setLikedState] = useState<Record<string, boolean>>(() => readLikedState());
  const [muted, setMuted] = useState(true);

  const activeIndex = Math.max(0, reels.findIndex((r) => r.id === activeId));

  // Lock page scroll while viewer is open; restore exact position on close.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Snap to the opened Reel on mount.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const el = root.querySelector(`[data-reel-id="${startId}"]`);
    (el as HTMLElement | null)?.scrollIntoView({ block: 'start' });
  }, [startId]);

  // Track which slide owns the viewport.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const slides = root.querySelectorAll('[data-reel-slide]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-reel-id');
            if (id) setActiveId(id);
          }
        }
      },
      { root, threshold: 0.6 },
    );
    slides.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const step = useCallback(
    (dir: number) => {
      const root = containerRef.current;
      if (!root) return;
      const slides = root.querySelectorAll('[data-reel-slide]');
      const next = Math.min(reels.length - 1, Math.max(0, activeIndex + dir));
      const el = slides[next] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [activeIndex, reels.length],
  );

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        step(1);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, step]);

  // Touch swipe: any vertical drag past threshold navigates to next/prev.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - start.y;
    const dt = Date.now() - start.t;
    if (Math.abs(dy) > 60 && dt < 400) {
      step(dy > 0 ? -1 : 1);
    }
    touchRef.current = null;
  };

  const toggleLike = (id: string) => {
    setLikedState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      persistLikedState(next);
      if (typeof window !== 'undefined') void syncReelLike(id, next[id]);
      return next;
    });
  };

  if (!reels || reels.length === 0) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Reels"
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ overscrollBehavior: 'contain' }}
        className="ll-hide-scrollbar absolute inset-0 snap-y snap-mandatory overflow-y-auto"
      >
        {reels.map((reel, i) => (
          <ReelSlide
            key={reel.id}
            reel={reel}
            index={i}
            total={reels.length}
            active={reel.id === activeId}
            nearby={Math.abs(i - activeIndex) <= 1}
            liked={!!likedState[reel.id]}
            likes={reel.likes + (likedState[reel.id] ? 1 : 0)}
            muted={muted}
            onToggleLike={() => toggleLike(reel.id)}
            onClose={onClose}
            onGoHome={() => (onGoHome ? onGoHome() : onClose())}
            onToggleMuted={() => setMuted((m) => !m)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ReelViewer;