import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import toast from "react-hot-toast";

/**
 * useDeleteAccount
 *
 * Custom hook to handle permanent account deletion via Supabase Edge Function.
 *
 * Responsibilities:
 * - Confirms user intent twice
 * - Invokes Supabase Edge Function `delete-user` to remove user data
 * - Signs the user out and redirects to home on success
 * - Displays toast messages on success or error
 */
export function useDeleteAccount() {
  const { user } = useCurrentUser();
  const router = useRouter();

  const deleteAccount = async () => {
    const first = confirm("Are you sure you want to delete your account?");
    if (!first) return;

    const second = confirm(
      "This is your final confirmation. All your data will be permanently deleted and cannot be recovered. Are you sure you want to proceed?"
    );
    if (!second || !user) return;

    localStorage.setItem("skip_auth_redirect", "true");

    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: JSON.stringify({ user_id: user.id }),
      });

      if (error) {
        console.error("Supabase delete-user function error:", error);
        localStorage.removeItem("skip_auth_redirect");
        toast.error("Failed to delete your account. Please try again later.");
        return;
      }

      toast.success("Account deleted. You're always welcome back!");
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error("Unexpected error:", e);
      localStorage.removeItem("skip_auth_redirect");
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return { deleteAccount };
}
