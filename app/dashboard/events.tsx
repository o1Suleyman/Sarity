import { createClient } from "@/utils/supabase/server";
import { ScrollArea } from "../../components/ui/scroll-area";

export default async function Events() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*");
    return (
        <ScrollArea>
            {data?.map((event) => (
                <div key={event.id} className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 rounded-md transition-colors p-2">
                    <h1>{event.name}</h1>
                    <h1>{event.created_at}</h1>
                </div>
            ))}
        </ScrollArea>
    )
}
{/* <>
{data?.map((event) => (
    <div key={event.id}>
        <h2>{event.name}</h2>
    </div>
))}
</> */}