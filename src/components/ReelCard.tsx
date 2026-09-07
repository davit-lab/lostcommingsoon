import React from 'react';
import { Play, Heart } from 'lucide-react';
import { Reel } from '@/types';

interface ReelCardProps {
  reel: Reel;
  onOpen: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={`Lost Lock — ${reel.title}`}
    className="group relative aspect-[9/16] w-[62vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[24px] md:rounded-[32px] border border-zinc-800/60 bg-zinc-900/40 shadow-2xl text-left transition-all duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-[230px] md:w-[250px] lg:w-[270px]"
  >
    <img
      src={reel.thumbnail}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40 transition-opacity duration-500 opacity-90 group-hover:opacity-70" />

    {/* touch-friendly vitals */}
    <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <span className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-md border border-white/10 transition-transform duration-500 group-hover:scale-110 shadow-xl">
        <Play size={18} className="ml-0.5" />
      </span>
    </span>

    {/* like badge */}
    <span className="absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] md:text-[11px] font-black text-white/90 backdrop-blur-md border border-white/10">
      <Heart size={11} className="fill-[#ff5a5f] text-[#ff5a5f]" /> {reel.likes}
    </span>

    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 pb-4">
      <span className="text-[13px] md:text-sm font-black text-white uppercase tracking-wide leading-none drop-shadow">{reel.title}</span>
      <span className="text-[10px] md:text-[11px] font-semibold text-white/75 line-clamp-2 leading-snug drop-shadow">{reel.description}</span>
    </div>
  </button>
);

export default ReelCard;