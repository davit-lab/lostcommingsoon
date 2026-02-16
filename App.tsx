import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Check, 
  ChevronDown, 
  ArrowLeft, 
  ArrowUpRight, 
  Menu, 
  X,
  Facebook,
  Instagram,
  PhoneCall,
  MapPin,
  Utensils,
  Coffee,
  Beer,
  Pizza as PizzaIcon,
  Zap,
  Gift,
  Clock,
  ArrowRight as ArrowIcon,
  Share2,
  Globe
} from 'lucide-react';
import { ASSETS, TRANSLATIONS } from './constants';
import { ServiceItem, Language } from './types';

// --- LOGO COMPONENT ---

// CHANGED: This component now intelligently chooses between an image (if provided in constants.ts)
// or the original SVG spider logo.
const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  if (ASSETS.logo) {
    return <img src={ASSETS.logo} alt="Lost Lock Logo" className={`${className} object-contain`} />;
  }

  return (
    <svg viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2AC" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#8E6E1F" />
          <stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFF2AC" />
        </linearGradient>
        
        <filter id="logoDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
          <feOffset in="blur" dx="0.8" dy="0.8" result="offset" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#white" result="specOut">
            <fePointLight x="-50" y="-100" z="200" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.6" />
        </filter>
      </defs>
      
      <g filter="url(#logoDepth)">
        <path 
          d="M58 13C72 16 83 26 89 40C93 50 94 62 90 74C85 88 72 98 56 101C38 104 20 98 11 84C4 73 2 59 6 46C11 31 24 18 40 14C43 13 45 12 47 11.5C48.5 11 50 10 50 8C50 6 48.5 5 47 5C38 5 28 8.5 20 15C10 23 4 36 3 50C2 66 8 82 20 92C32 102 50 106 66 102C82 98 94 84 98 67C101 50 98 33 89 20C82 11 71 5 60 3C58 2.5 56 3.5 56 5.5C56 7.5 57.5 9 59.5 9.5C64 10.5 68 12 72 14.5" 
          fill="url(#logoGold)" 
        />
        <path d="M33 100V114C33 117 34.5 119 36.5 118.5C38.5 118 39.5 115.5 39.5 112.5V102.5H33Z" fill="url(#logoGold)" />
        <path d="M48.5 104V122C48.5 124.5 50.5 126 53 126C55.5 126 57.5 124.5 57.5 122V104H48.5Z" fill="url(#logoGold)" />
        <path d="M68 99.5V113C68 116 69.5 118 71.5 117.5C73.5 117 74.5 114.5 74.5 111.5V101H68Z" fill="url(#logoGold)" />
        <circle cx="53" cy="38" r="7" fill="url(#logoGold)" />
        <path d="M53 45C62 45 70 53 70 65C70 77 62 84 53 84C44 84 36 77 36 65C36 53 44 45 53 45Z" fill="url(#logoGold)" />
        <g stroke="url(#logoGold)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M46 40C40 37 36 24 36 24" />
          <path d="M60 40C66 37 70 24 70 24" />
          <path d="M41 51C32 48 26 34 26 34" />
          <path d="M65 51C74 48 80 34 80 34" />
          <path d="M38 62C27 64 24 81 24 81" />
          <path d="M68 62C79 64 82 81 82 81" />
          <path d="M41 76C34 80 33 94 33 94" />
          <path d="M65 76C72 80 73 94 73 94" />
        </g>
      </g>
    </svg>
  );
};

// --- SHARED COMPONENTS ---

const LanguageSwitcher = ({ currentLang, setLang }: { currentLang: Language, setLang: (l: Language) => void }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'ka', label: 'KA' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${currentLang === l.code ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 'text-white/60 hover:text-white'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

const Nav = ({ onNavigate, lang, setLang }: { onNavigate: (hash: string) => void, lang: Language, setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 bg-black/80 backdrop-blur-2xl border-b border-[#d4af37]/20 flex items-center justify-between px-4 md:px-14">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('#')} className="flex items-center gap-2 md:gap-4 group">
          <Logo className="w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform" />
          <span className="font-vintage text-sm md:text-2xl tracking-tight text-white uppercase">LOST-LOCK</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        {t.nav.map((link: any) => (
          <button 
            key={link.label}
            onClick={() => onNavigate(link.href)}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-[#d4af37] transition-all relative group"
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-6">
         <LanguageSwitcher currentLang={lang} setLang={setLang} />
         <button onClick={() => onNavigate('#book')} className="px-8 py-3 rounded-2xl bg-[#d4af37] text-black text-[10px] font-black hover:bg-white transition-all uppercase tracking-[0.2em]">
           {t.ui.book}
         </button>
      </div>

      <div className="lg:hidden flex items-center gap-3">
        <LanguageSwitcher currentLang={lang} setLang={setLang} />
        <button className="p-2 text-[#d4af37] bg-white/5 rounded-lg border border-[#d4af37]/20" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-[72px] left-4 right-4 bg-[#1a1510] rounded-[32px] border border-[#d4af37]/30 p-8 flex flex-col gap-6 lg:hidden shadow-2xl z-50">
            {t.nav.map((link: any) => (
              <button key={link.label} onClick={() => { onNavigate(link.href); setIsOpen(false); }} className="text-2xl font-black text-white/60 hover:text-[#d4af37] text-left">
                {link.label}
              </button>
            ))}
            <button onClick={() => { onNavigate('#book'); setIsOpen(false); }} className="mt-4 w-full py-5 bg-[#d4af37] rounded-2xl text-center text-black font-black uppercase text-xs">
              {t.ui.book}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroComp = ({ onNavigate, lang }: { onNavigate: (hash: string) => void, lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className="relative w-full min-h-[500px] md:h-[600px] overflow-hidden mt-2 md:mt-4 rounded-[32px] md:rounded-[48px] mx-auto max-w-[1400px] shadow-2xl border border-white/5">
      <video src={ASSETS.heroVideo} autoPlay loop muted playsInline poster={ASSETS.heroFallback} className="absolute inset-0 w-full h-full object-cover brightness-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 md:p-20">
        <div className="flex flex-col gap-4 md:gap-6 max-w-4xl">
          <div className="bg-[#d4af37] px-4 py-1.5 md:px-5 md:py-2 rounded-full w-fit shadow-lg shadow-[#d4af37]/30">
            <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-black">{t.ui.premiumCenter}</span>
          </div>
          <h1 className="text-5xl md:text-[120px] font-vintage text-white tracking-normal leading-[0.9] md:leading-[0.85] uppercase drop-shadow-2xl">Lost Lock</h1>
          <p className="text-lg md:text-2xl font-bold text-white max-w-xl drop-shadow-md">{t.ui.heroDesc}</p>
          <button onClick={() => onNavigate('#obstacles')} className="mt-4 md:mt-6 px-10 py-4 md:px-12 md:py-5 bg-white text-black font-black rounded-2xl md:rounded-3xl w-fit hover:bg-[#d4af37] transition-all uppercase text-[10px] md:text-sm">
            {t.ui.discoverRooms}
          </button>
        </div>
      </div>
    </section>
  );
};

// Fix: Use React.FC to properly type props and handle internal React attributes like 'key' in mapped components
const CardComp: React.FC<{ item: ServiceItem; onClick: () => void; lang: Language }> = ({ item, onClick, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}${item.link}`;
    if (navigator.share) {
      navigator.share({ title: item.name, url: shareUrl }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <motion.div whileHover={{ y: -12 }} onClick={onClick} className="group flex flex-col gap-4 md:gap-8 cursor-pointer w-full relative">
      <div className="relative aspect-square overflow-hidden rounded-[32px] md:rounded-[40px] border border-[#d4af37]/20 bg-black/40 shadow-2xl backdrop-blur-md">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
        <button onClick={handleShare} className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all">
          <AnimatePresence mode="wait">
            {copied ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={18} /></motion.div> : <Share2 size={18} />}
          </AnimatePresence>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em] mb-1 md:mb-2">{item.category}</span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">{item.name}</h3>
          </div>
          <div className="p-3 md:p-4 rounded-full bg-[#d4af37] text-black shadow-lg group-hover:rotate-45 transition-transform duration-500">
            <ArrowUpRight size={22} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PAGES ---

const PageHeader = ({ title, description, onBack, ui }: { title: string; description?: string; onBack?: () => void, ui: any }) => (
  <div className="w-full flex flex-col gap-6 md:gap-10 mb-12 md:mb-20">
    {onBack && (
      <button onClick={onBack} className="flex items-center gap-2 md:gap-3 text-[#d4af37] hover:text-white transition-colors w-fit group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">{ui.back}</span>
      </button>
    )}
    <div className="flex flex-col gap-3 md:gap-4">
      <h1 className="text-5xl md:text-8xl lg:text-[110px] font-vintage text-white uppercase leading-[1] md:leading-[0.8]">{title}</h1>
      {description && <p className="text-lg md:text-2xl text-white/90 max-w-3xl font-bold leading-relaxed">{description}</p>}
    </div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ka' || saved === 'en') return saved as Language;
    return 'ka';
  });
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.style.setProperty('--bg-url', `url('${ASSETS.mainBackground}')`);
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [lang]);

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const t = TRANSLATIONS[lang];

  const renderContent = () => {
    const allItems = [...t.obstacles, ...t.services];
    const itemMatch = allItems.find(item => item.link === currentHash);
    
    if (itemMatch) {
      return (
        <div className="flex flex-col items-center py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto gap-12 md:gap-20">
          <div className="w-full">
            <button onClick={() => navigateTo(itemMatch.category.includes('Rooms') || itemMatch.category.includes('ოთახები') || itemMatch.category.includes('Комнаты') ? '#obstacles' : '#services')} className="flex items-center gap-2 md:gap-3 text-[#d4af37] hover:text-white transition-colors group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-[11px] md:text-xs uppercase tracking-[0.4em] underline underline-offset-[12px] decoration-[#d4af37]/30">{t.ui.backToList}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <div className="relative aspect-square rounded-[32px] md:rounded-[64px] overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-black/40">
              <img src={itemMatch.image} alt={itemMatch.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-8 md:gap-12 lg:sticky lg:top-32">
              <div className="flex flex-col gap-4 md:gap-6">
                <span className="text-[#d4af37] font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">{itemMatch.category}</span>
                <h1 className="text-5xl md:text-8xl font-vintage text-white uppercase leading-[1] md:leading-[0.8]">{itemMatch.name}</h1>
                {itemMatch.price && itemMatch.price !== '0' && <span className="text-3xl md:text-5xl font-black text-[#d4af37] mt-2 md:mt-4 drop-shadow-lg">{itemMatch.price}</span>}
              </div>
              <div className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-black/40 border border-[#d4af37]/20 backdrop-blur-3xl shadow-2xl">
                <p className="text-lg md:text-2xl text-white leading-relaxed font-bold">{itemMatch.description}</p>
              </div>
              <button onClick={() => navigateTo('#book')} className="py-5 md:py-7 rounded-[24px] md:rounded-[32px] bg-[#d4af37] text-black font-black text-lg md:text-2xl hover:bg-white transition-all uppercase tracking-widest">
                {t.ui.book}
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentHash) {
      case '#menu':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.menuTitle} description={t.ui.menuDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-12">
               {Object.entries(t.menu).map(([key, cat]: [string, any]) => (
                 <div key={key} className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-black/40 border border-[#d4af37]/20 backdrop-blur-3xl shadow-2xl flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-[#d4af37] drop-shadow-lg">{cat.title}</h2>
                    <div className="flex flex-col gap-4">
                       {cat.items.map((item: any, i: number) => (
                         <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded-xl transition-colors">
                           <span className="text-lg md:text-xl font-bold text-white/80">{item.name}</span>
                           <span className="text-lg md:text-xl font-black text-[#d4af37] shrink-0 ml-4">{item.price}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case '#book':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen flex flex-col items-center">
            <PageHeader title={t.ui.bookingTitle} description={t.ui.bookingDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full items-start">
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <a href="https://www.facebook.com/lostlocklost" target="_blank" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#1877F2]/10 border border-[#1877F2]/30 flex flex-col gap-4">
                    <Facebook size={28} className="text-[#1877F2]" />
                    <span className="font-black text-xl md:text-2xl text-white uppercase">Facebook</span>
                    <span className="font-bold text-white/60">{t.ui.writeUs}</span>
                  </a>
                  <a href="https://www.instagram.com/lost_lock1/" target="_blank" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#E4405F]/10 border border-[#E4405F]/30 flex flex-col gap-4">
                    <Instagram size={28} className="text-[#E4405F]" />
                    <span className="font-black text-xl md:text-2xl text-white uppercase">Instagram</span>
                    <span className="font-bold text-white/60">{t.ui.followUs}</span>
                  </a>
                </div>
                <a href="tel:+995568967277" className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-[#d4af37] flex items-center justify-between group hover:bg-white transition-all">
                  <div className="flex items-center gap-4 text-black">
                    <PhoneCall size={28} />
                    <div className="flex flex-col">
                      <span className="font-black text-[9px] uppercase tracking-widest opacity-60">{t.ui.callUs}</span>
                      <span className="font-black text-2xl md:text-4xl">568 96 72 77</span>
                    </div>
                  </div>
                  <ArrowIcon size={32} className="text-black/30 hidden sm:block" />
                </a>
              </div>
              <div className="relative h-[400px] md:h-[650px] w-full rounded-[32px] md:rounded-[64px] overflow-hidden border border-[#d4af37]/20 shadow-2xl">
                 <iframe title="Lost Lock Map" className="w-full h-full border-0 brightness-95" src="https://maps.google.com/maps?q=lost%20lock&z=15&output=embed" loading="lazy" />
              </div>
            </div>
          </div>
        );
      case '#prices':
        return (
          <div className="flex flex-col items-center gap-12 md:gap-24 py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.pricingTitle} description={t.ui.pricingDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full">
              {t.pricing.map((pkg: any, idx: number) => (
                <div key={idx} className={`p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-2 shadow-2xl transition-all hover:scale-[1.02] ${pkg.recommended ? 'bg-[#d4af37]/20 border-[#d4af37]' : 'bg-black/40 border-[#d4af37]/10'}`}>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{pkg.title}</h3>
                  <div className="text-4xl md:text-6xl font-black text-[#d4af37] my-6 drop-shadow-xl">{pkg.price}</div>
                  <div className="flex flex-col gap-4 mb-10">
                    {pkg.features.map((f: string, i: number) => (
                      <div key={i} className="flex gap-3 text-xs md:text-sm font-bold text-white/80 leading-snug">
                        <Check size={14} className="text-[#d4af37] shrink-0 mt-0.5" /> {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigateTo('#book')} className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] transition-all ${pkg.recommended ? 'bg-[#d4af37] text-black hover:bg-white' : 'bg-white text-black hover:bg-[#d4af37]'}`}>{t.ui.book}</button>
                </div>
              ))}
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
                <details key={idx} className="group border border-[#d4af37]/20 rounded-3xl bg-black/40 overflow-hidden shadow-2xl">
                  <summary className="p-8 font-black text-lg md:text-2xl cursor-pointer list-none flex justify-between items-center text-white hover:bg-white/5 transition-colors">
                    {item.question} <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#d4af37]" />
                  </summary>
                  <div className="p-8 pt-0 text-base md:text-xl text-white/80 font-bold leading-relaxed">{item.answer}</div>
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
                 <div key={idx} className="p-8 md:p-10 rounded-[32px] bg-black/40 border border-[#d4af37]/20 flex gap-8 items-start hover:bg-[#d4af37]/10 transition-all shadow-xl backdrop-blur-sm">
                    <div className="text-[#d4af37] font-black text-5xl md:text-7xl shrink-0 leading-none">{idx + 1}</div>
                    <p className="text-lg md:text-2xl text-white font-bold leading-relaxed">{rule.substring(rule.indexOf('.') + 1).trim()}</p>
                 </div>
               ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-16 md:gap-32 pb-16 md:pb-32 px-4 md:px-0">
            <HeroComp onNavigate={navigateTo} lang={lang} />
            <section className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl md:text-8xl font-vintage text-white uppercase leading-none">{t.ui.rooms}</h2>
                </div>
                <button onClick={() => navigateTo('#obstacles')} className="text-[10px] font-black uppercase text-[#d4af37] hover:text-white flex items-center gap-3 bg-[#d4af37]/10 px-6 py-3 rounded-full border border-[#d4af37]/30 transition-all">
                  {t.ui.seeAll} <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {t.obstacles.slice(0, 3).map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
              </div>
            </section>
            <div className="w-full h-px bg-[#d4af37]/20 max-w-[1400px]" />
            <section className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl md:text-8xl font-vintage text-white uppercase leading-none">{t.ui.services}</h2>
                </div>
                <button onClick={() => navigateTo('#services')} className="text-[10px] font-black uppercase text-[#d4af37] hover:text-white flex items-center gap-3 bg-[#d4af37]/10 px-6 py-3 rounded-full border border-[#d4af37]/30 transition-all">
                  {t.ui.seeAll} <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {t.services.slice(0, 3).map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      <Nav onNavigate={navigateTo} lang={lang} setLang={setLang} />
      <main className="pt-16 md:pt-20 flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={`${currentHash}-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="w-full py-16 md:py-32 px-4 md:px-14 border-t border-[#d4af37]/20 bg-black/95 backdrop-blur-xl mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="flex flex-col gap-6">
               <div className="flex items-center gap-6">
                  <Logo className="w-16 h-16 md:w-24 md:h-24" />
                  <h2 className="text-5xl md:text-9xl font-vintage text-white uppercase">LOST-LOCK</h2>
               </div>
               <p className="text-lg md:text-2xl font-bold text-white/40 max-w-sm">{t.ui.footerDesc}</p>
             </div>
             <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col gap-8">
                   <span className="text-[10px] font-black uppercase text-[#d4af37]">{t.ui.product}</span>
                   <div className="flex flex-col gap-4 font-bold text-sm md:text-xl">
                      <button onClick={() => navigateTo('#obstacles')} className="text-white/70 hover:text-[#d4af37] text-left">{t.ui.rooms}</button>
                      <button onClick={() => navigateTo('#services')} className="text-white/70 hover:text-[#d4af37] text-left">{t.ui.services}</button>
                      <button onClick={() => navigateTo('#menu')} className="text-white/70 hover:text-[#d4af37] text-left">{t.ui.menuTitle}</button>
                   </div>
                </div>
                <div className="flex flex-col gap-8">
                   <span className="text-[10px] font-black uppercase text-[#d4af37]">{t.ui.company}</span>
                   <div className="flex flex-col gap-4 font-bold text-sm md:text-xl">
                      <button onClick={() => navigateTo('#faq')} className="text-white/70 hover:text-[#d4af37] text-left">{t.ui.faq}</button>
                      <button onClick={() => navigateTo('#privacy')} className="text-white/70 hover:text-[#d4af37] text-left">{t.ui.rulesTitle}</button>
                   </div>
                </div>
             </div>
          </div>
          <div className="pt-16 border-t border-[#d4af37]/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">{t.ui.copyright}</div>
            <div className="flex gap-10">
              <a href="https://www.instagram.com/lost_lock1/" target="_blank" className="text-[#d4af37] hover:text-white transition-all transform hover:scale-110"><Instagram size={28}/></a>
              <a href="https://www.facebook.com/lostlocklost" target="_blank" className="text-[#d4af37] hover:text-white transition-all transform hover:scale-110"><Facebook size={28}/></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;