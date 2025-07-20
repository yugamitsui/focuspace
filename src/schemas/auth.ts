import { z } from "zod";

/**
 * Schema for validating display name.
 * - Max 30 characters.
 */
export const displayNameSchema = z.object({
  name: z.string().max(30, { message: "Name must be at most 30 characters" }),
});

/**
 * Schema for validating email address.
 * - Required
 * - Must be a valid email format
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

/**
 * Base password schema used for sign-in.
 * - Password is required, but no strength checks
 */
const basePasswordSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

/**
 * Extended password schema used for sign-up and reset.
 * - Includes strength requirements (length, uppercase, lowercase, number, symbol)
 */
const extendedPasswordSchema = z.object({
  password: basePasswordSchema.shape.password
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain a lowercase letter (a-z)",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain an uppercase letter (A-Z)",
    })
    .regex(/[0-9]/, {
      message: "Password must contain a number (0-9)",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain a symbol (e.g. !@#$%)",
    }),
});

/**
 * Schema for sign-in form validation.
 */
export const signInSchema = z.object({
  email: emailSchema.shape.email,
  password: basePasswordSchema.shape.password,
});

/**
 * Schema for sign-up form validation.
 */
export const signUpSchema = z.object({
  email: emailSchema.shape.email,
  password: extendedPasswordSchema.shape.password,
});

/**
 * Schema for reset-password form validation.
 * - Includes password confirmation check
 */
export const resetPasswordSchema = z
  .object({
    password: extendedPasswordSchema.shape.password,
    confirm: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

// Types inferred from schemas
export type DisplayNameFormData = z.infer<typeof displayNameSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
