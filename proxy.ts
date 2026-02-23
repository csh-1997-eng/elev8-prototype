import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const isMockMode = !supabaseUrl || !supabaseKey;

export async function proxy(request: NextRequest) {
  // Only protect /profile (own profile, not public /profile/[id])
  if (request.nextUrl.pathname !== "/profile") {
    return NextResponse.next();
  }

  // Mock mode: check for mock_user cookie
  if (isMockMode) {
    const mockUser = request.cookies.get("mock_user");
    if (!mockUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Real Supabase auth check
  const response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile"],
};
