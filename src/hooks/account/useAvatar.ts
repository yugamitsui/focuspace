import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { supabase } from "@/lib/supabase/client";
import { getAvatarUrl, updateAvatarUrl } from "@/lib/supabase/profiles";
import { getRandomAvatarByUserId } from "@/lib/getRandomAvatarByUserId";

/**
 * Custom hook to manage the user's avatar.
 *
 * Features:
 * - Fetches the avatar URL from the profiles table in Supabase
 * - If no avatar is set, assigns a consistent default avatar based on user ID
 * - Allows users to upload a new avatar:
 *   - Uploads to Supabase Storage
 *   - Updates the avatar URL in the profiles table
 *   - Deletes the previous avatar from storage if applicable
 * - Exposes current avatar URL, loading state, and upload handler
 */
export function useAvatar() {
  const { user } = useCurrentUser();
  const [avatarUrl, setAvatarUrl] = useState("/images/avatars/avatar_01.png");
  const [isLoading, setIsLoading] = useState(true);

  // Load avatar URL on mount or when the user changes
  // If no avatar is stored, assign a default avatar deterministically based on user ID
  useEffect(() => {
    if (!user) return;

    (async () => {
      const url = await getAvatarUrl(user.id);
      const defaultAvatar = getRandomAvatarByUserId(user.id);
      setAvatarUrl(url || defaultAvatar);
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

    const toastId = toast.loading("Uploading your avatar...");

    // Upload new avatar to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar. Please try again later.", {
        id: toastId,
      });
      return;
    }

    // Get the public URL of the uploaded file
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const newUrl = data?.publicUrl;

    if (!newUrl) {
      console.error("Failed to retrieve public URL for uploaded avatar.");
      toast.error("Failed to save avatar. Please try again later.", {
        id: toastId,
      });
      return;
    }

    // Update avatar URL in profiles table
    try {
      await updateAvatarUrl(user.id, newUrl);
      setAvatarUrl(newUrl);
      toast.success("Avatar updated successfully!", { id: toastId });
    } catch (e) {
      console.error("Failed to update avatar URL:", e);
      toast.error("Failed to update avatar. Please try again later.", {
        id: toastId,
      });
      return;
    }

    // Delete previous avatar file if stored in Supabase
    const prefix = "/storage/v1/object/public/avatars/";
    const isSupabaseUrl = previousUrl.includes(prefix);
    const filePath = isSupabaseUrl ? previousUrl.split(prefix)[1] : null;

    if (filePath) {
      try {
        await supabase.storage.from("avatars").remove([filePath]);
      } catch (e) {
        console.error("Failed to delete previous avatar file:", e);
      }
    }
  };

  return {
    avatarUrl,
    isLoading,
    uploadAvatar,
  };
}
