import { SignJWT, jwtVerify } from "jose";
import { AuthSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "fixlink-default-fallback-secret-key-at-least-32-chars-long";
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AuthSession;
  } catch {
    return null;
  }
}
