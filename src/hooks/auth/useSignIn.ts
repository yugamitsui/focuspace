"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import toast from "react-hot-toast";

/**
 * Custom hook for handling user signin actions.
 *
 * Provides functions to sign in with email/password or with OAuth providers.
 * You can optionally specify a redirect URL on success.
 */
export function useSignIn(options?: { redirect?: string }) {
  const router = useRouter();
  const redirectPath = options?.redirect ?? "/";

  /**
   * Sign in a user using email and password.
   * Shows a toast and redirects on success.
   *
   * @param credentials - Email and password
   */
  const signInWithEmail = useCallback(
    async (credentials: SignInWithPasswordCredentials) => {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully signed in.");
        router.push(redirectPath);
      }
    },
    [router, redirectPath]
  );

  /**
   * Sign in via OAuth provider (e.g., Google, GitHub, Discord).
   *
   * @param provider - The OAuth provider to use
   */
  const signInWithOAuth = useCallback(
    async (provider: "google" | "github" | "discord", redirectTo?: string) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: redirectTo ? { redirectTo } : undefined,
      });
      if (error) {
        toast.error(error.message);
      }
    },
    []
  );

  return {
    signInWithEmail,
    signInWithOAuth,
  };
}
