import { ASSETS } from '@/constants';
import { BookingRow, BookingMenuLine, BookingServiceLine, LiveItem } from '@/types';

const INK = '#171512';
const FAINT = '#8A837A';
const HAIR = '#E8E4DA';
const GOLD = '#9A7A26';
const PAPER = '#FFFFFF';
const BAND = '#191613';

export const fmt = (n: number | null | undefined) => `${Math.round(Number(n ?? 0)).toLocaleString('en-US')} ₾`;

const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

export const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${KA_MONTHS[m - 1]} ${y}`;
};

const timeOf = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const stamp = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${KA_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${timeOf(d)}`;
};

const paidAmountOf = (b: BookingRow): number => {
  const direct = Number(b.paid_amount);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const metadata = Array.isArray(b.live_items)
    ? b.live_items.find((item) => item.id === '__lostlock_paid_amount__')
    : undefined;
  return Math.max(Number(metadata?.price ?? 0), 0);
};

/**
 * Prints an A4 document by rendering it into a hidden iframe and calling print().
 * No popup windows and no inline <script> — immune to popup blockers & page CSP.
 */
function printHtml(innerDoc: string): void {
  const existing = document.getElementById('ll-print-frame');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'll-print-frame';
  iframe.setAttribute('title', 'print');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  iframe.srcdoc = innerDoc;
  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) { iframe.remove(); return; }
    const go = () => setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(() => iframe.remove(), 2000);
    }, 350);
    // wait for web fonts so Georgian glyphs render correctly
    try {
      (win.document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready.then(go).catch(go);
    } catch { go(); }
  };
  document.body.appendChild(iframe);
}

const HEAD_LINKS = `<meta charset="UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&family=Abhaya+Libre:wght@600;700&display=swap" rel="stylesheet" />`;

const SHARED_CSS = `
  @page { size: A4; margin: 12mm 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: ${PAPER}; }
  body {
    font-family: 'Noto Sans Georgian', sans-serif;
    color: ${INK};
    font-size: 11px;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-feature-settings: 'tnum' 1;
  }
  .serif { font-family: 'Abhaya Libre', serif; }
  .caps { text-transform: uppercase; letter-spacing: .16em; font-size: 8px; font-weight: 700; color: ${FAINT}; }
  .num { font-feature-settings: 'tnum' 1; }
  .gold { color: ${GOLD}; }

  /* ===== masthead ===== */
  .masthead { display: flex; justify-content: space-between; align-items: center; padding: 0 0 16px; }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand img { height: 50px; object-fit: contain; }
  .wordmark { font-size: 30px; line-height: 1; letter-spacing: .05em; color: ${INK}; }
  .brand-sub { margin-top: 4px; }
  .doc-id { text-align: right; }
  .doc-id .lbl { font-size: 8px; letter-spacing: .22em; color: ${FAINT}; font-weight: 700; }
  .doc-id .ref { font-size: 22px; color: ${GOLD}; margin-top: 2px; }
  .doc-id .when { font-size: 9px; color: ${FAINT}; margin-top: 3px; }

  .rule { height: 3px; background: ${BAND}; margin-bottom: 2px; }
  .rule-thin { height: 1px; background: ${GOLD}; margin-bottom: 22px; }

  /* ===== section label ===== */
  .section-head { display: flex; align-items: center; gap: 12px; margin: 22px 0 12px; }
  .section-head .t { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: ${INK}; }
  .section-head::after { content: ''; flex: 1; border-top: 1px solid ${HAIR}; }

  /* ===== meta cards ===== */
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
  .meta-card { border: 1px solid #EAE6DA; border-radius: 10px; padding: 14px 16px; background: #FCFBF7; }
  .meta-card .hd { font-size: 8px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: ${GOLD}; margin-bottom: 8px; }
  .field { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; padding: 3px 0; }
  .field .k { color: ${FAINT}; font-size: 10px; }
  .field .v { font-weight: 600; font-size: 11.5px; text-align: right; }

  /* ===== items table ===== */
  table.items { width: 100%; border-collapse: collapse; }
  table.items thead th {
    font-size: 8px; text-transform: uppercase; letter-spacing: .14em; font-weight: 700; color: #FFF;
    text-align: left; padding: 8px 12px; background: ${BAND};
  }
  table.items th.r, table.items td.r { text-align: right; }
  table.items thead th:first-child { border-radius: 8px 0 0 0; }
  table.items thead th:last-child { border-radius: 0 8px 0 0; }
  table.items td { padding: 8px 12px; border-bottom: 1px solid ${HAIR}; vertical-align: baseline; }
  tr.grp td {
    padding: 12px 12px 5px; border-bottom: none; font-size: 9px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase; color: ${GOLD};
  }
  .i-name { font-weight: 500; }
  .i-name .cat { color: ${FAINT}; font-size: 9.5px; }
  tr.z td { background: #F7F5EE; }
  col.c-name { width: 56%; } col.c-qty { width: 10%; } col.c-unit { width: 16%; } col.c-sum { width: 18%; }
  .i-qty { color: ${FAINT}; }

  /* ===== totals ===== */
  .totals { margin-left: auto; width: 290px; margin-top: 20px; }
  .totals .t-row { display: flex; justify-content: space-between; align-items: baseline; padding: 4.5px 0; color: #4d4942; font-size: 11px; }
  .totals .t-row .k { color: ${FAINT}; }
  .totals .grand { border-top: 2px solid ${BAND}; margin-top: 6px; padding-top: 9px; }
  .totals .grand .lbl { font-size: 11px; font-weight: 700; letter-spacing: .06em; }
  .totals .grand .amt { font-size: 26px; line-height: 1; color: ${GOLD}; }

  /* ===== note ===== */
  .note { margin-top: 20px; padding: 11px 14px; border-left: 3px solid ${GOLD}; background: #FBF8EF; color: #4a4436; font-size: 10.5px; }

  /* ===== terms ===== */
  .terms { margin-top: 26px; }
  .terms ol { margin: 8px 0 0 16px; color: #55503f; font-size: 9.5px; }
  .terms li { padding: 1.5px 0; }

  /* ===== signatures ===== */
  .signs { display: flex; justify-content: space-between; margin-top: 48px; max-width: 84%; margin-left: auto; margin-right: auto; }
  .sig { text-align: center; width: 210px; }
  .sig .line { border-bottom: 1px solid #A9A294; height: 30px; }
  .sig .who { margin-top: 6px; }

  /* ===== footer ===== */
  .foot { margin-top: 30px; border-top: 1px solid ${HAIR}; padding-top: 9px; display: flex; justify-content: space-between; }
`;

/* ================= FULL EVENT DOCUMENT ================= */

export function buildEventDocHtml(b: BookingRow): string {
  const menuItems: BookingMenuLine[] = Array.isArray(b.menu_items) ? b.menu_items : [];
  const services: BookingServiceLine[] = Array.isArray(b.services) ? b.services : [];
  const hasExtras = Number(b.extra_kids) > 0;
  const paidAmount = paidAmountOf(b);
  const remainingAmount = Math.max(Number(b.total_price) - paidAmount, 0);

  const itemRow = (name: string, cat: string, qty: number | null, unit: number, sum: number, i: number) => `
    <tr class="${i % 2 ? 'z' : ''}">
      <td class="i-name">${name}${cat ? `<span class="cat"> · ${cat}</span>` : ''}</td>
      <td class="i-qty num">${qty ?? ''}</td>
      <td class="i-unit num">${unit > 0 ? fmt(unit) : ''}</td>
      <td class="i-sum num">${fmt(sum)}</td>
    </tr>`;

  const groupRow = (label: string) => `
    <tr class="grp"><td colspan="4">${label}</td></tr>`;

  let itemIdx = 0;
  const rows: string[] = [];
  rows.push(groupRow('პაკეტი'));
  rows.push(itemRow('ბაზისური პაკეტი — 20 ბავშვი, პროგრამა, XBOX / ლაზერ შოუ, ტორტის ცერემონია', '', 1, Number(b.base_price), Number(b.base_price), itemIdx++));
  if (hasExtras) rows.push(itemRow('დამატებითი ბავშვები', '', Number(b.extra_kids), 30, Number(b.extra_kids_cost), itemIdx++));
  if (menuItems.length) rows.push(groupRow('მენიუ'));
  menuItems.forEach((l) => rows.push(itemRow(l.name, l.cat, l.qty, l.price, l.price * l.qty, itemIdx++)));
  if (services.length) rows.push(groupRow('სერვისები'));
  services.forEach((l) => rows.push(itemRow(l.name, '', null, Number(l.price), Number(l.price), itemIdx++)));

  return `<!DOCTYPE html>
<html lang="ka">
<head>
${HEAD_LINKS}
<title>Lost Lock — ${b.ref_code}</title>
<style>
  ${SHARED_CSS}
</style>
</head>
<body>
  <header class="masthead">
    <div class="brand">
      ${ASSETS.logo ? `<img src="${ASSETS.logo}" alt="" />` : ''}
      <div>
        <div class="wordmark serif"><b>LOST LOCK</b></div>
        <div class="caps brand-sub">ღონისძიების სივრცე · თბილისი</div>
      </div>
    </div>
    <div class="doc-id">
      <div class="lbl">ჯავშნის დამადასტურებელი დოკუმენტი</div>
      <div class="ref serif num">${b.ref_code}</div>
      <div class="when num">გაცემულია&nbsp;&nbsp;${stamp(b.created_at)}</div>
    </div>
  </header>
  <div class="rule"></div>
  <div class="rule-thin"></div>

  <section class="meta-grid">
    <div class="meta-card">
      <div class="hd">კლიენტი</div>
      <div class="field"><span class="k">მშობელი</span><span class="v">${b.parent_name}</span></div>
      <div class="field"><span class="k">ტელეფონი</span><span class="v num">${b.phone}</span></div>
      ${(b.notes ?? '').trim() ? `<div class="field"><span class="k">შენიშვნა</span><span class="v" style="max-width:180px">${b.notes}</span></div>` : ''}
    </div>
    <div class="meta-card">
      <div class="hd">ღონისძიება</div>
      <div class="field"><span class="k">თარიღი</span><span class="v">${formatDate(b.event_date)}</span></div>
      <div class="field"><span class="k">დაწყება</span><span class="v num">${b.session_hour ?? '—'} · 2 საათი</span></div>
      <div class="field"><span class="k">სტუმრები</span><span class="v num">${b.kids_count} ბავშვი${hasExtras ? ` + ${Number(b.extra_kids)}` : ''}</span></div>
    </div>
  </section>

  <div class="section-head"><span class="t">შემადგენლობა</span></div>
  <table class="items">
    <colgroup><col class="c-name"/><col class="c-qty"/><col class="c-unit"/><col class="c-sum"/></colgroup>
    <thead>
      <tr><th>დასახელება</th><th class="r">რაოდ.</th><th class="r">ფასი</th><th class="r">ჯამი</th></tr>
    </thead>
    <tbody>
      ${rows.join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="t-row"><span class="k">პაკეტი</span><span class="num">${fmt(b.base_price)}</span></div>
    ${hasExtras ? `<div class="t-row"><span class="k">დამატებითი ბავშვები</span><span class="num">${fmt(b.extra_kids_cost)}</span></div>` : ''}
    ${Number(b.menu_total) > 0 ? `<div class="t-row"><span class="k">მენიუ</span><span class="num">${fmt(b.menu_total)}</span></div>` : ''}
    ${Number(b.services_total) > 0 ? `<div class="t-row"><span class="k">სერვისები</span><span class="num">${fmt(b.services_total)}</span></div>` : ''}
    ${paidAmount > 0 ? `<div class="t-row"><span class="k">სრული ღირებულება</span><span class="num">${fmt(b.total_price)}</span></div>` : ''}
    ${paidAmount > 0 ? `<div class="t-row" style="color:#23734a;font-weight:700"><span>ბე / უკვე გადახდილი</span><span class="num">− ${fmt(paidAmount)}</span></div>` : ''}
    <div class="t-row grand"><span class="lbl">${paidAmount > 0 ? 'დარჩენილი თანხა' : 'სულ გადასახდელი'}</span><span class="amt serif num">${fmt(remainingAmount)}</span></div>
  </div>

  ${(b.notes ?? '').trim() ? `<div class="note"><b>შენიშვნა:</b> ${String(b.notes).replace(/</g, '&lt;')}</div>` : ''}

  <div class="terms">
    <div class="caps"><b>პირობები</b></div>
    <ol>
      <li>ჯავშნისთვის აუცილებელია წინადახდის ნაწილის გადახდა; თარიღი არ იცვლება და წინადახდა არ ბრუნდება.</li>
      <li>ბავშვების საბოლოო რაოდენობა და მენიუ დასადასტურებელია ღონისძიებამდე ერთი დღით ადრე, 19:00-მდე.</li>
      <li>ღონისძიება გრძელდება ზუსტად 2 საათი; დაგვიანების შემთხვევაში დრო არ გახანგრძლივდება.</li>
      <li>მხოლოდ ტორტისა და ნამცხვრების შემოტანაა ნებადართული; გარე სასმელები აკრძალულია.</li>
      <li>პროგრამა გათვლილია 6+ ასაკზე; 6 წლამდე ბავშვებს სჭირდებათ მშობლის თანხლება.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="line"></div><div class="who caps">მშობელი</div></div>
    <div class="sig"><div class="line"></div><div class="who caps">Lost Lock · ჰოსტი</div></div>
  </div>

  <footer class="foot">
    <span class="caps">Lost Lock · თბილისი · 568 96 72 77</span>
    <span class="caps num">${b.ref_code} · ${formatDate(b.event_date)}</span>
  </footer>
</body>
</html>`;
}

export function printEventDoc(b: BookingRow): void {
  printHtml(buildEventDocHtml(b));
}

/* ================= LIVE CHECK RECEIPT ================= */

export function buildCheckDocHtml(b: BookingRow, liveItems: LiveItem[]): string {
  const now = new Date();
  const bookedTotal =
    Number(b.total_price) ||
    Number(b.base_price) + Number(b.extra_kids_cost) + Number(b.menu_total) + Number(b.services_total);
  const liveTotal = liveItems.reduce((a, l) => a + Number(l.price) * Number(l.qty), 0);
  const total = bookedTotal + liveTotal;
  const paid = paidAmountOf(b);
  const balance = Math.max(total - paid, 0);

  const bookedRows = [
    { n: 'ბაზისური პაკეტი', q: 1, p: Number(b.base_price) },
    ...(Number(b.extra_kids) > 0 ? [{ n: 'დამატებითი ბავშვები', q: Number(b.extra_kids), p: 30 }] : []),
    ...((Array.isArray(b.menu_items) ? b.menu_items : []) as BookingMenuLine[]).map((l) => ({ n: l.name, q: l.qty, p: l.price })),
    ...((Array.isArray(b.services) ? b.services : []) as BookingServiceLine[]).map((l) => ({ n: l.name, q: 1, p: Number(l.price) })),
  ].filter((r) => r.p > 0 && r.q > 0);

  const liveRows = liveItems.filter((l) => Number(l.qty) > 0 && Number(l.price) >= 0 && (l.name || '').trim());

  const safe = (value: unknown) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const itemRow = (name: string, qty: number, unit: number) => `
    <tr>
      <td>${safe(name)}</td>
      <td class="num center">${qty}</td>
      <td class="num right">${fmt(unit)}</td>
      <td class="num right strong">${fmt(unit * qty)}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="UTF-8" />
<title>Lost Lock — ${safe(b.ref_code)}</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #181714; }
  body {
    font-family: Arial, 'Noto Sans Georgian', sans-serif;
    font-size: 11px;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-feature-settings: 'tnum' 1;
  }
  .sheet { max-width: 178mm; min-height: 270mm; margin: 0 auto; border: 1px solid #e6e0d5; }
  .topline { height: 6px; background: #b88a2b; }
  .content { padding: 17mm 16mm 11mm; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .brand { font-family: Georgia, serif; font-size: 29px; font-weight: 700; letter-spacing: .08em; line-height: 1; }
  .brand-note { margin-top: 7px; color: #777064; font-size: 9px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; }
  .document { text-align: right; }
  .eyebrow { color: #9a7a26; font-size: 8px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
  .reference { margin-top: 4px; font-family: Georgia, serif; font-size: 20px; font-weight: 700; }
  .issued { margin-top: 3px; color: #777064; font-size: 9px; }
  .divider { margin: 18px 0; height: 1px; background: #ded8cd; }
  .intro { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 10px; }
  .meta { min-height: 58px; padding: 11px 12px; background: #f8f6f1; border: 1px solid #ebe6dc; }
  .meta .label { display: block; margin-bottom: 5px; color: #8a837a; font-size: 8px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
  .meta .value { font-size: 12px; font-weight: 700; }
  .meta .sub { display: block; margin-top: 2px; color: #777064; font-size: 9px; font-weight: 400; }
  .section-title { margin: 23px 0 8px; font-size: 9px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 8px 9px; background: #191714; color: #fff; font-size: 8px; letter-spacing: .12em; text-align: left; text-transform: uppercase; }
  td { padding: 8px 9px; border-bottom: 1px solid #ece8df; }
  tbody tr:nth-child(even) td { background: #fbfaf7; }
  .right { text-align: right; }
  .center { text-align: center; }
  .num { font-variant-numeric: tabular-nums; }
  .strong { font-weight: 700; }
  .empty { padding: 13px 9px; border-bottom: 1px solid #ece8df; color: #8a837a; text-align: center; }
  .payment { display: grid; grid-template-columns: 1fr 76mm; gap: 18px; align-items: stretch; margin-top: 20px; }
  .message { padding: 16px; background: #f8f6f1; border-left: 3px solid #b88a2b; color: #5f594f; }
  .message b { display: block; margin-bottom: 5px; color: #181714; font-family: Georgia, serif; font-size: 15px; }
  .summary { border: 1px solid #ded8cd; }
  .sum-row { display: flex; justify-content: space-between; gap: 16px; padding: 7px 11px; border-bottom: 1px solid #ece8df; }
  .sum-row span:first-child { color: #6f695f; }
  .sum-row.paid { color: #23734a; font-weight: 700; }
  .sum-row.paid span:first-child { color: #23734a; }
  .balance { display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 13px 11px; background: #191714; color: #fff; }
  .balance .label { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .balance .amount { font-family: Georgia, serif; font-size: 22px; font-weight: 700; white-space: nowrap; }
  .paid-stamp { color: #55b781; font-size: 13px; letter-spacing: .04em; }
  .footer { display: flex; justify-content: space-between; gap: 20px; margin-top: 35px; padding-top: 10px; border-top: 1px solid #ded8cd; color: #777064; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
  .signature { margin-top: 34px; width: 62mm; margin-left: auto; text-align: center; color: #777064; font-size: 8px; letter-spacing: .12em; text-transform: uppercase; }
  .signature::before { content: ''; display: block; margin-bottom: 7px; border-top: 1px solid #8a837a; }
</style>
</head>
<body>
  <main class="sheet">
    <div class="topline"></div>
    <div class="content">
      <header class="header">
        <div>
          <div class="brand">LOST LOCK</div>
          <div class="brand-note">ღონისძიებების სივრცე · თბილისი</div>
        </div>
        <div class="document">
          <div class="eyebrow">ანგარიშსწორების ქვითარი</div>
          <div class="reference num">№ ${safe(b.ref_code)}</div>
          <div class="issued">გაცემულია ${now.getDate()} ${KA_MONTHS[now.getMonth()]} ${now.getFullYear()}, ${timeOf(now)}</div>
        </div>
      </header>

      <div class="divider"></div>

      <section class="intro">
        <div class="meta">
          <span class="label">კლიენტი</span>
          <span class="value">${safe(b.parent_name)}</span>
          <span class="sub num">${safe(b.phone)}</span>
        </div>
        <div class="meta">
          <span class="label">ღონისძიება</span>
          <span class="value">${formatDate(b.event_date)}</span>
          <span class="sub num">${safe(b.session_hour ?? '—')} · 2 საათი</span>
        </div>
        <div class="meta">
          <span class="label">სტუმრები</span>
          <span class="value num">${b.kids_count} ბავშვი</span>
          <span class="sub">დაჯავშნილი რაოდენობა</span>
        </div>
      </section>

      <div class="section-title">დაჯავშნილი პაკეტი და სერვისები</div>
      <table>
        <thead><tr><th>დასახელება</th><th class="center">რაოდ.</th><th class="right">ერთ.</th><th class="right">ჯამი</th></tr></thead>
        <tbody>${bookedRows.map((r) => itemRow(r.n, r.q, r.p)).join('')}</tbody>
      </table>

      ${liveRows.length ? `
        <div class="section-title">ღონისძიების დროს დამატებული</div>
        <table>
          <thead><tr><th>დასახელება</th><th class="center">რაოდ.</th><th class="right">ერთ.</th><th class="right">ჯამი</th></tr></thead>
          <tbody>${liveRows.map((l) => itemRow(l.name, Number(l.qty), Number(l.price))).join('')}</tbody>
        </table>` : ''}

      <section class="payment">
        <div class="message">
          <b>გმადლობთ, რომ აგვირჩიეთ.</b>
          სასიამოვნო მოგონებებს და ბევრ თავგადასავალს გისურვებთ Lost Lock-ში.
        </div>
        <div class="summary">
          <div class="sum-row"><span>ჯავშანი</span><strong class="num">${fmt(bookedTotal)}</strong></div>
          <div class="sum-row"><span>დამატებული</span><strong class="num">${fmt(liveTotal)}</strong></div>
          <div class="sum-row"><span>სრული თანხა</span><strong class="num">${fmt(total)}</strong></div>
          <div class="sum-row paid"><span>ბე / უკვე გადახდილი</span><strong class="num">− ${fmt(paid)}</strong></div>
          <div class="balance">
            <span class="label">${balance === 0 ? 'სტატუსი' : 'დარჩენილი თანხა'}</span>
            <span class="amount num ${balance === 0 ? 'paid-stamp' : ''}">${balance === 0 ? 'სრულად გადახდილია' : fmt(balance)}</span>
          </div>
        </div>
      </section>

      <div class="signature">პასუხისმგებელი პირი</div>
      <footer class="footer">
        <span>Lost Lock · თბილისი · 568 96 72 77</span>
        <span class="num">${safe(b.ref_code)} · ${formatDate(b.event_date)}</span>
      </footer>
    </div>
  </main>
</body>
</html>`;
}

export function printCheckDoc(b: BookingRow, liveItems: LiveItem[]): void {
  printHtml(buildCheckDocHtml(b, liveItems));
}
