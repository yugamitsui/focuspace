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
import { supabase } from "@/lib/supabaseClient";

type SocialProvider = "google" | "github" | "discord";
const SOCIAL_PROVIDERS: SocialProvider[] = ["google", "github", "discord"];

interface Profile {
  name: string;
  email: string;
  avatar_url: string;
  provider: string;
}

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/signin");
        return;
      }

      const currentEmail = user.email ?? "";
      let updatedProviders = user.app_metadata?.providers || [];

      const shouldCheckIdentity = localStorage.getItem("should_check_identity");

      if (shouldCheckIdentity) {
        const identities = user.identities;

        if (identities && identities.length > 1) {
          const mismatch = identities.some(
            (id) => id.identity_data?.email !== currentEmail
          );

          if (mismatch) {
            toast.error(
              "You can only connect accounts with the same email address."
            );

            const wrongIdentity = identities.find(
              (id) => id.identity_data?.email !== currentEmail
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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Failed to load profile:", profileError.message);
        return;
      }

      const loadedProfile = {
        name: profileData?.name ?? "",
        email: currentEmail,
        avatar_url: profileData?.avatar_url ?? "",
        provider: user.app_metadata?.provider ?? "email",
      };

      setProfile(loadedProfile);
      setOriginalProfile(loadedProfile);
      setLinkedProviders(updatedProviders);
      setLoading(false);
    })();
  }, [router]);

  const updateField = (key: keyof Profile, val: string) => {
    setProfile((prev) => (prev ? { ...prev, [key]: val } : prev));
  };

  const isModified = (key: keyof Profile) => {
    if (!profile || !originalProfile) return false;
    return profile[key] !== originalProfile[key];
  };

  const updateAvatar = async (newUrl: string, previousUrl: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("id", user.id);

    if (error) return console.error(error.message);

    setOriginalProfile((prev) =>
      prev ? { ...prev, avatar_url: newUrl } : prev
    );

    if (previousUrl.includes("/storage/v1/object/public/avatars/")) {
      const filePath = previousUrl.split("/avatars/")[1];
      if (filePath) {
        await supabase.storage.from("avatars").remove([filePath]);
      }
    }
  };

  const updateName = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name: profile.name })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Your name has been updated.");
    setOriginalProfile((prev) =>
      prev ? { ...prev, name: profile.name } : prev
    );
  };

  const updateEmail = async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user || !profile) return;

    if (!(linkedProviders.length === 1 && linkedProviders[0] === "email")) {
      toast.error(
        "You can't change your email while a social provider is connected."
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: profile.email,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Confirmation email sent! Please check your inbox.");

    setOriginalProfile((prev) =>
      prev ? { ...prev, email: profile.email } : prev
    );
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !profile) return;
    const file = e.target.files[0];
    const fileName = `avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const previousAvatarUrl = profile.avatar_url || "";

    const toastId = toast.loading("Uploading avatar...");

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      toast.error("Upload failed.", { id: toastId });
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      updateField("avatar_url", data.publicUrl);
      await updateAvatar(data.publicUrl, previousAvatarUrl);
      toast.success("Avatar updated!", { id: toastId });
    }

    e.target.value = "";
  };

  const handlePasswordReset = async () => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(
      profile!.email,
      {
        redirectTo: `${origin}/reset-password`,
      }
    );
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async () => {
    const confirmed = confirm("Delete account permanently?");
    if (!confirmed) return;

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const session = sessionData.session;

    if (sessionError || !session) {
      toast.error("Failed to retrieve session.");
      return;
    }

    const userId = session.user.id;

    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: JSON.stringify({ user_id: userId }),
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

  if (loading || !profile)
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
          <div className="relative w-24 h-24">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="avatar"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-5xl">
                {(profile.name || profile.email).charAt(0).toUpperCase()}
              </div>
            )}
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
          {/* Name */}
          <div className="flex gap-3 w-full">
            <input
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Name"
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
            />
            <button
              disabled={!isModified("name")}
              onClick={updateName}
              className="text-sm bg-blue-600 text-white px-5 py-3 rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-600 disabled:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>

          {/* Email */}
          <div className="flex gap-3 w-full">
            <input
              value={profile.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
            />
            <button
              disabled={!isModified("email")}
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
            onClick={handleLogout}
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
