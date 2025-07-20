import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

/**
 * useAuthRedirect
 *
 * A hook to protect authenticated routes.
 * It redirects the user to "/signin" if the user is unauthenticated.
 *
 * Behavior:
 * - During loading (isLoading = true), does nothing
 * - Once loading completes:
 *   - If user is null and `skip_auth_redirect` is not set, redirects to "/signin"
 *   - If `skip_auth_redirect` is set (e.g. after connecting identity), skips redirection once
 */
export function useAuthRedirect() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    const shouldSkipRedirect =
      localStorage.getItem("skip_auth_redirect") === "true";

    if (user === null) {
      if (shouldSkipRedirect) {
        // Clear the flag after using it once
        localStorage.removeItem("skip_auth_redirect");
        return;
      }

      router.push("/signin");
    }
  }, [isLoading, user, router]);
}
