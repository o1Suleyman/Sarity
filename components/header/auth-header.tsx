import { createClient } from "@/utils/supabase/server";
import InteractiveHoverLink from "./interactive-hover-link";

export default async function AuthHeader() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    let isLoggedIn: boolean;
    data.user ? isLoggedIn = true : isLoggedIn = false;
    return (
        <>
            <InteractiveHoverLink isLoggedIn={isLoggedIn} />
        </>
    )
}