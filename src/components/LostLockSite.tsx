import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, ChevronDown, ArrowLeft, ArrowUpRight, Menu, X,
  Facebook, Instagram, PhoneCall, ArrowRight as ArrowIcon, Share2
} from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { ServiceItem, Language, NavLink as SiteNavigationLink } from '@/types';
import ReelsSection from '@/components/ReelsSection';
import { REELS_SECTION_TITLE } from '@/config/reels';
import { getFramerImageProps, optimizeFramerImageUrl } from '@/lib/framerImages';

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  const logo = useContentStore((s) => s.assets.logo);
  if (logo) {
    return (
      <img
        {...getFramerImageProps(logo, 300)}
        alt="Lost Lock Logo"
        className={`${className} object-contain`}
        sizes="56px"
        width={56}
        height={56}
        decoding="async"
      />
    );
  }
  return (
    <svg viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2AC" /><stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#8E6E1F" /><stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFF2AC" />
        </linearGradient>
      </defs>
      <g>
        <path d="M58 13C72 16 83 26 89 40C93 50 94 62 90 74C85 88 72 98 56 101C38 104 20 98 11 84C4 73 2 59 6 46C11 31 24 18 40 14C43 13 45 12 47 11.5C48.5 11 50 10 50 8C50 6 48.5 5 47 5C38 5 28 8.5 20 15C10 23 4 36 3 50C2 66 8 82 20 92C32 102 50 106 66 102C82 98 94 84 98 67C101 50 98 33 89 20C82 11 71 5 60 3C58 2.5 56 3.5 56 5.5C56 7.5 57.5 9 59.5 9.5C64 10.5 68 12 72 14.5" fill="url(#logoGold)" />
        <circle cx="53" cy="38" r="7" fill="url(#logoGold)" />
        <path d="M53 45C62 45 70 53 70 65C70 77 62 84 53 84C44 84 36 77 36 65C36 53 44 45 53 45Z" fill="url(#logoGold)" />
        <g stroke="url(#logoGold)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M46 40C40 37 36 24 36 24" /><path d="M60 40C66 37 70 24 70 24" />
          <path d="M41 51C32 48 26 34 26 34" /><path d="M65 51C74 48 80 34 80 34" />
          <path d="M38 62C27 64 24 81 24 81" /><path d="M68 62C79 64 82 81 82 81" />
          <path d="M41 76C34 80 33 94 33 94" /><path d="M65 76C72 80 73 94 73 94" />
        </g>
        <path d="M33 100V114C33 117 34.5 119 36.5 118.5C38.5 118 39.5 115.5 39.5 112.5V102.5H33Z" fill="url(#logoGold)" />
        <path d="M48.5 104V122C48.5 124.5 50.5 126 53 126C55.5 126 57.5 124.5 57.5 122V104H48.5Z" fill="url(#logoGold)" />
        <path d="M68 99.5V113C68 116 69.5 118 71.5 117.5C73.5 117 74.5 114.5 74.5 111.5V101H68Z" fill="url(#logoGold)" />
      </g>
    </svg>
  );
};

const LanguageSwitcher = ({ currentLang, setLang }: { currentLang: Language; setLang: (l: Language) => void }) => (
  <div role="group" aria-label={currentLang === 'ka' ? 'ენის არჩევა' : 'Choose language'} className="flex items-center gap-0.5 rounded-md border border-white/15 bg-white/[0.03] p-1">
    {(['ka', 'en'] as Language[]).map((code) => (
      <button
        key={code}
        type="button"
        onClick={() => setLang(code)}
        aria-pressed={currentLang === code}
        className={`min-w-9 rounded-sm px-2 py-1.5 text-[10px] font-bold tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          currentLang === code
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {code.toUpperCase()}
      </button>
    ))}
  </div>
);

const Nav = ({ onNavigate, lang, setLang, currentHash }: {
  onNavigate: (hash: string) => void;
  lang: Language;
  setLang: (l: Language) => void;
  currentHash: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = useContentStore((s) => s.translations[lang]);
  const navLabel = lang === 'ka' ? 'მთავარი ნავიგაცია' : 'Main navigation';
  const activeHref = (href: string) => {
    if (href === '#') return currentHash === '#';
    if (href === currentHash) return true;
    if (href === '#reels' && currentHash.startsWith('#/reels/')) return true;
    if (href === '#obstacles' && t.obstacles.some((item: { link: string }) => item.link === currentHash)) return true;
    if (href === '#services' && t.services.some((item: { link: string }) => item.link === currentHash)) return true;
    return false;
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 xl:h-20 xl:px-8 2xl:px-14">
        <button
          type="button"
          onClick={() => onNavigate('#')}
          aria-label="LOST-LOCK"
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <Logo className="h-10 w-10 transition-transform duration-300 group-hover:scale-[1.04] sm:h-12 sm:w-12" />
          <span className="font-vintage text-lg tracking-[0.12em] text-foreground sm:text-xl">LOST-LOCK</span>
        </button>

        <nav aria-label={navLabel} className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
          <div className="flex items-center gap-2 2xl:gap-3">
            {t.nav.map((link: SiteNavigationLink) => {
              const isActive = activeHref(link.href);
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => onNavigate(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative whitespace-nowrap px-1.5 py-3 text-[11px] font-semibold transition-colors duration-200 after:absolute after:inset-x-1.5 after:bottom-1 after:h-px after:origin-center after:bg-primary after:transition-transform after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? 'text-primary after:scale-x-100'
                      : 'text-white/75 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex 2xl:gap-5">
          <LanguageSwitcher currentLang={lang} setLang={setLang} />
          <button
            type="button"
            onClick={() => onNavigate('#contact')}
            className="rounded-md border border-primary/70 bg-primary px-5 py-3 text-[11px] font-bold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {t.ui.book}
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5 xl:hidden">
          <LanguageSwitcher currentLang={lang} setLang={setLang} />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isOpen ? (lang === 'ka' ? 'მენიუს დახურვა' : 'Close menu') : (lang === 'ka' ? 'მენიუს გახსნა' : 'Open menu')}
            aria-expanded={isOpen}
            aria-controls="site-mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="site-mobile-navigation"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-white/10 bg-[#080808] px-5 pb-6 pt-3 shadow-2xl sm:px-8 xl:hidden"
          >
            <nav aria-label={navLabel} className="flex flex-col">
              {t.nav.map((link: SiteNavigationLink) => {
                const isActive = activeHref(link.href);
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => { onNavigate(link.href); setIsOpen(false); }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`border-b border-white/[0.07] py-3.5 pl-3 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                      isActive
                        ? 'border-l-2 border-l-primary text-primary'
                        : 'border-l-2 border-l-transparent text-white/75 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => { onNavigate('#contact'); setIsOpen(false); }}
              className="mt-5 w-full rounded-md border border-primary/70 bg-primary px-5 py-3.5 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {t.ui.book}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const HeroComp = ({ onNavigate, lang }: { onNavigate: (hash: string) => void; lang: Language }) => {
  const heroVideo = useContentStore((s) => s.assets.heroVideo);
  const heroFallback = useContentStore((s) => s.assets.heroFallback);
  const t = useContentStore((s) => s.translations[lang]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (video.paused) {
          void video.play().catch((error) => console.error('[hero] playback failed', error));
        }
      } else {
        video.pause();
      }
    }, { threshold: 0.1 });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full min-h-[500px] md:h-[600px] overflow-hidden mt-2 md:mt-4 rounded-[32px] md:rounded-[48px] mx-auto max-w-[1400px] shadow-2xl border border-zinc-800">
      <video ref={videoRef} src={heroVideo} autoPlay loop muted playsInline poster={heroFallback} preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 md:p-20">
        <div className="flex flex-col gap-4 md:gap-6 max-w-4xl">
          <h1 className="text-5xl md:text-[120px] font-vintage text-foreground tracking-normal leading-[0.9] md:leading-[0.85] uppercase drop-shadow-2xl">Lost Lock</h1>
          <p className="text-lg md:text-2xl font-bold text-foreground max-w-xl drop-shadow-md">{t.ui.heroDesc}</p>
          <button onClick={() => onNavigate('#obstacles')} className="mt-4 md:mt-6 px-10 py-4 md:px-12 md:py-5 bg-foreground text-background font-black rounded-2xl md:rounded-3xl w-fit hover:bg-primary hover:text-primary-foreground transition-all uppercase text-[10px] md:text-sm">
            {t.ui.discoverRooms}
          </button>
        </div>
      </div>
    </section>
  );
};

const CardComp: React.FC<{ item: ServiceItem; onClick: () => void; lang: Language }> = ({ item, onClick, lang }) => {
  const [copied, setCopied] = useState(false);
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}${item.link}`;
    if (navigator.share) { navigator.share({ title: item.name, url: shareUrl }).catch(console.error); }
    else { navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }
  };
  return (
    <motion.div whileHover={{ y: -12 }} onClick={onClick} className="group flex flex-col gap-4 md:gap-8 cursor-pointer w-full relative">
      <div className="relative aspect-square overflow-hidden rounded-[24px] md:rounded-[32px] border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
        <img {...getFramerImageProps(item.image, 600)} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" loading="lazy" decoding="async" width={400} height={400} />
        <button onClick={handleShare} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
          <AnimatePresence mode="wait">
            {copied ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={15} /></motion.div> : <Share2 size={15} />}
          </AnimatePresence>
        </button>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-zinc-900/70 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4 md:px-6 md:py-5">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-[8px] font-black uppercase tracking-[0.18em] text-primary sm:text-[9px] sm:tracking-[0.3em]">{item.category}</span>
            <h3 className="line-clamp-2 break-words text-xs font-black uppercase leading-tight tracking-tight text-white sm:text-lg md:text-xl">{item.name}</h3>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-black/20 text-primary transition-transform duration-300 group-hover:rotate-45 sm:h-10 sm:w-10">
            <ArrowUpRight size={15} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductImageSlider: React.FC<{ item: ServiceItem; lang: Language }> = ({ item, lang }) => {
  const images = Array.from(new Set([item.image, ...(item.images || [])].filter(Boolean)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [images.length, isPaused]);

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900/60 shadow-xl sm:rounded-[32px] lg:aspect-[4/3]"
      role="region"
      aria-roledescription="carousel"
      aria-label={lang === 'ka' ? `${item.name} ფოტოები` : `${item.name} photos`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[activeIndex]}
          {...getFramerImageProps(images[activeIndex], 1400)}
          sizes="(max-width: 1024px) 90vw, 800px"
          alt={`${item.name} ${activeIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0.65 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.65 }}
          transition={{ duration: 0.35 }}
          decoding="async"
          loading="eager"
          width={800}
          height={800}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
          <button
            type="button"
            onClick={showPrevious}
            aria-label={lang === 'ka' ? 'წინა ფოტო' : 'Previous photo'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex min-w-0 items-center justify-center gap-2" role="group" aria-label={lang === 'ka' ? 'ფოტოს არჩევა' : 'Choose photo'}>
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={lang === 'ka' ? `ფოტო ${index + 1}` : `Photo ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            {activeIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={showNext}
            aria-label={lang === 'ka' ? 'შემდეგი ფოტო' : 'Next photo'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const PageHeader = ({ title, description, onBack, ui }: { title: string; description?: string; onBack?: () => void; ui: any }) => (
  <div className="w-full flex flex-col gap-6 md:gap-10 mb-12 md:mb-20">
    {onBack && (
      <button onClick={onBack} className="flex items-center gap-2 md:gap-3 text-primary hover:text-foreground transition-colors w-fit group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">{ui.back}</span>
      </button>
    )}
    <div className="flex flex-col gap-3 md:gap-4">
      <h1 className="text-5xl md:text-8xl lg:text-[110px] font-vintage text-foreground uppercase leading-[1] md:leading-[0.8]">{title}</h1>
      {description && <p className="text-lg md:text-2xl text-foreground/90 max-w-3xl font-bold leading-relaxed">{description}</p>}
    </div>
  </div>
);

const LostLockSite: React.FC = () => {
  const backgroundColor = useContentStore((s) => s.assets.bgColor);
  const translations = useContentStore((s) => s.translations);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ka' || saved === 'en') ? saved : 'ka';
  });
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#';
      if (!hash.startsWith('#/admin')) {
        setCurrentHash(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (hash: string) => { window.location.hash = hash; };
  const t = translations[lang];
  const reelDeepLink = currentHash.match(/^#\/reels\/(.+)$/)?.[1];
  const isReelsView = currentHash === '#reels' || !!reelDeepLink;

  const renderContent = () => {
    const allItems = [...t.obstacles, ...t.services];
    const itemMatch = allItems.find((item: any) => item.link === currentHash);

    if (itemMatch) {
      const relatedItems = (t.obstacles.some((item: any) => item.link === currentHash) ? t.obstacles : t.services)
        .filter((item: any) => item.link !== currentHash);

      return (
        <div className="flex flex-col items-center py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto gap-12 md:gap-20">
          <div className="w-full">
            <button onClick={() => navigateTo(itemMatch.category.includes('Rooms') || itemMatch.category.includes('ოთახები') ? '#obstacles' : '#services')}
              className="flex items-center gap-2 md:gap-3 text-primary hover:text-foreground transition-colors group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-[11px] md:text-xs uppercase tracking-[0.4em]">{t.ui.backToList}</span>
            </button>
          </div>
          <div className="grid w-full grid-cols-1 items-start gap-12 md:gap-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4">
              <ProductImageSlider key={itemMatch.id} item={itemMatch} lang={lang} />
              {itemMatch.video && (
                <div className="relative aspect-video rounded-[24px] md:rounded-[40px] border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
                  <video
                    src={itemMatch.video}
                    poster={optimizeFramerImageUrl(itemMatch.image, 1400)}
                    controls
                    playsInline
                    preload="none"
                    className="w-full h-full object-contain bg-black rounded-[24px] md:rounded-[40px]"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-8 md:gap-12 lg:sticky lg:top-32">
              <div className="flex flex-col gap-4 md:gap-6">
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">{itemMatch.category}</span>
                <div className="rounded-xl border border-primary/25 bg-black/35 p-4 shadow-lg sm:rounded-2xl sm:p-6">
                  <h1 className="break-words font-vintage text-3xl uppercase leading-tight text-foreground sm:text-4xl md:text-5xl">
                    {itemMatch.name}
                  </h1>
                </div>
                {itemMatch.price && <span className="text-3xl md:text-5xl font-black text-primary mt-2 md:mt-4">{itemMatch.price}</span>}
              </div>
              <div className="p-8 md:p-10 rounded-[24px] md:rounded-[32px] bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
                <p className="text-lg md:text-2xl text-foreground leading-relaxed font-bold">{itemMatch.description}</p>
              </div>
               <button onClick={() => navigateTo('#contact')} className="py-5 md:py-7 rounded-[24px] md:rounded-[32px] bg-primary text-primary-foreground border border-primary/30 font-black text-lg md:text-2xl hover:opacity-90 transition-all uppercase tracking-widest">{t.ui.book}</button>
            </div>
          </div>
          {relatedItems.length > 0 && (
            <section aria-labelledby="related-items-title" className="w-full border-t border-white/10 pt-10 md:pt-14">
              <h2 id="related-items-title" className="mb-7 font-vintage text-3xl leading-tight text-foreground sm:text-4xl md:mb-10 md:text-5xl">
                {lang === 'ka' ? 'შესაძლოა დაგაინტერესოთ' : 'Maybe you will be interested'}
              </h2>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedItems.map((item: any) => (
                  <CardComp
                    key={item.id}
                    item={item}
                    lang={lang}
                    onClick={() => navigateTo(item.link)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }

    switch (currentHash) {
      case '#reels':
        return (
          <div className="flex flex-col items-center py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto gap-12 md:gap-20">
            <PageHeader title={t.ui.reelsTitle || REELS_SECTION_TITLE} description={t.ui.reelsDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="w-full">
              <ReelsSection
                initialReelId={reelDeepLink}
                onDeepLinkClosed={() => { window.location.hash = '#'; }}
                onGoHome={() => navigateTo('#')}
              />
            </div>
          </div>
        );
      case '#prices':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.pricingTitle} description={t.ui.pricingDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
              {t.pricing.map((pkg: any, idx: number) => (
                <div key={idx} className={`p-8 md:p-10 rounded-[24px] flex flex-col gap-6 border shadow-xl ${pkg.recommended ? 'bg-zinc-900/60 backdrop-blur-sm border-primary/60' : 'bg-zinc-900/60 backdrop-blur-sm border-zinc-800/50'}`}>
                  {pkg.recommended && <span className="bg-transparent text-primary border border-primary/30 px-4 py-1 rounded-full text-[10px] font-black uppercase w-fit">★</span>}
                  <h3 className="text-xl md:text-2xl font-black text-foreground uppercase">{pkg.title}</h3>
                  <span className="text-4xl md:text-5xl font-black text-primary">{pkg.price}</span>
                  <div className="flex flex-col gap-3">
                    {pkg.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-3"><Check size={16} className="text-primary shrink-0 mt-1" /><span className="text-sm text-muted-foreground font-bold">{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => navigateTo('#contact')} className="mt-auto py-4 rounded-2xl bg-transparent text-primary border border-primary/30 font-black uppercase text-xs hover:bg-primary/10 transition-all">{t.ui.book}</button>
                </div>
              ))}
            </div>
          </div>
        );
      case '#menu':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.menuTitle} description={t.ui.menuDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
              {Object.entries(t.menu).map(([key, cat]: [string, any]) => (
                <div key={key} className="h-fit self-start p-6 md:p-8 rounded-[24px] bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 shadow-xl flex flex-col">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase mb-5 text-primary">{cat.title}</h2>
                  <div className="flex flex-col">
                    {cat.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-3 px-2 border-b border-zinc-800 last:border-0 hover:bg-zinc-800 rounded-xl transition-colors">
                        <span className="min-w-0 text-base md:text-lg leading-snug font-semibold text-muted-foreground">{item.name}</span>
                        <span className="shrink-0 text-base md:text-lg font-black text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case '#contact':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen flex flex-col items-center">
            <PageHeader title={t.ui.contactUs} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full items-start">
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <a href="https://www.facebook.com/lostlocklost" target="_blank" rel="noreferrer" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#1877F2]/10 border border-[#1877F2]/30 flex flex-col gap-4">
                    <Facebook size={28} className="text-[#1877F2]" />
                    <span className="font-black text-xl md:text-2xl text-foreground uppercase">Facebook</span>
                    <span className="font-bold text-muted-foreground">{t.ui.writeUs}</span>
                  </a>
                  <a href="https://www.instagram.com/lostlock_official/" target="_blank" rel="noreferrer" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#E4405F]/10 border border-[#E4405F]/30 flex flex-col gap-4">
                    <Instagram size={28} className="text-[#E4405F]" />
                    <span className="font-black text-xl md:text-2xl text-foreground uppercase">Instagram</span>
                    <span className="font-bold text-muted-foreground">{t.ui.followUs}</span>
                  </a>
                </div>
                <a href="tel:+995568967277" className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-transparent border border-primary/30 flex items-center justify-between group hover:bg-primary/10 transition-all">
                  <div className="flex items-center gap-4 text-primary">
                    <PhoneCall size={28} />
                    <div className="flex flex-col">
                      <span className="font-black text-[9px] uppercase tracking-widest opacity-60">{t.ui.callUs}</span>
                      <span className="font-black text-2xl md:text-4xl">568 96 72 77</span>
                    </div>
                  </div>
                  <ArrowIcon size={32} className="text-primary/30 hidden md:block" />
                </a>
              </div>
              <div className="rounded-[32px] md:rounded-[48px] overflow-hidden border border-primary/20 shadow-2xl h-[400px] md:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d993.4!2d44.7309356!3d41.7092913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40447342e62489f5%3A0xb1f017cf712d9384!2sLostlock!5e0!3m2!1ska!2sge!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        );
      case '#obstacles':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.rooms} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
              {t.obstacles.map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
            </div>
          </div>
        );
      case '#services':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.services} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
              {t.services.map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
            </div>
          </div>
        );
      case '#faq':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[900px] mx-auto min-h-screen">
            <PageHeader title="FAQ" ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="flex flex-col gap-4 md:gap-6 mt-12">
              {t.faq.map((item: any, idx: number) => (
                <details key={idx} className="group border border-zinc-800/50 rounded-2xl bg-zinc-900/60 backdrop-blur-sm overflow-hidden shadow-xl">
                  <summary className="p-8 font-black text-lg md:text-2xl cursor-pointer list-none flex justify-between items-center text-foreground hover:bg-white/5 transition-colors">
                    {item.question} <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-primary" />
                  </summary>
                  <div className="p-8 pt-0 text-base md:text-xl text-muted-foreground font-bold leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        );
      case '#privacy':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1000px] mx-auto min-h-screen">
            <PageHeader title={t.ui.rulesTitle} description={t.ui.rulesDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="flex flex-col gap-6 mt-12">
              {t.rules.map((rule: string, idx: number) => (
                <div key={idx} className="p-8 md:p-10 rounded-[24px] bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 flex gap-8 items-start hover:bg-zinc-800/60 transition-all shadow-xl">
                  <div className="text-primary font-black text-5xl md:text-7xl shrink-0 leading-none">{idx + 1}</div>
                  <p className="text-lg md:text-2xl text-foreground font-bold leading-relaxed">{rule.substring(rule.indexOf('.') + 1).trim()}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-[72px] md:gap-24 lg:gap-[104px] pb-16 md:pb-32 px-4 md:px-0">
            <HeroComp onNavigate={navigateTo} lang={lang} />
            <section className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
              <div className="flex justify-between items-end">
                <h2 className="text-4xl md:text-8xl font-vintage text-foreground uppercase leading-none">{t.ui.rooms}</h2>
                <button onClick={() => navigateTo('#obstacles')} className="text-[10px] font-black uppercase text-primary hover:text-foreground flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm px-6 py-3 rounded-full border border-zinc-700/50 transition-all">{t.ui.seeAll} <ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
                {t.obstacles.map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
              </div>
            </section>
            <div className="w-full h-px bg-zinc-800 max-w-[1400px]" />
            <section className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
              <div className="flex justify-between items-end">
                <h2 className="text-4xl md:text-8xl font-vintage text-foreground uppercase leading-none">{t.ui.services}</h2>
                <button onClick={() => navigateTo('#services')} className="text-[10px] font-black uppercase text-primary hover:text-foreground flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm px-6 py-3 rounded-full border border-zinc-700/50 transition-all">{t.ui.seeAll} <ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
                {t.services.map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
              </div>
            </section>
            <div className="w-full h-px bg-zinc-800 max-w-[1400px]" />
            <ReelsSection
              initialReelId={reelDeepLink}
              onDeepLinkClosed={() => { window.location.hash = '#'; }}
            />
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
      style={{
        backgroundColor: backgroundColor || undefined,
        backgroundImage: `url(${import.meta.env.BASE_URL}background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {!isReelsView && <Nav onNavigate={navigateTo} lang={lang} setLang={setLang} currentHash={currentHash} />}
      <main className={`${isReelsView ? '' : 'pt-[72px] xl:pt-20'} flex-grow relative`}>
        <AnimatePresence mode="wait">
          <motion.div key={`${currentHash}-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isReelsView && (
      <footer className="relative z-10 mt-auto w-full border-t border-white/10 bg-gradient-to-b from-black/65 via-black/90 to-black px-4 py-8 sm:px-6 md:px-14 md:py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_minmax(260px,360px)] md:gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Logo className="h-10 w-10 md:h-12 md:w-12" />
                <h2 className="font-vintage text-2xl uppercase tracking-wide text-foreground sm:text-3xl">LOST-LOCK</h2>
              </div>
              <p className="max-w-sm text-sm font-medium leading-relaxed text-muted-foreground md:text-base">{t.ui.footerDesc}</p>
            </div>
            <a href="tel:+995568967277" className="flex w-fit items-center gap-3 text-white/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <PhoneCall size={19} className="text-primary/80" />
              <span className="flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground">{t.ui.callUs}</span>
                <span className="text-base font-semibold tracking-wide sm:text-lg">568 96 72 77</span>
              </span>
            </a>
            <div className="h-40 overflow-hidden rounded-lg border border-primary/20 md:h-36">
              <iframe
                title={lang === 'ka' ? 'Lost Lock-ის მდებარეობა Google Maps-ზე' : 'Lost Lock location on Google Maps'}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d993.4!2d44.7309356!3d41.7092913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40447342e62489f5%3A0xb1f017cf712d9384!2sLostlock!5e0!3m2!1ska!2sge!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row">
            <div className="text-center text-xs font-semibold tracking-wide text-white/65 sm:text-left sm:text-sm">
              {t.ui.copyright}
            </div>
            <div className="flex gap-5">
              <a href="https://www.instagram.com/lostlock_official/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-primary transition-colors hover:text-foreground"><Instagram size={21} /></a>
              <a href="https://www.facebook.com/lostlocklost" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-primary transition-colors hover:text-foreground"><Facebook size={21} /></a>
            </div>
          </div>
        </div>
      </footer>
    )}
    </div>
  );
};

export default LostLockSite;
