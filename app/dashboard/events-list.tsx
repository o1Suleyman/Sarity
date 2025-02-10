"use client";

import { Button } from "@/components/ui/button";

export default function EventsList({updateItemAction, initialEvents}: { updateItemAction: (formData: FormData) => void, initialEvents: any[] }) {
    // const
    return (
        <>
        {initialEvents.map((event) => (
            <div key={event.id}>
                <span>{event.name}</span>
            </div>
        ))}
    <form action={updateItemAction}>
        <Button type="submit">Create event</Button>
    </form></>)
  }