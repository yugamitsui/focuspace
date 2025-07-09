"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function PasswordResetPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const disabled = password.length < 8 || password !== confirm || submitting;

  const handleSave = async () => {
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Your password has been reset. Please sign in again.");

    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/signin");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-white">Reset your password</h1>
        <p className="text-white/80 text-sm">
          Enter a new password below. It must be at least 8 characters long.
        </p>

        <input
          type="password"
          placeholder="New password"
          className="w-full rounded bg-white/10 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full rounded bg-white/10 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={disabled}
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded disabled:opacity-50"
        >
          Save new password
        </button>
      </div>
    </main>
  );
}
