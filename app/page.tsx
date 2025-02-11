import Dashboard from "@/components/events/dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return (error || !data?.user) ? redirect("/auth") : <Dashboard />;
}
