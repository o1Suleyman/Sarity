import Image from "next/image";
import light from "../public/daylylight.svg";
import dark from "../public/daylydark.png";

export default function Logo() {
  return (
    <>
      <Image
        src={light}
        alt="Logo"
        className="dark:hidden"
        fetchPriority="high"
      />
      <Image
        src={dark}
        alt="Logo"
        className="hidden dark:block"
        fetchPriority="high"
      />
    </>
  );
}
