import { createClient } from "@/utils/supabase/server";
import EventsList from "./events-list";
import { revalidatePath } from "next/cache";

export default async function Events() {
    const supabase = await createClient();
    const {data, error} = await supabase.from("events").select("*");
    async function createEvent(formData: FormData) {
        "use server";
        const supabase = await createClient();
        const { data } = await supabase.from("events").insert([{
            name: "Event",
        }]);
        revalidatePath("/dashboard");
    }
    return (
            <EventsList updateItemAction={createEvent} initialEvents={data || []} />
    )
}