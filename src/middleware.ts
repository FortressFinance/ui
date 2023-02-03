import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /favicon, /images, /svg (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|favicon/|images/|svg/|[\\w-]+\\.\\w+).*)",
  ],
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. localhost:3000)
  const hostname = req.headers.get("host") || "fortress.finance"

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  const shouldRedirectToApp =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL === "1" &&
    hostname === "fortress.finance"
  const shouldRedirectToLandingPage =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL === "1" &&
    hostname === "app.fortress.finance"

  // redirect for app pages
  if (shouldRedirectToApp && path !== "/") {
    // we show only the landing page with fortress.finance
    return NextResponse.redirect(`https://app.fortress.finance/${path}`)
  }
  if (shouldRedirectToLandingPage && path === "/") {
    return NextResponse.redirect(`https://fortress.finance`)
  }
}
