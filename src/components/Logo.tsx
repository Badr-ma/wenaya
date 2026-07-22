/** Logo component — renders the Wenaya logo image with responsive sizing */
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo-full.png"
      alt="Wenaya"
      width={1097}
      height={222}
      className="h-[18px] sm:h-5 md:h-6 w-auto"
      priority
    />
  );
}
