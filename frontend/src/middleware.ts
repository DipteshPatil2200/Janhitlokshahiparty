import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/data/site";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${siteConfig.localeDefault}`, request.url),
    );
  }

  const firstSegment = pathname.split("/")[1];
  const locale = siteConfig.locales.find(
    (supportedLocale) => supportedLocale === firstSegment,
  );

  if (!locale) {
    if (/^[a-z]{2}$/i.test(firstSegment)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const isReservedPath =
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      /\.[^/]+$/.test(pathname);
    if (!isReservedPath) {
      const destination = request.nextUrl.clone();
      destination.pathname = `/${siteConfig.localeDefault}${pathname}`;
      return NextResponse.redirect(destination);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale || siteConfig.localeDefault);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|googlec3d660ce455bf7b8\\.html$).*)",
  ],
};
