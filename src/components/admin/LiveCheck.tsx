import React, { useMemo, useState } from 'react';
import { Plus, Minus, X, Save, Printer, Search, RotateCcw, Check, Loader2, ShoppingCart, Receipt, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useContentStore } from '@/store/contentStore';
import { BookingRow, LiveItem } from '@/types';
import { printCheckDoc } from '@/lib/eventDocument';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

const fmt = (n: number | null | undefined) => `${Math.round(Number(n ?? 0)).toLocaleString('en-US')}₾`;

const parsePrice = (p: unknown): number => Math.round(Number(String(p ?? '').replace(/[^\d.]/g, '')) || 0);

interface CatalogEntry { key: string; name: string; price: number; cat: string; catKey: string; }

const EXTRA_KID: CatalogEntry = { key: '__kid__', name: 'დამატებითი ბავშვი', price: 30, cat: 'ბავშვები', catKey: 'kids' };

interface Props {
  booking: BookingRow;
  onSaved?: (items: LiveItem[]) => void;
}

const LiveCheck: React.FC<Props> = ({ booking, onSaved }) => {
  const { translations } = useContentStore();
  const [items, setItems] = useState<LiveItem[]>(Array.isArray(booking.live_items) ? booking.live_items : []);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const menu = useMemo<Record<string, { title: string; items: { name: string; price: string }[] }>>(() =>
    (translations as { ka?: { menu?: Record<string, { title: string; items: { name: string; price: string }[] }> } }).ka?.menu ?? {},
    [translations]);

  const catalog = useMemo<CatalogEntry[]>(() => [
    EXTRA_KID,
    ...Object.entries(menu).flatMap(([catKey, c]) =>
      (c.items ?? []).map((it, i) => ({
        key: `live|${catKey}|${i}`,
        name: it.name,
        price: parsePrice(it.price),
        cat: c.title,
        catKey,
      }))),
  ], [menu]);

  const cats = useMemo(
    () => [{ id: 'all', title: 'ყველა' }, { id: 'kids', title: 'ბავშვები' }, ...Object.entries(menu).map(([id, c]) => ({ id, title: c.title }))],
    [menu],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((c) => {
      if (catFilter !== 'all' && c.catKey !== catFilter) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q);
    });
  }, [catalog, query, catFilter]);

  const bookedTotal =
    Number(booking.total_price) ||
    Number(booking.base_price) + Number(booking.extra_kids_cost) + Number(booking.menu_total) + Number(booking.services_total);
  const liveTotal = items.reduce((a, l) => a + Number(l.price) * Number(l.qty), 0);
  const grand = bookedTotal + liveTotal;
  const liveCount = items.reduce((a, l) => a + Number(l.qty), 0);
  const dirty = JSON.stringify(items) !== JSON.stringify(Array.isArray(booking.live_items) ? booking.live_items : []);

  const addLine = (entry: Pick<CatalogEntry, 'key' | 'name' | 'price'>) => {
    setItems((prev) => {
      const i = prev.findIndex((l) => l.id === entry.key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { id: entry.key, name: entry.name, price: entry.price, qty: 1 }];
    });
  };

  const bump = (id: string, d: number) =>
    setItems((prev) => prev
      .map((l) => (l.id === id ? { ...l, qty: l.qty + d } : l))
      .filter((l) => l.qty > 0));

  const removeLine = (id: string) => setItems((prev) => prev.filter((l) => l.id !== id));

  const addCustom = () => {
    const name = customName.trim();
    const price = parsePrice(customPrice);
    if (!name || price <= 0) return;
    addLine({ key: `live|custom|${name}|${price}`, name, price });
    setCustomName('');
    setCustomPrice('');
  };

  const save = async () => {
    setSaving(true);
    setSaveErr('');
    const { error } = await supabase.rpc('ll_admin_set_live_items', {
      p_username: ADMIN_USER, p_password: ADMIN_PASS, p_id: booking.id, p_items: items as unknown as Json,
    });
    setSaving(false);
    if (error) {
      console.error('[live-check] save failed', error);
      setSaveErr('შენახვა ვერ მოხერხდა — სცადეთ ხელახლა.');
      return;
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
    onSaved?.(items);
  };

  return (
    <div className="rounded-2xl border border-zinc-800/70 overflow-hidden bg-zinc-900/30">
      {/* header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800/70 flex-wrap">
        <span className={`flex items-center gap-2 text-xs font-bold ${dirty ? 'text-amber-400' : 'text-muted-foreground'}`}>
          <span className={`w-2 h-2 rounded-full ${dirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          ბარი / დამატებით · {liveCount} პოზიც.
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-muted/40">ჯავშანი <b className="text-foreground">{fmt(bookedTotal)}</b></span>
          <span className="px-2.5 py-1 rounded-lg bg-muted/40">ბარი <b className="text-foreground text-primary">{fmt(liveTotal)}</b></span>
          <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-sm font-black text-primary">{fmt(grand)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* catalog */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ძებნა მენიუში…"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-muted border border-zinc-700 text-[13px] focus:outline-none focus:border-primary placeholder:text-zinc-600" />
            </div>
            <button onClick={() => addLine(EXTRA_KID)} title="დამატებითი ბავშვი (+30₾)"
              className="shrink-0 px-3.5 py-2 rounded-xl border border-primary/40 text-primary text-[13px] font-bold hover:bg-primary/10 transition-colors inline-flex items-center gap-1.5">
              <UserPlus size={14} /> +30₾
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCatFilter(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${catFilter === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/30 text-zinc-400 hover:text-foreground border-zinc-800'}`}>
                {c.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-0.5">
            {filtered.map((c) => (
              <button key={c.key} onClick={() => addLine(c)}
                className="text-left px-3 py-2.5 rounded-xl border border-zinc-800/70 bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <div className="text-[13px] font-bold truncate">{c.name}</div>
                <div className="text-xs tabular-nums mt-1 flex items-center justify-between">
                  <b className="text-primary group-hover:scale-105 transition-transform inline-block">{fmt(c.price)}</b>
                  <span className="text-zinc-600 text-[10px] truncate ml-1">{c.cat}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="col-span-full text-center text-[13px] text-zinc-600 py-8">ვერ მოიძებნა</div>}
          </div>

          <div className="flex gap-2">
            <input value={customName} onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="სხვა პოზიცია…"
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-muted border border-zinc-700 text-[13px] focus:outline-none focus:border-primary placeholder:text-zinc-600" />
            <input value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="₾" inputMode="numeric"
              className="w-16 shrink-0 px-3 py-2 rounded-xl bg-muted border border-zinc-700 text-[13px] tabular-nums focus:outline-none focus:border-primary placeholder:text-zinc-600" />
            <button onClick={addCustom} disabled={!customName.trim()}
              className="shrink-0 px-3 rounded-xl border border-zinc-700 text-muted-foreground hover:text-foreground hover:border-primary disabled:opacity-40 transition-colors">
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* check lines */}
        <div className="rounded-xl border border-zinc-800/70 flex flex-col min-w-0 w-full">
          <div className="px-3.5 py-2.5 border-b border-zinc-800/70 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5">
              <Receipt size={13} className="text-primary" /> ანგარიში
            </span>
            {items.length > 0 && (
              <button onClick={() => setItems([])} className="text-xs text-zinc-500 hover:text-red-400 inline-flex items-center gap-1 transition-colors">
                <RotateCcw size={11} /> გასუფთავება
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-800/50 overflow-y-auto max-h-56">
            {items.length === 0 && (
              <div className="py-10 text-center text-[13px] text-zinc-600 inline-flex flex-col items-center gap-2">
                <ShoppingCart size={20} className="text-zinc-700" />
                აირჩიეთ პოზიციები მარჯვნიდან
              </div>
            )}
            {items.map((l) => (
              <div key={l.id} className="flex items-center gap-2 px-3.5 py-2 hover:bg-muted/10 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{l.name}</div>
                  <div className="text-[11px] text-zinc-500 tabular-nums">{fmt(l.price)}</div>
                </div>
                <button onClick={() => bump(l.id, -1)} className="p-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors"><Minus size={13} /></button>
                <span className="w-7 text-center text-[13px] font-black tabular-nums">{l.qty}</span>
                <button onClick={() => bump(l.id, +1)} className="p-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary/50 transition-colors"><Plus size={13} /></button>
                <span className="w-16 text-right text-[13px] font-bold tabular-nums shrink-0">{fmt(Number(l.price) * l.qty)}</span>
                <button onClick={() => removeLine(l.id)} className="p-0.5 text-zinc-600 hover:text-red-400 shrink-0 transition-colors"><X size={14} /></button>
              </div>
            ))}
          </div>

          <div className="px-3.5 py-3 border-t border-zinc-800/70 space-y-1.5 text-[13px]">
            <div className="flex justify-between text-zinc-400 tabular-nums font-semibold"><span>ჯავშანით</span><span>{fmt(bookedTotal)}</span></div>
            <div className="flex justify-between text-zinc-400 tabular-nums font-semibold"><span>ბარი / დამატებით</span><span className="text-primary">{fmt(liveTotal)}</span></div>
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-zinc-800/70">
              <span className="font-black uppercase text-xs tracking-widest">სულ</span>
              <span className="text-xl font-black text-primary tabular-nums">{fmt(grand)}</span>
            </div>
          </div>

          <div className="flex gap-2 p-3 pt-1">
            <button onClick={save} disabled={saving || !dirty}
              className={`flex-1 px-3 py-2.5 rounded-xl text-[13px] font-black transition-colors ${savedFlash ? 'bg-emerald-600 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'} disabled:opacity-40 inline-flex items-center justify-center gap-1.5`}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : savedFlash ? <Check size={14} /> : <Save size={14} />}{savedFlash ? 'შენახულია' : 'შენახვა'}
            </button>
            <button onClick={() => printCheckDoc({ ...booking, live_items: items }, items)}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 text-[13px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors inline-flex items-center gap-1.5">
              <Printer size={14} /> ჩეკი
            </button>
          </div>
          {saveErr && <div className="px-3 pb-2 -mt-0.5 text-xs text-red-400">{saveErr}</div>}
        </div>
      </div>
    </div>
  );
};

export default LiveCheck;