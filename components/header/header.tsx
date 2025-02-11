import Logo from "../logo";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
// import AuthHeader from "./auth-header";
// import { Suspense } from "react";
// import { Skeleton } from "../ui/skeleton";

export default async function Header() {
  return (
    <header className="w-full border-b p-1 px-1.5">
      <div className="max-w-5xl flex justify-between items-center mx-auto">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          {/* <Suspense fallback={<Skeleton className="w-[101px]" />}>
            <AuthHeader />
          </Suspense> */}
        </div>
      </div>
    </header>
  );
}
