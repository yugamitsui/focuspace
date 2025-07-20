import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { SocialProvider } from "@/constants/socialProviders";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

/**
 * useProviders
 *
 * A custom hook to manage the connection state of social auth providers.
 *
 * Responsibilities:
 * - Tracks connected social providers (e.g., Google, GitHub)
 * - Ensures identity email matches when linking new providers
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
          // Check if any connected identity has a mismatched email
          const hasMismatch = identities.some(
            (id) => id.identity_data?.email !== currentEmail
          );

          if (hasMismatch) {
            toast.error(
              "You can only connect accounts with the same email address."
            );

            // Attempt to unlink the mismatched identity
            const mismatched = identities.find(
              (id) => id.identity_data?.email !== currentEmail
            );

            if (mismatched) {
              await supabase.auth.unlinkIdentity(mismatched);
              const { data: refreshed } = await supabase.auth.getUser();
              updatedProviders = refreshed?.user?.app_metadata?.providers || [];
            }
          } else {
            toast.success("Account connected successfully.");
          }
        }

        // Clear the temporary flag
        localStorage.removeItem("should_check_identity");
      }

      setConnectedProviders(updatedProviders);
      setIsLoading(false);
    })();
  }, [user]);

  /**
   * Connect a new social auth provider
   * - Stores a flag in localStorage to verify identity post-redirect
   */
  const connectProvider = async (provider: SocialProvider) => {
    localStorage.setItem("should_check_identity", "true");
    localStorage.setItem("skip_auth_redirect", "true");

    const origin = window.location.origin;
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${origin}/account` },
    });

    if (error) {
      localStorage.removeItem("should_check_identity");
      localStorage.removeItem("skip_auth_redirect");
      toast.error(error.message);
    }
  };

  /**
   * Disconnect a previously connected social provider
   * - Confirms with the user
   * - Disconnect the provider if it exists
   */
  const disconnectProvider = async (provider: SocialProvider) => {
    const confirm = window.confirm(
      `Disconnect from ${provider.charAt(0).toUpperCase() + provider.slice(1)}?`
    );
    if (!confirm) return;

    const { data: identities, error } = await supabase.auth.getUserIdentities();

    if (error) {
      toast.error("Failed to fetch connected accounts.");
      return;
    }

    const identity = identities?.identities.find(
      (id) => id.provider === provider
    );

    if (!identity) {
      toast.error("No identity found for this provider.");
      return;
    }

    const { error: disconnectError } = await supabase.auth.unlinkIdentity(
      identity
    );

    if (disconnectError) {
      toast.error(disconnectError.message);
      return;
    }

    toast.success(
      `${
        provider.charAt(0).toUpperCase() + provider.slice(1)
      } disconnected successfully.`
    );

    // Refresh connected provider list
    const { data: refreshed } = await supabase.auth.getUser();
    setConnectedProviders(refreshed?.user?.app_metadata?.providers || []);
  };

  return {
    connectedProviders, // e.g. ["google", "github"]
    isLoading, // true while checking connected state
    connectProvider, // function to connect a new provider
    disconnectProvider, // function to disconnect an existing provider
  };
}
