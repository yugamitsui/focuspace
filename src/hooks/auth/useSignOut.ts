import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * Custom hook to sign out the current user from Supabase auth.
 *
 * Responsibilities:
 * - Signs out the authenticated user
 * - Displays toast messages for success or failure
 */
export function useSignOut() {
  /**
   * Signs out the current user from Supabase auth.
   * Shows a success toast if completed, or an error toast if failed.
   * Caller is responsible for any post-signout navigation or state reset.
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
    } catch (e) {
      console.error("Unexpected sign-out error:", e);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }, []);

  return {
    signOut,
  };
}
