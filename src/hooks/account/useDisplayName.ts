import { useState, useEffect } from "react";
import { getDisplayName, updateDisplayName } from "@/lib/supabase/profiles";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import toast from "react-hot-toast";

/**
 * Custom hook to manage the user's display name.
 *
 * This hook:
 * - Fetches the current display name from the `profiles` table
 * - Provides a setter to update the local state
 * - Exposes a `saveDisplayName` function to persist changes to Supabase
 * - Returns loading state for initial data fetch
 */
export function useDisplayName() {
  const { user } = useCurrentUser();
  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const name = await getDisplayName(user.id);
      const safeName = name ?? "";
      setDisplayName(safeName);
      setOriginalName(safeName);
      setIsLoading(false);
    })();
  }, [user]);

  const isModified = displayName !== originalName;

  const saveDisplayName = async () => {
    if (!user) return;

    await updateDisplayName(user.id, displayName);
    setOriginalName(displayName);
    toast.success("Your name has been updated.");
  };

  return {
    displayName,
    setDisplayName,
    isModified,
    saveDisplayName,
    isLoading,
  };
}
