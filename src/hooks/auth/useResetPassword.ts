import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * useResetPassword
 *
 * Custom hook to handle password reset using Supabase's token-based flow.
 *
 * Responsibilities:
 * - Updates the user's password using the token in the URL (handled automatically by Supabase)
 * - Signs the user out after a successful password change
 * - Redirects the user to the sign-in page
 * - Displays toast notifications for success or error
 */
export function useResetPassword() {
  const router = useRouter();

  /**
   * Resets the user's password.
   * @param newPassword - The new password entered by the user.
   */
  const resetPassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      // Show error toast if password update fails
      toast.error(error.message);
      return;
    }

    // Show success toast and immediately sign the user out
    toast.success("Your password has been reset. Please sign in again.");

    await supabase.auth.signOut();
    router.push("/signin");
  };

  return { resetPassword };
}
