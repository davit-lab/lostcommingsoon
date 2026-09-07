import { BookingRow } from '@/types';

export const normalizePhone = (raw: string): string => {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('995')) return d;
  if (d.length === 9) return `995${d}`;
  return d;
};

export const waLink = (phone: string, text: string): string =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

export const formatDateKa = (iso: string | null): string => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${KA_MONTHS[m - 1]} ${y}`;
};

export const bookingConfirmText = (b: BookingRow): string => {
  const lines = [
    `გამარჯობა, ${b.parent_name}!`,
    '',
    'თქვენი ჯავშანი Lost Lock-ში დადასტურებულია.',
    `თარიღი: ${formatDateKa(b.event_date)}`,
    `დრო: ${b.session_hour ?? '—'} (2 საათი)`,
    `სტუმრები: ${b.kids_count} ბავშვი`,
    `სულ გადასახდელი: ${Math.round(Number(b.total_price)).toLocaleString('en-US')} ₾`,
    '',
    'მშობლების მენიუ და ბავშვების საბოლოო რაოდენობა გთხოვთ დაადასტუროთ ღონისძიებამდე ერთი დღით ადრე, 19:00-მდე.',
    '',
    'Lost Lock · 568 96 72 77',
  ];
  return lines.join('\n');
};
