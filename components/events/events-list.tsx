import { createClient } from "@/utils/supabase/server";
import Event from "./event";

export default async function EventsList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*");

  return (
    <div className="flex flex-col gap-1">
      {data?.map((event) => (
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
