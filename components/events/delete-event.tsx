"use client";

import { Button } from "../ui/button";
import { DeleteEventAction } from "./actions";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteEvent({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeleteEventAction(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      disabled={isDeleting}
      aria-label="Delete event"
      className="ml-1"
    >
      {isDeleting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </Button>
  );
}
