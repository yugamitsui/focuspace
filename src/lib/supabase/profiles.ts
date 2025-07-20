import { supabase } from "./client";

/* -------------------------------------------------------------------------- */
/*                                Display Name                                */
/* -------------------------------------------------------------------------- */

/**
 * Get the user's display name from the "profiles" table.
 * @param userId - Supabase Auth user ID
 * @returns The user's display name or null if not found
 */
export const getDisplayName = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.display_name ?? null;
};

/**
 * Update the user's display name in the "profiles" table.
 * @param userId - Supabase Auth user ID
 * @param displayName - New display name to be set
 */
export const updateDisplayName = async (
  userId: string,
  displayName: string
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", userId);

  if (error) throw new Error(error.message);
};

/* -------------------------------------------------------------------------- */
/*                                Avatar URL                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get the user's avatar URL from the "profiles" table.
 * @param userId - Supabase Auth user ID
 * @returns The avatar URL or null if not found
 */
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.avatar_url ?? null;
};

/**
 * Update the user's avatar URL in the "profiles" table.
 * @param userId - Supabase Auth user ID
 * @param avatarUrl - New avatar URL to be set
 */
export const updateAvatarUrl = async (
  userId: string,
  avatarUrl: string
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) throw new Error(error.message);
};
