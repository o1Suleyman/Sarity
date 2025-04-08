"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { useToast } from "@/components/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import UpdateButton from "./update-event";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

const formSchema = z.object({
  query: z.string().min(2, {
    message: "Query must be at least 2 characters.",
  }),
});

function isValidTimeOrder(
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string,
) {
  const startTime = parseInt(startHour) * 60 + parseInt(startMinute);
  const endTime = parseInt(endHour) * 60 + parseInt(endMinute);
  return startTime < endTime;
}

function isOverlapping(
  newEvent: {
    start_hour: string;
    start_minute: string;
    end_hour: string;
    end_minute: string;
  },
  existingEvents: any[],
  currentEventId: number,
) {
  if (
    !isValidTimeOrder(
      newEvent.start_hour,
      newEvent.start_minute,
      newEvent.end_hour,
      newEvent.end_minute,
    )
  ) {
    return "invalid_time_order";
  }

  const newStart =
    parseInt(newEvent.start_hour) * 60 + parseInt(newEvent.start_minute);
  const newEnd =
    parseInt(newEvent.end_hour) * 60 + parseInt(newEvent.end_minute);

  return existingEvents.some((event) => {
    // Skip checking against the current event being updated
    if (event.id === currentEventId) return false;

    const existingStart =
      parseInt(event.start_hour) * 60 + parseInt(event.start_minute);
    const existingEnd =
      parseInt(event.end_hour) * 60 + parseInt(event.end_minute);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}

interface UpdateEventFormProps {
  eventId: number;
  currentName: string;
  onSuccess?: () => void;
}

export default function UpdateEventForm({
  eventId,
  currentName,
  onSuccess,
}: UpdateEventFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: currentName,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: z.object({
          event: z.object({
            name: z.string(),
            startHour: z.string(),
            startMinute: z.string(),
            endHour: z.string(),
            endMinute: z.string(),
          }),
        }),
        prompt:
          "Use military time, for example if it's 8am return 08 and if its 7pm return 19, if the user doesn't specify am or pm guess which one based on the context, auto-capitalize the name, if the user doesn't specify then assume that the task lasts one hour, here's the event:" +
          values.query,
      });

      const supabase = createClient();

      // Get the event's date
      const { data: currentEvent } = await supabase
        .from("events")
        .select("date")
        .eq("id", eventId)
        .single();

      if (!currentEvent) {
        throw new Error("Event not found");
      }

      // Select events from the same date
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("date", currentEvent.date);

      // Check for overlapping events
      const newEvent = {
        start_hour: object.event.startHour,
        start_minute: object.event.startMinute,
        end_hour: object.event.endHour,
        end_minute: object.event.endMinute,
      };

      const overlapCheck = isOverlapping(newEvent, data || [], eventId);

      if (overlapCheck === "invalid_time_order") {
        toast({
          title: "The start time must be before the end time.",
        });
        return;
      }

      if (data && overlapCheck === true) {
        toast({
          title:
            "This event is overlapping an existing event! Choose a different time period.",
        });
        return;
      }

      // Upsert the event
      const { error } = await supabase
        .from("events")
        .update({
          name: object.event.name,
          start_hour: object.event.startHour,
          start_minute: object.event.startMinute,
          end_hour: object.event.endHour,
          end_minute: object.event.endMinute,
        })
        .eq("id", eventId);

      if (error) {
        toast({
          title: "Error updating event",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Event updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      toast({
        title: "Error updating event",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  // In update-event-form.tsx
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Enter updated event details" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <UpdateButton
            initialText="Update"
            pendingText="Updating..."
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
