/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize
 * @returns A new string with the first character in uppercase
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
