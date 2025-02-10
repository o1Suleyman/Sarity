"use client";
import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

export default function InteractiveHoverLink({isLoggedIn}: {isLoggedIn: boolean}) {
    const router = useRouter();
    return (
        <InteractiveHoverButton onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth")}>{isLoggedIn ? "Dashboard" : "Get Started"}</InteractiveHoverButton>
    )
}