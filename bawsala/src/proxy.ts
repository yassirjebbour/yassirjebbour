import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "bawsala_session";
const PROTECTED = ["/app", "/institution", "/admin"];

/**
 * Runs before every page request:
 *  - optimistic auth gate (cookie present) for private areas — the real check happens server-side
 *    in the data-access layer on every request;
 *  - per-request CSP nonce and security headers;
 *  - private areas are marked noindex.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPrivate = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isPrivate && !request.cookies.get(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const https = (process.env.APP_URL ?? "").startsWith("https://");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ""}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (https) res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  if (isPrivate) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: [
    { source: "/((?!api|_next/static|_next/image|fonts|brand|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|sw.js).*)", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] },
  ],
};
