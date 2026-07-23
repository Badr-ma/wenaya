/**
 * Admin Auth API — validates username + password against bcrypt hashes in Redis,
 * returns a signed HMAC token with the username embedded.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser, verifyBcrypt, signToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const user = await getUser(username);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const match = await verifyBcrypt(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(user.username);
    return NextResponse.json({ token, name: user.name, username: user.username });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
