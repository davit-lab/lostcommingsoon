import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { REELS_SECTION_SUBTITLE, REELS_SECTION_TITLE } from '@/config/reels';
import ReelCard from '@/components/ReelCard';
import ReelViewer from '@/components/ReelViewer';
import { useContentStore } from '@/store/contentStore';

interface ReelsSectionProps {
  /** When set (deep link like #/reels/<id>), the viewer opens straight on this Reel. */
  initialReelId?: string;
  /** Called when a deep-linked viewer is closed, so the hash can be cleaned up. */
  onDeepLinkClosed?: () => void;
  /** Optional: when set, the viewer shows a "Back to Home" button calling this. */
  onGoHome?: () => void;
}

const ReelsSection: React.FC<ReelsSectionProps> = ({ initialReelId, onDeepLinkClosed, onGoHome }) => {
  const reels = useContentStore((s) => s.reels);
  const [openId, setOpenId] = useState<string | null>(null);
  const consumedLink = useRef(false);

  useEffect(() => {
    if (initialReelId && !consumedLink.current) {
      setOpenId(initialReelId);
      consumedLink.current = true;
    }
  }, [initialReelId]);

  const close = () => {
    setOpenId(null);
    if (consumedLink.current) {
      consumedLink.current = false;
      onDeepLinkClosed?.();
    }
  };

  return (
    <section aria-labelledby="ll-reels-title" className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 id="ll-reels-title" className="text-4xl md:text-8xl font-vintage text-foreground uppercase leading-none">
          {REELS_SECTION_TITLE}
        </h2>
        <p className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-primary/80">{REELS_SECTION_SUBTITLE}</p>
      </div>

      <div className="ll-hide-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} onOpen={() => setOpenId(reel.id)} />
        ))}
      </div>

      <AnimatePresence>
        {openId && reels.length > 0 && (
          <ReelViewer reels={reels} initialId={openId} onClose={close} onGoHome={onGoHome} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReelsSection;