"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import {
  GoogleLogoIcon,
  GithubLogoIcon,
  DiscordLogoIcon,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain a lowercase letter (a-z)",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain an uppercase letter (A-Z)",
      })
      .regex(/[0-9]/, { message: "Password must contain a number (0-9)" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain a symbol (e.g. !@#$%)",
      }),
  })
  .required();

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = async (data: SignupFormData) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm signup.");
      router.push("/signin");
    }
  };

  const handleOAuthSignup = async (
    provider: "google" | "github" | "discord"
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) toast.error(error.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Get started with Focuspace
          </h1>
          <p className="text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSignup)}
          noValidate
          className="space-y-4 text-left"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:opacity-90 transition duration-500 cursor-pointer"
          >
            Sign up
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-white/75" />
          <span className="text-sm">or</span>
          <div className="flex-1 border-t border-white/75" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthSignup("google")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <GoogleLogoIcon size={24} />
            <span className="font-semibold">Sign up with Google</span>
          </button>
          <button
            onClick={() => handleOAuthSignup("github")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <GithubLogoIcon size={24} />
            <span className="font-semibold">Sign up with GitHub</span>
          </button>
          <button
            onClick={() => handleOAuthSignup("discord")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <DiscordLogoIcon size={24} />
            <span className="font-semibold">Sign up with Discord</span>
          </button>
        </div>
      </div>
    </main>
  );
}
