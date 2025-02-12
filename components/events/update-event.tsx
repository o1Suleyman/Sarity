"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UpdateButtonProps {
  initialText: string;
  pendingText: string;
  isSubmitting: boolean;
}

export default function UpdateButton({
  initialText,
  pendingText,
  isSubmitting,
}: UpdateButtonProps) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        initialText
      )}
    </Button>
  );
}
