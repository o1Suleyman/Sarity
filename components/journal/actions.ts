"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteNoteAction(id: number) {
  const supabase = await createClient()
  await supabase.from("notes").delete().eq("id", id)
  revalidatePath("/")
}
export async function createNoteAction(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get("name") as string;
  console.log(name)
  const { data, error } = await supabase.from("notes").insert({
    name: name,
  })
  revalidatePath("/")
}