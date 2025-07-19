"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  SignOutIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { supabase } from "@/lib/supabase/client";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { useDisplayName } from "@/hooks/account/useDisplayName";
import { useEmail } from "@/hooks/account/useEmail";
import { useAvatar } from "@/hooks/account/useAvatar";

type SocialProvider = "google" | "github" | "discord";
const SOCIAL_PROVIDERS: SocialProvider[] = ["google", "github", "discord"];

export default function AccountPage() {
  useAuthRedirect();

  const router = useRouter();
  const { user } = useCurrentUser();
  const { signOut } = useSignOut();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    displayName,
    setDisplayName,
    isModified: isNameModified,
    saveDisplayName,
    isLoading: isNameLoading,
  } = useDisplayName();

  const {
    email,
    setEmail,
    isModified: isEmailModified,
    updateEmail,
    isLoading: isEmailLoading,
  } = useEmail();

  const { avatarUrl, isLoading: isAvatarLoading, uploadAvatar } = useAvatar();

  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (user === null) return;

      let updatedProviders = user.app_metadata?.providers || [];
      const shouldCheckIdentity = localStorage.getItem("should_check_identity");

      if (shouldCheckIdentity) {
        const identities = user.identities;

        if (identities && identities.length > 1) {
          const mismatch = identities.some(
            (id) => id.identity_data?.email !== email
          );

          if (mismatch) {
            toast.error(
              "You can only connect accounts with the same email address."
            );

            const wrongIdentity = identities.find(
              (id) => id.identity_data?.email !== email
            );

            if (wrongIdentity) {
              await supabase.auth.unlinkIdentity(wrongIdentity);

              const { data: refreshedUser } = await supabase.auth.getUser();
              updatedProviders =
                refreshedUser?.user?.app_metadata?.providers || [];
            }
          } else {
            toast.success("Account connected successfully.");
          }
        }

        localStorage.removeItem("should_check_identity");
      }

      setLinkedProviders(updatedProviders);
      setLoading(false);
    })();
  }, [router, user, email]);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    await uploadAvatar(file);
    e.target.value = "";
  };

  const handlePasswordReset = async () => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent.");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Delete account permanently?");
    if (!confirmed || !user) return;

    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: JSON.stringify({ user_id: user.id }),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account deleted.");
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error("Unexpected error:", e);
      toast.error("Unexpected error occurred.");
    }
  };

  const handleProviderLink = async (provider: SocialProvider) => {
    localStorage.setItem("should_check_identity", "true");

    const origin = window.location.origin;
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${origin}/account` },
    });

    if (error) {
      localStorage.removeItem("should_check_identity");
      toast.error(error.message);
    }
  };

  const handleProviderUnlink = async (provider: SocialProvider) => {
    const confirmed = window.confirm(
      `Disconnect from ${provider.charAt(0).toUpperCase() + provider.slice(1)}?`
    );
    if (!confirmed) return;

    const { data: identitiesData, error: identitiesError } =
      await supabase.auth.getUserIdentities();

    if (identitiesError) {
      toast.error("Failed to fetch identities.");
      return;
    }

    const identity = identitiesData?.identities.find(
      (id) => id.provider === provider
    );

    if (!identity) {
      toast.error("No identity found for provider.");
      return;
    }

    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      `${
        provider.charAt(0).toUpperCase() + provider.slice(1)
      } disconnected successfully.`
    );

    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      setLinkedProviders(userData.user.app_metadata.providers || []);
    }
  };

  if (loading || isNameLoading || isAvatarLoading || isEmailLoading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-center text-white">Loading…</p>
      </main>
    );

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white">Account settings</h1>

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full cursor-pointer"
            >
              <UploadSimpleIcon size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Display Name */}
          <div className="flex gap-3 w-full">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Name"
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
            />
            <button
              disabled={!isNameModified}
              onClick={saveDisplayName}
              className="text-sm bg-blue-600 text-white px-5 py-3 rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-600 disabled:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>

          {/* Email */}
          <div className="flex gap-3 w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
            />
            <button
              disabled={!isEmailModified}
              onClick={updateEmail}
              className="text-sm bg-blue-600 text-white px-5 py-3 rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-600 disabled:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        {/* Password reset */}
        <button
          onClick={handlePasswordReset}
          className="self-start text-sm text-blue-500 cursor-pointer hover:underline"
        >
          Send password-reset email
        </button>

        {/* Social provider links */}
        <div className="text-white space-y-2">
          <p className="font-semibold">Social Connections</p>
          {SOCIAL_PROVIDERS.map((provider) => (
            <div key={provider} className="flex justify-between items-center">
              <span className="capitalize">{provider}</span>
              {linkedProviders.includes(provider) ? (
                <button
                  onClick={() => handleProviderUnlink(provider)}
                  className="text-sm text-green-500 cursor-pointer hover:underline"
                >
                  Connected
                </button>
              ) : (
                <button
                  onClick={() => handleProviderLink(provider)}
                  className="text-sm text-blue-500 cursor-pointer hover:underline"
                >
                  Disconnected
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="space-y-4">
          <button
            onClick={signOut}
            className="w-full bg-white/10 hover:bg-white/8 py-3 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <SignOutIcon size={24} /> Sign out
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrashIcon size={24} /> Delete account
          </button>
        </div>
      </div>
    </main>
  );
}
