"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const avatars = [
  "/images/avatar_01.png",
  "/images/avatar_02.png",
  "/images/avatar_03.png",
  "/images/avatar_04.png",
  "/images/avatar_05.png",
  "/images/avatar_06.png",
];

export default function AvatarSelector() {
  const [index, setIndex] = useState(0);

  const prevAvatar = () => {
    setIndex((prev) => (prev - 1 + avatars.length) % avatars.length);
  };

  const nextAvatar = () => {
    setIndex((prev) => (prev + 1) % avatars.length);
  };

  return (
    <div className="group flex items-center gap-4">
      <button
        onClick={prevAvatar}
        className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition duration-500"
      >
        <CaretLeftIcon size={32} weight="bold" />
      </button>

      <Image
        src={avatars[index]}
        alt={`avatar-${index}`}
        width={256}
        height={384}
        className="rounded-full"
      />

      <button
        onClick={nextAvatar}
        className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition duration-500"
      >
        <CaretRightIcon size={32} weight="bold" />
      </button>
    </div>
  );
}
