"use server"
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function DeleteGoalAction(id: number) {
    const supabase = await createClient();
    await supabase.from("goals").delete().eq("id", id);
    revalidatePath("/dashboard");
}