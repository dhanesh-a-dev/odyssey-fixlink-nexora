import { NextResponse } from "next/server";
import { validateRegistration } from "@/lib/validation";
import { getUserByEmail, createUser } from "@/lib/services/userService";
import { signToken } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { valid, errors } = validateRegistration(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const existing = await getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      location: body.location,
      phone: body.phone,
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ user, success: true }, { status: 201 });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
