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
import { TimeUtils } from "@/lib/utils";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

const formSchema = z.object({
  query: z.string().min(2, {
    message: "Query must be at least 2 characters.",
  }),
});

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
            isTomorrow: z.boolean().optional(),
          }),
        }),
        prompt:
          "You should capitalize the event name the way that the user does, if the user doesn't specify am or pm guess which one based on the context, use military time, for example if it's 8am return 08 and if its 7pm return 19, fix the user's spelling mistakes, if the user doesn't specify, assume the event ends one hour after it starts, impersonalize the verbs (for example walk my dog turns into walk dog), if the user mentions tomorrow, set isTomorrow to true, anyway here's the event:" +
          values.query,
      });

      const supabase = await createClient();

      const today = new Date();
      const date = object.event.isTomorrow
        ? new Date(today.setDate(today.getDate() + 1)).toLocaleDateString(
            "en-CA",
          )
        : today.toLocaleDateString("en-CA");

      if (object.event.type === "workout") {
        const { data: existingWorkout } = await supabase
          .from("events")
          .select("*")
          .eq("date", date)
          .eq("type", "workout")
          .maybeSingle();

        if (existingWorkout) {
          toast({
            title:
              "Cannot have more than one workout per day",
          });
          return;
        }
      }

      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("date", date);

      const newEvent = {
        start_hour: object.event.startHour,
        start_minute: object.event.startMinute,
        end_hour: object.event.endHour,
        end_minute: object.event.endMinute,
      };

      const overlapCheck = TimeUtils.isOverlapping(newEvent, data || []);

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

      const { error } = await supabase.from("events").insert({
        name: object.event.name,
        start_hour: object.event.startHour,
        start_minute: object.event.startMinute,
        end_hour: object.event.endHour,
        end_minute: object.event.endMinute,
        type: object.event.type,
        date: date,
      });

      if (error) {
        toast({
          title: "Error creating event",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error creating event",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
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
                  autoComplete="off"
                  placeholder="Finish my homework after school"
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
