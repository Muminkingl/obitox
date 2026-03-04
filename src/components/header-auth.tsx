'use client'

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export function AuthSection() {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // For Google auth, user data is in user_metadata
          setUser({
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "User",
            email: authUser.email || "user@example.com",
            avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || "",
          })
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleAvatarClick = () => {
    router.push('/dashboard/usage')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-8 w-8 mr-2">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <Button
        asChild
        size="sm"
        className="mr-2">
        <Link href="/login">
          <span>Get Started</span>
        </Link>
      </Button>
    )
  }

  return (
    <Avatar 
      className="h-8 w-8 cursor-pointer mr-2" 
      onClick={handleAvatarClick}
    >
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}