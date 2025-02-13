import { createClient } from "@/utils/supabase/server";
import Event from "./event";

export default async function TasksList({ showTomorrow = false }) {
  const supabase = await createClient();

  // Calculate the date based on the `showTomorrow` prop
  const date = new Date();
  if (showTomorrow) {
    date.setDate(date.getDate() + 1); // Move to the next day
  }
  const formattedDate = date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

  // Query tasks for the specified date
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("date", formattedDate)
    .eq("type", "task")
    .order("start_hour", { ascending: true })
    .order("start_minute", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return <div>Error loading events</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {data.map((event) => (
        <Event
          key={event.id}
          id={event.id}
          name={event.name}
          startHour={event.start_hour}
          startMinute={event.start_minute}
          endHour={event.end_hour}
          endMinute={event.end_minute}
        />
      ))}
    </div>
  );
}
