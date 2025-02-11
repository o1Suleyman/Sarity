"use server"
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function DeleteEventAction(id:number) {
    const supabase = await createClient();
    const response = await supabase.from("events").delete().eq("id", id);
    revalidatePath("/")
}