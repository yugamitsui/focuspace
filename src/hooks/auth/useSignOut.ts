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
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign-out error:", error);
        toast.error("Failed to sign out. Please try again.");
        return;
      }

      toast.success("Signed out. See you again soon!");
      router.push(redirectPath);
    } catch (e) {
      console.error("Unexpected sign-out error:", e);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }, [router, redirectPath]);

  return {
    signOut,
  };
}
