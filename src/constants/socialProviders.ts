/**
 * Supported social authentication providers.
 */
export const SOCIAL_PROVIDERS = ["google", "github", "discord"] as const;

/**
 * SocialProvider type derived from SOCIAL_PROVIDERS.
 * Ensures type safety when referring to a provider.
 */
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];
