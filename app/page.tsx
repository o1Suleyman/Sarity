import Dashboard from "@/components/events/dashboard";
import Home from "@/components/home";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return (error || !data?.user) ? <Home /> : <Dashboard />;
}
