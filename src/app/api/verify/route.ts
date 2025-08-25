import { NextRequest } from "next/server";
import { createTransport } from "nodemailer";
import { getUserInfo, makeVerificationLink } from "../db_handler";

const EMAIL_CONFIG = {
  smtpServer: "smtp.office365.com",
  smtpPort: 587,
  smtpUser: "joshua@baddle.fun",
  smtpFrom: "support@baddle.fun",
  smtpPassword: process.env.appPassword,
};

const transporter = createTransport({
  host: EMAIL_CONFIG.smtpServer,
  port: EMAIL_CONFIG.smtpPort,
  secure: EMAIL_CONFIG.smtpPort == 465,
  auth: {
    user: EMAIL_CONFIG.smtpUser,
    pass: EMAIL_CONFIG.smtpPassword,
  },
});

interface UserInfo {
  id: number;
  username: string;
  email: string;
  verified: boolean;
}

export const POST = async (request: NextRequest) => {
  const body: UserInfo = await request.json();

  // create verification link

  const uuid_code = await makeVerificationLink(body.id);

  if (!uuid_code) {
    return new Response("There was an error generating the UUID link.", {
      status: 500,
    });
  }

  await transporter.sendMail({
    from: `"Joshua Novak" <${EMAIL_CONFIG.smtpFrom}>`,
    to: `${body.email}`,
    subject: "Verify your account",
    text: `Hello, ${body.username}. Click on the following link to verify your account. https://baddle.fun/verify?verificationCode=${uuid_code}`,
  });

  return new Response("OK.", { status: 200 });
};

export const GET = async (request: NextRequest) => {};
