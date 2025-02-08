import Image from "next/image";
import light from "../public/light.svg";
import dark from "../public/dark.svg";

export default function Logo() {
    return (
        <>
            <Image src={light} alt="Logo" className="dark:hidden"/>
            <Image src={dark} alt="Logo" className="hidden dark:block"/>
        </>
    )
}