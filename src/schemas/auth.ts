import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = signinSchema.extend({
  password: signinSchema.shape.password
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

export const resetPasswordSchema = z
  .object({
    password: signupSchema.shape.password,
    confirm: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export type SigninFormData = z.infer<typeof signinSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
