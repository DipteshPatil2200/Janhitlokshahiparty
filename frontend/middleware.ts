import { NextResponse, type NextRequest } from "next/server";

/** Locale detection for the root layout's <html lang> attribute. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname === "/mr" || pathname.startsWith("/mr/") ? "mr" : "en";
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  // Exclude Next.js internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
