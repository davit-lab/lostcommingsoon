import { create } from 'zustand';
import { ASSETS, TRANSLATIONS } from '@/constants';
import { Language } from '@/types';

const STORAGE_KEY = 'lostlock_admin_content';
const AUTH_KEY = 'lostlock_admin_auth';

export interface ContentStore {
  assets: typeof ASSETS;
  translations: Record<Language, any>;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateAssets: (assets: Partial<typeof ASSETS>) => void;
  updateTranslation: (lang: Language, path: string, value: any) => void;
  getContent: () => { assets: typeof ASSETS; translations: Record<Language, any> };
  resetToDefault: () => void;
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveToStorage(data: { assets: any; translations: any }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
  const lastKey = isNaN(Number(keys[keys.length - 1])) ? keys[keys.length - 1] : Number(keys[keys.length - 1]);
  current[lastKey] = value;
  return result;
}

const saved = loadFromStorage();

export const useContentStore = create<ContentStore>((set, get) => ({
  assets: saved?.assets || { ...ASSETS },
  translations: saved?.translations || JSON.parse(JSON.stringify(TRANSLATIONS)),
  isAuthenticated: localStorage.getItem(AUTH_KEY) === 'true',
  
  login: (username: string, password: string) => {
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
    saveToStorage({ assets: updated, translations: state.translations });
  },

  updateTranslation: (lang, path, value) => {
    const state = get();
    const updatedTranslations = {
      ...state.translations,
      [lang]: setNestedValue(state.translations[lang], path, value),
    };
    set({ translations: updatedTranslations });
    saveToStorage({ assets: state.assets, translations: updatedTranslations });
  },

  getContent: () => {
    const state = get();
    return { assets: state.assets, translations: state.translations };
  },

  resetToDefault: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ assets: { ...ASSETS }, translations: JSON.parse(JSON.stringify(TRANSLATIONS)) });
  },
}));
