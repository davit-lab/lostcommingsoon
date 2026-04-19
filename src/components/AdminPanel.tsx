import React, { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { Language } from '@/types';
import { ASSETS, FONT_OPTIONS } from '@/constants';
import { ArrowLeft, Save, RotateCcw, LogOut, Image, Type, DollarSign, FileText, UtensilsCrossed, HelpCircle, ShieldCheck, Palette, ChevronDown, Plus, Trash2, TextCursorInput } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-primary/20 shadow-2xl">
        <h1 className="text-3xl font-vintage text-foreground uppercase mb-2 text-center">Admin Panel</h1>
        <p className="text-muted-foreground text-center mb-8">Lost Lock CMS</p>
        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-xl bg-muted border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-muted border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <button type="submit" className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-wider hover:opacity-90 transition-all">Login</button>
        </form>
      </div>
    </div>
  );
};

type Tab = 'assets' | 'fonts' | 'ui_ka' | 'ui_en' | 'rooms_ka' | 'rooms_en' | 'services_ka' | 'services_en' | 'pricing_ka' | 'pricing_en' | 'menu_ka' | 'menu_en' | 'faq_ka' | 'faq_en' | 'rules_ka' | 'rules_en' | 'nav_ka' | 'nav_en' | 'background';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'background', label: 'Background', icon: <Palette size={18} /> },
  { id: 'fonts', label: 'Fonts', icon: <TextCursorInput size={18} /> },
  { id: 'assets', label: 'Assets / Media', icon: <Image size={18} /> },
  { id: 'ui_ka', label: 'UI Texts (KA)', icon: <Type size={18} /> },
  { id: 'ui_en', label: 'UI Texts (EN)', icon: <Type size={18} /> },
  { id: 'nav_ka', label: 'Navigation (KA)', icon: <FileText size={18} /> },
  { id: 'nav_en', label: 'Navigation (EN)', icon: <FileText size={18} /> },
  { id: 'rooms_ka', label: 'Rooms (KA)', icon: <FileText size={18} /> },
  { id: 'rooms_en', label: 'Rooms (EN)', icon: <FileText size={18} /> },
  { id: 'services_ka', label: 'Services (KA)', icon: <DollarSign size={18} /> },
  { id: 'services_en', label: 'Services (EN)', icon: <DollarSign size={18} /> },
  { id: 'pricing_ka', label: 'Pricing (KA)', icon: <DollarSign size={18} /> },
  { id: 'pricing_en', label: 'Pricing (EN)', icon: <DollarSign size={18} /> },
  { id: 'menu_ka', label: 'Menu (KA)', icon: <UtensilsCrossed size={18} /> },
  { id: 'menu_en', label: 'Menu (EN)', icon: <UtensilsCrossed size={18} /> },
  { id: 'faq_ka', label: 'FAQ (KA)', icon: <HelpCircle size={18} /> },
  { id: 'faq_en', label: 'FAQ (EN)', icon: <HelpCircle size={18} /> },
  { id: 'rules_ka', label: 'Rules (KA)', icon: <ShieldCheck size={18} /> },
  { id: 'rules_en', label: 'Rules (EN)', icon: <ShieldCheck size={18} /> },
];

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

const AdminDashboard: React.FC = () => {
  const { assets, translations, updateAssets, updateTranslation, logout, resetToDefault } = useContentStore();
  const [activeTab, setActiveTab] = useState<Tab>('background');
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'background':
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-foreground">Site Background</h2>
            <p className="text-muted-foreground">Change the main background image of the entire site.</p>
            <InputField label="Background Image URL" value={assets.mainBackground} onChange={(v) => { updateAssets({ mainBackground: v }); showSaved(); }} />
            {assets.mainBackground && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-primary/20 max-w-md">
                <img src={assets.mainBackground} alt="Background preview" className="w-full h-48 object-cover" />
              </div>
            )}
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
            <div>
              <h2 className="text-2xl font-black text-foreground">Typography</h2>
              <p className="text-muted-foreground mt-2">
                Pick a Google Font for each text role. Changes apply instantly across the site.
                For Georgian text, fonts marked <span className="text-primary">KA</span> are recommended.
              </p>
            </div>
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
            <h2 className="text-2xl font-black text-foreground">Assets & Media</h2>

            {/* LOGO SECTION */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-primary/20 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Logo</h3>
                {assets.logo && (
                  <div className="w-20 h-20 rounded-xl bg-background border border-primary/20 flex items-center justify-center overflow-hidden">
                    <img src={assets.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
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
                  className="w-full text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-black file:uppercase file:text-xs file:cursor-pointer"
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
            <h2 className="text-2xl font-black text-foreground">UI Texts ({lang.toUpperCase()})</h2>
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
            <h2 className="text-2xl font-black text-foreground">Navigation ({lang.toUpperCase()})</h2>
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
            <h2 className="text-2xl font-black text-foreground">Rooms ({lang.toUpperCase()})</h2>
            {items.map((item: any, idx: number) => (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <InputField label="Name" value={item.name} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.name`, v); showSaved(); }} />
                  <InputField label="Category" value={item.category} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.category`, v); showSaved(); }} />
                  <InputField label="Image URL" value={item.image} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.image`, v); showSaved(); }} />
                  <InputField label="Description" value={item.description} onChange={(v) => { updateTranslation(lang, `obstacles.${idx}.description`, v); showSaved(); }} multiline />
                  <button onClick={() => {
                    const newItems = [...items]; newItems.splice(idx, 1);
                    updateTranslation(lang, 'obstacles', newItems); showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            ))}
            <button onClick={() => {
              const newItem = { id: `room_${Date.now()}`, name: 'New Room', category: lang === 'ka' ? 'ოთახები' : 'Rooms', image: '', link: `#room_${Date.now()}`, description: '' };
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
            <h2 className="text-2xl font-black text-foreground">Services ({lang.toUpperCase()})</h2>
            {items.map((item: any, idx: number) => (
              <details key={idx} className="group border border-primary/20 rounded-2xl overflow-hidden">
                <summary className="p-4 font-black text-foreground cursor-pointer flex justify-between items-center bg-muted/30 hover:bg-muted/50">
                  {item.name} - {item.price} <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-primary" />
                </summary>
                <div className="p-4 flex flex-col gap-3">
                  <InputField label="Name" value={item.name} onChange={(v) => { updateTranslation(lang, `services.${idx}.name`, v); showSaved(); }} />
                  <InputField label="Price" value={item.price || ''} onChange={(v) => { updateTranslation(lang, `services.${idx}.price`, v); showSaved(); }} />
                  <InputField label="Image URL" value={item.image} onChange={(v) => { updateTranslation(lang, `services.${idx}.image`, v); showSaved(); }} />
                  <InputField label="Description" value={item.description} onChange={(v) => { updateTranslation(lang, `services.${idx}.description`, v); showSaved(); }} multiline />
                  <button onClick={() => {
                    const newItems = [...items]; newItems.splice(idx, 1);
                    updateTranslation(lang, 'services', newItems); showSaved();
                  }} className="self-end text-destructive text-xs font-black flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                </div>
              </details>
            ))}
            <button onClick={() => {
              const newItem = { id: `svc_${Date.now()}`, name: 'New Service', price: '0₾', category: lang === 'ka' ? 'სერვისები' : 'Services', image: '', link: `#svc_${Date.now()}`, description: '' };
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
            <h2 className="text-2xl font-black text-foreground">Pricing ({lang.toUpperCase()})</h2>
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
            <h2 className="text-2xl font-black text-foreground">Menu ({lang.toUpperCase()})</h2>
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
            <h2 className="text-2xl font-black text-foreground">FAQ ({lang.toUpperCase()})</h2>
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
            <h2 className="text-2xl font-black text-foreground">Rules ({lang.toUpperCase()})</h2>
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r border-primary/20 overflow-hidden shrink-0`}>
        <div className="p-4 border-b border-primary/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">L</div>
          <span className="font-black text-foreground text-sm uppercase">Admin Panel</span>
        </div>
        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
              {tab.icon} <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-primary/20 flex flex-col gap-1">
          <button onClick={() => { resetToDefault(); showSaved(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all">
            <RotateCcw size={16} /> Reset All
          </button>
          <button onClick={() => { logout(); window.location.hash = '#'; }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-primary/20 bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground">
              <ArrowLeft size={18} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
            <span className="text-sm font-bold text-muted-foreground">{TABS.find(t => t.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs font-black text-green-500 flex items-center gap-1 animate-pulse">
                <Save size={14} /> Saved!
              </span>
            )}
            <a href="#" className="text-xs font-black text-primary hover:text-foreground transition-all flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Site
            </a>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl">
          {renderTabContent()}
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
