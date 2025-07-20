"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * Custom hook to manage the user's email address.
 *
 * Responsibilities:
 * - Load the current email and connected providers from Supabase Auth
 * - Track changes to the email for update validation
 * - Provide a method to request an email update
 *
 * Constraints:
 * - Email can only be updated when only the "email" provider is connected
 * - Updates will trigger a confirmation email from Supabase
 */
export function useEmail() {
  const { user } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load current email and providers from Supabase Auth
  useEffect(() => {
    if (!user) return;

    const currentEmail = user.email ?? "";
    setEmail(currentEmail);
    setOriginalEmail(currentEmail);
    setConnectedProviders(user.app_metadata?.providers || []);
    setIsLoading(false);
  }, [user]);

  // Check if the email field was modified
  const isModified = email !== originalEmail;

  /**
   * Updates the user's email in Supabase Auth.
   * Can only be performed if the user has no social providers connected.
   * Supabase will send a confirmation email to the new address.
   */
  const updateEmail = async () => {
    if (!user) return;

    const isOnlyEmailProvider =
      connectedProviders.length === 1 && connectedProviders[0] === "email";

    if (!isOnlyEmailProvider) {
      toast.error(
        "You can't change your email while a social provider is connected."
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Confirmation email sent! Please check your inbox.");
    setOriginalEmail(email);
  };

  return {
    email,
    setEmail,
    isModified,
    updateEmail,
    isLoading,
  };
}
