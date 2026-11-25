import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, readAdminSession } from "./admin";

/**
 * Keeps unauthenticated visitors out of /admin and sends a signed-in admin
 * away from the login screen.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await readAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!session && !isLogin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isLogin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
