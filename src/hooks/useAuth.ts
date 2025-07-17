"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getDisplayName, getAvatarUrl } from "@/lib/supabase/profiles";

export interface UserInfo {
  name?: string;
  avatar_url?: string;
  email?: string;
}

export function useAuth() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const [name, avatarUrl] = await Promise.all([
        getDisplayName(userId),
        getAvatarUrl(userId),
      ]);

      return {
        name: name || email,
        avatar_url: avatarUrl || "",
        email,
      };
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return {
        name: email,
        avatar_url: "",
        email,
      };
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isAuth = !!session;
      setIsLoggedIn(isAuth);

      if (isAuth && session?.user?.id && session?.user?.email) {
        const profile = await fetchUserProfile(
          session.user.id,
          session.user.email
        );
        setUser(profile);
      }
    };

    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setTimeout(() => {
          if (session?.user?.id && session?.user?.email) {
            fetchUserProfile(session.user.id, session.user.email).then(
              (profile) => {
                setUser(profile);
                setAvatarError(false);
              }
            );
          } else {
            setUser(null);
          }
          setIsLoggedIn(!!session);
        }, 0);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return {
    isLoggedIn,
    user,
    avatarError,
    setAvatarError,
    logout,
  };
}
