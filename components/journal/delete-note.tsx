"use client";

import { Button } from "../ui/button";
import { deleteNoteAction } from "./actions";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DeleteNote({ id, redirect }: { id: number, redirect:boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Track if the component should be removed

  const handleDelete = async (event) => {
    event.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteNoteAction(id);
      setIsDeleted(true); // Trigger fade-out
    } finally {
      setIsDeleting(false);
    }
    if (redirect) {
      router.push("/")
    }
  };

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Fade-out duration
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
