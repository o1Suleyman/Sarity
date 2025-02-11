"use client";

import { Button } from "@/components/ui/button";
import { ComponentPropsWithoutRef } from "react";

type SubmitButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  initialText: string;
  pendingText: string;
  isSubmitting: boolean;
};

export default function SubmitButton({
  initialText,
  pendingText,
  isSubmitting,
  ...props
}: SubmitButtonProps) {
  return (
    <Button {...props} type="submit" disabled={isSubmitting}>
      {isSubmitting ? pendingText : initialText}
    </Button>
  );
}
