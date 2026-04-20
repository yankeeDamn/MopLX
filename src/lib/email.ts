import { Resend } from "resend";

// Base URL for the application (used in email links)
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

// Initialize Resend client lazily to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Sanitize a string for safe inclusion in HTML text content
 * Escapes HTML special characters to prevent XSS/injection attacks
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate and sanitize a URL for use in href attributes
 * Only allows http/https protocols and returns empty string for invalid URLs
 */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return url;
  } catch {
    return "";
  }
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const client = getResendClient();
  
  // If no API key, log email for development
  if (!client) {
    console.log("📧 Email would be sent (no RESEND_API_KEY configured):");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Content: ${html.substring(0, 200)}...`);
    return true;
  }

  try {
    const { error } = await client.emails.send({
      from: process.env.EMAIL_FROM || "MopLX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

export function getVerificationEmailHtml(name: string, verificationUrl: string): string {
  // Sanitize name for HTML text content
  const safeName = escapeHtml(name);
  // Validate URL for href attribute (use original URL, not HTML-escaped)
  const safeVerificationUrl = sanitizeUrl(verificationUrl);
  // Escape URL for display in text content
  const displayUrl = escapeHtml(verificationUrl);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MopLX!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${safeName || "there"},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Thanks for signing up for MopLX! Please verify your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${safeVerificationUrl}" 
         style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                color: white; 
                padding: 14px 30px; 
                border-radius: 8px; 
                text-decoration: none; 
                font-weight: 600;
                font-size: 16px;
                display: inline-block;">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="font-size: 12px; color: #6b7280; word-break: break-all;">
      ${displayUrl}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      If you didn't create an account with MopLX, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
`;
}

export function getWelcomeEmailHtml(name: string): string {
  // Sanitize name for HTML text content
  const safeName = escapeHtml(name);
  // Validate URL for href attribute
  const signInUrl = `${APP_BASE_URL}/signin`;
  const safeSignInUrl = sanitizeUrl(signInUrl);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Email Verified!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${safeName || "there"},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your email has been verified and your MopLX account is now active! 
      You can now sign in and access all our DevOps learning resources.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${safeSignInUrl}" 
         style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                color: white; 
                padding: 14px 30px; 
                border-radius: 8px; 
                text-decoration: none; 
                font-weight: 600;
                font-size: 16px;
                display: inline-block;">
        Sign In Now
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280;">
      Happy learning! 🚀
    </p>
  </div>
</body>
</html>
`;
}
