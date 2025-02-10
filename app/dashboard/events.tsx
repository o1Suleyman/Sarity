import { createClient } from "@/utils/supabase/server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default async function Events() {
    const supabase = await createClient();
    const { data } = await supabase.from("events").select("*");
    async function createEvent() {
        
    }
    return (
        <ScrollArea>
            {data?.map((event) => (
                <div key={event.id}>
                    <h1>{event.name}</h1>
                    <h1>{event.created_at}</h1>
                </div>
            ))}
            <form>
                <Button formAction={createEvent}/>
            </form>
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
// className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 rounded-md transition-colors p-2"