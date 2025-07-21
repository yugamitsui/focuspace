import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
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
      toast.error("Email not available.");
      return;
    }

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent.");
      }
    } catch (e) {
      toast.error("Failed to send password reset email.");
      console.error("sendPasswordResetEmail error:", e);
    }
  };

  return { sendPasswordResetEmail };
}
