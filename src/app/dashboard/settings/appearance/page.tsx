'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/base/buttons/button'
import { Toggle } from '@/components/base/toggle/toggle'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Alert, AlertTitle, AlertIcon } from '@/components/ui/alert'
import { RiCheckboxCircleFill } from '@remixicon/react'
import { Upload } from 'lucide-react'
import { useAppearance } from '@/contexts/appearance-context'
import type { DisplayPreference } from '@/hooks/use-appearance-settings'
import { createClient } from '@/lib/supabase/client'

export default function AppearancePage() {
    const { theme, setTheme } = useTheme()
    const { settings, updateSettings, resetSettings } = useAppearance()

    // Pending states (not yet saved)
    const [pendingDisplayMode, setPendingDisplayMode] = React.useState<DisplayPreference>('system')
    const [pendingTransparentSidebar, setPendingTransparentSidebar] = React.useState(true)
    const [pendingUserLogo, setPendingUserLogo] = React.useState<string | null>(null)

    // Saved states (from localStorage/context)
    const [savedDisplayMode, setSavedDisplayMode] = React.useState<DisplayPreference>('system')

    // User auth state
    const [userEmail, setUserEmail] = React.useState<string>('')
    const [userAvatarUrl, setUserAvatarUrl] = React.useState<string | null>(null)

    // UI states
    const [isLoading, setIsLoading] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null)

    // Load initial values from context and auth
    React.useEffect(() => {
        const loadInitialData = async () => {
            // Load appearance settings
            setPendingDisplayMode(settings.displayPreference)
            setSavedDisplayMode(settings.displayPreference)
            setPendingTransparentSidebar(settings.transparentSidebar)
            setPendingUserLogo(settings.userLogo)
            setLogoPreview(settings.userLogo)

            // Load user data from Supabase
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || '')
                setUserAvatarUrl(user.user_metadata?.avatar_url || null)
            }
        }
        loadInitialData()
    }, [settings])

    // Handle theme changes immediately for preview
    React.useEffect(() => {
        setTheme(pendingDisplayMode)
    }, [pendingDisplayMode, setTheme])

    const handleDisplayModeChange = (mode: DisplayPreference) => {
        setPendingDisplayMode(mode)
    }

    const handleCancel = () => {
        setPendingDisplayMode(savedDisplayMode)
        setTheme(savedDisplayMode)
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setLogoPreview(base64)
                setPendingUserLogo(base64)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleResetToDefault = () => {
        setPendingDisplayMode('system')
        setPendingTransparentSidebar(true)
        setTheme('system')

        // Apply immediately
        resetSettings()
        setSavedDisplayMode('system')
        setLogoPreview(null)
        setPendingUserLogo(null)
    }

    const handleSave = () => {
        setIsLoading(true)
        setShowSuccess(false)

        // Simulate save delay
        setTimeout(() => {
            // Save all settings to localStorage via context
            updateSettings({
                displayPreference: pendingDisplayMode,
                transparentSidebar: pendingTransparentSidebar,
                userLogo: pendingUserLogo
            })

            setSavedDisplayMode(pendingDisplayMode)
            setIsLoading(false)
            setShowSuccess(true)

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        }, 800)
    }

    const showCancelButton = pendingDisplayMode !== savedDisplayMode

    return (
        <div className="max-w-4xl relative">
            {/* Success Alert */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <Alert variant="mono" icon="success" className="shadow-2xl backdrop-blur-md">
                        <AlertIcon>
                            <RiCheckboxCircleFill className="text-green-500" />
                        </AlertIcon>
                        <AlertTitle>Settings saved successfully</AlertTitle>
                    </Alert>
                </div>
            )}

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-start justify-between border-b pb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">Appearance</h2>
                        <p className="text-sm text-muted-foreground">
                            Change how your dashboard looks and feels.
                        </p>
                    </div>
                </div>

                {/* User Logo */}
                <div className="flex items-start justify-between border-b pb-6">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium">User logo</h3>
                        <p className="text-sm text-muted-foreground">Update your personal logo.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 overflow-hidden bg-background">
                            {logoPreview || userAvatarUrl ? (
                                <img
                                    src={logoPreview || userAvatarUrl || undefined}
                                    alt="User logo"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <svg className="h-12 w-12 text-muted-foreground" viewBox="0 0 100 100" fill="none">
                                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M50 20 L50 80 M35 35 L65 35 M35 50 L65 50 M35 65 L65 65" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                        <Button
                            color="outline"
                            size="md"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Replace logo
                        </Button>
                    </div>
                </div>

                {/* Display Preference */}
                <div className="space-y-4 border-b pb-6">
                    <div>
                        <h3 className="text-sm font-medium">Display preference</h3>
                        <p className="text-sm text-muted-foreground">
                            Switch between light and dark modes.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* System Preference */}
                        <button
                            onClick={() => handleDisplayModeChange('system')}
                            className={`group relative overflow-hidden rounded-lg border-2 transition-all ${pendingDisplayMode === 'system'
                                ? 'border-primary ring-4 ring-primary/20'
                                : 'border-border hover:border-muted-foreground/50'
                                }`}
                        >
                            <div className="aspect-video bg-background p-4">
                                <div className="flex h-full gap-2">
                                    <div className="flex-1 rounded-md bg-card border p-2">
                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-6 rounded bg-primary" />
                                                <div className="flex-1 space-y-1">
                                                    <div className="h-2 rounded bg-muted" />
                                                    <div className="h-4 rounded bg-muted" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-md bg-muted border p-2">
                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="h-6 rounded bg-background" />
                                            <svg className="w-full h-8 text-primary opacity-60" viewBox="0 0 100 40">
                                                <polyline
                                                    points="0,30 20,25 40,28 60,15 80,20 100,10"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {pendingDisplayMode === 'system' && (
                                <div className="absolute bottom-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                </div>
                            )}
                            <div className="border-t p-3">
                                <p className="text-sm font-medium">System preference</p>
                            </div>
                        </button>

                        {/* Light Mode */}
                        <button
                            onClick={() => handleDisplayModeChange('light')}
                            className={`group relative overflow-hidden rounded-lg border-2 transition-all ${pendingDisplayMode === 'light'
                                ? 'border-primary ring-4 ring-primary/20'
                                : 'border-border hover:border-muted-foreground/50'
                                }`}
                        >
                            <div className="aspect-video bg-gray-100 p-4">
                                <div className="h-full rounded-md bg-white border border-gray-200 p-2">
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-6 rounded bg-primary" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 rounded bg-gray-200" />
                                                <div className="h-4 rounded bg-gray-100" />
                                            </div>
                                        </div>
                                        <svg className="w-full h-8 text-primary/40" viewBox="0 0 100 40">
                                            <polyline
                                                points="0,30 20,25 40,28 60,15 80,20 100,10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {pendingDisplayMode === 'light' && (
                                <div className="absolute bottom-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                </div>
                            )}
                            <div className="border-t p-3 bg-background">
                                <p className="text-sm font-medium">Light mode</p>
                            </div>
                        </button>

                        {/* Dark Mode */}
                        <button
                            onClick={() => handleDisplayModeChange('dark')}
                            className={`group relative overflow-hidden rounded-lg border-2 transition-all ${pendingDisplayMode === 'dark'
                                ? 'border-primary ring-4 ring-primary/20'
                                : 'border-border hover:border-muted-foreground/50'
                                }`}
                        >
                            <div className="aspect-video bg-black p-4">
                                <div className="h-full rounded-md bg-zinc-900 border border-zinc-800 p-2">
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-6 rounded bg-zinc-800 space-y-0.5 p-0.5">
                                                <div className="h-1 rounded bg-zinc-700" />
                                                <div className="h-1 rounded bg-zinc-700" />
                                                <div className="h-1 rounded bg-zinc-700" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 rounded bg-zinc-800" />
                                                <div className="h-4 rounded bg-zinc-800" />
                                            </div>
                                        </div>
                                        <svg className="w-full h-8 text-primary" viewBox="0 0 100 40">
                                            <polyline
                                                points="0,30 20,25 40,28 60,15 80,20 100,10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {pendingDisplayMode === 'dark' && (
                                <div className="absolute bottom-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                </div>
                            )}
                            <div className="border-t p-3 bg-background">
                                <p className="text-sm font-medium">Dark mode</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Transparent Sidebar */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Transparent sidebar</h3>
                        <p className="text-sm text-muted-foreground">Make the sidebar transparent.</p>
                    </div>
                    <Toggle
                        checked={pendingTransparentSidebar}
                        onCheckedChange={setPendingTransparentSidebar}
                        size="sm"
                    />
                </div>

                {/* Language */}
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">Language</h3>
                        <p className="text-sm text-muted-foreground">
                            Default language for public dashboard.
                        </p>
                    </div>
                    <Select defaultValue="en-us" disabled>
                        <SelectTrigger className="w-[180px] opacity-50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-us">English (US)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4">
                    <Button color="ghost" onClick={handleResetToDefault}>Reset to default</Button>
                    <div className="flex gap-3">
                        {showCancelButton && (
                            <Button color="outline" size="md" onClick={handleCancel}>Cancel</Button>
                        )}
                        <Button
                            color="primary"
                            size="md"
                            isLoading={isLoading}
                            showTextWhileLoading={true}
                            onClick={handleSave}
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
