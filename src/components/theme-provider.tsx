'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes'
import { useEffect } from 'react'
import { useAppearance } from '@/contexts/appearance-context'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

/**
 * Dashboard Theme Controller
 * Applies user's saved theme preference ONLY to dashboard routes
 * Landing page and other routes use default dark theme
 */
export function DashboardThemeController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { settings } = useAppearance()

  const isDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    if (isDashboard) {
      // Inside dashboard: Use user's saved preference
      const theme = settings.displayPreference
      document.documentElement.setAttribute('data-theme', 'dashboard')
      document.documentElement.className = theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : theme
    } else {
      // Outside dashboard: Force dark theme
      document.documentElement.setAttribute('data-theme', 'landing')
      document.documentElement.className = 'dark'
    }
  }, [isDashboard, settings.displayPreference])

  return <>{children}</>
}
