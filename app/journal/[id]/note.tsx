"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";

const FormSchema = z.object({
  content: z.string().nullable(), // Allow content to be null
});

type NoteProps = {
  id: string;
  name: string;
  content: string | null; // Content can be null
};

export default function Note({ id, name, content }: NoteProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: content || "", // Default to an empty string if content is null
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createClient();

    const { error } = await supabase.from("notes").upsert(
      {
        id, // Use the provided `id` to match the row
        content: data.content,
        name: name,
      },
      { onConflict: "id" }, // Specify the column to check for conflicts
    );

    if (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save the note.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note saved successfully.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-2 mx-auto my-2">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Jot down your thoughts and plans
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[90vw] space-y-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    autoFocus
                    className="resize-none"
                    {...field}
                    value={field.value || ""} // Ensure value is always a string
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
