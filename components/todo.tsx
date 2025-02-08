import { createClient } from "@/utils/supabase/server";

export default async function ToDo() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*");
    return (<></>)
}