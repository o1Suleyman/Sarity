"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { ComponentPropsWithoutRef } from "react";
import { useToast } from "./hooks/use-toast";

type SubmitButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  pendingText: string;
};

export default function SubmitButton({
  pendingText,
  ...props
}: SubmitButtonProps) {
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const handleClick = () => {
    toast({
      title: "Click the link in your email to get started",
      description: "Redirecting...",
    });
  };

  return (
    <Button {...props} type="submit">
      {pending ? pendingText : "Get Verification Link"}
    </Button>
  );
}
