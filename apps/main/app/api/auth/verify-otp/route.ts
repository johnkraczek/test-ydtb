import { NextRequest, NextResponse } from "next/server";
import { auth } from "@ydtb/core/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid verification code format" },
        { status: 400 }
      );
    }

    // Verify OTP using better-auth's verifyEmailOTP method
    const result = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });

    // Type cast to handle possible error response
    const resultWithError = result as any;
    if (resultWithError.error) {
      return NextResponse.json(
        { error: resultWithError.error.message || "Invalid verification code" },
        { status: 400 }
      );
    }

    // If verification is successful, the user's email is now verified
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying code" },
      { status: 500 }
    );
  }
}