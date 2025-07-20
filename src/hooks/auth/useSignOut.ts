import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * Custom hook for handling user signout actions.
 *
 * Provides a function to sign out the currently authenticated user.
 * You can optionally specify a redirect URL on success.
 *
 * @param options - Optional config such as redirect path
 */
export function useSignOut(options?: { redirect?: string }) {
  const router = useRouter();
  const redirectPath = options?.redirect ?? "/";

  /**
   * Sign out the current user from Supabase auth.
   * Shows a toast and redirects on success.
   */
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully signed out.");
      router.push(redirectPath);
    }
  }, [router, redirectPath]);

  return {
    signOut,
  };
}
