"use client";

import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import {
  SignOutIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { SOCIAL_PROVIDERS } from "@/constants/socialProviders";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useAvatar } from "@/hooks/account/useAvatar";
import { useDisplayName } from "@/hooks/account/useDisplayName";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { useEmail } from "@/hooks/auth/useEmail";
import { usePasswordResetEmail } from "@/hooks/auth/usePasswordResetEmail";
import { useProviders } from "@/hooks/auth/useProviders";
import { useDeleteAccount } from "@/hooks/auth/useDeleteAccount";

export default function AccountPage() {
  useAuthRedirect();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { avatarUrl, isLoading: isAvatarLoading, uploadAvatar } = useAvatar();

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    await uploadAvatar(file);
    e.target.value = "";
  };

  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    saveDisplayName,
    error: displayNameError,
    isModified: isDisplayNameModified,
    isLoading: isDisplayNameLoading,
  } = useDisplayName();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    updateEmail,
    error: emailError,
    isModified: isEmailModified,
    isLoading: isEmailLoading,
  } = useEmail();

  const { sendPasswordResetEmail } = usePasswordResetEmail();

  const {
    connectedProviders,
    isLoading: isProviderLoading,
    connectProvider,
    disconnectProvider,
  } = useProviders();

  const { signOut } = useSignOut();
  const { deleteAccount } = useDeleteAccount();

  const isLoading =
    isAvatarLoading ||
    isDisplayNameLoading ||
    isEmailLoading ||
    isProviderLoading;

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-center text-white">Loading…</p>
      </main>
    );
  }

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
          <div>
            <div className="flex gap-3 w-full">
              <input
                {...registerName("name")}
                placeholder="Name"
                className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
              />
              <button
                disabled={!isDisplayNameModified}
                onClick={handleNameSubmit(saveDisplayName)}
                className="text-sm bg-blue-600 text-white px-5 py-3 rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
            {displayNameError && (
              <p className="text-red-500 text-sm mt-2">{displayNameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex gap-3 w-full">
              <input
                {...registerEmail("email")}
                placeholder="Email"
                type="email"
                className="w-full rounded bg-white/10 px-5 py-3 focus:outline-none focus:ring-1 focus:ring-white/75"
              />
              <button
                disabled={!isEmailModified}
                onClick={handleEmailSubmit(updateEmail)}
                className="text-sm bg-blue-600 text-white px-5 py-3 rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
          </div>
        </div>

        {/* Password reset */}
        <button
          onClick={() => sendPasswordResetEmail()}
          className="self-start text-sm text-blue-500 cursor-pointer hover:underline"
        >
          Send password-reset email
        </button>

        {/* Social provider connections */}
        <div className="text-white space-y-2">
          <p className="font-semibold">Social Connections</p>
          {SOCIAL_PROVIDERS.map((provider) => (
            <div key={provider} className="flex justify-between items-center">
              <span className="capitalize">{provider}</span>
              {connectedProviders.includes(provider) ? (
                <button
                  onClick={() => disconnectProvider(provider)}
                  className="text-sm text-green-500 cursor-pointer hover:underline"
                >
                  Connected
                </button>
              ) : (
                <button
                  onClick={() => connectProvider(provider)}
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
            onClick={deleteAccount}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrashIcon size={24} /> Delete account
          </button>
        </div>
      </div>
    </main>
  );
}
