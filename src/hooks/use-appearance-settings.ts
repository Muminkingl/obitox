"use client"

import { useState, useEffect } from 'react'

export type DisplayPreference = 'system' | 'light' | 'dark'

export interface AppearanceSettings {
    displayPreference: DisplayPreference
    transparentSidebar: boolean
    userLogo: string | null
    language: string
}

const STORAGE_KEY = 'appearance-settings'

const DEFAULT_SETTINGS: AppearanceSettings = {
    displayPreference: 'system',
    transparentSidebar: true,
    userLogo: null,
    language: 'system'
}

export function useAppearanceSettings() {
    const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_SETTINGS)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(STORAGE_KEY)
                if (stored) {
                    const parsed = JSON.parse(stored)
                    setSettings({ ...DEFAULT_SETTINGS, ...parsed })
                }
            } catch (error) {
                console.error('Failed to load appearance settings:', error)
            } finally {
                setIsLoaded(true)
            }
        }
    }, [])

    // Save settings to localStorage
    const saveSettings = (newSettings: Partial<AppearanceSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            } catch (error) {
                console.error('Failed to save appearance settings:', error)
            }
        }

        return updated
    }

    // Reset to defaults
    const resetToDefaults = () => {
        setSettings(DEFAULT_SETTINGS)

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
            } catch (error) {
                console.error('Failed to reset appearance settings:', error)
            }
        }

        return DEFAULT_SETTINGS
    }

    // Get individual setting
    const getSetting = <K extends keyof AppearanceSettings>(key: K): AppearanceSettings[K] => {
        return settings[key]
    }

    return {
        settings,
        isLoaded,
        saveSettings,
        resetToDefaults,
        getSetting
    }
}
