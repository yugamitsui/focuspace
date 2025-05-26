import Timer from "@/components/Timer";
import AvatarSelector from "@/components/AvatarSelector";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-16 min-h-screen">
      <Timer />
      <AvatarSelector />
    </main>
  );
}
