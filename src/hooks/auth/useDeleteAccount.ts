"use client";

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
 * - Confirms user intent
 * - Invokes Supabase Edge Function `delete-user` to remove user data
 * - Signs the user out and redirects to home on success
 * - Displays toast messages on success or error
 */
export function useDeleteAccount() {
  const { user } = useCurrentUser();
  const router = useRouter();

  const deleteAccount = async () => {
    const confirmed = confirm("Delete account permanently?");
    if (!confirmed || !user) return;

    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: JSON.stringify({ user_id: user.id }),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account deleted.");
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error("Unexpected error:", e);
      toast.error("Unexpected error occurred.");
    }
  };

  return { deleteAccount };
}
