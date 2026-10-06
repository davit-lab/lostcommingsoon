import React, { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { Language } from '@/types';
import { ASSETS, FONT_OPTIONS } from '@/constants';
import { ArrowLeft, Save, RotateCcw, LogOut, Image, Type, DollarSign, FileText, UtensilsCrossed, HelpCircle, ShieldCheck, Palette, ChevronDown, Plus, Trash2, TextCursorInput, CalendarClock, BellRing, PlusCircle, DoorOpen, ExternalLink, LayoutDashboard, Clapperboard, Menu, X } from 'lucide-react';
import BookingsAdmin from '@/components/admin/BookingsAdmin';
import TodayAdmin from '@/components/admin/TodayAdmin';
import NotifySettings from '@/components/admin/NotifySettings';
import CreateEvent from '@/components/admin/CreateEvent';
import ReelsAdmin from '@/components/admin/ReelsAdmin';

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContentStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) { onLogin(); }
    else { setError('Invalid credentials'); }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0b] flex items-center justify-center p-5">
      <div className="w-full max-w-sm border border-white/10 bg-[#141412] shadow-2xl">
        <div className="h-1 bg-primary" />
        <div className="p-8 md:p-10">
        <div className="mb-9">
          <div className="font-vintage text-3xl text-foreground tracking-wide">LOST LOCK</div>
          <p className="text-sm text-muted-foreground mt-2">ჯავშნებისა და ღონისძიებების მართვა</p>
        </div>
        {error && <div className="mb-4 p-3 border border-red-500/30 bg-red-500/5 text-red-300 text-sm">მომხმარებელი ან პაროლი არასწორია</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-xs font-semibold text-zinc-400">მომხმარებელი
            <input type="text" placeholder="შეიყვანეთ მომხმარებელი" value={username} onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full p-3.5 bg-black/20 border border-white/10 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary" />
          </label>
          <label className="text-xs font-semibold text-zinc-400">პაროლი
            <input type="password" placeholder="შეიყვანეთ პაროლი" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3.5 bg-black/20 border border-white/10 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary" />
          </label>
          <button type="submit" className="w-full mt-2 py-3.5 bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all">შესვლა</button>
        </form>
        </div>
      </div>
    </div>
  );
};

type Tab = 'today' | 'bookings' | 'create' | 'settings' | 'reels' | 'assets' | 'fonts' | 'ui_ka' | 'ui_en' | 'rooms_ka' | 'rooms_en' | 'services_ka' | 'services_en' | 'pricing_ka' | 'pricing_en' | 'menu_ka' | 'menu_en' | 'faq_ka' | 'faq_en' | 'rules_ka' | 'rules_en' | 'nav_ka' | 'nav_en' | 'background';

interface TabDef { id: Tab; label: string; icon: React.ReactNode }
interface TabGroupDef { label: string; tabs: TabDef[] }

const TAB_GROUPS: TabGroupDef[] = [
  {
    label: 'დღიური სამუშაო',
    tabs: [
      { id: 'today', label: 'დღეს / ხვალ', icon: <LayoutDashboard size={17} /> },
      { id: 'bookings', label: 'ყველა ჯავშანი', icon: <CalendarClock size={17} /> },
      { id: 'create', label: 'ახალი ღონისძიება', icon: <PlusCircle size={17} /> },
    ],
  },
  {
    label: 'ვებსაიტის იერი',
    tabs: [
      { id: 'background', label: 'ფონი', icon: <Palette size={17} /> },
      { id: 'assets', label: 'ლოგო და მედია', icon: <Image size={17} /> },
      { id: 'fonts', label: 'შრიფტები', icon: <TextCursorInput size={17} /> },
      { id: 'reels', label: 'ვიდეოები', icon: <Clapperboard size={17} /> },
    ],
  },
  {
    label: 'ქართული კონტენტი',
    tabs: [
      { id: 'ui_ka', label: 'მთავარი ტექსტები', icon: <Type size={17} /> },
      { id: 'nav_ka', label: 'ნავიგაცია', icon: <FileText size={17} /> },
      { id: 'rooms_ka', label: 'ოთახები', icon: <DoorOpen size={17} /> },
      { id: 'services_ka', label: 'სერვისები', icon: <DollarSign size={17} /> },
      { id: 'pricing_ka', label: 'ფასები', icon: <DollarSign size={17} /> },
      { id: 'menu_ka', label: 'მენიუ', icon: <UtensilsCrossed size={17} /> },
      { id: 'faq_ka', label: 'ხშირი კითხვები', icon: <HelpCircle size={17} /> },
      { id: 'rules_ka', label: 'წესები', icon: <ShieldCheck size={17} /> },
    ],
  },
  {
    label: 'English content',
    tabs: [
      { id: 'ui_en', label: 'Main texts', icon: <Type size={17} /> },
      { id: 'nav_en', label: 'Navigation', icon: <FileText size={17} /> },
      { id: 'rooms_en', label: 'Rooms', icon: <DoorOpen size={17} /> },
      { id: 'services_en', label: 'Services', icon: <DollarSign size={17} /> },
      { id: 'pricing_en', label: 'Pricing', icon: <DollarSign size={17} /> },
      { id: 'menu_en', label: 'Menu', icon: <UtensilsCrossed size={17} /> },
      { id: 'faq_en', label: 'FAQ', icon: <HelpCircle size={17} /> },
      { id: 'rules_en', label: 'Rules', icon: <ShieldCheck size={17} /> },
    ],
  },
  {
    label: 'სისტემა',
    tabs: [
      { id: 'settings', label: 'შეტყობინებები', icon: <BellRing size={17} /> },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);

const InputField = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full p-3 rounded-xl bg-muted border border-primary/20 text-foreground text-sm focus:outline-none focus:border-primary resize-y" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-muted border border-primary/20 text-foreground text-sm focus:outline-none focus:border-primary" />
    )}
  </div>
);

const SectionTitle: React.FC<{ title: string; desc?: string }> = ({ title, desc }) => (
  <div className="mb-6">
    <h2 className="font-vintage text-2xl md:text-3xl text-foreground">{title}</h2>
    {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const { assets, translations, updateAssets, updateTranslation, logout, resetToDefault } = useContentStore();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>(['დღიური სამუშაო']);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return <TodayAdmin />;
      case 'bookings':
        return <BookingsAdmin />;
      case 'create':
        return (
          <div>
            <SectionTitle title="ახალი ღონისძიება" desc="შექმენით ღონისძიება თარიღით, სესიით, კლიენტით, მენიუთ და სერვისებით. შექმნისთანავე გამოჩნდება ჯავშნებში." />
            <CreateEvent />
          </div>
        );
      case 'settings':
        return <NotifySettings />;
      case 'reels':
        return <ReelsAdmin />;
      case 'background':
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="Site Background" />
            <div className="p-5 rounded-2xl bg-muted/40 border border-primary/10 flex flex-col gap-4">
              <label className="text-sm font-bold uppercase tracking-wide text-foreground">Background Color</label>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="color"
                  value={assets.bgColor || '#000000'}
                  onChange={(e) => { updateAssets({ bgColor: e.target.value } as any); showSaved(); }}
                  className="w-20 h-20 rounded-xl border border-primary/20 bg-transparent cursor-pointer p-1"
                  aria-label="Background color picker"
                />
                <input
                  type="text"
                  value={assets.bgColor || ''}
                  onChange={(e) => { updateAssets({ bgColor: e.target.value } as any); showSaved(); }}
                  placeholder="#000000"
                  className="px-4 py-3 rounded-xl bg-background border border-primary/20 text-foreground font-mono w-44"
                />
                <button
                  type="button"
                  onClick={() => { updateAssets({ bgColor: '#000000' } as any); showSaved(); }}
                  className="px-4 py-3 rounded-xl border border-primary/20 text-foreground hover:bg-muted text-sm font-bold"
                >
                  Reset
                </button>
                <div
                  className="w-20 h-20 rounded-xl border border-primary/20"
                  style={{ backgroundColor: assets.bgColor || '#000000' }}
                  aria-label="Live color preview"
                />
              </div>
              <p className="text-xs text-muted-foreground">Tip: drag the color regulator for fine control, or paste an exact hex like <code className="text-primary">#0a0a0a</code>.</p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/40 border border-primary/10 flex flex-col gap-4">
              <p className="text-sm text-foreground">The background image is bundled with the site. Replace <code className="text-primary">public/background.jpg</code> in the project to change it.</p>
              <div className="rounded-2xl overflow-hidden border border-primary/20 max-w-md">
                <img src={`${import.meta.env.BASE_URL}background.jpg`} alt="Bundled background preview" className="w-full h-48 object-cover" loading="lazy" decoding="async" width={400} height={192} />
              </div>
            </div>
          </div>
        );
      case 'fonts': {
        const currentFonts = (assets as any).fonts || ASSETS.fonts;
        const slots: { key: keyof typeof ASSETS.fonts; label: string; sample: string; className?: string }[] = [
          { key: 'heading', label: 'Heading Font (h1–h6)', sample: 'Lost Lock — Premium Adventure', className: 'text-3xl' },
          { key: 'body', label: 'Body Font (paragraphs)', sample: 'The quick brown fox jumps over the lazy dog. ქართული ტექსტის ნიმუში 123.', className: 'text-base' },
          { key: 'vintage', label: 'Vintage Font (.font-vintage)', sample: 'LOST LOCK', className: 'text-4xl uppercase tracking-wide' },
          { key: 'accent', label: 'Accent Font (.font-accent)', sample: 'Buttons · Labels · Badges', className: 'text-sm uppercase tracking-[0.3em] font-black' },
        ];
        const updateFont = (key: string, value: string) => {
          const next = { ...currentFonts, [key]: value };
          updateAssets({ fonts: next } as any);
          showSaved();
        };
        return (
          <div className="flex flex-col gap-8">
            <SectionTitle title="Typography" desc="Pick a Google Font for each text role. Changes apply instantly across the site. For Georgian text, fonts marked KA are recommended." />
            {slots.map((slot) => (
              <div key={slot.key} className="flex flex-col gap-3 p-5 rounded-2xl bg-muted/40 border border-primary/10">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">{slot.label}</label>
                <select
                  value={currentFonts[slot.key]}
                  onChange={(e) => updateFont(slot.key, e.target.value)}
                  className="w-full p-3 rounded-xl bg-muted border border-primary/20 text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  {(['Serif Display', 'Sans-serif', 'Mono', 'Handwritten', 'Georgian'] as const).map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {FONT_OPTIONS.filter((f) => f.category === cat).map((f) => (
                        <option key={f.name} value={f.name}>
                          {f.name}{f.ka ? '  ·  KA' : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div
                  className={`mt-2 p-4 rounded-xl bg-background border border-primary/20 text-foreground ${slot.className || ''}`}
                  style={{ fontFamily: `'${currentFonts[slot.key]}', system-ui, sans-serif` }}
                >
                  {slot.sample}
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 'assets':
        return (
          <div className="flex flex-col gap-8">
            <SectionTitle title="Assets & Media" />
            <div className="p-5 rounded-2xl bg-muted/40 border border-primary/20 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Logo</h3>
                {assets.logo && (
                  <div className="w-20 h-20 rounded-xl bg-background border border-primary/20 flex items-center justify-center overflow-hidden">
                    <img src={assets.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" decoding="async" width={80} height={80} />
                  </div>
                )}
              </div>
              <InputField
                label="Logo URL (paste any image link)"
                value={assets.logo}
                onChange={(v) => { updateAssets({ logo: v }); showSaved(); }}
              />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Or upload from your device</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      updateAssets({ logo: reader.result as string });
                      showSaved();
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-transparent file:text-primary file:border file:border-primary/30 file:font-black file:uppercase file:text-xs file:cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Tip: PNG with transparent background works best.</p>
              </div>
            </div>

            <InputField label="Hero Video URL" value={assets.heroVideo} onChange={(v) => { updateAssets({ heroVideo: v }); showSaved(); }} />
            <InputField label="Hero Fallback Image URL" value={assets.heroFallback} onChange={(v) => { updateAssets({ heroFallback: v }); showSaved(); }} />
          </div>
        );
      case 'ui_ka':
      case 'ui_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const ui = translations[lang].ui;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`UI Texts (${lang.toUpperCase()})`} />
            {Object.entries(ui).map(([key, val]) => (
              <InputField key={key} label={key} value={val as string} onChange={(v) => { updateTranslation(lang, `ui.${key}`, v); showSaved(); }} />
            ))}
          </div>
        );
      }
      case 'nav_ka':
      case 'nav_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const nav = translations[lang].nav;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Navigation (${lang.toUpperCase()})`} />
            {nav.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/50 border border-primary/10 flex flex-col gap-3">
                <InputField label={`Link ${idx + 1} - Label`} value={item.label} onChange={(v) => { updateTranslation(lang, `nav.${idx}.label`, v); showSaved(); }} />
                <InputField label={`Link ${idx + 1} - Href`} value={item.href} onChange={(v) => { updateTranslation(lang, `nav.${idx}.href`, v); showSaved(); }} />
                <button onClick={() => {
                  const newNav = [...nav]; newNav.splice(idx, 1);
                  updateTranslation(lang, 'nav', newNav); showSaved();
                }} className="self-end text-destructive text-xs font-black flex items-center gap-1 hover:opacity-70"><Trash2 size={14} /> Remove</button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation(lang, 'nav', [...nav, { label: 'New Link', href: '#new' }]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm hover:opacity-70"><Plus size={16} /> Add Nav Link</button>
          </div>
        );
      }
      case 'rooms_ka':
      case 'rooms_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const items = translations[lang].obstacles;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Rooms (${lang.toUpperCase()})`} />
            {items.map((item: any, idx: number) => (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <InputField label="Name" value={item.name} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.name`, v); showSaved(); }} />
                  <InputField label="Category" value={item.category} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.category`, v); showSaved(); }} />
                  <InputField label="Main Image URL" value={item.image} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.image`, v); showSaved(); }} />
                  <InputField label="Image 2 URL" value={(item.images && item.images[0]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[0] = v; updateTranslation(lang, `obstacles.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Image 3 URL" value={(item.images && item.images[1]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[1] = v; updateTranslation(lang, `obstacles.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Image 4 URL" value={(item.images && item.images[2]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[2] = v; updateTranslation(lang, `obstacles.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Video URL" value={item.video || ''} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.video`, v); showSaved(); }} />
                  <InputField label="Description" value={item.description} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.description`, v); showSaved(); }} multiline />
                  <button onClick={() => {
                    const newItems = [...items]; newItems.splice(idx, 1);
                    updateTranslation(lang, 'obstacles', newItems); showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            ))}
            <button onClick={() => {
              const newItem = { id: `room_${Date.now()}`, name: 'New Room', category: lang === 'ka' ? 'ოთახები' : 'Rooms', image: '', images: ['', '', ''], video: '', link: `#room_${Date.now()}`, description: '' };
              updateTranslation(lang, 'obstacles', [...items, newItem]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Room</button>
          </div>
        );
      }
      case 'services_ka':
      case 'services_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const items = translations[lang].services;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Services (${lang.toUpperCase()})`} />
            {items.map((item: any, idx: number) => (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} - {item.price} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <InputField label="Name" value={item.name} onChange={(v) => { updateTranslation(lang, `services.${idx}.name`, v); showSaved(); }} />
                  <InputField label="Price" value={item.price || ''} onChange={(v) => { updateTranslation(lang, `services.${idx}.price`, v); showSaved(); }} />
                  <InputField label="Main Image URL" value={item.image} onChange={(v) => { updateTranslation(lang, `services.${idx}.image`, v); showSaved(); }} />
                  <InputField label="Image 2 URL" value={(item.images && item.images[0]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[0] = v; updateTranslation(lang, `services.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Image 3 URL" value={(item.images && item.images[1]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[1] = v; updateTranslation(lang, `services.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Image 4 URL" value={(item.images && item.images[2]) || ''} onChange={(v) => { const imgs = [...(item.images || ['', '', ''])]; imgs[2] = v; updateTranslation(lang, `services.${idx}.images`, imgs); showSaved(); }} />
                  <InputField label="Video URL" value={item.video || ''} onChange={(v) => { updateTranslation(lang, `services.${idx}.video`, v); showSaved(); }} />
                  <InputField label="Description" value={item.description} onChange={(v) => { updateTranslation(lang, `services.${idx}.description`, v); showSaved(); }} multiline />
                  <button onClick={() => {
                    const newItems = [...items]; newItems.splice(idx, 1);
                    updateTranslation(lang, 'services', newItems); showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            ))}
            <button onClick={() => {
              const newItem = { id: `svc_${Date.now()}`, name: 'New Service', price: '0₾', category: lang === 'ka' ? 'სერვისები' : 'Services', image: '', images: ['', '', ''], video: '', link: `#svc_${Date.now()}`, description: '' };
              updateTranslation(lang, 'services', [...items, newItem]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Service</button>
          </div>
        );
      }
      case 'pricing_ka':
      case 'pricing_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const items = translations[lang].pricing;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Pricing (${lang.toUpperCase()})`} />
            {items.map((pkg: any, idx: number) => (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {pkg.title} - {pkg.price} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <InputField label="Title" value={pkg.title} onChange={(v) => { updateTranslation(lang, `pricing.${idx}.title`, v); showSaved(); }} />
                  <InputField label="Price" value={pkg.price} onChange={(v) => { updateTranslation(lang, `pricing.${idx}.price`, v); showSaved(); }} />
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-black uppercase text-muted-foreground">Recommended</label>
                    <input type="checkbox" checked={!!pkg.recommended} onChange={(e) => { updateTranslation(lang, `pricing.${idx}.recommended`, e.target.checked); showSaved(); }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Features (one per line)</label>
                    <textarea value={(pkg.features || []).join('\n')} onChange={(e) => { updateTranslation(lang, `pricing.${idx}.features`, e.target.value.split('\n')); showSaved(); }} rows={5}
                      className="w-full p-3 rounded-xl bg-muted border border-primary/20 text-foreground text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <button onClick={() => {
                    const newItems = [...items]; newItems.splice(idx, 1);
                    updateTranslation(lang, 'pricing', newItems); showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            ))}
            <button onClick={() => {
              updateTranslation(lang, 'pricing', [...items, { title: 'New Session', price: '0₾', features: ['Feature 1'] }]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Package</button>
          </div>
        );
      }
      case 'menu_ka':
      case 'menu_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const menu = translations[lang].menu;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Menu (${lang.toUpperCase()})`} />
            {Object.entries(menu).map(([key, cat]: [string, any]) => (
              <details key={key} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {cat.title} ({cat.items.length} items) <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-4">
                  <InputField label="Category Title" value={cat.title} onChange={(v) => { updateTranslation(lang, `menu.${key}.title`, v); showSaved(); }} />
                  {cat.items.map((item: any, i: number) => (
                    <div key={i} className="flex gap-2 items-end p-3 bg-muted/30 rounded-xl">
                      <div className="flex-1"><InputField label={`Item ${i + 1}`} value={item.name} onChange={(v) => { updateTranslation(lang, `menu.${key}.items.${i}.name`, v); showSaved(); }} /></div>
                      <div className="w-24"><InputField label="Price" value={item.price} onChange={(v) => { updateTranslation(lang, `menu.${key}.items.${i}.price`, v); showSaved(); }} /></div>
                      <button onClick={() => {
                        const newItems = [...cat.items]; newItems.splice(i, 1);
                        updateTranslation(lang, `menu.${key}.items`, newItems); showSaved();
                      }} className="pb-3 text-destructive"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => {
                    updateTranslation(lang, `menu.${key}.items`, [...cat.items, { name: 'New Item', price: '0₾' }]); showSaved();
                  }} className="flex items-center gap-2 text-primary font-black text-xs"><Plus size={14} /> Add Item</button>
                </div>
              </details>
            ))}
          </div>
        );
      }
      case 'faq_ka':
      case 'faq_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const faq = translations[lang].faq;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`FAQ (${lang.toUpperCase()})`} />
            {faq.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-primary/10 flex flex-col gap-3">
                <InputField label="Question" value={item.question} onChange={(v) => { updateTranslation(lang, `faq.${idx}.question`, v); showSaved(); }} />
                <InputField label="Answer" value={item.answer} onChange={(v) => { updateTranslation(lang, `faq.${idx}.answer`, v); showSaved(); }} multiline />
                <button onClick={() => {
                  const newFaq = [...faq]; newFaq.splice(idx, 1);
                  updateTranslation(lang, 'faq', newFaq); showSaved();
                }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation(lang, 'faq', [...faq, { question: 'New Question?', answer: 'Answer here.' }]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add FAQ</button>
          </div>
        );
      }
      case 'rules_ka':
      case 'rules_en': {
        const lang = activeTab.endsWith('_ka') ? 'ka' : 'en' as Language;
        const rules = translations[lang].rules;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title={`Rules (${lang.toUpperCase()})`} />
            {rules.map((rule: string, idx: number) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-primary font-black text-lg shrink-0 mt-3">{idx + 1}.</span>
                <div className="flex-1"><InputField label={`Rule ${idx + 1}`} value={rule} onChange={(v) => { updateTranslation(lang, `rules.${idx}`, v); showSaved(); }} multiline /></div>
                <button onClick={() => {
                  const newRules = [...rules]; newRules.splice(idx, 1);
                  updateTranslation(lang, 'rules', newRules); showSaved();
                }} className="mt-8 text-destructive"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation(lang, 'rules', [...rules, `${rules.length + 1}. New rule`]); showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Rule</button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const currentTab = ALL_TABS.find((t) => t.id === activeTab);
  const activeGroup = TAB_GROUPS.find((g) => g.tabs.some((t) => t.id === activeTab));

  const chooseTab = (tab: Tab, groupLabel: string) => {
    setActiveTab(tab);
    setOpenGroups((groups) => groups.includes(groupLabel) ? groups : [...groups, groupLabel]);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((groups) => groups.includes(label) ? groups.filter((g) => g !== label) : [...groups, label]);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0a] flex text-zinc-100">
      {sidebarOpen && <button aria-label="დახურე მენიუ" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/70 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-[270px] border-r border-white/10 bg-[#11110f] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
        <div className="h-16 px-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">L</div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm uppercase tracking-wide leading-none">Lost Lock</span>
            <span className="text-[10px] text-zinc-500 font-medium mt-1">მართვის პანელი</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 text-zinc-500 hover:text-white lg:hidden"><X size={18} /></button>
        </div>
        <nav className="h-[calc(100vh-128px)] px-3 py-4 overflow-y-auto ll-hide-scrollbar">
          {TAB_GROUPS.map((group, groupIndex) => {
            const groupOpen = groupIndex === 0 || openGroups.includes(group.label) || activeGroup?.label === group.label;
            return (
            <div key={group.label} className="mb-3">
              {groupIndex === 0 ? (
                <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">{group.label}</div>
              ) : (
                <button onClick={() => toggleGroup(group.label)} className="w-full px-3 py-2 flex items-center justify-between text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-300">
                  {group.label}
                  <ChevronDown size={13} className={`transition-transform ${groupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
              {groupOpen && <div className="flex flex-col gap-0.5">
                {group.tabs.map((tab) => {
                  const isCreate = tab.id === 'create';
                  return (
                    <button key={tab.id} onClick={() => chooseTab(tab.id, group.label)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white/[0.07] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary'
                          : isCreate ? 'text-primary hover:bg-white/[0.04]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}>
                      <span className={activeTab === tab.id ? 'text-primary' : ''}>{tab.icon}</span>
                      <span className="truncate">{tab.label}</span>
                      {isCreate && <Plus size={14} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>}
            </div>
          )})}
        </nav>
        <div className="h-16 px-3 border-t border-white/10 flex items-center gap-1">
          <button onClick={() => { resetToDefault(); showSaved(); }}
            title="საიტის კონტენტის აღდგენა"
            className="p-2.5 text-zinc-600 hover:text-red-400 transition-colors">
            <RotateCcw size={16} />
          </button>
          <button onClick={() => { logout(); window.location.hash = '#'; }}
            className="ml-auto flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors">
            <LogOut size={15} /> გასვლა
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 border-b border-white/10 bg-[#0b0b0a]/95 backdrop-blur flex items-center justify-between px-4 md:px-7 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 text-zinc-400 shrink-0">
              {sidebarOpen ? <ArrowLeft size={18} /> : <Menu size={19} />}
            </button>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-zinc-600">{activeGroup?.label}</div>
              <div className="text-sm font-semibold text-foreground truncate">{currentTab?.label}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <Save size={14} /> შენახულია
              </span>
            )}
            <button onClick={() => chooseTab('create', 'დღიური სამუშაო')} className="hidden sm:flex items-center gap-1.5 bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:brightness-110">
              <PlusCircle size={14} /> ახალი ღონისძიება
            </button>
            <a href="#" className="flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors">
              <ExternalLink size={13} /> <span className="hidden md:inline">საიტზე დაბრუნება</span>
            </a>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className={`w-full ${activeTab === 'bookings' || activeTab === 'create' || activeTab === 'today' ? 'max-w-[1440px]' : 'max-w-4xl'} mx-auto`}>
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { isAuthenticated } = useContentStore();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated);

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard />;
};

export default AdminPanel;
