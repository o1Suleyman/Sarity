import { createClient } from "@/utils/supabase/server";

export default async function deleteSetAction(id: number) {
    const db = await createClient();
    const action = await db.from("sets").delete().eq("id", id);
}