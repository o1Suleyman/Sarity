import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "../ui/button";

export default async function AuthHeader() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return (
        <>
            {!data.user ? (<Button asChild><Link href="/auth">Get Started</Link></Button>) : (<Button asChild><Link href="/dashboard">Dashboard</Link></Button>)}
        </>
    )
}