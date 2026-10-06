import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, RefreshCw, Search, CalendarClock, Users, Banknote, CircleDot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookingRow, BookingStatus } from '@/types';
import { printEventDoc } from '@/lib/eventDocument';
import LiveCheck from '@/components/admin/LiveCheck';
import { bookingConfirmText, waLink, formatDateKa } from '@/lib/messages';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

const fmt = (n: number | null | undefined) => `${Math.round(Number(n ?? 0)).toLocaleString('en-US')}₾`;

const STATUS_META: Record<BookingStatus, { label: string; dot: string; chip: string }> = {
  new: { label: 'ახალი', dot: 'bg-amber-400', chip: 'bg-amber-400/10 text-amber-400 border-amber-500/30' },
  confirmed: { label: 'დადასტურებული', dot: 'bg-emerald-500', chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'ჩატარდა', dot: 'bg-zinc-400', chip: 'bg-zinc-400/10 text-zinc-300 border-zinc-500/30' },
  cancelled: { label: 'გაუქმებული', dot: 'bg-zinc-600', chip: 'bg-zinc-600/10 text-zinc-500 border-zinc-700/50' },
};

const FILTERS: { id: 'all' | BookingStatus; label: string }[] = [
  { id: 'all', label: 'ყველა' },
  { id: 'new', label: 'ახალი' },
  { id: 'confirmed', label: 'მიღებული' },
  { id: 'completed', label: 'ჩატარდა' },
  { id: 'cancelled', label: 'გაუქმებული' },
];

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-t border-zinc-800/70">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2.5 text-left group">
        <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</span>
        <ChevronDown size={15} className={`text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const InfoLine: React.FC<{ l: React.ReactNode; v: React.ReactNode }> = ({ l, v }) => (
  <div className="flex justify-between gap-6 py-1 text-[13px]">
    <span className="text-muted-foreground">{l}</span>
    <span className="font-medium text-right">{v}</span>
  </div>
);

export const QuietBtn: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; danger?: boolean; primary?: boolean }> =
({ onClick, children, disabled, danger, primary }) => (
  <button onClick={onClick} disabled={disabled}
    className={`px-3 py-1.5 rounded-md border text-[13px] font-medium transition-colors disabled:opacity-40 ${
      primary
        ? 'bg-primary border-transparent text-primary-foreground hover:opacity-90'
        : danger
          ? 'border-zinc-700 text-muted-foreground hover:text-red-400 hover:border-red-500/50'
          : 'border-zinc-700 text-muted-foreground hover:text-foreground hover:border-zinc-500'
    }`}>
    {children}
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent?: string }> = ({ icon, label, value, accent }) => (
  <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-800/70 bg-muted/20 px-4 py-3.5">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ?? 'bg-primary/10 text-primary'}`}>{icon}</div>
    <div className="min-w-0">
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{label}</div>
      <div className="text-lg font-black tabular-nums leading-tight truncate">{value}</div>
    </div>
  </div>
);

const BookingsAdmin: React.FC = () => {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [waFor, setWaFor] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    const { data, error } = await supabase.rpc('ll_admin_get_bookings', { p_username: ADMIN_USER, p_password: ADMIN_PASS });
    if (error) {
      console.error('[bookings-admin] load failed', error);
      setErr('წაკითხვა ვერ მოხერხდა.');
    }
    setRows(((data ?? []) as unknown as BookingRow[]));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (b: BookingRow, status: BookingStatus) => {
    setBusyId(b.id);
    const { error } = await supabase.rpc('ll_admin_set_booking_status', { p_username: ADMIN_USER, p_password: ADMIN_PASS, p_id: b.id, p_status: status });
    if (error) {
      console.error('[bookings-admin] status failed', error);
    } else {
      setRows((rs) => rs.map((r) => (r.id === b.id ? { ...r, status } : r)));
      if (status === 'confirmed') {
        const url = waLink(b.phone, bookingConfirmText(b));
        const win = window.open(url, '_blank');
        if (!win) setWaFor(b.id);
      }
    }
    setBusyId(null);
  };

  const removeBooking = async (b: BookingRow) => {
    if (!window.confirm(`წაშალოთ ჯავშანი ${b.ref_code}?`)) return;
    setBusyId(b.id);
    const { error } = await supabase.rpc('ll_admin_delete_booking', { p_username: ADMIN_USER, p_password: ADMIN_PASS, p_id: b.id });
    if (error) console.error('[bookings-admin] delete failed', error);
    else setRows((rs) => rs.filter((r) => r.id !== b.id));
    setBusyId(null);
  };

  const counts = useMemo(() => ({
    all: rows.length,
    new: rows.filter((r) => r.status === 'new').length,
    confirmed: rows.filter((r) => r.status === 'confirmed').length,
    completed: rows.filter((r) => r.status === 'completed').length,
    cancelled: rows.filter((r) => r.status === 'cancelled').length,
  }), [rows]);

  const revenue = useMemo(
    () => rows.filter((r) => r.status !== 'cancelled').reduce((a, r) => a + Number(r.total_price), 0),
    [rows],
  );

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return rows.filter((r) => r.event_date && r.event_date >= today && r.status !== 'cancelled').length;
  }, [rows]);

  const visible = useMemo(() => rows.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return r.ref_code.toLowerCase().includes(q)
        || r.parent_name.toLowerCase().includes(q)
        || r.phone.toLowerCase().includes(q)
        || String(r.event_date ?? '').includes(q);
    }
    return true;
  }), [rows, filter, query]);

  return (
    <div className="flex flex-col gap-5">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-vintage text-2xl md:text-3xl text-foreground">ყველა ჯავშანი</h2>
          <p className="text-xs text-muted-foreground mt-1">მართეთ ღონისძიებები — სტატუსი, ბეჭდვა, ბარი.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="მოძებნე სახელი, ტელ, კოდი…"
              className="pl-8 pr-3 py-2 rounded-md bg-muted border border-zinc-700 text-foreground text-[13px] w-52 focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
          </div>
          <button onClick={load} disabled={loading} title="განახლება"
            className="p-2 rounded-md border border-zinc-700 text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<CalendarClock size={18} />} label="სულ" value={String(counts.all)} />
        <StatCard icon={<CircleDot size={18} />} label="ახალი" value={String(counts.new)} accent="bg-amber-400/10 text-amber-400" />
        <StatCard icon={<Users size={18} />} label="მომავალი" value={String(upcoming)} accent="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={<Banknote size={18} />} label="შემოსავალი" value={fmt(revenue)} />
      </div>

      {/* segmented filter */}
      <div className="inline-flex self-start rounded-lg bg-muted p-0.5 flex-wrap">
        {FILTERS.map((f) => {
          const n = counts[f.id as keyof typeof counts];
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === f.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {f.label}{n > 0 && <span className="ml-1 text-[10px] opacity-60">{n}</span>}
            </button>
          );
        })}
      </div>

      {err && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{err}</div>}
      {loading && <div className="py-14 text-center text-muted-foreground text-sm">იტვირთება…</div>}
      {!loading && visible.length === 0 && (
        <div className="py-14 text-center text-muted-foreground text-sm">ჯავშნები ვერ მოიძებნა</div>
      )}

      {/* list */}
      {!loading && visible.length > 0 && (
        <div className="divide-y divide-zinc-800/70 border-y border-zinc-800/70 -mx-2 rounded-xl">
          {visible.map((b) => {
            const meta = STATUS_META[b.status] ?? STATUS_META.new;
            const open = expanded === b.id;
            const menuItems = Array.isArray(b.menu_items) ? b.menu_items : [];
            const services = Array.isArray(b.services) ? b.services : [];
            const busy = busyId === b.id;
            return (
              <div key={b.id}>
                <button onClick={() => setExpanded(open ? null : b.id)}
                  className={`w-full px-3 py-3 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[160px_minmax(0,1fr)_48px_84px_130px_18px] items-center gap-x-3 text-left hover:bg-muted/25 transition-colors ${open ? 'bg-muted/15' : ''}`}>
                  <span className={`hidden sm:block text-[13px] tabular-nums ${open ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {formatDateKa(b.event_date)} · {b.session_hour ?? '—'}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm truncate ${b.status === 'cancelled' ? 'line-through text-muted-foreground' : ''}`}>{b.parent_name}</span>
                    <span className="block text-xs text-zinc-600 truncate sm:hidden">
                      {formatDateKa(b.event_date)} · {b.session_hour ?? ''} · {meta.label}
                    </span>
                  </span>
                  <span className="hidden sm:block text-[13px] text-muted-foreground tabular-nums">{b.kids_count}</span>
                  <span className={`text-[13px] font-semibold text-right tabular-nums ${b.status === 'cancelled' ? 'line-through text-muted-foreground' : ''}`}>{fmt(b.total_price)}</span>
                  <span className="hidden sm:flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${meta.chip}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </span>
                  <ChevronDown size={14} className={`hidden sm:block text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
                  <ChevronDown size={14} className={`sm:hidden text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <div className="px-3 pb-5 pt-1">
                    <div className="rounded-lg bg-muted/20 border border-zinc-800/70 p-4">
                      <div className="flex flex-wrap gap-1.5 pb-3">
                        {b.status === 'new' && (
                          <QuietBtn onClick={() => setStatus(b, 'confirmed')} disabled={busy}>✓ მიღება</QuietBtn>
                        )}
                        {waFor === b.id && (
                          <a href={waLink(b.phone, bookingConfirmText(b))} target="_blank" rel="noreferrer"
                            className="px-3 py-1.5 rounded-md border border-emerald-500/50 text-emerald-400 text-[13px] font-medium hover:bg-emerald-500/10 transition-colors">
                            გახსენი WhatsApp ↗
                          </a>
                        )}
                        {b.status === 'confirmed' && (
                          <QuietBtn onClick={() => setStatus(b, 'completed')} disabled={busy}>✓ ჩატარდა</QuietBtn>
                        )}
                        {b.status !== 'cancelled' && (
                          <QuietBtn onClick={() => printEventDoc(b)} primary>PDF</QuietBtn>
                        )}
                        {b.status !== 'cancelled' && (
                          <QuietBtn onClick={() => setStatus(b, 'cancelled')} disabled={busy} danger>გაუქმება</QuietBtn>
                        )}
                        <QuietBtn onClick={() => removeBooking(b)} disabled={busy} danger>წაშლა</QuietBtn>
                      </div>

                      <Section title="კლიენტი და ღონისძიება" defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                          <div>
                            <InfoLine l="მშობელი" v={b.parent_name} />
                            <InfoLine l="ტელეფონი" v={<a href={`tel:${b.phone}`} className="hover:text-primary">{b.phone}</a>} />
                            <InfoLine l="№ კოდი" v={b.ref_code} />
                          </div>
                          <div>
                            <InfoLine l="თარიღი" v={`${formatDateKa(b.event_date)} — ${b.session_hour ?? '—'} (2 სთ)`} />
                            <InfoLine l="ბავშვები" v={`${b.kids_count}${Number(b.extra_kids) > 0 ? ` (20 + ${b.extra_kids} × 30₾)` : ''}`} />
                            {(b.notes ?? '').trim() && <InfoLine l="შენიშვნა" v={<span className="italic text-muted-foreground">{b.notes}</span>} />}
                          </div>
                        </div>
                      </Section>

                      <Section title={`მენიუ და სერვისები${menuItems.length || services.length ? ` (${menuItems.length + services.length})` : ''}`}>
                        {menuItems.length === 0 && services.length === 0 && (
                          <div className="text-[13px] text-muted-foreground py-1">— არაფერია არჩეული —</div>
                        )}
                        {menuItems.map((l) => (
                          <InfoLine key={l.key} l={<span>{l.name} <span className="text-xs text-zinc-600">×{l.qty}</span></span>} v={fmt(l.price * l.qty)} />
                        ))}
                        {services.map((l) => (
                          <InfoLine key={l.key} l={l.name} v={fmt(l.price)} />
                        ))}
                        {(menuItems.length > 0 || services.length > 0) && (
                          <div className="flex justify-between pt-2 mt-1.5 border-t border-zinc-800/70 text-[13px] font-medium">
                            <span className="text-muted-foreground">პაკეტი {fmt(b.base_price)}{Number(b.extra_kids_cost) > 0 ? ` + ბავშვები ${fmt(b.extra_kids_cost)}` : ''}</span>
                            <span>{fmt(b.total_price)}</span>
                          </div>
                        )}
                      </Section>

                      {b.status !== 'cancelled' && (
                        <Section title="ბარი / Live Check — ღონისძიების დროს">
                          <LiveCheck booking={b} onSaved={(items, paidAmount) => setRows((rs) => rs.map((r) => (r.id === b.id ? { ...r, live_items: items, paid_amount: paidAmount } : r)))} />
                        </Section>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsAdmin;
