"use client";

import { Button } from "../ui/button";
import { DeleteEventAction } from "./actions";
import { Trash2, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function DeleteEvent({ id, redirect }: { id: number, redirect:boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Track if the component should be removed

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeleteEventAction(id);
      setIsDeleted(true); // Trigger fade-out
    } finally {
      setIsDeleting(false);
      confetti();
      if (redirect) {
        router.push("/");
    }
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
            disabled={isDeleting}
            aria-label="Delete event"
            className="ml-1 bg-green-600 hover:bg-green-700"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
