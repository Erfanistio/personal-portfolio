import { cookies } from "next/headers";
import { ADMIN_COOKIE, readAdminSession } from "./admin";

/** Current static-admin session, or null when signed out or unconfigured. */
export async function getAdminSession() {
  const cookieStore = await cookies();
  return readAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}
