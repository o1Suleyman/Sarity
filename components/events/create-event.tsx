"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button"
import { ComponentPropsWithoutRef } from "react";

type SubmitButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  initialText: string;
  pendingText: string;
};

export default function SubmitButton({
  initialText,
  pendingText,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} type="submit">
      {pending ? pendingText : initialText}
    </Button>
  );
}
