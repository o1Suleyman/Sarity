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
import SubmitButton from "./create-event";

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
  const newEnd = parseInt(newEvent.end_hour) * 60 + parseInt(newEvent.end_minute);

  return existingEvents.some((event) => {
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

export default function NewEvent() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
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
            type: z.enum(["task", "workout"]),
          }),
        }),
        prompt:
          "Use military time, for example if it's 8am return 08 and if its 7pm return 19, capitalize the name unless otherwise stated, if the user doesn't specify am or pm guess which one based on the context, fix the user's spelling mistakes, here's the event:" +
          values.query,
      });

      const supabase = await createClient();

      // Get today's date
      const today = new Date();
      const date = today.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
      console.log(date);

      // If this is a workout, check if one already exists for today
      if (object.event.type === "workout") {
        const { data: existingWorkout } = await supabase
          .from("events")
          .select("*")
          .eq("date", date)
          .eq("type", "workout")
          .single();

        if (existingWorkout) {
          toast({
            title: "Working out more than once a day is against Sarity's philosophy",
          });
          return;
        }
      }

      // Select only events from today
      const { data } = await supabase.from("events").select("*").eq("date", date);

      // Check for overlapping events
      const newEvent = {
        start_hour: object.event.startHour,
        start_minute: object.event.startMinute,
        end_hour: object.event.endHour,
        end_minute: object.event.endMinute,
      };

      const overlapCheck = isOverlapping(newEvent, data || []);

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

      // Insert the new event with the date
      const { error } = await supabase.from("events").insert({
        name: object.event.name,
        start_hour: object.event.startHour,
        start_minute: object.event.startMinute,
        end_hour: object.event.endHour,
        end_minute: object.event.endMinute,
        type: object.event.type,
        date: date, // Store as YYYY-MM-DD
      });

      if (error) {
        toast({
          title: "Error creating event",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      form.reset(); // Clear the form after successful submission
      router.refresh();
    } catch (error) {
      toast({
        title: "Error creating event",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 md:min-w-[70vw]"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you want to complete today?</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Treadmill after school"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          initialText="Create"
          pendingText="Creating..."
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
