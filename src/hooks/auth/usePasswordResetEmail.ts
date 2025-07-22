import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase/client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

/**
 * usePasswordResetEmail
 *
 * A flexible hook to send a password reset email.
 *
 * Features:
 * - Uses the current user's email by default
 * - Accepts an optional email override (e.g. from user input)
 * - Sends reset email with redirect to /reset-password
 * - Handles errors and user feedback with toast
 *
 * Usage:
 * const { sendPasswordResetEmail } = usePasswordResetEmail();
 * await sendPasswordResetEmail(); // Uses current user
 * await sendPasswordResetEmail("someone@example.com"); // Overrides email
 */
export function usePasswordResetEmail() {
  const { user } = useCurrentUser();

  const sendPasswordResetEmail = async (emailOverride?: string) => {
    const email = emailOverride ?? user?.email;

    if (!email) {
      toast.error("No email address available to send reset link.");
      return;
    }

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        console.error("Supabase resetPasswordForEmail error:", error);
        toast.error("Failed to send reset email. Please try again later.");
      } else {
        toast.success("Password reset email sent. Please check your inbox.");
      }
    } catch (e) {
      console.error("Unexpected error in sendPasswordResetEmail:", e);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return { sendPasswordResetEmail };
}
