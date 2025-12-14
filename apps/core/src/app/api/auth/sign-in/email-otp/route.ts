import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // This endpoint is called after OTP verification to complete the sign-in process
    // Since we're doing email verification (not passwordless sign-in), user must provide password
    // We'll redirect them to the normal sign-in flow with a message that their email is verified
    return NextResponse.json({
      success: true,
      message: "Email verified successfully. Please sign in with your password."
    });

  } catch (error) {
    console.error("Email OTP sign-in error:", error);
    return NextResponse.json(
      { error: "An error occurred while completing sign in" },
      { status: 500 }
    );
  }
}