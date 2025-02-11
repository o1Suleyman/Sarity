"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { useToast } from "@/components/hooks/use-toast"


import { Button } from "@/components/ui/button";
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

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

const formSchema = z.object({
  query: z.string().min(2, {
    message: "Query must be at least 2 characters.",
  }),
});

function isOverlapping(
  newEvent: {
    start_hour: string;
    start_minute: string;
    end_hour: string;
    end_minute: string;
  },
  existingEvents: any[]
) {
  // Convert new event times to minutes for easier comparison
  const newStart =
    parseInt(newEvent.start_hour) * 60 + parseInt(newEvent.start_minute);
  const newEnd = parseInt(newEvent.end_hour) * 60 + parseInt(newEvent.end_minute);

  return existingEvents.some((event) => {
    // Convert existing event times to minutes
    const existingStart =
      parseInt(event.start_hour) * 60 + parseInt(event.start_minute);
    const existingEnd =
      parseInt(event.end_hour) * 60 + parseInt(event.end_minute);

    // Check for overlap
    return (
      (newStart >= existingStart && newStart < existingEnd) || // New event starts during existing event
      (newEnd > existingStart && newEnd <= existingEnd) || // New event ends during existing event
      (newStart <= existingStart && newEnd >= existingEnd) // New event completely encompasses existing event
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { object } = await generateObject({
      model: google("gemini-2.0-pro-exp-02-05"),
      schema: z.object({
        event: z.object({
          task: z.string(),
          startHour: z.string(),
          startMinute: z.string(),
          endHour: z.string(),
          endMinute: z.string(),
        }),
      }),
      prompt: "Use military time, here's the event:" + values.query,
    });

    const supabase = await createClient();
    const { data } = await supabase.from("events").select("*");

    // Check for overlapping events
    const newEvent = {
      start_hour: object.event.startHour,
      start_minute: object.event.startMinute,
      end_hour: object.event.endHour,
      end_minute: object.event.endMinute,
    };

    if (data && isOverlapping(newEvent, data)) {
      // Handle overlap case (e.g., show error message)
      toast({
        title: "This event is overlapping an existing event! Choose a different time period."
      })
      return;
    }

    const { error } = await supabase.from("events").insert({
      name: object.event.task,
      start_hour: object.event.startHour,
      start_minute: object.event.startMinute,
      end_hour: object.event.endHour,
      end_minute: object.event.endMinute,
    });
    router.refresh();
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
              <FormLabel>What task do you want to complete today?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="CS IA from 7 p.m. to 8 p.m." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
