import { createClient } from "@/utils/supabase/server";
import Event from "./event";
import Link from "next/link";

export default async function WorkoutsList() {
  const supabase = await createClient();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

  // Query only workouts for today
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("date", today)
    .eq("type", "workout")
    .order("start_hour", { ascending: true })
    .order("start_minute", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return <div>Error loading events</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((event) => (
        <Link key={event.id} href={`/workouts/${event.id}`}>
        <Event
          id={event.id}
          name={event.name}
          startHour={event.start_hour}
          startMinute={event.start_minute}
          endHour={event.end_hour}
          endMinute={event.end_minute}
        />
        </Link>
      ))}
    </div>
  );
}
