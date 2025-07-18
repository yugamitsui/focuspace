import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

/**
 * useAuthRedirect
 *
 * A hook to protect authenticated routes.
 * It redirects the user to "/signin" if they are confirmed to be signed out.
 *
 * Behavior:
 * - During the loading state (isLoading = true), do nothing.
 * - Once loading completes (isLoading = false):
 *    - If user is null (unauthenticated), redirect to "/signin"
 *    - If user exists, do nothing (stay on page)
 */
export function useAuthRedirect() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);
}
