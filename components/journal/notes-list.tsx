import { createClient } from "@/utils/supabase/server";
import Note from "./note";
  
export default async function NotesList() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("notes").select("*").order("created_at", {ascending:false})
  return (
    <div className="flex flex-col gap-1">
      {data?.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          name={note.name}
          content={note.content}
        />
      ))}
    </div>
  );
}