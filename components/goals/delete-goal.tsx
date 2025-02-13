"use client";

import { Button } from "../ui/button";
import DeleteGoalAction from "./actions";
import { Trash2, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DeleteGoal({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Track if the component should be removed

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeleteGoalAction(id);
      setIsDeleted(true); // Trigger fade-out
    } finally {
      setIsDeleting(false);
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
            variant="default"
            disabled={isDeleting}
            aria-label="Delete event"
            className="ml-1"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle className="size-4" />
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
