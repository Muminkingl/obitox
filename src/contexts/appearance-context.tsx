"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAppearanceSettings, type AppearanceSettings } from '@/hooks/use-appearance-settings'

interface AppearanceContextType {
    settings: AppearanceSettings
    isLoaded: boolean
    updateSettings: (settings: Partial<AppearanceSettings>) => void
    resetSettings: () => void
    transparentSidebar: boolean
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
    const { settings, isLoaded, saveSettings, resetToDefaults } = useAppearanceSettings()
    const [transparentSidebar, setTransparentSidebar] = useState(true)

    // Sync transparent sidebar with settings
    useEffect(() => {
        if (isLoaded) {
            setTransparentSidebar(settings.transparentSidebar)
        }
    }, [settings.transparentSidebar, isLoaded])

    const updateSettings = (newSettings: Partial<AppearanceSettings>) => {
        const updated = saveSettings(newSettings)
        if ('transparentSidebar' in newSettings) {
            setTransparentSidebar(newSettings.transparentSidebar!)
        }
    }

    const resetSettings = () => {
        const defaults = resetToDefaults()
        setTransparentSidebar(defaults.transparentSidebar)
    }

    return (
        <AppearanceContext.Provider
            value={{
                settings,
                isLoaded,
                updateSettings,
                resetSettings,
                transparentSidebar
            }}
        >
            {children}
        </AppearanceContext.Provider>
    )
}

export function useAppearance() {
    const context = useContext(AppearanceContext)
    if (!context) {
        throw new Error('useAppearance must be used within AppearanceProvider')
    }
    return context
}
