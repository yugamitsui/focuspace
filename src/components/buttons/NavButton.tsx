import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

type Props = {
  direction: "left" | "right";
  onClick: () => void;
};

export default function NavButton({ direction, onClick }: Props) {
  const isLeft = direction === "left";

  return (
    <div
      className={`absolute ${
        isLeft ? "left-0" : "right-0"
      } top-0 bottom-0 flex items-center group p-16 z-20`}
    >
      <button
        onClick={onClick}
        className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer"
      >
        {isLeft ? <CaretLeftIcon size={32} /> : <CaretRightIcon size={32} />}
      </button>
    </div>
  );
}
