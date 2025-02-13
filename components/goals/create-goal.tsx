"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/hooks/use-toast"
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
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  goal: z.string().min(2, {
    message: "goal must be at least 2 characters.",
  }),
})

export default function CreateGoal() {
    const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goal: "",
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("goals").insert([
      { name: values.goal },
    ]);
    form.reset();
    router.refresh();
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Input {...field} disabled={form.formState.isSubmitting} autoComplete="off" autoFocus/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="hidden">Submit</Button>
      </form>
    </Form>
  )
}
