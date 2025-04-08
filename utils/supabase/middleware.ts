import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

class CookieHandler {
  private request: NextRequest;
  private dbResponse: NextResponse;

  constructor(request: NextRequest, dbResponse: NextResponse) {
    this.request = request;
    this.dbResponse = dbResponse;
  }

  public getAll() {
    return this.request.cookies.getAll();
  }

  public setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
    // Set cookies in the request (not persisted)
    cookiesToSet.forEach(({ name, value }) => {
      this.request.cookies.set(name, value);
    });

    // Create a new response with updated cookies
    this.dbResponse = NextResponse.next({ request: this.request });

    cookiesToSet.forEach(({ name, value, options }) => {
      this.dbResponse.cookies.set(name, value, options);
    });
  }

  public getResponse() {
    return this.dbResponse;
  }
}

export async function updateSession(request: NextRequest) {
  let dbResponse = NextResponse.next({ request });
  const cookies = new CookieHandler(request, dbResponse);

  const db = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (cookiesToSet) => cookies.setAll(cookiesToSet),
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Return the response with the properly synced cookies
  return cookies.getResponse();
}
