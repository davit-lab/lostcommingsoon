import { create } from 'zustand';
import { ASSETS, TRANSLATIONS } from '@/constants';
import { Language } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const AUTH_KEY = 'lostlock_admin_auth';
const ROW_ID = 'main';

export interface ContentStore {
  assets: typeof ASSETS;
  translations: Record<Language, any>;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateAssets: (assets: Partial<typeof ASSETS>) => void;
  updateTranslation: (lang: Language, path: string, value: any) => void;
  getContent: () => { assets: typeof ASSETS; translations: Record<Language, any> };
  resetToDefault: () => void;
  init: () => void;
}

function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
    if (current[key] === undefined) current[key] = {};
    current = current[key];
  }
  const lastKey = isNaN(Number(keys[keys.length - 1]))
    ? keys[keys.length - 1]
    : Number(keys[keys.length - 1]);
  current[lastKey] = value;
  return result;
}

// Debounced remote save to avoid hammering DB on every keystroke
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSelfUpdate = 0;
async function persist(assets: any, translations: any) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    lastSelfUpdate = Date.now();
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: ROW_ID, assets, translations }, { onConflict: 'id' });
    if (error) console.error('[contentStore] save failed', error);
  }, 350);
}

export const useContentStore = create<ContentStore>((set, get) => ({
  assets: { ...ASSETS },
  translations: JSON.parse(JSON.stringify(TRANSLATIONS)),
  isAuthenticated:
    typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY) === 'true',
  isLoaded: false,

  init: () => {
    // Initial load
    supabase
      .from('site_content')
      .select('assets, translations')
      .eq('id', ROW_ID)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('[contentStore] load failed', error);
          set({ isLoaded: true });
          return;
        }
        const remoteAssets =
          data?.assets && Object.keys(data.assets).length > 0
            ? { ...ASSETS, ...(data.assets as any) }
            : { ...ASSETS };
        const remoteTranslations =
          data?.translations && Object.keys(data.translations).length > 0
            ? (data.translations as any)
            : JSON.parse(JSON.stringify(TRANSLATIONS));
        set({
          assets: remoteAssets,
          translations: remoteTranslations,
          isLoaded: true,
        });

        // If row was empty, seed it with defaults so realtime payloads are valid
        if (
          !data ||
          !data.assets ||
          Object.keys(data.assets).length === 0 ||
          !data.translations ||
          Object.keys(data.translations).length === 0
        ) {
          supabase
            .from('site_content')
            .upsert(
              {
                id: ROW_ID,
                assets: remoteAssets,
                translations: remoteTranslations,
              },
              { onConflict: 'id' },
            )
            .then(({ error: seedErr }) => {
              if (seedErr) console.error('[contentStore] seed failed', seedErr);
            });
        }
      });

    // Realtime subscription
    supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content' },
        (payload) => {
          // Ignore echo of our own update if it arrives within 1s
          if (Date.now() - lastSelfUpdate < 1000) return;
          const row: any = payload.new;
          if (!row) return;
          set({
            assets:
              row.assets && Object.keys(row.assets).length > 0
                ? { ...ASSETS, ...row.assets }
                : { ...ASSETS },
            translations:
              row.translations && Object.keys(row.translations).length > 0
                ? row.translations
                : JSON.parse(JSON.stringify(TRANSLATIONS)),
          });
        },
      )
      .subscribe();
  },

  login: (username, password) => {
    if (username === 'lostlock' && password === 'lostlock2013') {
      localStorage.setItem(AUTH_KEY, 'true');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ isAuthenticated: false });
  },

  updateAssets: (newAssets) => {
    const state = get();
    const updated = { ...state.assets, ...newAssets };
    set({ assets: updated });
    persist(updated, state.translations);
  },

  updateTranslation: (lang, path, value) => {
    const state = get();
    const updatedTranslations = {
      ...state.translations,
      [lang]: setNestedValue(state.translations[lang], path, value),
    };
    set({ translations: updatedTranslations });
    persist(state.assets, updatedTranslations);
  },

  getContent: () => {
    const state = get();
    return { assets: state.assets, translations: state.translations };
  },

  resetToDefault: () => {
    const assets = { ...ASSETS };
    const translations = JSON.parse(JSON.stringify(TRANSLATIONS));
    set({ assets, translations });
    persist(assets, translations);
  },
}));

// Initialize once on module load (browser only)
if (typeof window !== 'undefined') {
  useContentStore.getState().init();
}
