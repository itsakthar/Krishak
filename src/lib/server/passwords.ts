import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function createPasswordRecord(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, passwordSalt, 64).toString("hex");
  return { passwordHash, passwordSalt };
}

export function verifyPassword(password: string, passwordHash: string, passwordSalt: string) {
  if (!passwordHash || !passwordSalt) {
    return false;
  }

  const candidate = scryptSync(password, passwordSalt, 64);
  const target = Buffer.from(passwordHash, "hex");
  return candidate.length === target.length && timingSafeEqual(candidate, target);
}
