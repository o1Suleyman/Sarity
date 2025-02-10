"use client";

import { Form } from "@/components/ui/form";
import { useOptimistic } from "react";
import CreateEventDrawer from "./create-event-drawer";

export default function EventsList({
  updateItemAction,
  initialEvents,
}: {
  updateItemAction: (formData: FormData) => void;
  initialEvents: any[];
}) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(initialEvents);
  // const handleSubmit = () => {
  //     f
  // }
  return (
    <>
      {optimisticTasks.map((event) => (
        <div key={event.id}>
          <span>{event.name}</span>
        </div>
      ))}
      <CreateEventDrawer />
    </>
  );
}
