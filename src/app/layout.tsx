import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Focuspace",
  description: "A minimal Pomodoro timer for focused work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white/75 bg-black text-base antialiased font-sans tabular-nums">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
