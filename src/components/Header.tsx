"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { GearIcon, SignOutIcon } from "@phosphor-icons/react";
import Logo from "@/assets/logo.svg";
import { useCurrentSession } from "@/hooks/auth/useCurrentSession";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useAvatar } from "@/hooks/account/useAvatar";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { session, isLoading: isSessionLoading } = useCurrentSession();
  const { signOut } = useSignOut();
  const { avatarUrl } = useAvatar();

  const inAuthPages =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full flex items-start justify-between px-6 py-4">
      {pathname === "/" ? (
        <button className="cursor-default" aria-label="Focuspace logo" disabled>
          <Logo className="w-auto h-8 fill-white" />
        </button>
      ) : (
        <Link href="/" className="cursor-pointer" aria-label="Go to Home">
          <Logo className="w-auto h-8 fill-white" />
        </Link>
      )}

      {!inAuthPages &&
        !isSessionLoading &&
        (session ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="block cursor-pointer focus:outline-none"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black/50 animate-pulse" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-black/50 rounded p-2 min-w-48 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/account");
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded text-sm text-white hover:bg-black transition duration-500 cursor-pointer"
                >
                  <GearIcon size={20} weight="light" />
                  <span>Account settings</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded text-sm text-red-500 hover:bg-black transition duration-500 cursor-pointer"
                >
                  <SignOutIcon size={20} weight="light" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-2 font-medium bg-black/50 hover:text-white hover:bg-black rounded-full transition duration-500 cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-2 font-medium bg-black/50 hover:text-white hover:bg-black rounded-full transition duration-500 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        ))}
    </header>
  );
}
