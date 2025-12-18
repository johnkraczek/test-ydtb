import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@ydtb/core/server/auth";

export async function POST(request: NextRequest) {
  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { error: "Invitation ID is required" },
        { status: 400 }
      );
    }

    // Use Better Auth's rejectInvitation method
    await auth.api.rejectInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    return NextResponse.json(
      { message: "Invitation rejected successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error rejecting invitation:", error);

    // Better Auth returns specific error messages
    const errorMessage = error?.message || "Failed to reject invitation";
    const statusCode = error?.status || 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}