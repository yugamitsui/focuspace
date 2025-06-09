"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  DiscordLogoIcon,
  GithubLogoIcon,
  GoogleLogoIcon,
} from "@phosphor-icons/react";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
  };

  const handleOAuthSignin = async (
    provider: "google" | "github" | "discord"
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert(error.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Welcome back to Focuspace
          </h1>
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 border text-white placeholder:text-white/50 border-white/75 rounded-full focus:outline-none focus:border-white transition duration-500"
          />
          <button
            onClick={handleSignin}
            className="w-full px-6 py-3 bg-white text-black rounded-full font-semibold hover:opacity-90 transition duration-500 cursor-pointer"
          >
            Sign in
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-white/75" />
          <span className="text-sm">or</span>
          <div className="flex-1 border-t border-white/75" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthSignin("google")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <GoogleLogoIcon size={24} />
            <span className="font-semibold">Sign in with Google</span>
          </button>
          <button
            onClick={() => handleOAuthSignin("github")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <GithubLogoIcon size={24} />
            <span className="font-semibold">Sign in with GitHub</span>
          </button>
          <button
            onClick={() => handleOAuthSignin("discord")}
            className="w-full px-6 py-3 flex items-center justify-center gap-2 border border-white/75 rounded-full hover:bg-white hover:text-black transition duration-500 cursor-pointer"
          >
            <DiscordLogoIcon size={24} />
            <span className="font-semibold">Sign in with Discord</span>
          </button>
        </div>
      </div>
    </main>
  );
}
