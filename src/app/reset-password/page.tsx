"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/schemas/auth";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, canResetPassword } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetPassword(data.password);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!canResetPassword) {
        toast.error(
          "Reset link is invalid or expired. Please request a new one."
        );
        router.push("/");
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [canResetPassword, router]);

  if (!canResetPassword) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-center text-white">Validating reset link...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-white">Reset your password</h1>
          <p className="text-sm">
            Create and confirm a new password to update your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <input
              type="password"
              placeholder="New password"
              {...register("password")}
              className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirm")}
              className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
            />
            {errors.confirm && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirm.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:opacity-90 transition duration-500 cursor-pointer"
          >
            Save new password
          </button>
        </form>

        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm hover:text-white transition duration-500 cursor-pointer"
        >
          <ArrowLeftIcon size={24} />
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
