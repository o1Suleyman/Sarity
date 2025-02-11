"use server";

import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function auth(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string
  const domain = email.split("@")[1];

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000",
    },
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  revalidatePath("/", "layout");
  permanentRedirect(`https://${domain}`);
}
