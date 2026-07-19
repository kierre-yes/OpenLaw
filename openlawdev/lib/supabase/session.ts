import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase getUser error:", error);
  }

  // Define our protected routes (add more as the app grows)
  const protectedRoutes = ["/search", "/sources", "/history", "/settings", "/saved", "/account"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Prevent authenticated users from visiting auth pages (login, sign-up, forgot-password)
  const authRoutes = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"];
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/search"; // Redirect to main app
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
