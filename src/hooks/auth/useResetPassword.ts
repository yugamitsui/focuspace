import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * useResetPassword
 *
 * Custom hook to handle the Supabase password reset flow.
 *
 * Responsibilities:
 * - Detects password recovery state via Supabase's onAuthStateChange
 * - Enables access to the reset password form only when PASSWORD_RECOVERY event is emitted
 * - Updates the user's password via Supabase
 * - Signs the user out after a successful reset
 * - Redirects the user to the sign-in page
 *
 * Note:
 * This implementation assumes the use of `@supabase/supabase-js` directly,
 * since `@supabase/ssr` does not emit PASSWORD_RECOVERY event properly.
 */
export function useResetPassword() {
  const router = useRouter();
  const [canResetPassword, setCanResetPassword] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log(event);
      if (event === "PASSWORD_RECOVERY") {
        setCanResetPassword(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Updates the user's password.
   * @param newPassword - The new password to set
   */
  const resetPassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Your password has been reset. Please sign in again.");
    await supabase.auth.signOut();
    router.push("/signin");
  };

  return {
    resetPassword,
    canResetPassword,
  };
}
