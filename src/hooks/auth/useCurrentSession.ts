import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Custom React hook to provide the current authenticated session and its loading state.
 *
 * This hook:
 * - Retrieves the initial session via `supabase.auth.getSession()`
 * - Subscribes to auth state changes (sign-in, sign-out, token refresh) with `onAuthStateChange`
 * - Updates `session` in real time and sets `isLoading` to false once the state is determined
 *
 * @returns An object containing:
 * - `session`: the current Supabase session object, or `null` if not signed in
 * - `isLoading`: whether the session state is still being determined
 */
export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        setSession(session ?? null);
        setIsLoading(false);
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
  };
}
