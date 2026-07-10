import i18next from 'i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'ar' | 'en';

type LanguageState = {
  language: AppLanguage;
  direction: 'rtl' | 'ltr';
  setLanguage: (language: AppLanguage) => void;
};

function getDirection(language: AppLanguage) {
  return language === 'ar' ? 'rtl' : 'ltr';
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      direction: 'rtl',
      setLanguage: (language) => {
        void i18next.changeLanguage(language);
        set({ language, direction: getDirection(language) });
      },
    }),
    {
      name: 'football-language',
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          void i18next.changeLanguage(state.language);
          document.documentElement.lang = state.language;
          document.documentElement.dir = state.direction;
        }
      },
    },
  ),
);
