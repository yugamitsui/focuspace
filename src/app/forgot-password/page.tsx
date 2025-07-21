"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, EmailFormData } from "@/schemas/auth";
import { usePasswordResetEmail } from "@/hooks/auth/usePasswordResetEmail";

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = usePasswordResetEmail();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    await sendPasswordResetEmail(data.email);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-white">
            Forgot your password?
          </h1>
          <p className="text-sm">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:opacity-90 transition duration-500 cursor-pointer"
          >
            Send email
          </button>
        </form>

        <Link
          href={"/signin"}
          className="inline-flex items-center gap-2 text-sm hover:text-white transition duration-500 cursor-pointer"
        >
          <ArrowLeftIcon size={24} />
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
