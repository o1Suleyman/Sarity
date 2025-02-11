import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/auth/actions";
import SubmitButton from "./submit-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0">
        <CardContent className="pt-4">
          <form>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  required
                />
              </div>
              <SubmitButton pendingText="Redirecting to email.." formAction={auth} className="w-full"/>
              {/* <Button type="submit" className="w-full" formAction={auth}>
                Get Started
              </Button> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
