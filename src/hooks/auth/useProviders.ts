import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { SocialProvider } from "@/constants/socialProviders";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { capitalize } from "@/lib/capitalize";

/**
 * useProviders
 *
 * A custom hook to manage the connection state of social auth providers.
 *
 * Responsibilities:
 * - Tracks connected social providers (e.g., Google, GitHub)
 * - Ensures identity email matches when connecting new providers
 * - Provides connect/disconnect functions
 *
 * Design notes:
 * - Uses `user.email` directly for identity matching
 * - Email is not passed from external props to avoid inconsistency
 */
export function useProviders() {
  const { user } = useCurrentUser();
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check for connected providers and identity email match
  useEffect(() => {
    if (!user) return;

    const currentEmail = user.email ?? "";
    let updatedProviders = user.app_metadata?.providers || [];

    // Used to trigger identity verification after redirect
    const shouldCheckIdentity = localStorage.getItem("should_check_identity");

    (async () => {
      if (shouldCheckIdentity) {
        const identities = user.identities;

        if (identities && identities.length > 1) {
          // Check for any mismatched identity email
          const hasMismatch = identities.some(
            (id) => id.identity_data?.email !== currentEmail
          );

          if (hasMismatch) {
            console.error("Identity mismatch detected");
            toast.error(
              "Cannot connect accounts with different email addresses."
            );

            // Attempt to disconenct the mismatched identity
            try {
              const mismatchedIdentity = identities.find(
                (id) => id.identity_data?.email !== currentEmail
              );

              if (mismatchedIdentity) {
                await supabase.auth.unlinkIdentity(mismatchedIdentity);
                const { data: refreshed } = await supabase.auth.getUser();
                updatedProviders =
                  refreshed?.user?.app_metadata?.providers || [];
              }
            } catch (e) {
              console.error("Failed to disconnect mismatched identity:", e);
              toast.error(
                "Failed to disconnect the mismatched account automatically. Please disconnect it manually from the list below."
              );
            }
          } else {
            toast.success("Account connected successfully!");
          }
        }

        // Clean up flag
        localStorage.removeItem("should_check_identity");
      }

      setConnectedProviders(updatedProviders);
      setIsLoading(false);
    })();
  }, [user]);

  /**
   * Connect a new social auth provider (redirect flow)
   */
  const connectProvider = async (provider: SocialProvider) => {
    localStorage.setItem("should_check_identity", "true");
    localStorage.setItem("skip_auth_redirect", "true");

    const origin = window.location.origin;

    try {
      const { error } = await supabase.auth.linkIdentity({
        provider,
        options: { redirectTo: `${origin}/account` },
      });

      if (error) throw error;
    } catch (e) {
      console.error("Failed to connect provider:", e);
      localStorage.removeItem("should_check_identity");
      localStorage.removeItem("skip_auth_redirect");
      toast.error("Failed to connect account. Please try again later.");
    }
  };

  /**
   * Disconnect a connected social provider after confirmation
   */
  const disconnectProvider = async (provider: SocialProvider) => {
    const confirm = window.confirm(`Disconnect from ${capitalize(provider)}?`);
    if (!confirm) return;

    try {
      const { data: identities, error } =
        await supabase.auth.getUserIdentities();
      if (error) throw new Error("Could not fetch connected accounts.");

      const identity = identities?.identities.find(
        (id) => id.provider === provider
      );

      if (!identity) {
        toast.error("No connected account found for this provider.");
        return;
      }

      const { error: disconnectError } = await supabase.auth.unlinkIdentity(
        identity
      );
      if (disconnectError) throw disconnectError;

      toast.success(`${capitalize(provider)} disconnected successfully.`);

      // Refresh provider state
      const { data: refreshed } = await supabase.auth.getUser();
      setConnectedProviders(refreshed?.user?.app_metadata?.providers || []);
    } catch (e) {
      console.error("Failed to disconnect provider:", e);
      toast.error("Failed to disconnect account. Please try again later.");
    }
  };

  return {
    connectedProviders, // Array of connected provider names
    isLoading, // Loading state
    connectProvider, // Connect social provider
    disconnectProvider, // Disconnect social provider
  };
}
