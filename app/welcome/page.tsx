import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      <h1 className="mt-16 scroll-m-20 text-xl font-semibold tracking-tight">
        Almost there! Please click the link in your email:
      </h1>
      <Button asChild>
        <div>
          <Mail />
          <a href="https://gmail.com">Open Gmail</a>
        </div>
      </Button>
    </div>
  );
}
