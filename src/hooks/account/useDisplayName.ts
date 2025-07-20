import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { displayNameSchema, DisplayNameFormData } from "@/schemas/auth";
import { getDisplayName, updateDisplayName } from "@/lib/supabase/profiles";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import toast from "react-hot-toast";

/**
 * useDisplayName
 *
 * A custom hook that manages the user's display name form using react-hook-form and Zod.
 *
 * Features:
 * - Loads the current display name from Supabase
 * - Initializes react-hook-form with Zod schema
 * - Tracks modification via isDirty
 * - Submits and saves the new name to Supabase
 * - Provides validation error, loading state, and error handling
 */
export function useDisplayName() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<DisplayNameFormData>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { name: "" },
  });

  /**
   * Load the current display name from Supabase and populate the form.
   */
  useEffect(() => {
    if (!user) return;

    (async () => {
      const name = await getDisplayName(user.id);
      reset({ name: name ?? "" });
      setIsLoading(false);
    })();
  }, [user, reset]);

  /**
   * Save the updated display name to Supabase with error handling.
   */
  const saveDisplayName = async (): Promise<boolean> => {
    if (!user) return false;

    const { name } = getValues();

    try {
      await updateDisplayName(user.id, name);
      reset({ name }); // Reset dirty state
      toast.success("Your name has been updated.");
      return true;
    } catch {
      toast.error("Failed to update name.");
      return false;
    }
  };

  return {
    register, // bind input
    handleSubmit, // handle form submission
    saveDisplayName, // trigger save logic
    error: errors.name?.message ?? "", // validation error message
    isModified: isDirty, // true if input is dirty
    isLoading, // true while loading initial data
  };
}
