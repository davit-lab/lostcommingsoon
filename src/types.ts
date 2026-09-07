export interface ServiceItem {
  id: string;
  name: string;
  price?: string;
  category: string;
  image: string;
  images: string[];
  video: string;
  link: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingPackage {
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface BookingMenuLine {
  key: string;
  catKey: string;
  cat: string;
  name: string;
  price: number;
  qty: number;
}

export interface BookingServiceLine {
  key: string;
  name: string;
  price: number;
}

export type BookingStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface LiveItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface BookingRow {
  live_items?: LiveItem[] | null;
  id: string;
  ref_code: string;
  event_date: string | null;
  session_hour: string | null;
  kids_count: number;
  extra_kids: number;
  base_price: number;
  extra_kids_cost: number;
  menu_items: BookingMenuLine[] | null;
  menu_total: number;
  services: BookingServiceLine[] | null;
  services_total: number;
  total_price: number;
  parent_name: string;
  phone: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
}

export type Language = 'ka' | 'en';

/**
 * A single vertical Reel in the "ვიდეოები" (Reels) section.
 * Data lives in `src/config/reels.ts` — add/remove entries there.
 */
export interface Reel {
  /** Unique shareable id — becomes part of the deep link: #/reels/<id> */
  id: string;
  /** Local or remote video file, e.g. `/videos/reel-1.mp4` (9:16 recommended) */
  video: string;
  /** Preview frame shown on the card + as poster while the video loads */
  thumbnail: string;
  title: string;
  description: string;
  /** Baseline like count shown before any visitor engages (seeded by hand) */
  likes: number;
  /** Optional link — navigated to when the user taps the link button in the viewer */
  link?: string;
}

export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface SiteContent {
  assets: {
    logo: string;
    mainBackground: string;
    bgColor: string;
    heroVideo: string;
    heroFallback: string;
  };
  translations: Record<Language, any>;
}
