import { createClient } from "@/utils/supabase/server";
import Note from "./note";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }
  return <Note id={id} name={data?.name} content={data?.content} />;
}
