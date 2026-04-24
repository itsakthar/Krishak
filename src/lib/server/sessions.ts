import { createHash, randomUUID } from "crypto";

import { cookies } from "next/headers";

import { DemoSession } from "@/lib/data/types";

export const USER_SESSION_COOKIE = "krishak_session";
export const ADMIN_SESSION_COOKIE = "krishak_admin_session";

export function createSessionToken() {
  return `${randomUUID()}-${randomUUID()}`;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createDemoSession(userId: string): { token: string; record: DemoSession } {
  const token = createSessionToken();
  return {
    token,
    record: {
      id: randomUUID(),
      userId,
      tokenHash: hashToken(token),
      createdAt: new Date().toISOString()
    }
  };
}

export function getSessionCookieValue(name: string) {
  return cookies().get(name)?.value;
}

export function setSessionCookie(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(name: string) {
  cookies().set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0
  });
}
