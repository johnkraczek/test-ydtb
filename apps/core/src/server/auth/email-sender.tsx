import { render } from "@react-email/render";
import OtpVerificationEmail from "@/email/otp-verification-email";
import { sendEmail } from "@/lib/email-transporter";
import { emailRateLimiter } from "@/lib/rate-limiter";
import { env } from "@/env";

export async function sendVerificationOTP({
  email,
  otp,
  userName,
}: {
  email: string;
  otp: string;
  userName?: string;
}) {
  // Check rate limit
  const rateLimitResult = await emailRateLimiter.canSendEmail(email);

  if (!rateLimitResult.allowed) {
    throw new Error(
      `Too many verification emails sent. Please try again after ${Math.ceil(
        ((rateLimitResult.resetTime?.getTime() || 0) - Date.now()) / 60000
      )} minutes.`
    );
  }

  // In development, log OTP to console
  if (env.NODE_ENV === "development" || env.SKIP_EMAIL_SENDING === "true") {
    console.log(`[OTP Verification] Email: ${email}, Code: ${otp}, Expires in: 5 minutes`);

    // Still record the send for rate limiting
    await emailRateLimiter.recordEmailSent(email);
    return;
  }

  try {
    // Render email template
    const emailHtml = await render(
      OtpVerificationEmail({
        userName,
        otp,
        expirationMinutes: 5,
      })
    );

    // Send email
    await sendEmail({
      to: email,
      subject: "Verify your email for YDTB",
      html: emailHtml,
    });

    // Record the send for rate limiting
    await emailRateLimiter.recordEmailSent(email);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email. Please try again.");
  }
}