'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, SizeOption } from '@/lib/types'
import en from '@/i18n/en.json'
import am from '@/i18n/am.json'

interface AppState {
  // Language
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof en

  // Dark Mode
  darkMode: boolean
  toggleDarkMode: () => void

  // Size Preference (3L / 5L toggle)
  selectedSize: SizeOption
  setSelectedSize: (size: SizeOption) => void

  // Search
  searchQuery: string
  setSearchQuery: (q: string) => void

  // Active Category
  activeCategory: string
  setActiveCategory: (cat: string) => void
}

const translations = { en, am }

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language
      language: 'en',
      t: en,
      setLanguage: (lang) => {
        set({ language: lang, t: translations[lang] })
        // Apply Amharic font class to HTML
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang
          if (lang === 'am') {
            document.documentElement.classList.add('font-amharic')
          } else {
            document.documentElement.classList.remove('font-amharic')
          }
        }
      },

      // Dark Mode
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next)
        }
      },

      // Size
      selectedSize: '3L',
      setSelectedSize: (size) => set({ selectedSize: size }),

      // Search
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Category
      activeCategory: 'all',
      setActiveCategory: (cat) => set({ activeCategory: cat }),
    }),
    {
      name: 'cleano-store',
      partialize: (state) => ({
        language: state.language,
        darkMode: state.darkMode,
      }),
    }
  )
)
