import { createClient } from "@/utils/supabase/server";

export default async function EventsList() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*");
}