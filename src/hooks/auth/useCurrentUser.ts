import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Custom React hook to provide the current authenticated user and its loading state.
 *
 * This hook:
 * - Retrieves the initial user via `supabase.auth.getUser()`
 * - Subscribes to auth state changes (sign-in, sign-out, token refresh) with `onAuthStateChange`
 * - Updates `user` in real time and sets `isLoading` to false once the state is determined
 *
 * @returns An object containing:
 * - `user`: the current Supabase user object, or `null` if not signed in
 * - `isLoading`: whether the user state is still being determined
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
  };
}
