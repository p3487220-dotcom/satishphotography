// src/app/api/admin/login/route.ts
// Supabase Auth sign-in for admin panel
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Use SSR createServerClient for automatic cookie management
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Cookies will be set on the response below
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Admin Login] Auth error:", error.message);
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Build response and forward cookies set by Supabase Auth
    const response = NextResponse.json({ success: true, user: data.user?.email });

    // Re-read cookies that were set on the request by setAll above
    // and forward them to the actual response
    const cookiesToForward = ["sb-access-token", "sb-refresh-token"];
    for (const name of cookiesToForward) {
      const cookie = request.cookies.get(name);
      if (cookie) {
        response.cookies.set(name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: name === "sb-refresh-token" ? 60 * 60 * 24 * 7 : 60 * 60,
        });
      }
    }

    return response;
  } catch (err) {
    console.error("[Admin Login] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
