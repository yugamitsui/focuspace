/**
 * Returns a consistent default avatar path for a given user ID.
 *
 * This function uses a simple hash (sum of character codes in the user ID)
 * to deterministically assign one of a fixed number of default avatar images.
 * The same user ID will always get the same avatar, unless the count changes.
 *
 * @param userId - Unique user identifier (e.g. Supabase UID)
 * @param count - Total number of available default avatar images (e.g. 10)
 * @returns The path to the assigned default avatar image (e.g. /images/avatars/avatar_03.png)
 */
export function getRandomAvatarByUserId(userId: string, count: number = 10) {
  // Create a simple hash by summing the Unicode values of each character in the user ID
  const hash = Array.from(userId).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  );

  // Compute a 1-based index within the range of available avatar images
  const index = (hash % count) + 1;

  // Return the corresponding avatar image path, zero-padded (e.g. avatar_03.png)
  return `/images/avatars/avatar_${String(index).padStart(2, "0")}.png`;
}
