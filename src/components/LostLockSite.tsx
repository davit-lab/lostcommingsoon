import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Check, ChevronDown, ArrowLeft, ArrowUpRight, Menu, X,
  Facebook, Instagram, PhoneCall, ArrowRight as ArrowIcon, Share2
} from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { ServiceItem, Language } from '@/types';

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  const { assets } = useContentStore();
  if (assets.logo) {
    return <img src={assets.logo} alt="Lost Lock Logo" className={`${className} object-contain`} />;
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
  <div className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md">
    {(['ka', 'en'] as Language[]).map((code) => (
      <button key={code} onClick={() => setLang(code)}
        className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${currentLang === code ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
      >{code.toUpperCase()}</button>
    ))}
  </div>
);

const Nav = ({ onNavigate, lang, setLang }: { onNavigate: (hash: string) => void; lang: Language; setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { translations } = useContentStore();
  const t = translations[lang];
  return (
    <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 bg-black/80 backdrop-blur-2xl border-b border-primary/20 flex items-center justify-between px-4 md:px-14">
      <button onClick={() => onNavigate('#')} className="flex items-center gap-2 md:gap-4 group">
        <Logo className="w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform" />
        <span className="font-vintage text-sm md:text-2xl tracking-tight text-foreground uppercase">LOST-LOCK</span>
      </button>
      <div className="hidden lg:flex items-center gap-8">
        {t.nav.map((link: any) => (
          <button key={link.label} onClick={() => onNavigate(link.href)}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all"
          >{link.label}</button>
        ))}
      </div>
      <div className="hidden lg:flex items-center gap-6">
        <LanguageSwitcher currentLang={lang} setLang={setLang} />
        <button onClick={() => onNavigate('#book')} className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black hover:opacity-90 transition-all uppercase tracking-[0.2em]">{t.ui.book}</button>
      </div>
      <div className="lg:hidden flex items-center gap-3">
        <LanguageSwitcher currentLang={lang} setLang={setLang} />
        <button className="p-2 text-primary bg-white/5 rounded-lg border border-primary/20" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] left-4 right-4 bg-card rounded-[32px] border border-primary/30 p-8 flex flex-col gap-6 lg:hidden shadow-2xl z-50">
            {t.nav.map((link: any) => (
              <button key={link.label} onClick={() => { onNavigate(link.href); setIsOpen(false); }}
                className="text-2xl font-black text-muted-foreground hover:text-primary text-left">{link.label}</button>
            ))}
            <button onClick={() => { onNavigate('#book'); setIsOpen(false); }}
              className="mt-4 w-full py-5 bg-primary rounded-2xl text-center text-primary-foreground font-black uppercase text-xs">{t.ui.book}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroComp = ({ onNavigate, lang }: { onNavigate: (hash: string) => void; lang: Language }) => {
  const { assets, translations } = useContentStore();
  const t = translations[lang];
  return (
    <section className="relative w-full min-h-[500px] md:h-[600px] overflow-hidden mt-2 md:mt-4 rounded-[32px] md:rounded-[48px] mx-auto max-w-[1400px] shadow-2xl border border-white/5">
      <video src={assets.heroVideo} autoPlay loop muted playsInline poster={assets.heroFallback} className="absolute inset-0 w-full h-full object-cover brightness-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 md:p-20">
        <div className="flex flex-col gap-4 md:gap-6 max-w-4xl">
          <div className="bg-primary px-4 py-1.5 md:px-5 md:py-2 rounded-full w-fit shadow-lg">
            <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">{t.ui.premiumCenter}</span>
          </div>
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
      <div className="relative aspect-square overflow-hidden rounded-[32px] md:rounded-[40px] border border-primary/20 bg-black/40 shadow-2xl backdrop-blur-md">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
        <button onClick={handleShare} className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
          <AnimatePresence mode="wait">
            {copied ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={18} /></motion.div> : <Share2 size={18} />}
          </AnimatePresence>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1 md:mb-2">{item.category}</span>
            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase leading-none">{item.name}</h3>
          </div>
          <div className="p-3 md:p-4 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:rotate-45 transition-transform duration-500">
            <ArrowUpRight size={22} />
          </div>
        </div>
      </div>
    </motion.div>
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
  const { assets, translations } = useContentStore();
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ka' || saved === 'en') ? saved : 'ka';
  });
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.style.setProperty('--bg-url', `url('${assets.mainBackground}')`);
    const handleHashChange = () => {
      const hash = window.location.hash || '#';
      if (!hash.startsWith('#/admin')) {
        setCurrentHash(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [lang, assets.mainBackground]);

  const navigateTo = (hash: string) => { window.location.hash = hash; };
  const t = translations[lang];

  const renderContent = () => {
    const allItems = [...t.obstacles, ...t.services];
    const itemMatch = allItems.find((item: any) => item.link === currentHash);

    if (itemMatch) {
      return (
        <div className="flex flex-col items-center py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto gap-12 md:gap-20">
          <div className="w-full">
            <button onClick={() => navigateTo(itemMatch.category.includes('Rooms') || itemMatch.category.includes('ოთახები') ? '#obstacles' : '#services')}
              className="flex items-center gap-2 md:gap-3 text-primary hover:text-foreground transition-colors group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-[11px] md:text-xs uppercase tracking-[0.4em]">{t.ui.backToList}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <div className="relative aspect-square rounded-[32px] md:rounded-[64px] overflow-hidden border border-primary/30 shadow-2xl bg-black/40">
              <img src={itemMatch.image} alt={itemMatch.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-8 md:gap-12 lg:sticky lg:top-32">
              <div className="flex flex-col gap-4 md:gap-6">
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">{itemMatch.category}</span>
                <h1 className="text-5xl md:text-8xl font-vintage text-foreground uppercase leading-[1] md:leading-[0.8]">{itemMatch.name}</h1>
                {itemMatch.price && <span className="text-3xl md:text-5xl font-black text-primary mt-2 md:mt-4">{itemMatch.price}</span>}
              </div>
              <div className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-black/40 border border-primary/20 backdrop-blur-xl shadow-2xl">
                <p className="text-lg md:text-2xl text-foreground leading-relaxed font-bold">{itemMatch.description}</p>
              </div>
              <button onClick={() => navigateTo('#book')} className="py-5 md:py-7 rounded-[24px] md:rounded-[32px] bg-primary text-primary-foreground font-black text-lg md:text-2xl hover:opacity-90 transition-all uppercase tracking-widest">{t.ui.book}</button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentHash) {
      case '#prices':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.pricingTitle} description={t.ui.pricingDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
              {t.pricing.map((pkg: any, idx: number) => (
                <div key={idx} className={`p-8 md:p-10 rounded-[32px] flex flex-col gap-6 border shadow-2xl ${pkg.recommended ? 'bg-primary/10 border-primary' : 'bg-black/40 border-primary/20'}`}>
                  {pkg.recommended && <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase w-fit">★</span>}
                  <h3 className="text-xl md:text-2xl font-black text-foreground uppercase">{pkg.title}</h3>
                  <span className="text-4xl md:text-5xl font-black text-primary">{pkg.price}</span>
                  <div className="flex flex-col gap-3">
                    {pkg.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-3"><Check size={16} className="text-primary shrink-0 mt-1" /><span className="text-sm text-muted-foreground font-bold">{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => navigateTo('#book')} className="mt-auto py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs hover:opacity-90 transition-all">{t.ui.book}</button>
                </div>
              ))}
            </div>
          </div>
        );
      case '#menu':
        return (
          <div className="py-12 md:py-24 px-4 md:px-14 max-w-[1400px] mx-auto min-h-screen">
            <PageHeader title={t.ui.menuTitle} description={t.ui.menuDesc} ui={t.ui} onBack={() => navigateTo('#')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-12">
              {Object.entries(t.menu).map(([key, cat]: [string, any]) => (
                <div key={key} className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-black/40 border border-primary/20 backdrop-blur-xl shadow-2xl flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-10 text-primary">{cat.title}</h2>
                  <div className="flex flex-col gap-4">
                    {cat.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded-xl transition-colors">
                        <span className="text-lg md:text-xl font-bold text-muted-foreground">{item.name}</span>
                        <span className="text-lg md:text-xl font-black text-primary shrink-0 ml-4">{item.price}</span>
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
                  <a href="https://www.facebook.com/lostlocklost" target="_blank" rel="noreferrer" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#1877F2]/10 border border-[#1877F2]/30 flex flex-col gap-4">
                    <Facebook size={28} className="text-[#1877F2]" />
                    <span className="font-black text-xl md:text-2xl text-foreground uppercase">Facebook</span>
                    <span className="font-bold text-muted-foreground">{t.ui.writeUs}</span>
                  </a>
                  <a href="https://www.instagram.com/lost_lock1/" target="_blank" rel="noreferrer" className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-[#E4405F]/10 border border-[#E4405F]/30 flex flex-col gap-4">
                    <Instagram size={28} className="text-[#E4405F]" />
                    <span className="font-black text-xl md:text-2xl text-foreground uppercase">Instagram</span>
                    <span className="font-bold text-muted-foreground">{t.ui.followUs}</span>
                  </a>
                </div>
                <a href="tel:+995568967277" className="p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-primary flex items-center justify-between group hover:opacity-90 transition-all">
                  <div className="flex items-center gap-4 text-primary-foreground">
                    <PhoneCall size={28} />
                    <div className="flex flex-col">
                      <span className="font-black text-[9px] uppercase tracking-widest opacity-60">{t.ui.callUs}</span>
                      <span className="font-black text-2xl md:text-4xl">568 96 72 77</span>
                    </div>
                  </div>
                  <ArrowIcon size={32} className="text-primary-foreground/30 hidden md:block" />
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
                <details key={idx} className="group border border-primary/20 rounded-3xl bg-black/40 overflow-hidden shadow-2xl">
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
                <div key={idx} className="p-8 md:p-10 rounded-[32px] bg-black/40 border border-primary/20 flex gap-8 items-start hover:bg-primary/10 transition-all shadow-xl">
                  <div className="text-primary font-black text-5xl md:text-7xl shrink-0 leading-none">{idx + 1}</div>
                  <p className="text-lg md:text-2xl text-foreground font-bold leading-relaxed">{rule.substring(rule.indexOf('.') + 1).trim()}</p>
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
                <h2 className="text-4xl md:text-8xl font-vintage text-foreground uppercase leading-none">{t.ui.rooms}</h2>
                <button onClick={() => navigateTo('#obstacles')} className="text-[10px] font-black uppercase text-primary hover:text-foreground flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full border border-primary/30 transition-all">{t.ui.seeAll} <ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {t.obstacles.slice(0, 3).map((item: any) => <CardComp key={item.id} item={item} lang={lang} onClick={() => navigateTo(item.link)} />)}
              </div>
            </section>
            <div className="w-full h-px bg-primary/20 max-w-[1400px]" />
            <section className="w-full max-w-[1400px] md:px-14 flex flex-col gap-8 md:gap-16">
              <div className="flex justify-between items-end">
                <h2 className="text-4xl md:text-8xl font-vintage text-foreground uppercase leading-none">{t.ui.services}</h2>
                <button onClick={() => navigateTo('#services')} className="text-[10px] font-black uppercase text-primary hover:text-foreground flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full border border-primary/30 transition-all">{t.ui.seeAll} <ChevronRight size={16} /></button>
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
    <div className="min-h-screen relative flex flex-col selection:bg-primary selection:text-primary-foreground overflow-x-hidden bg-atmospheric">
      <Nav onNavigate={navigateTo} lang={lang} setLang={setLang} />
      <main className="pt-16 md:pt-20 flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={`${currentHash}-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="w-full py-16 md:py-32 px-4 md:px-14 border-t border-primary/20 bg-black/95 backdrop-blur-xl mt-auto relative z-10">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <Logo className="w-16 h-16 md:w-24 md:h-24" />
                <h2 className="text-5xl md:text-9xl font-vintage text-foreground uppercase">LOST-LOCK</h2>
              </div>
              <p className="text-lg md:text-2xl font-bold text-muted-foreground max-w-sm">{t.ui.footerDesc}</p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div className="flex flex-col gap-8">
                <span className="text-[10px] font-black uppercase text-primary">{t.ui.product}</span>
                <div className="flex flex-col gap-4 font-bold text-sm md:text-xl">
                  <button onClick={() => navigateTo('#obstacles')} className="text-muted-foreground hover:text-primary text-left">{t.ui.rooms}</button>
                  <button onClick={() => navigateTo('#services')} className="text-muted-foreground hover:text-primary text-left">{t.ui.services}</button>
                  <button onClick={() => navigateTo('#menu')} className="text-muted-foreground hover:text-primary text-left">{t.ui.menuTitle}</button>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <span className="text-[10px] font-black uppercase text-primary">{t.ui.company}</span>
                <div className="flex flex-col gap-4 font-bold text-sm md:text-xl">
                  <button onClick={() => navigateTo('#faq')} className="text-muted-foreground hover:text-primary text-left">{t.ui.faq}</button>
                  <button onClick={() => navigateTo('#privacy')} className="text-muted-foreground hover:text-primary text-left">{t.ui.rulesTitle}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest">{t.ui.copyright}</div>
            <div className="flex gap-10">
              <a href="https://www.instagram.com/lost_lock1/" target="_blank" rel="noreferrer" className="text-primary hover:text-foreground transition-all transform hover:scale-110"><Instagram size={28} /></a>
              <a href="https://www.facebook.com/lostlocklost" target="_blank" rel="noreferrer" className="text-primary hover:text-foreground transition-all transform hover:scale-110"><Facebook size={28} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LostLockSite;
