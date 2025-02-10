import { createClient } from "@/utils/supabase/server";

export default async function Events() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*");
    return (
        <>
            {data?.map((event) => (
                <div key={event.id}>
                    <h2>{event.name}</h2>
                </div>
            ))}
        </>
    )
}