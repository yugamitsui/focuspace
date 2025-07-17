"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import toast from "react-hot-toast";

/**
 * Custom hook for handling user signup actions.
 *
 * Provides functions to sign up with email/password or with OAuth providers.
 * You can optionally specify a redirect URL on success.
 */
export function useSignUp(options?: { redirect?: string }) {
  const router = useRouter();
  const redirectPath = options?.redirect ?? "/signin";

  /**
   * Sign up a new user using email and password.
   * Shows a toast and redirects on success.
   *
   * @param credentials - Email and password
   */
  const signUpWithEmail = useCallback(
    async (credentials: SignUpWithPasswordCredentials) => {
      const { error } = await supabase.auth.signUp(credentials);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm signup.");
        router.push(redirectPath);
      }
    },
    [router, redirectPath]
  );

  /**
   * Sign up via OAuth provider (e.g., Google, GitHub, Discord).
   *
   * @param provider - The OAuth provider to use
   */
  const signUpWithOAuth = useCallback(
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
    signUpWithEmail,
    signUpWithOAuth,
  };
}
