import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useNavigationGuard(
  shouldGuard: boolean,
  customMessage?: string
) {
  const router = useRouter();
  const originalPush = useRef(router.push);

  const message =
    customMessage ??
    "You might lose progress. Are you sure you want to leave this page?";

  useEffect(() => {
    const savedPush = originalPush.current;

    router.push = async (url, options) => {
      if (shouldGuard && !confirm(message)) {
        return;
      }
      return savedPush(url, options);
    };

    return () => {
      router.push = savedPush;
    };
  }, [shouldGuard, message, router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldGuard) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldGuard]);
}
