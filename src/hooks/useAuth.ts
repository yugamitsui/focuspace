"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsLoggedIn(isAuth);
      if (isAuth && session?.user) {
        setUser({
          name: session.user.user_metadata.name || session.user.email,
          avatar_url: session.user.user_metadata.avatar_url,
          email: session.user.email,
        });
      }
    };

    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const isAuth = !!session;
        setIsLoggedIn(isAuth);
        if (isAuth && session?.user) {
          setUser({
            name: session.user.user_metadata.name || session.user.email,
            avatar_url: session.user.user_metadata.avatar_url,
            email: session.user.email,
          });
          setAvatarError(false);
        } else {
          setUser(null);
        }
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
