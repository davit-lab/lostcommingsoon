import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, PartyPopper, Banknote, Users, CalendarDays, Printer, CheckCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookingRow, BookingStatus } from '@/types';
import { printEventDoc } from '@/lib/eventDocument';
import LiveCheck from '@/components/admin/LiveCheck';
import { bookingConfirmText, waLink, formatDateKa } from '@/lib/messages';
import { QuietBtn } from '@/components/admin/BookingsAdmin';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

const fmt = (n: number | null | undefined) => `${Math.round(Number(n ?? 0)).toLocaleString('en-US')}₾`;

const isoToday = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`; };
const isoTomorrow = () => { const n = new Date(Date.now() + 86400000); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`; };

const STATUS_META: Record<BookingStatus, { label: string; dot: string; chip: string }> = {
  new: { label: 'ახალი', dot: 'bg-amber-400', chip: 'bg-amber-400/10 text-amber-400 border-amber-500/30' },
  confirmed: { label: 'დადასტურებული', dot: 'bg-emerald-500', chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'ჩატარდა', dot: 'bg-zinc-400', chip: 'bg-zinc-400/10 text-zinc-300 border-zinc-500/30' },
  cancelled: { label: 'გაუქმებული', dot: 'bg-zinc-600', chip: 'bg-zinc-600/10 text-zinc-500 border-zinc-700/50' },
};

const TodayAdmin: React.FC = () => {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [waFor, setWaFor] = useState<string | null>(null);
  const [openCheck, setOpenCheck] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('ll_admin_get_bookings', { p_username: ADMIN_USER, p_password: ADMIN_PASS });
    if (error) console.error('[today] load failed', error);
    setRows(((data ?? []) as unknown as BookingRow[]));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (b: BookingRow, status: BookingStatus) => {
    setBusyId(b.id);
    const { error } = await supabase.rpc('ll_admin_set_booking_status', { p_username: ADMIN_USER, p_password: ADMIN_PASS, p_id: b.id, p_status: status });
    if (error) {
      console.error('[today] status failed', error);
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

  const groups = useMemo(() => {
    const t = isoToday();
    const tm = isoTomorrow();
    return [
      { key: 'today', label: 'დღეს', date: t },
      { key: 'tomorrow', label: 'ხვალ', date: tm },
    ].map((g) => ({
      ...g,
      items: rows
        .filter((r) => r.event_date === g.date && r.status !== 'cancelled')
        .sort((a, b) => (a.session_hour ?? '').localeCompare(b.session_hour ?? '')),
    }));
  }, [rows]);

  const totals = useMemo(() => ({
    today: groups[0].items.reduce((a, b) => a + Number(b.total_price), 0),
    tomorrow: groups[1].items.reduce((a, b) => a + Number(b.total_price), 0),
  }), [groups]);

  const todayCount = groups[0].items.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-vintage text-2xl md:text-3xl text-foreground">დღევანდელი ღონისძიებები</h2>
          <p className="text-xs text-muted-foreground mt-1">დღე და ხვალ · ჩეკი, PDF, სტატუსი.</p>
        </div>
        <button onClick={load} disabled={loading} title="განახლება"
          className="p-2 rounded-md border border-zinc-700 text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* today overview */}
      {!loading && todayCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-800/70 bg-muted/20 px-4 py-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary"><PartyPopper size={18} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">დღეს</div>
              <div className="text-lg font-black tabular-nums leading-tight">{todayCount} ღონისძიება</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-800/70 bg-muted/20 px-4 py-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-400"><Users size={18} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ბავშვები</div>
              <div className="text-lg font-black tabular-nums leading-tight">{groups[0].items.reduce((a, b) => a + Number(b.kids_count), 0)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-800/70 bg-muted/20 px-4 py-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-400/10 text-amber-400"><Banknote size={18} /></div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">დღევანდელი ბრუნვა</div>
              <div className="text-lg font-black tabular-nums leading-tight">{fmt(totals.today)}</div>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="py-14 text-center text-muted-foreground text-sm">იტვირთება…</div>}

      {!loading && (
        groups.map((g) => (
          <section key={g.key}>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[14px] font-bold flex items-center gap-2">
                <CalendarDays size={15} className="text-primary" />
                {g.label} · {formatDateKa(g.date)}
                <span className="text-xs font-normal text-zinc-600">{g.items.length === 0 ? '— ჯავშნები არ არის' : `${g.items.length} ღონისძიება`}</span>
              </h3>
              {g.items.length > 0 && g.key === 'today' && (
                <span className="text-xs font-bold text-primary tabular-nums">{fmt(totals[g.key as 'today'])}</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {g.items.length === 0 && (
                <div className="rounded-2xl border border-zinc-800/60 bg-muted/10 py-10 text-center text-sm text-zinc-600">
                  {g.key === 'today' ? 'დღეს ღონისძიება არ არის' : 'ხვალ ჯერ ჯავშანი არ არის'}
                </div>
              )}

              {g.items.map((b) => {
                const meta = STATUS_META[b.status] ?? STATUS_META.new;
                const checkOpen = openCheck === b.id;
                const busy = busyId === b.id;
                return (
                  <div key={b.id} className={`rounded-2xl border border-zinc-800/60 bg-muted/10 overflow-hidden ${b.status === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="px-4 py-3.5 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-11 shrink-0 text-center">
                          <div className="text-lg font-black tabular-nums text-primary">{(b.session_hour ?? '—').slice(0, 5)}</div>
                          <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">2 სთ</div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-bold truncate ${b.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{b.parent_name}</div>
                        <div className="text-xs text-zinc-500 tabular-nums">{b.kids_count} ბავშვი · №{b.ref_code}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium shrink-0 ${meta.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />{meta.label}
                      </span>
                      <span className="w-20 text-right text-base font-black tabular-nums shrink-0">{fmt(b.total_price)}</span>
                    </div>

                    <div className="px-4 pb-3.5 -mt-1 flex flex-wrap gap-1.5">
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
                        <QuietBtn onClick={() => setStatus(b, 'completed')} disabled={busy}><CheckCheck size={13} className="inline mr-1 -mt-0.5" />ჩატარდა</QuietBtn>
                      )}
                      {b.status !== 'completed' && b.status !== 'cancelled' && (
                        <QuietBtn onClick={() => printEventDoc(b)} primary><Printer size={13} className="inline mr-1 -mt-0.5" />PDF</QuietBtn>
                      )}
                      {b.status !== 'completed' && b.status !== 'cancelled' && (
                        <QuietBtn onClick={() => setOpenCheck(checkOpen ? null : b.id)}>
                          {checkOpen ? 'ჩეკის დახურვა' : 'ბარი / ჩეკი'}
                        </QuietBtn>
                      )}
                      {b.status !== 'cancelled' && (
                        <QuietBtn onClick={() => setStatus(b, 'cancelled')} disabled={busy} danger>გაუქმება</QuietBtn>
                      )}
                    </div>

                    {checkOpen && (
                      <div className="px-4 pb-4">
                        <LiveCheck booking={b} onSaved={(items) => setRows((rs) => rs.map((r) => (r.id === b.id ? { ...r, live_items: items } : r)))} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default TodayAdmin;