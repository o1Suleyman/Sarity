"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function auth(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000",
    },
  });

  revalidatePath("/", "layout");
  redirect("/welcome");
}
