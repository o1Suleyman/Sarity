"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast, useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import SubmitButton from "../submit-button";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Note name must be at least 2 characters.",
  }),
});

export function NoteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createClient();
    console.log(data);
    const { error } = await supabase
      .from("notes")
      .insert([{ name: data.name }]);
    toast({
      title: "Success",
      description: "Note created successfully.",
    });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          type="submit"
          initialText="Create note"
          pendingText="Creating note..."
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
}
