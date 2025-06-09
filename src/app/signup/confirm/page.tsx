"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckEmailPage() {
  const search = useSearchParams();
  const email = search.get("email") ?? "your mailbox";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-12 text-center">
      <h1 className="text-3xl font-bold text-white">Check your email!</h1>

      <p className="leading-relaxed max-w-md">
        We&apos;ve sent a confirmation link to{" "}
        <span className="font-semibold">{email}</span>.
        <br />
        Please open it to activate your Focuspace account.
      </p>

      <Link
        href="/signin"
        className="font-medium hover:text-white underline transition duration-500 cursor-pointer"
      >
        Back to sign in
      </Link>
    </main>
  );
}
