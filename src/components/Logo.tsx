import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo-full.png"
      alt="Wenaya"
      width={500}
      height={100}
      className="h-[90px] sm:h-[100px] w-auto object-cover"
      priority
    />
  );
}
