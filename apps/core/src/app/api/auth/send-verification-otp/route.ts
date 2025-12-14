import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Send OTP using better-auth
    const result = await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "email-verification"
      },
    });

    // Type cast to handle possible error response
    const resultWithError = result as any;
    if (resultWithError.error) {
      return NextResponse.json(
        { error: resultWithError.error.message || "Failed to send verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending verification code" },
      { status: 500 }
    );
  }
}