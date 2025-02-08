import { createClient } from "@/utils/supabase/server";
import InteractiveHoverLink from "./interactive-hover-link";

export default async function AuthHeader() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const isLoggedIn = !!data.user;
    return (
        <>
            <InteractiveHoverLink isLoggedIn={isLoggedIn} />
        </>
    )
}