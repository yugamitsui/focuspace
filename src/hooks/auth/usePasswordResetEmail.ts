import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

/**
 * usePasswordResetEmail
 *
 * A custom hook to send a password reset email using the currently authenticated user's email.
 *
 * Features:
 * - Automatically retrieves the current user's email
 * - Sends a reset email with a redirect to `/reset-password`
 * - Provides user feedback via toast messages
 *
 * Usage:
 * const { sendPasswordResetEmail } = usePasswordResetEmail();
 * await sendPasswordResetEmail();
 */
export function usePasswordResetEmail() {
  const { user } = useCurrentUser();

  const sendPasswordResetEmail = async () => {
    if (!user || !user.email) {
      toast.error("Email not available.");
      return;
    }

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
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
