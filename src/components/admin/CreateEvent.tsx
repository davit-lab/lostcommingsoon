import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, Users, UtensilsCrossed, Sparkles, User, Phone, StickyNote,
  Check, Minus, Plus, PartyPopper, Printer, AlertTriangle, Loader2, RefreshCw, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContentStore } from '@/store/contentStore';
import { BookingRow, BookingMenuLine, BookingServiceLine } from '@/types';
import { printEventDoc } from '@/lib/eventDocument';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

const INCLUDED_KIDS = 20;
const EXTRA_KID_PRICE = 30;
const SESSIONS = [
  { hour: '11:00', price: 800 },
  { hour: '13:30', price: 800 },
  { hour: '16:00', price: 800 },
  { hour: '18:30', price: 800 },
  { hour: '21:00', price: 1000 },
];

const fmt = (n: number | null | undefined) => `${Math.round(Number(n ?? 0)).toLocaleString('en-US')}₾`;

const parsePrice = (p?: string): number => parseFloat(String(p || '').replace(/[^\d.]/g, '')) || 0;

const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

const formatDateKA = (iso: string | null): string => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${KA_MONTHS[m - 1]} ${y}`;
};

const isoToday = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`; };

const QtyBtn: React.FC<{ d: number; onClick: () => void; disabled?: boolean }> = ({ d, onClick, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled}
    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${disabled ? 'opacity-25 cursor-not-allowed' : 'text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground'}`}>
    {d < 0 ? <Minus size={15} /> : <Plus size={15} />}
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    {children}
  </label>
);

const inputCls = "w-full p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 focus:border-primary outline-none font-bold placeholder:text-muted-foreground/50 transition-colors text-sm";
const cardCls = "rounded-[20px] md:rounded-[28px] bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 shadow-xl p-5 md:p-8";

interface MenuLine { key: string; catKey: string; cat: string; name: string; price: number; qty: number }
interface ServiceLine { key: string; name: string; price: number }

const CreateEvent: React.FC = () => {
  const { translations } = useContentStore();
  const menu = translations.ka.menu;
  const services = translations.ka.services;

  const [date, setDate] = useState<string>('');
  const [hour, setHour] = useState<string | null>(null);
  const [kids, setKids] = useState(INCLUDED_KIDS);
  const [menuQty, setMenuQty] = useState<Record<string, number>>({});
  const [serviceSel, setServiceSel] = useState<Record<string, boolean>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<BookingRow | null>(null);
  const [slots, setSlots] = useState<Set<string>>(new Set());
  const [slotsLoading, setSlotsLoading] = useState(true);

  const loadSlots = async () => {
    setSlotsLoading(true);
    try {
      const { data, error } = await supabase.rpc('ll_get_booked_slots', { from_date: isoToday() });
      if (!error && data) setSlots(new Set(data.map((r: any) => `${r.event_date}|${r.session_hour}`)));
    } catch { /* ignore */ }
    setSlotsLoading(false);
  };

  useEffect(() => { loadSlots(); }, []);

  const extraKids = Math.max(0, kids - INCLUDED_KIDS);
  const sessionBase = SESSIONS.find((s) => s.hour === hour)?.price ?? 0;
  const extraKidsCost = extraKids * EXTRA_KID_PRICE;

  const menuLines: MenuLine[] = useMemo(() => {
    const lines: MenuLine[] = [];
    Object.entries(menu).forEach(([catKey, cat]) => {
      (cat as any).items.forEach((item: any, idx: number) => {
        const key = `${catKey}|${idx}`;
        const qty = menuQty[key] || 0;
        if (qty > 0) lines.push({ key, catKey, cat: (cat as any).title, name: item.name, price: parsePrice(item.price), qty });
      });
    });
    return lines;
  }, [menu, menuQty]);
  const menuTotal = menuLines.reduce((a, l) => a + l.price * l.qty, 0);

  const serviceLines: ServiceLine[] = useMemo(
    () => services
      .filter((sv: any) => serviceSel[sv.id])
      .map((sv: any) => ({ key: sv.id, name: sv.name, price: parsePrice(sv.price) })),
    [services, serviceSel],
  );
  const servicesTotal = serviceLines.reduce((a, l) => a + l.price, 0);
  const totalPrice = sessionBase + extraKidsCost + menuTotal + servicesTotal;

  const slotKey = date && hour ? `${date}|${hour}` : '';
  const slotTaken = !!slotKey && slots.has(slotKey);
  const slotLabel = date && hour
    ? `${formatDateKA(date)} · ${hour} (2 სთ)`
    : '— 🕐 აირჩიეთ თარიღი და სესია';

  const create = async () => {
    setError('');
    if (!date || !hour) { setError('აირჩიეთ თარიღი და სესია.'); return; }
    if (!name.trim()) { setError('შეიყვანეთ მშობლის სახელი.'); return; }
    if (!/^[\d\s()+-]{9,}$/.test(phone.trim())) { setError('შეიყვანეთ სწორი ტელეფონის ნომერი.'); return; }
    setCreating(true);
    const ref = `LL-${String(Date.now()).slice(-6)}`;
    try {
      const booking = {
        ref_code: ref,
        event_date: date,
        session_hour: hour,
        kids_count: kids,
        extra_kids: extraKids,
        base_price: sessionBase,
        extra_kids_cost: extraKidsCost,
        menu_items: menuLines,
        menu_total: menuTotal,
        services: serviceLines,
        services_total: servicesTotal,
        total_price: totalPrice,
        parent_name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      };
      const { data, error } = await supabase.rpc('ll_admin_create_booking', {
        p_username: ADMIN_USER,
        p_password: ADMIN_PASS,
        p_booking: booking,
      });
      if (error) throw error;
      const row = (data ?? [])[0] as unknown as BookingRow | undefined;
      if (!row) throw new Error('no row returned');
      setCreated(row);
      loadSlots();
    } catch (e) {
      const err = e as { message?: string; code?: string; details?: string; hint?: string };
      console.error('[create-event] create failed', {
        message: err?.message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
      });
      setError('შექმნა ვერ მოხერხდა — სცადეთ ხელახლა.');
    }
    setCreating(false);
  };

  const reset = () => {
    setDate(''); setHour(null); setKids(INCLUDED_KIDS); setMenuQty({}); setServiceSel({});
    setName(''); setPhone(''); setNotes(''); setError(''); setCreated(null);
  };

  if (created) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto w-full">
        <div className="rounded-[28px] md:rounded-[40px] bg-zinc-900/70 backdrop-blur-sm border border-emerald-500/30 shadow-2xl p-8 md:p-14 flex flex-col items-center text-center gap-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.12 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <PartyPopper size={42} />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-vintage uppercase text-foreground">ღონისძიება შეიქმნა</h2>
          <div className="px-6 py-3 rounded-full border border-primary/40 bg-primary/10 text-primary font-black tracking-[0.25em] text-sm">
            № {created.ref_code}
          </div>
          <p className="text-muted-foreground font-bold text-base md:text-lg max-w-xl leading-relaxed">
            {created.parent_name} · {formatDateKA(created.event_date)} · {created.session_hour} · {created.kids_count} ბავშვი
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => printEventDoc(created)}
              className="flex-1 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3">
              <Printer size={16} /> PDF დანიშნულება
            </button>
            <button onClick={reset}
              className="flex-1 px-8 py-4 rounded-2xl border border-primary/30 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-3">
              <Plus size={16} /> ახალი ღონისძიება
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 md:gap-8 items-start">
      {/* ============ MAIN FORM ============ */}
      <div className="flex flex-col gap-6 min-w-0">
        {/* EVENT DETAILS */}
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-3"><CalendarDays className="text-primary" size={22} /> დეტალები</h3>
            {slotsLoading && <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> იტვირთება…</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="თარიღი *">
              <input type="date" min={isoToday()} value={date} onChange={(e) => { setDate(e.target.value); setHour(null); }}
                className={`${inputCls} [color-scheme:dark]`} />
            </Field>
            <Field label="სესია *">
              <div className="flex gap-2">
                {SESSIONS.map((s) => (
                  <button key={s.hour} type="button" onClick={() => setHour(s.hour)}
                    className={`flex-1 py-3 rounded-2xl border text-sm font-black transition-all ${hour === s.hour ? 'bg-primary text-primary-foreground border-primary' : 'bg-zinc-900/80 border-zinc-800 hover:border-primary/50'}`}>
                    {s.hour}
                    <span className={`block text-[10px] font-bold ${hour === s.hour ? 'opacity-80' : 'text-primary'}`}>{fmt(s.price)}</span>
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {slotTaken && !slotsLoading && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[13px] font-bold flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              ეს სესია უკვე დაკავებულია სხვა ჯავშნით. მაინც შეგიძლიათ დაჯავშნა — ამ შემთხვევაში იქნება ერთდროული ღონისძიებები.
            </div>
          )}
        </div>

        {/* CLIENT */}
        <div className={cardCls}>
          <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-3 mb-6"><User className="text-primary" size={22} /> კლიენტი</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="მშობლის სახელი *">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="მაგ: ნინო"
                className={inputCls} />
            </Field>
            <Field label="ტელეფონი *">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+995 5__ __ __ __" inputMode="tel"
                className={inputCls} />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="შენიშვნა">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="ტორტი, სპეციალური მოთხოვნები…"
                className={`${inputCls} resize-y`} />
            </Field>
          </div>
        </div>

        {/* KIDS */}
        <div className={cardCls}>
          <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-3 mb-6"><Users className="text-primary" size={22} /> ბავშვები</h3>
          <div className="flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-5">
              <QtyBtn d={-1} onClick={() => setKids(Math.max(1, kids - 1))} disabled={kids <= 1} />
              <div className="text-center min-w-[70px]">
                <motion.div key={kids} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-5xl md:text-6xl font-vintage tabular-nums leading-none">{kids}</motion.div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mt-1">ბავშვი</div>
              </div>
              <QtyBtn d={1} onClick={() => setKids(kids + 1)} />
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/5 px-5 py-3.5 flex flex-col gap-1">
              <div className="flex justify-between gap-10 text-sm font-bold">
                <span className="text-muted-foreground">{INCLUDED_KIDS} შედის პაკეტში</span>
                <Check size={15} className="text-primary" />
              </div>
              {extraKids > 0 && (
                <div className="flex justify-between gap-10 text-sm font-black text-primary">
                  <span>+{extraKids} დამატებითი</span>
                  <span>{extraKids} × {EXTRA_KID_PRICE}₾ = {fmt(extraKidsCost)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className={cardCls}>
          <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-3 mb-3"><UtensilsCrossed className="text-primary" size={22} /> მენიუ</h3>
          <p className="text-muted-foreground text-sm font-bold mb-6">დაამატეთ დამატებითი პოზიციები (მშობლებისთვის / სტუმრებისთვის). ბაზისური მენიუ 20 ბავშვზე შედის პაკეტში.</p>
          <div className="flex flex-col gap-4">
            {Object.entries(menu).map(([catKey, cat]) => (
              <div key={catKey} className="rounded-2xl border border-zinc-800/70 overflow-hidden">
                <div className="px-5 py-3 bg-muted/30 border-b border-zinc-800/70">
                  <div className="text-sm font-black uppercase tracking-wide text-primary">{(cat as any).title}</div>
                </div>
                <div className="divide-y divide-zinc-800/50 bg-zinc-900/40">
                  {(cat as any).items.map((item: any, idx: number) => {
                    const key = `${catKey}|${idx}`;
                    const qty = menuQty[key] || 0;
                    return (
                      <div key={key} className={`flex items-center justify-between gap-3 px-5 py-2.5 transition-colors ${qty > 0 ? 'bg-primary/10' : ''}`}>
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{item.name}</div>
                          <div className="text-xs text-primary font-black">{item.price}</div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <QtyBtn d={-1} onClick={() => setMenuQty({ ...menuQty, [key]: Math.max(0, qty - 1) })} disabled={qty <= 0} />
                          <span className="w-6 text-center font-black tabular-nums">{qty}</span>
                          <QtyBtn d={1} onClick={() => setMenuQty({ ...menuQty, [key]: qty + 1 })} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <div className={cardCls}>
          <div className="flex items-baseline gap-3 mb-6">
            <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-3"><Sparkles className="text-primary" size={22} /> სერვისები</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-zinc-800 rounded-full px-3 py-1">არჩევითი</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((sv: any) => {
              const sel = !!serviceSel[sv.id];
              return (
                <button key={sv.id} type="button" onClick={() => setServiceSel({ ...serviceSel, [sv.id]: !sel })}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all ${sel ? 'border-primary bg-primary/10' : 'border-zinc-800/70 bg-zinc-900/40 hover:border-primary/40'}`}>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{sv.name}</div>
                    <div className="text-primary font-black text-xs">{sv.price}</div>
                  </div>
                  <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${sel ? 'bg-primary border-primary text-primary-foreground' : 'border-zinc-600 text-transparent'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ SUMMARY / CREATE ============ */}
      <aside className="lg:sticky lg:top-20 flex flex-col gap-4 rounded-[20px] md:rounded-[28px] bg-zinc-900/70 backdrop-blur-md border border-primary/25 shadow-2xl p-5 md:p-7 order-first lg:order-last">
        <h3 className="text-base md:text-lg font-black uppercase text-primary tracking-widest flex items-center gap-2"><StickyNote size={17} /> შეჯამება</h3>

        <div className="flex flex-col gap-2 text-sm font-bold">
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">თარიღი / დრო</span><span className="text-right">{slotLabel}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">სესია</span><span className="tabular-nums">{sessionBase > 0 ? fmt(sessionBase) : '—'}</span></div>
          {extraKids > 0 && (
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">დამატებითი ბავშვები ({extraKids})</span><span className="tabular-nums text-primary">+{fmt(extraKidsCost)}</span></div>
          )}
        </div>

        <div className="h-px bg-zinc-800" />

        {menuLines.length > 0 && (
          <div className="flex flex-col gap-2 text-sm font-bold">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">მენიუ</div>
            {menuLines.slice(0, 5).map((l) => (
              <div key={l.key} className="flex justify-between gap-4">
                <span className="text-muted-foreground truncate">{l.name} ×{l.qty}</span>
                <span className="tabular-nums shrink-0">{fmt(l.price * l.qty)}</span>
              </div>
            ))}
            {menuLines.length > 5 && <div className="text-[11px] text-muted-foreground/70">+{menuLines.length - 5} …</div>}
            {menuTotal > 0 && <div className="flex justify-between gap-4"><span className="text-muted-foreground">მენიუს ჯამი</span><span className="tabular-nums">{fmt(menuTotal)}</span></div>}
          </div>
        )}

        {serviceLines.length > 0 && (
          <div className="flex flex-col gap-2 text-sm font-bold">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">სერვისები</div>
            {serviceLines.map((l) => (
              <div key={l.key} className="flex justify-between gap-4">
                <span className="text-muted-foreground truncate">{l.name}</span>
                <span className="tabular-nums shrink-0">+{fmt(l.price)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-zinc-800" />

        <div className="flex justify-between items-end gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">სულ</span>
          <motion.span key={totalPrice} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
            className="text-3xl md:text-4xl font-black text-primary tabular-nums">{fmt(totalPrice)}</motion.span>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-[13px] font-black flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <button onClick={create} disabled={creating}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground border border-primary/30 font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-3">
          {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {creating ? 'იქმნება…' : 'ღონისძიების შექმნა'}
        </button>
        <button onClick={reset} disabled={creating}
          className="w-full py-3 rounded-2xl border border-zinc-700/60 text-muted-foreground font-bold uppercase text-[10px] tracking-widest hover:text-foreground hover:border-zinc-500 transition-all flex items-center justify-center gap-2">
          <X size={13} /> ფორმის გასუფთავება
        </button>
      </aside>
    </div>
  );
};

export default CreateEvent;