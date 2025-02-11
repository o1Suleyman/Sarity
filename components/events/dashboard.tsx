import { createClient } from "@/utils/supabase/server"

export default async function Dashboard() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("onboarded").single();
    const isOnboarded = data?.onboarded ?? false;
    return isOnboarded ? <>Onboarded</> : <>Not onboarded</>
}