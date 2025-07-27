import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {

  const response =  await updateSession(request);

  const protectedRoutes = ["/dashboard"]
  const {pathname} = request.nextUrl

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get the session from the Supabase middleware response
    const session = await getSupabaseSession(request);

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response
}

async function getSupabaseSession(request: NextRequest) {
  // Extract the session from cookies (adjust based on your Supabase setup)
  const cookie = request.cookies.get("sb-auth-token");
  if (!cookie) return null;

  try {
    // Verify the session (this depends on your Supabase implementation)
    // You might need to import your Supabase client here
    const session = JSON.parse(cookie.value);
    return session;
  } catch (error) {
    return null;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
