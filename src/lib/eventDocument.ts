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
    <div class="t-row grand"><span class="lbl">სულ გადასახდელი</span><span class="amt serif num">${fmt(b.total_price)}</span></div>
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

  const bookedRows = [
    { n: 'ბაზისური პაკეტი', q: 1, p: Number(b.base_price) },
    ...(Number(b.extra_kids) > 0 ? [{ n: 'დამატებითი ბავშვები', q: Number(b.extra_kids), p: 30 }] : []),
    ...((Array.isArray(b.menu_items) ? b.menu_items : []) as BookingMenuLine[]).map((l) => ({ n: l.name, q: l.qty, p: l.price })),
    ...((Array.isArray(b.services) ? b.services : []) as BookingServiceLine[]).map((l) => ({ n: l.name, q: 1, p: Number(l.price) })),
  ].filter((r) => r.p > 0 && r.q > 0);

  const liveRows = liveItems.filter((l) => Number(l.qty) > 0 && Number(l.price) >= 0 && (l.name || '').trim());

  const leaderRow = (name: string, qty: number, sum: number, strong?: boolean) => `
    <div class="li${strong ? ' strong' : ''}">
      <span class="n">${qty > 1 ? `<span class="q num">${qty} × </span>` : ''}${String(name).replace(/</g, '&lt;')}</span>
      <span class="dots"></span>
      <span class="s num">${fmt(sum)}</span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ka">
<head>
${HEAD_LINKS}
<title>Lost Lock Check — ${b.ref_code}</title>
<style>
  ${SHARED_CSS}
  body { max-width: 172mm; margin: 0 auto; }

  .ch-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; }
  .ch-brand { display: flex; align-items: center; gap: 14px; }
  .ch-brand img { height: 46px; object-fit: contain; }
  .ch-name { font-size: 24px; line-height: 1; letter-spacing: .05em; }
  .ch-sub { margin-top: 4px; }
  .ch-ref { text-align: right; }
  .ch-ref .lbl { font-size: 8px; letter-spacing: .2em; font-weight: 700; color: ${FAINT}; }
  .ch-ref .v { font-size: 20px; color: ${GOLD}; margin-top: 2px; }

  .rule { height: 3px; background: ${BAND}; margin-bottom: 2px; }
  .rule-thin { height: 1px; background: ${GOLD}; margin-bottom: 16px; }

  .ch-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 14px 0 16px; }
  .m-field { display: flex; flex-direction: column; gap: 2px; border: 1px solid #EAE6DA; border-radius: 8px; padding: 9px 11px; background: #FCFBF7; }
  .m-field .caps { display: block; }
  .m-field .mv { font-size: 11.5px; font-weight: 700; }

  .sec-lbl { text-align: center; margin: 18px 0 6px; display: flex; align-items: center; gap: 12px; }
  .sec-lbl span { font-size: 9px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: ${GOLD}; }
  .sec-lbl::before, .sec-lbl::after { content: ''; flex: 1; border-top: 1px solid ${HAIR}; }

  .lines { padding: 0 2px; }
  .li { display: flex; align-items: baseline; padding: 3.5px 0; }
  .li .n { font-weight: 500; }
  .li .q { color: ${FAINT}; font-size: 10px; }
  .dots { flex: 1; border-bottom: 1.5px dotted #C9C2AF; margin: 0 8px; transform: translateY(-3px); }
  .li .s { font-weight: 600; }
  .li.strong .s { font-weight: 700; }
  .empty { text-align: center; color: ${FAINT}; padding: 6px 0; }

  .sums { width: 260px; margin-left: auto; margin-top: 16px; }
  .sums .row { display: flex; justify-content: space-between; padding: 4px 0; color: #4d4942; }
  .total-line { display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid ${BAND}; margin-top: 7px; padding-top: 9px; }
  .total-line .lbl { font-size: 11px; font-weight: 700; letter-spacing: .06em; }
  .total-line .amt { font-size: 24px; line-height: 1; color: ${GOLD}; }

  .thanks { text-align: center; margin-top: 24px; font-style: italic; color: #55503f; font-size: 11px; }

  .signs { display: flex; justify-content: space-between; margin-top: 38px; max-width: 80%; margin-left: auto; margin-right: auto; }
  .sig { text-align: center; width: 190px; }
  .sig .line { border-bottom: 1px solid #A9A294; height: 28px; }
  .sig .who { margin-top: 6px; }

  .foot { margin-top: 26px; border-top: 1px solid ${HAIR}; padding-top: 8px; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <header class="ch-head">
    <div class="ch-brand">
      ${ASSETS.logo ? `<img src="${ASSETS.logo}" alt="" />` : ''}
      <div>
        <div class="ch-name serif"><b>LOST LOCK</b></div>
        <div class="caps ch-sub">ღონისძიების ანგარიში · ბარი</div>
      </div>
    </div>
    <div class="ch-ref">
      <div class="lbl">ანგარიში №</div>
      <div class="v serif num">${b.ref_code}</div>
    </div>
  </header>
  <div class="rule"></div>
  <div class="rule-thin"></div>

  <div class="ch-meta">
    <div class="m-field"><span class="caps">ორშაბათი — კვირა</span><span class="mv">${formatDate(b.event_date)}</span></div>
    <div class="m-field"><span class="caps">სესია</span><span class="mv num">${b.session_hour ?? '—'}</span></div>
    <div class="m-field"><span class="caps">სტუმარი</span><span class="mv">${b.parent_name}</span></div>
    <div class="m-field"><span class="caps">სტუმრები</span><span class="mv num">${b.kids_count} ბავშვი</span></div>
  </div>

  <div class="sec-lbl"><span>ჯავშანი</span></div>
  <div class="lines">
    ${bookedRows.map((r) => leaderRow(r.n, r.q, r.p * r.q)).join('')}
  </div>

  <div class="sec-lbl"><span>ბარი · ღონისძიების დროს</span></div>
  <div class="lines">
    ${liveRows.length ? liveRows.map((l) => leaderRow(l.name, Number(l.qty), Number(l.price) * Number(l.qty))).join('') : '<div class="empty">— დამატება არ არის —</div>'}
  </div>

  <div class="sums">
    <div class="row"><span class="k" style="color:#4d4942">ჯავშანი</span><span class="num">${fmt(bookedTotal)}</span></div>
    <div class="row"><span class="k" style="color:#4d4942">ბარი</span><span class="num">${fmt(liveTotal)}</span></div>
    <div class="total-line"><span class="lbl">სულ</span><span class="amt serif num">${fmt(bookedTotal + liveTotal)}</span></div>
  </div>

  <div class="thanks">გმადლობთ, რომ Lost Lock-თან ერთად აღნიშნეთ!</div>

  <div class="signs">
    <div class="sig"><div class="line"></div><div class="who caps">მშობელი</div></div>
    <div class="sig"><div class="line"></div><div class="who caps">ჰოსტი</div></div>
  </div>

  <footer class="foot">
    <span class="caps">Lost Lock · თბილისი · 568 96 72 77</span>
    <span class="caps num">${now.getDate()} ${KA_MONTHS[now.getMonth()]} ${now.getFullYear()} ${timeOf(now)}</span>
  </footer>
</body>
</html>`;
}

export function printCheckDoc(b: BookingRow, liveItems: LiveItem[]): void {
  printHtml(buildCheckDocHtml(b, liveItems));
}