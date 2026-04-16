import nodemailer from "nodemailer";

function smtpDebugEnabled(): boolean {
  return process.env.SMTP_DEBUG === "true" || process.env.NODE_ENV !== "production";
}

function toErrorDetails(error: unknown): Record<string, string | number | boolean | undefined> {
  if (!error || typeof error !== "object") return { message: String(error) };
  const maybe = error as {
    message?: string;
    code?: string;
    command?: string;
    response?: string;
    responseCode?: number;
    name?: string;
  };
  return {
    name: maybe.name,
    message: maybe.message,
    code: maybe.code,
    command: maybe.command,
    responseCode: maybe.responseCode,
    response: maybe.response,
  };
}

export async function sendOtpEmail(
  email: string,
  code: string,
  subject: string
): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) {
    if (smtpDebugEnabled()) {
      console.error("[SMTP] Missing configuration.", {
        hasHost: Boolean(host),
        hasUser: Boolean(user),
        hasPass: Boolean(pass),
        hasFrom: Boolean(from),
      });
    }
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();
    if (smtpDebugEnabled()) {
      console.log("[SMTP] Verify success.", { host, port, user });
    }

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `Your OTP code is ${code}. It expires in 10 minutes.`,
    });
    if (smtpDebugEnabled()) {
      console.log("[SMTP] OTP sent.", { to: email, subject });
    }
    return true;
  } catch (error) {
    if (smtpDebugEnabled()) {
      console.error("[SMTP] OTP send failed.", toErrorDetails(error));
    }
    return false;
  }
}
