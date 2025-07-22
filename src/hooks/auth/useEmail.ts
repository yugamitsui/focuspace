import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, EmailFormData } from "@/schemas/auth";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

/**
 * useEmail
 *
 * A hook to manage user's email form using react-hook-form and Zod.
 *
 * Features:
 * - Loads the current email and connected providers
 * - Initializes react-hook-form with schema
 * - Tracks if the email has changed
 * - Validates new email address
 * - Triggers Supabase confirmation email on update
 * - Blocks update if social providers are connected
 */
export function useEmail() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  /**
   * On mount: load user's current email and connected providers
   */
  useEffect(() => {
    if (!user) return;

    const currentEmail = user.email ?? "";
    reset({ email: currentEmail });
    setConnectedProviders(user.app_metadata?.providers || []);
    setIsLoading(false);
  }, [user, reset]);

  /**
   * Updates user's email via Supabase.
   * - Only allowed when no social providers are connected
   * - Sends confirmation email to new address
   */
  const updateEmail = async (): Promise<boolean> => {
    if (!user) return false;

    const { email } = getValues();
    const isOnlyEmailProvider =
      connectedProviders.length === 1 && connectedProviders[0] === "email";

    if (!isOnlyEmailProvider) {
      toast.error(
        "You can't change your email while you're signed in with a social provider."
      );
      return false;
    }

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      console.error("Failed to update email:", error);
      toast.error("Failed to update email. Please try again later.");
      return false;
    }

    reset({ email }); // clear dirty state
    toast.success(
      "Confirmation email sent to your new address. Please check your inbox."
    );
    return true;
  };

  return {
    register, // bind input
    handleSubmit, // handle form submission
    updateEmail, // submission logic
    error: errors.email?.message ?? "", // validation error
    isModified: isDirty, // email was changed
    isLoading, // loading state
  };
}
