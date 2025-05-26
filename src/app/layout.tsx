import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lofi Timer",
  description:
    "A minimalist Pomodoro timer with lo-fi vibes to help you focus and relax.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-100 text-base antialiased font-sans tabular-nums bg-[url('/images/background_01.png')] bg-cover">
        <div className="bg-black/40">{children}</div>
      </body>
    </html>
  );
}
