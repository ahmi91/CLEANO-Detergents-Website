'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function StoreInitializer() {
  const { darkMode, language } = useStore()

  useEffect(() => {
    // Sync dark mode with DOM
    document.documentElement.classList.toggle('dark', darkMode)

    // Sync language
    document.documentElement.lang = language
    if (language === 'am') {
      document.documentElement.classList.add('font-amharic')
    } else {
      document.documentElement.classList.remove('font-amharic')
    }
  }, [darkMode, language])

  return null
}
