import { supabase } from "./client";

/* -------------------------------------------------------------------------- */
/*                            Timer Duration ID                               */
/* -------------------------------------------------------------------------- */

/**
 * Get the timer duration ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @returns The timer duration ID or null if not found
 */
export const getTimerDurationId = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("timer_duration_id")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.timer_duration_id ?? null;
};

/**
 * Update the timer duration ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @param durationId - New timer duration ID
 */
export const updateTimerDurationId = async (
  userId: string,
  durationId: string
): Promise<void> => {
  const { error } = await supabase
    .from("space_settings")
    .update({ timer_duration_id: durationId })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

/* -------------------------------------------------------------------------- */
/*                         Background Music ID                                */
/* -------------------------------------------------------------------------- */

/**
 * Get the background music ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @returns The background music ID or null if not found
 */
export const getBackgroundMusicId = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("background_music_id")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.background_music_id ?? null;
};

/**
 * Update the background music ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @param musicId - New background music ID
 */
export const updateBackgroundMusicId = async (
  userId: string,
  musicId: string
): Promise<void> => {
  const { error } = await supabase
    .from("space_settings")
    .update({ background_music_id: musicId })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

/* -------------------------------------------------------------------------- */
/*                         Background Image URL                               */
/* -------------------------------------------------------------------------- */

/**
 * Get the background image URL setting for a given user.
 * @param userId - Supabase Auth user ID
 * @returns The image URL or null if not found
 */
export const getBackgroundImageUrl = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("background_image_url")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.background_image_url ?? null;
};

/**
 * Update the background image URL for a given user.
 * @param userId - Supabase Auth user ID
 * @param imageUrl - New background image URL
 */
export const updateBackgroundImageUrl = async (
  userId: string,
  imageUrl: string
): Promise<void> => {
  const { error } = await supabase
    .from("space_settings")
    .update({ background_image_url: imageUrl })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

/* -------------------------------------------------------------------------- */
/*                            Visual Effect ID                                */
/* -------------------------------------------------------------------------- */

/**
 * Get the visual effect ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @returns The visual effect ID or null if not found
 */
export const getVisualEffectId = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("visual_effect_id")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data?.visual_effect_id ?? null;
};

/**
 * Update the visual effect ID setting for a given user.
 * @param userId - Supabase Auth user ID
 * @param effectId - New visual effect ID
 */
export const updateVisualEffectId = async (
  userId: string,
  effectId: string
): Promise<void> => {
  const { error } = await supabase
    .from("space_settings")
    .update({ visual_effect_id: effectId })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};
