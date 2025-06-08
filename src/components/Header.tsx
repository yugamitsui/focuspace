"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo.svg";

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 z-50 w-full flex justify-between px-6 py-4">
      <Link href="/" className="cursor-pointer">
        <Logo className="w-48 h-auto fill-white" />
      </Link>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/signin")}
          className="px-6 py-2 font-medium bg-black/50 hover:text-white hover:bg-black rounded-full hover:opacity-90 transition duration-500 cursor-pointer"
        >
          Sign in
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-2 font-medium bg-black/50 hover:text-white hover:bg-black rounded-full hover:opacity-90 transition duration-500 cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </header>
  );
}
