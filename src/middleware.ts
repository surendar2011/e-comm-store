// Note: The deprecation warning about "proxy" in Next.js 16 is informational.
// The middleware.ts file is still the correct and recommended approach for authentication.
// This warning can be safely ignored until Next.js provides stable proxy API.
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup", "/", "/api", "/products", "/test-products", "/cart", "/checkout/success", "/checkout/cancel"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Skip auth check for public routes to avoid hanging
  // This allows login/signup pages to load immediately without waiting for auth
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  try {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    // If auth fails, redirect to login
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

