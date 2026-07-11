import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-12 max-w-[8rem]">
      <Image
        src="/logo.webp"
        fill
        className="object-contain"
        alt="Ourth logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
