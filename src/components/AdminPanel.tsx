import React, { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { Language, ServiceItem } from '@/types';
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
    label: 'კონტენტი / Bilingual content',
    tabs: [
      { id: 'ui_ka', label: 'მთავარი ტექსტები / Main texts', icon: <Type size={17} /> },
      { id: 'nav_ka', label: 'ნავიგაცია / Navigation', icon: <FileText size={17} /> },
      { id: 'rooms_ka', label: 'ოთახები / Rooms', icon: <DoorOpen size={17} /> },
      { id: 'services_ka', label: 'სერვისები / Services', icon: <DollarSign size={17} /> },
      { id: 'pricing_ka', label: 'ფასები / Pricing', icon: <DollarSign size={17} /> },
      { id: 'menu_ka', label: 'მენიუ / Menu', icon: <UtensilsCrossed size={17} /> },
      { id: 'faq_ka', label: 'ხშირი კითხვები / FAQ', icon: <HelpCircle size={17} /> },
      { id: 'rules_ka', label: 'წესები / Rules', icon: <ShieldCheck size={17} /> },
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

const BilingualField = ({ label, ka, en, onChangeKa, onChangeEn, multiline = false }: {
  label: string;
  ka: string;
  en: string;
  onChangeKa: (value: string) => void;
  onChangeEn: (value: string) => void;
  multiline?: boolean;
}) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    <InputField label={`${label} · ქართული`} value={ka} onChange={onChangeKa} multiline={multiline} />
    <InputField label={`${label} · English`} value={en} onChange={onChangeEn} multiline={multiline} />
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
  const updateBothLanguages = (path: string, value: string | boolean) => {
    updateTranslation('ka', path, value);
    updateTranslation('en', path, value);
    showSaved();
  };
  const ensureEnglishItem = (collection: 'obstacles' | 'services', item: ServiceItem) => {
    const englishItems: ServiceItem[] = useContentStore.getState().translations.en[collection];
    const existingIndex = englishItems.findIndex((entry) => entry.id === item.id);
    if (existingIndex >= 0) return existingIndex;

    const translatedItem: ServiceItem = {
      ...item,
      name: '',
      category: collection === 'obstacles' ? 'Rooms' : 'Services',
      description: '',
    };
    updateTranslation('en', collection, [...englishItems, translatedItem]);
    return englishItems.length;
  };

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
        const uiKa = translations.ka.ui;
        const uiEn = translations.en.ui;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="მთავარი ტექსტები / Main texts" desc="Edit Georgian and English together." />
            {Object.entries(uiKa).map(([key, val]) => (
              <BilingualField
                key={key}
                label={key}
                ka={String(val ?? '')}
                en={String(uiEn[key] ?? '')}
                onChangeKa={(v) => { updateTranslation('ka', `ui.${key}`, v); showSaved(); }}
                onChangeEn={(v) => { updateTranslation('en', `ui.${key}`, v); showSaved(); }}
              />
            ))}
          </div>
        );
      }
      case 'nav_ka':
      case 'nav_en': {
        const navKa = translations.ka.nav;
        const navEn = translations.en.nav;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="ნავიგაცია / Navigation" desc="Labels are translated; each link destination is shared." />
            {navKa.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/50 border border-primary/10 flex flex-col gap-3">
                <BilingualField
                  label={`Link ${idx + 1} · Label`}
                  ka={item.label}
                  en={navEn[idx]?.label || ''}
                  onChangeKa={(v) => { updateTranslation('ka', `nav.${idx}.label`, v); showSaved(); }}
                  onChangeEn={(v) => { updateTranslation('en', `nav.${idx}.label`, v); showSaved(); }}
                />
                <InputField label={`Link ${idx + 1} · Destination`} value={item.href} onChange={(v) => updateBothLanguages(`nav.${idx}.href`, v)} />
                <button onClick={() => {
                  const newNavKa = [...navKa]; newNavKa.splice(idx, 1);
                  const newNavEn = [...navEn]; newNavEn.splice(idx, 1);
                  updateTranslation('ka', 'nav', newNavKa);
                  updateTranslation('en', 'nav', newNavEn);
                  showSaved();
                }} className="self-end text-destructive text-xs font-black flex items-center gap-1 hover:opacity-70"><Trash2 size={14} /> Remove</button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation('ka', 'nav', [...navKa, { label: 'ახალი ბმული', href: '#new' }]);
              updateTranslation('en', 'nav', [...navEn, { label: 'New Link', href: '#new' }]);
              showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm hover:opacity-70"><Plus size={16} /> Add Nav Link</button>
          </div>
        );
      }
      case 'rooms_ka':
      case 'rooms_en': {
        const itemsKa: ServiceItem[] = translations.ka.obstacles;
        const itemsEn: ServiceItem[] = translations.en.obstacles;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="ოთახები / Rooms" desc="Add translations side by side. Images and video are shared between both languages." />
            {itemsKa.map((item: ServiceItem, idx: number) => {
              const enIdx = itemsEn.findIndex((candidate) => candidate.id === item.id);
              const translatedItem: Partial<ServiceItem> = enIdx >= 0 ? itemsEn[enIdx] : {};
              const updateEnglishField = (field: keyof ServiceItem, value: string | string[]) => {
                const targetIndex = enIdx >= 0 ? enIdx : ensureEnglishItem('obstacles', item);
                updateTranslation('en', `obstacles.${targetIndex}.${field}`, value);
                showSaved();
              };
              const updateSharedImages = (imageIndex: number, value: string) => {
                const images = [...(item.images || ['', '', ''])];
                images[imageIndex] = value;
                updateTranslation('ka', `obstacles.${idx}.images`, images);
                updateEnglishField('images', images);
                showSaved();
              };
              return (
              <details key={item.id} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} / {translatedItem.name || 'English translation needed'} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <BilingualField
                    label="Name"
                    ka={item.name}
                    en={translatedItem.name || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `obstacles.${idx}.name`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('name', v)}
                  />
                  <BilingualField
                    label="Category"
                    ka={item.category}
                    en={translatedItem.category || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `obstacles.${idx}.category`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('category', v)}
                  />
                  <InputField label="Main Image URL · shared" value={item.image} onChange={(v) => {
                    updateTranslation('ka', `obstacles.${idx}.image`, v);
                    updateEnglishField('image', v);
                    showSaved();
                  }} />
                  {[0, 1, 2].map((imageIndex) => (
                    <InputField key={imageIndex} label={`Image ${imageIndex + 2} URL · shared`} value={item.images?.[imageIndex] || ''} onChange={(v) => updateSharedImages(imageIndex, v)} />
                  ))}
                  <InputField label="Video URL · shared" value={item.video || ''} onChange={(v) => {
                    updateTranslation('ka', `obstacles.${idx}.video`, v);
                    updateEnglishField('video', v);
                    showSaved();
                  }} />
                  <BilingualField
                    label="Description"
                    ka={item.description}
                    en={translatedItem.description || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `obstacles.${idx}.description`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('description', v)}
                    multiline
                  />
                  <button onClick={() => {
                    updateTranslation('ka', 'obstacles', itemsKa.filter((entry) => entry.id !== item.id));
                    updateTranslation('en', 'obstacles', itemsEn.filter((entry) => entry.id !== item.id));
                    showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            );})}
            <button onClick={() => {
              const id = `room_${Date.now()}`;
              const link = `#${id}`;
              updateTranslation('ka', 'obstacles', [...itemsKa, { id, name: 'ახალი ოთახი', category: 'ოთახები', image: '', images: ['', '', ''], video: '', link, description: '' }]);
              updateTranslation('en', 'obstacles', [...itemsEn, { id, name: 'New Room', category: 'Rooms', image: '', images: ['', '', ''], video: '', link, description: '' }]);
              showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Room</button>
          </div>
        );
      }
      case 'services_ka':
      case 'services_en': {
        const itemsKa: ServiceItem[] = translations.ka.services;
        const itemsEn: ServiceItem[] = translations.en.services;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="სერვისები / Services" desc="Add translations side by side. Images, video, and price are shared between both languages." />
            {itemsKa.map((item: ServiceItem, idx: number) => {
              const enIdx = itemsEn.findIndex((candidate) => candidate.id === item.id);
              const translatedItem: Partial<ServiceItem> = enIdx >= 0 ? itemsEn[enIdx] : {};
              const updateEnglishField = (field: keyof ServiceItem, value: string | string[]) => {
                const targetIndex = enIdx >= 0 ? enIdx : ensureEnglishItem('services', item);
                updateTranslation('en', `services.${targetIndex}.${field}`, value);
                showSaved();
              };
              const updateSharedImages = (imageIndex: number, value: string) => {
                const images = [...(item.images || ['', '', ''])];
                images[imageIndex] = value;
                updateTranslation('ka', `services.${idx}.images`, images);
                updateEnglishField('images', images);
                showSaved();
              };
              return (
              <details key={item.id} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} / {translatedItem.name || 'English translation needed'} - {item.price} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <BilingualField
                    label="Name"
                    ka={item.name}
                    en={translatedItem.name || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `services.${idx}.name`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('name', v)}
                  />
                  <BilingualField
                    label="Category"
                    ka={item.category}
                    en={translatedItem.category || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `services.${idx}.category`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('category', v)}
                  />
                  <InputField label="Price · shared" value={item.price || ''} onChange={(v) => {
                    updateTranslation('ka', `services.${idx}.price`, v);
                    updateEnglishField('price', v);
                    showSaved();
                  }} />
                  <InputField label="Main Image URL · shared" value={item.image} onChange={(v) => {
                    updateTranslation('ka', `services.${idx}.image`, v);
                    updateEnglishField('image', v);
                    showSaved();
                  }} />
                  {[0, 1, 2].map((imageIndex) => (
                    <InputField key={imageIndex} label={`Image ${imageIndex + 2} URL · shared`} value={item.images?.[imageIndex] || ''} onChange={(v) => updateSharedImages(imageIndex, v)} />
                  ))}
                  <InputField label="Video URL · shared" value={item.video || ''} onChange={(v) => {
                    updateTranslation('ka', `services.${idx}.video`, v);
                    updateEnglishField('video', v);
                    showSaved();
                  }} />
                  <BilingualField
                    label="Description"
                    ka={item.description}
                    en={translatedItem.description || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `services.${idx}.description`, v); showSaved(); }}
                    onChangeEn={(v) => updateEnglishField('description', v)}
                    multiline
                  />
                  <button onClick={() => {
                    updateTranslation('ka', 'services', itemsKa.filter((entry) => entry.id !== item.id));
                    updateTranslation('en', 'services', itemsEn.filter((entry) => entry.id !== item.id));
                    showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            );})}
            <button onClick={() => {
              const id = `svc_${Date.now()}`;
              const link = `#${id}`;
              updateTranslation('ka', 'services', [...itemsKa, { id, name: 'ახალი სერვისი', price: '0₾', category: 'სერვისები', image: '', images: ['', '', ''], video: '', link, description: '' }]);
              updateTranslation('en', 'services', [...itemsEn, { id, name: 'New Service', price: '0₾', category: 'Services', image: '', images: ['', '', ''], video: '', link, description: '' }]);
              showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Service</button>
          </div>
        );
      }
      case 'pricing_ka':
      case 'pricing_en': {
        const itemsKa = translations.ka.pricing;
        const itemsEn = translations.en.pricing;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="ფასები / Pricing" />
            {itemsKa.map((pkg: any, idx: number) => {
              const translatedPackage = itemsEn[idx] || {};
              return (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {pkg.title} / {translatedPackage.title || 'English translation needed'} - {pkg.price} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <BilingualField
                    label="Title"
                    ka={pkg.title}
                    en={translatedPackage.title || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `pricing.${idx}.title`, v); showSaved(); }}
                    onChangeEn={(v) => { updateTranslation('en', `pricing.${idx}.title`, v); showSaved(); }}
                  />
                  <InputField label="Price · shared" value={pkg.price} onChange={(v) => updateBothLanguages(`pricing.${idx}.price`, v)} />
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-black uppercase text-muted-foreground">Recommended</label>
                    <input type="checkbox" checked={!!pkg.recommended} onChange={(e) => updateBothLanguages(`pricing.${idx}.recommended`, e.target.checked)} />
                  </div>
                  <BilingualField
                    label="Features · one per line"
                    ka={(pkg.features || []).join('\n')}
                    en={(translatedPackage.features || []).join('\n')}
                    onChangeKa={(v) => { updateTranslation('ka', `pricing.${idx}.features`, v.split('\n')); showSaved(); }}
                    onChangeEn={(v) => { updateTranslation('en', `pricing.${idx}.features`, v.split('\n')); showSaved(); }}
                    multiline
                  />
                  <button onClick={() => {
                    const newItemsKa = [...itemsKa]; newItemsKa.splice(idx, 1);
                    const newItemsEn = [...itemsEn]; newItemsEn.splice(idx, 1);
                    updateTranslation('ka', 'pricing', newItemsKa);
                    updateTranslation('en', 'pricing', newItemsEn);
                    showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            );})}
            <button onClick={() => {
              updateTranslation('ka', 'pricing', [...itemsKa, { title: 'ახალი სესია', price: '0₾', features: ['ახალი პუნქტი'] }]);
              updateTranslation('en', 'pricing', [...itemsEn, { title: 'New Session', price: '0₾', features: ['New feature'] }]);
              showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add Package</button>
          </div>
        );
      }
      case 'menu_ka':
      case 'menu_en': {
        const menuKa = translations.ka.menu;
        const menuEn = translations.en.menu;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="მენიუ / Menu" desc="Both languages stay visible. Add menu items in the appropriate language column." />
            {Object.entries(menuKa).map(([key, catKa]: [string, any]) => {
              const catEn = menuEn[key] || { title: '', items: [] };
              return (
              <details key={key} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {catKa.title} / {catEn.title} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-4">
                  <BilingualField
                    label="Category Title"
                    ka={catKa.title}
                    en={catEn.title}
                    onChangeKa={(v) => { updateTranslation('ka', `menu.${key}.title`, v); showSaved(); }}
                    onChangeEn={(v) => { updateTranslation('en', `menu.${key}.title`, v); showSaved(); }}
                  />
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {([
                      { language: 'ka' as Language, label: 'ქართული', category: catKa },
                      { language: 'en' as Language, label: 'English', category: catEn },
                    ]).map(({ language, label, category }) => (
                      <div key={language} className="flex flex-col gap-3 rounded-xl border border-primary/10 p-3">
                        <h3 className="text-sm font-bold text-primary">{label}</h3>
                        {category.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-end gap-2 rounded-xl bg-muted/30 p-3">
                            <div className="min-w-0 flex-1"><InputField label={`Item ${i + 1}`} value={item.name} onChange={(v) => { updateTranslation(language, `menu.${key}.items.${i}.name`, v); showSaved(); }} /></div>
                            <div className="w-24 shrink-0"><InputField label="Price" value={item.price} onChange={(v) => { updateTranslation(language, `menu.${key}.items.${i}.price`, v); showSaved(); }} /></div>
                            <button onClick={() => {
                              const newItems = [...category.items]; newItems.splice(i, 1);
                              updateTranslation(language, `menu.${key}.items`, newItems); showSaved();
                            }} aria-label={`Remove ${label} item ${i + 1}`} className="pb-3 text-destructive"><Trash2 size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => {
                          updateTranslation(language, `menu.${key}.items`, [...category.items, { name: language === 'ka' ? 'ახალი პროდუქტი' : 'New Item', price: '0₾' }]); showSaved();
                        }} className="flex items-center gap-2 text-left text-xs font-black text-primary"><Plus size={14} /> Add Item · {label}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            );})}
          </div>
        );
      }
      case 'faq_ka':
      case 'faq_en': {
        const faqKa = translations.ka.faq;
        const faqEn = translations.en.faq;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="ხშირი კითხვები / FAQ" />
            {faqKa.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-primary/10 flex flex-col gap-3">
                <BilingualField
                  label={`Question ${idx + 1}`}
                  ka={item.question}
                  en={faqEn[idx]?.question || ''}
                  onChangeKa={(v) => { updateTranslation('ka', `faq.${idx}.question`, v); showSaved(); }}
                  onChangeEn={(v) => { updateTranslation('en', `faq.${idx}.question`, v); showSaved(); }}
                />
                <BilingualField
                  label="Answer"
                  ka={item.answer}
                  en={faqEn[idx]?.answer || ''}
                  onChangeKa={(v) => { updateTranslation('ka', `faq.${idx}.answer`, v); showSaved(); }}
                  onChangeEn={(v) => { updateTranslation('en', `faq.${idx}.answer`, v); showSaved(); }}
                  multiline
                />
                <button onClick={() => {
                  const newFaqKa = [...faqKa]; newFaqKa.splice(idx, 1);
                  const newFaqEn = [...faqEn]; newFaqEn.splice(idx, 1);
                  updateTranslation('ka', 'faq', newFaqKa);
                  updateTranslation('en', 'faq', newFaqEn);
                  showSaved();
                }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation('ka', 'faq', [...faqKa, { question: 'ახალი კითხვა?', answer: 'პასუხი აქ.' }]);
              updateTranslation('en', 'faq', [...faqEn, { question: 'New Question?', answer: 'Answer here.' }]);
              showSaved();
            }} className="flex items-center gap-2 text-primary font-black text-sm"><Plus size={16} /> Add FAQ</button>
          </div>
        );
      }
      case 'rules_ka':
      case 'rules_en': {
        const rulesKa = translations.ka.rules;
        const rulesEn = translations.en.rules;
        return (
          <div className="flex flex-col gap-6">
            <SectionTitle title="წესები / Rules" />
            {rulesKa.map((rule: string, idx: number) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-primary font-black text-lg shrink-0 mt-3">{idx + 1}.</span>
                <div className="flex-1">
                  <BilingualField
                    label={`Rule ${idx + 1}`}
                    ka={rule}
                    en={rulesEn[idx] || ''}
                    onChangeKa={(v) => { updateTranslation('ka', `rules.${idx}`, v); showSaved(); }}
                    onChangeEn={(v) => { updateTranslation('en', `rules.${idx}`, v); showSaved(); }}
                    multiline
                  />
                </div>
                <button onClick={() => {
                  const newRulesKa = [...rulesKa]; newRulesKa.splice(idx, 1);
                  const newRulesEn = [...rulesEn]; newRulesEn.splice(idx, 1);
                  updateTranslation('ka', 'rules', newRulesKa);
                  updateTranslation('en', 'rules', newRulesEn);
                  showSaved();
                }} className="mt-8 text-destructive"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => {
              updateTranslation('ka', 'rules', [...rulesKa, `${rulesKa.length + 1}. ახალი წესი`]);
              updateTranslation('en', 'rules', [...rulesEn, `${rulesEn.length + 1}. New rule`]);
              showSaved();
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
