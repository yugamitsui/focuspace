import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Custom React hook to retrieve the current authenticated user object.
 *
 * This hook runs on the client side and uses Supabase's auth module
 * to fetch the current user session. It stores the full user object
 * in local component state for use in components.
 *
 * @returns The authenticated Supabase user object or null if not signed in.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
    });
  }, []);

  return user;
}
