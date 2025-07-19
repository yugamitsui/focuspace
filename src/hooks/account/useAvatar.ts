import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { supabase } from "@/lib/supabase/client";
import { getAvatarUrl, updateAvatarUrl } from "@/lib/supabase/profiles";
import toast from "react-hot-toast";

/**
 * Custom hook to manage the user's avatar URL.
 *
 * Responsibilities:
 * - Fetch the initial avatar URL from the profiles table
 * - Upload a new avatar file to Supabase Storage
 * - Update the avatar URL in the profiles table
 * - Remove the previous avatar file from Storage if applicable
 * - Expose loading state and upload handler
 */
export function useAvatar() {
  const { user } = useCurrentUser();
  const [avatarUrl, setAvatarUrl] = useState("/images/avatars/avatar_01.png");
  const [isLoading, setIsLoading] = useState(true);

  // Load avatar URL on mount or when the user changes
  useEffect(() => {
    if (!user) return;

    (async () => {
      const url = await getAvatarUrl(user.id);
      setAvatarUrl(url || "/images/avatars/avatar_01.png");
      setIsLoading(false);
    })();
  }, [user]);

  /**
   * Uploads a new avatar file to Supabase Storage,
   * updates the avatar URL in the profiles table,
   * and deletes the old file from Storage if needed.
   *
   * @param file - The new avatar file to upload
   */
  const uploadAvatar = async (file: File) => {
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const previousUrl = avatarUrl;

    const toastId = toast.loading("Uploading avatar...");

    // Upload new avatar to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed", { id: toastId });
      return;
    }

    // Get the public URL of the uploaded file
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const newUrl = data?.publicUrl;

    if (!newUrl) {
      toast.error("Failed to retrieve avatar URL", { id: toastId });
      return;
    }

    // Update avatar URL in profiles table
    await updateAvatarUrl(user.id, newUrl);
    setAvatarUrl(newUrl);

    // Delete the previous avatar if it was stored in Supabase
    const prefix = "/storage/v1/object/public/avatars/";
    if (previousUrl.includes(prefix)) {
      const filePath = previousUrl.split(prefix)[1];
      if (filePath) {
        await supabase.storage.from("avatars").remove([filePath]);
      }
    }

    toast.success("Avatar updated!", { id: toastId });
  };

  return {
    avatarUrl,
    isLoading,
    uploadAvatar,
  };
}
