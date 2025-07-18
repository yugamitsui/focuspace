import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Custom React hook to retrieve the current Supabase session object.
 *
 * This hook runs on the client side and uses Supabase's auth module
 * to fetch the current authenticated session. It stores the session object
 * in local component state and keeps it updated in response to
 * auth state changes (sign-in, sign-out, token refresh).
 *
 * @returns The current Supabase session object, or null if not signed in.
 */
export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        setSession(session ?? null);
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
}
