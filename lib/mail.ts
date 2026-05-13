import nodemailer from "nodemailer";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required mail environment variable: ${name}`);
  }

  return value;
}

function getMailConfig() {
  const host = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT?.trim() || "465");
  const secure = port === 465;
  const user = getRequiredEnv("EMAIL_USER");
  const pass = getRequiredEnv("EMAIL_PASS").replace(/\s+/g, "");
  const from = process.env.EMAIL_FROM?.trim() || user;

  return {
    from,
    transport: {
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 60000,
      socketTimeout: 60000,
    },
  };
}

export const transporter = nodemailer.createTransport(getMailConfig().transport);

export function getDefaultFromAddress() {
  return getMailConfig().from;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: getDefaultFromAddress(),
    to,
    subject,
    html,
  });
}
