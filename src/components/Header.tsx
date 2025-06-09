"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const inAuthPages =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  const { isLoggedIn, user, avatarError, setAvatarError, logout } = useAuth();

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
    <header className="fixed top-0 z-50 w-full flex justify-between px-6 py-4">
      <Link href="/" className="cursor-pointer">
        <Logo className="w-auto h-8 fill-white" />
      </Link>

      {!inAuthPages &&
        (isLoggedIn && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer focus:outline-none"
            >
              {!avatarError && user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-black/50 rounded py-2 min-w-36 z-50">
                <button className="w-full text-left px-6 py-2 text-sm text-white hover:bg-black transition duration-500 cursor-pointer">
                  {user.name}
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-6 py-2 text-sm text-red-500 hover:bg-black transition duration-500 cursor-pointer"
                >
                  Log out
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
