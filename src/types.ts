export interface ServiceItem {
  id: string;
  name: string;
  price?: string;
  category: string;
  image: string;
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

export type Language = 'ka' | 'en';

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
    heroVideo: string;
    heroFallback: string;
  };
  translations: Record<Language, any>;
}
