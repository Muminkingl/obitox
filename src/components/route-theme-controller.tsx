'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

/**
 * Route Theme Controller
 * Forces dark theme on landing page and other non-dashboard routes
 * Allows dashboard to use saved theme preference
 */
export function RouteThemeController({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { setTheme } = useTheme()

    const isDashboard = pathname?.startsWith('/dashboard')

    useEffect(() => {
        if (!isDashboard) {
            // Force dark theme on landing page and other routes
            setTheme('dark')
        }
        // Dashboard theme is handled by the appearance settings
    }, [isDashboard, setTheme, pathname])

    return <>{children}</>
}
