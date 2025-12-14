import nodemailer from "nodemailer";
import { env } from "@/env";

// Create a transporter with SMTP configuration
export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "localhost",
  port: parseInt(env.SMTP_PORT || "587"),
  secure: env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER || "",
    pass: env.SMTP_PASSWORD || "",
  },
});

// Verify transporter configuration
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
  } catch (error) {
    console.error("Email transporter verification failed:", error);
  }
};

// Send email helper
export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM || '"YDTB" <noreply@ydtb.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};