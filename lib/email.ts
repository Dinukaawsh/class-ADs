import nodemailer from "nodemailer";

export async function sendOtpEmail(
  email: string,
  code: string,
  subject: string
): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) return false;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `Your OTP code is ${code}. It expires in 10 minutes.`,
    });
    return true;
  } catch {
    return false;
  }
}
