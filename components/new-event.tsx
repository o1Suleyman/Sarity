"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client";
const google = createGoogleGenerativeAI({
    apiKey: "AIzaSyBxk_VjqA8f6tWyGzTPTHWrPRVC3bfzkLI",
})
const formSchema = z.object({
  query: z.string().min(2, {
    message: "Query must be at least 2 characters.",
  }),
})

export default function NewEvent() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          query: "",
        },
      })
     
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
            prompt: "Don't pad the hours and minutes, use military time, here's the event:" + values.query,
          });
          const supabase = await createClient();
          const {error} = await supabase.from("events").insert({
            name: object.event.task,
            start_hour: object.event.startHour,
            start_minute: object.event.startMinute,
            end_hour: object.event.endHour,
            end_minute: object.event.endMinute,
          })
          console.log(object);
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:min-w-[70vw]">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
