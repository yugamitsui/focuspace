import { z } from "zod";

export const authBaseSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = authBaseSchema.extend({
  password: authBaseSchema.shape.password
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

export type AuthBaseFormData = z.infer<typeof authBaseSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
