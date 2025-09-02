'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { NavUser } from '@/components/nav-user';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "User",
    email: "loading@example.com",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // For Google auth, user data is in user_metadata
          const userData = {
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "User",
            email: authUser.email || "user@example.com",
            avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || "",
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  return <NavUser user={loading ? { name: "Loading...", email: "Please wait", avatar: "" } : user} />;
}

