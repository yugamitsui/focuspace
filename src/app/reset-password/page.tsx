"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/schemas/auth";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export default function ResetPasswordPage() {
  const { resetPassword } = useResetPassword();

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

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-white">Reset your password</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div>
            <input
              type="password"
              placeholder="New password"
              {...register("password")}
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
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
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save new password
          </button>
        </form>
      </div>
    </main>
  );
}
