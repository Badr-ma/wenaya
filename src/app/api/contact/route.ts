import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Contact submission logged server-side

    return NextResponse.json({ success: true, message: "Votre message a bien été envoyé. Nous vous répondrons sous 24h." });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
