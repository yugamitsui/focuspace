"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

type SocialProvider = "google" | "github" | "discord";

/**
 * useProviders
 *
 * Manages connecting and disconnecting social authentication providers (Google, GitHub, Discord).
 *
 * Responsibilities:
 * - Tracks which providers are currently connected to the authenticated user
 * - Verifies email consistency between primary and newly connected identities
 * - Provides connect/disconnect functions for use in UI
 *
 * This hook is meant to be used in account settings pages where users manage their connected accounts.
 */
export function useProviders(email: string) {
  const { user } = useCurrentUser();
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let updatedProviders = user.app_metadata?.providers || [];

    // Flag used to trigger email identity validation after connecting a new provider
    const shouldCheckIdentity = localStorage.getItem("should_check_identity");

    (async () => {
      if (shouldCheckIdentity) {
        const identities = user.identities;

        // If multiple identities exist, check if any of them use a different email
        if (identities && identities.length > 1) {
          const hasMismatch = identities.some(
            (id) => id.identity_data?.email !== email
          );

          if (hasMismatch) {
            toast.error(
              "You can only connect accounts with the same email address."
            );

            // Find and disconnect the mismatched identity
            const mismatched = identities.find(
              (id) => id.identity_data?.email !== email
            );

            if (mismatched) {
              await supabase.auth.unlinkIdentity(mismatched);

              // Refresh user state and provider list
              const { data: refreshed } = await supabase.auth.getUser();
              updatedProviders = refreshed?.user?.app_metadata?.providers || [];
            }
          } else {
            toast.success("Account connected successfully.");
          }
        }

        // Clear the flag regardless of outcome
        localStorage.removeItem("should_check_identity");
      }

      setConnectedProviders(updatedProviders);
      setIsLoading(false);
    })();
  }, [user, email]);

  /**
   * Starts the process of connecting a new social provider.
   * A flag is set in localStorage to validate identities after redirect.
   */
  const connectProvider = async (provider: SocialProvider) => {
    localStorage.setItem("should_check_identity", "true");
    localStorage.setItem("skip_auth_redirect", "true"); // Prevents unintended redirect during session reset

    const origin = window.location.origin;
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${origin}/account` },
    });

    if (error) {
      // If an error occurs, clean up flags immediately
      localStorage.removeItem("should_check_identity");
      localStorage.removeItem("skip_auth_redirect");
      toast.error(error.message);
    }
  };

  /**
   * Disconnects a previously connected social provider.
   * Prompts for confirmation before proceeding.
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

    // Refresh the list of connected providers
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
