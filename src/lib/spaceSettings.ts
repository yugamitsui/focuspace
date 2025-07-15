import { supabase } from "./supabaseClient";

export const updateBackgroundMusic = async (
  userId: string,
  musicId: string
) => {
  const { error } = await supabase
    .from("space_settings")
    .update({ background_music_id: musicId })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getBackgroundMusic = async (userId: string) => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("background_music_id")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.background_music_id as string | null;
};

export const updateBackgroundImage = async (
  userId: string,
  imageUrl: string
) => {
  const { error } = await supabase
    .from("space_settings")
    .update({ background_image_url: imageUrl })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getBackgroundImage = async (userId: string) => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("background_image_url")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.background_image_url ?? null;
};

export const updateVisualEffect = async (userId: string, effectId: string) => {
  const { error } = await supabase
    .from("space_settings")
    .update({ visual_effect_id: effectId })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getVisualEffect = async (userId: string) => {
  const { data, error } = await supabase
    .from("space_settings")
    .select("visual_effect_id")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.visual_effect_id ?? null;
};
