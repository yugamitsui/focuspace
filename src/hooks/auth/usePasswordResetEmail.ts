import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * usePasswordResetEmail
 *
 * A custom hook to handle the sending of a password reset email
 * using Supabase Auth.
 *
 * This hook:
 * - Sends a password reset email to the specified address
 * - Redirects the user to the `/reset-password` page after they click the email link
 * - Displays success or error messages via toast notifications
 *
 * Usage:
 * const { sendPasswordResetEmail } = usePasswordResetEmail();
 * await sendPasswordResetEmail("user@example.com");
 */
export function usePasswordResetEmail() {
  const sendPasswordResetEmail = async (email: string) => {
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
