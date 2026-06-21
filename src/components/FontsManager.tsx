import { useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import { FONT_OPTIONS, ASSETS } from '@/constants';

/**
 * Loads selected Google Fonts and exposes them as CSS variables:
 *   --font-heading, --font-body, --font-vintage, --font-accent
 * Mounted once at app root.
 */
const FontsManager: React.FC = () => {
  const fonts = useContentStore((s) => (s.assets as any).fonts) || ASSETS.fonts;

  useEffect(() => {
    const families = Array.from(
      new Set(
        [fonts.heading, fonts.body, fonts.vintage, fonts.accent].filter(Boolean),
      ),
    );

    // Build a single Google Fonts link for all selected families
    const families2 = families
      .map((name) => {
        const opt = FONT_OPTIONS.find((f) => f.name === name);
        const weights = opt?.weights ?? '400;700';
        return `family=${encodeURIComponent(name)}:wght@${weights}`;
      })
      .join('&');

    const href = `https://fonts.googleapis.com/css2?${families2}&display=swap`;

    const id = 'admin-dynamic-fonts';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;

    const root = document.documentElement.style;
    root.setProperty('--font-heading', `'${fonts.heading}', serif`);
    root.setProperty('--font-body', `'${fonts.body}', system-ui, sans-serif`);
    root.setProperty('--font-vintage', `'${fonts.vintage}', serif`);
    root.setProperty('--font-accent', `'${fonts.accent}', system-ui, sans-serif`);
  }, [fonts.heading, fonts.body, fonts.vintage, fonts.accent]);

  return null;
};

export default FontsManager;
