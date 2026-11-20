import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER || "developermuhammadaazan@gmail.com";
const smtpPass = process.env.SMTP_PASS || "xjiawiwivhrjbajy";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465");

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendOtpEmail(
  to: string,
  otpCode: string,
  purpose: "CHECKOUT" | "SIGNUP" | "FORGOT_PASSWORD" = "CHECKOUT"
) {
  let title = "Order Verification Code";
  let description =
    "To verify your email and confirm your order placement, please enter this 6-digit one-time verification code:";

  if (purpose === "SIGNUP") {
    title = "Account Verification Code";
    description =
      "Welcome to A. Fragrance. Please enter this one-time code to verify your email and activate your account:";
  } else if (purpose === "FORGOT_PASSWORD") {
    title = "Password Reset Code";
    description =
      "A request was received to reset your account password. Please enter this one-time code to authorize your password update:";
  }

  const mailOptions = {
    from: `"A. Fragrance Support" <${smtpUser}>`,
    to,
    subject: `Your Verification Code: ${otpCode} — A. Fragrance`,
    html: `
      <div style="background-color: #faf8f5; color: #171513; font-family: 'Times New Roman', serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #e6decb; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 1px solid #e6decb; padding-bottom: 24px; margin-bottom: 30px;">
          <h1 style="color: #8a6829; font-size: 26px; letter-spacing: 0.25em; margin: 0; font-family: 'Times New Roman', serif;">A. FRAGRANCE</h1>
          <p style="color: #756a5c; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px;">Luxury Perfumes & Concentrated Attars</p>
        </div>
        
        <h2 style="font-size: 20px; color: #171513; font-family: 'Times New Roman', serif; margin-bottom: 12px;">${title}</h2>
        <p style="font-size: 15px; line-height: 1.8; color: #5c5348; font-family: sans-serif;">
          ${description}
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <div style="background-color: #ffffff; border: 2px solid #c6a56b; padding: 18px 36px; display: inline-block; border-radius: 6px; box-shadow: 0 4px 12px rgba(198,165,107,0.15);">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.35em; color: #8a6829; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="color: #756a5c; font-size: 11px; margin-top: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-family: sans-serif;">
            Valid for 10 minutes · Single Use Only
          </p>
        </div>
        
        <p style="font-size: 12px; line-height: 1.6; color: #756a5c; font-family: sans-serif;">
          If you did not initiate this request with A. Fragrance, please disregard this email or contact customer support immediately.
        </p>
        
        <div style="border-top: 1px solid #e6decb; margin-top: 40px; padding-top: 20px; text-align: center; font-size: 11px; color: #756a5c; font-family: sans-serif;">
          © 2026 A. Fragrance. Karachi · Lahore · Islamabad. Nationwide Delivery across Pakistan.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
