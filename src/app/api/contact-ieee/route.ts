import { NextRequest } from "next/server";
import { createTransport } from "nodemailer";

const EMAIL_CONFIG = {
  smtpServer: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "nsm.ieeeuh@gmail.com",
  smtpFrom: "nsm.ieeeuh@gmail.com",
  smtpPassword: process.env.appPassword,
};

const transporter = createTransport({
  host: EMAIL_CONFIG.smtpServer,
  port: EMAIL_CONFIG.smtpPort,
  secure: EMAIL_CONFIG.smtpPort == 465,
  auth: {
    user: EMAIL_CONFIG.smtpUser,
    pass: "rcdc ulob wvxz qcdb",
  },
});

interface FormInfo {
  name: string;
  email: string;
  role: string;
  message: string;
}

const EMAIL_VERIFY_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const MAX_EMAIL_LENGTH = 128;

const MIN_MSG_LENGTH = 10;
const MAX_MSG_LENGTH = 1000;

export const POST = async (request: NextRequest) => {
  const body: FormInfo = await request.json();

  if (
    !body.name ||
    body.name.length < MIN_NAME_LENGTH ||
    body.name.length > MAX_NAME_LENGTH
  )
    return new Response("Invalid name", { status: 400 });

  if (
    !body.email ||
    body.email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_VERIFY_REGEX.test(body.email)
  )
    return new Response("Invalid email", { status: 400 });

  if (
    body.message.length < MIN_MSG_LENGTH ||
    body.message.length > MAX_MSG_LENGTH
  )
    return new Response("Invalid message", { status: 400 });

  await transporter.sendMail({
    from: `Contact Page <${EMAIL_CONFIG.smtpFrom}>`,
    to: `${EMAIL_CONFIG.smtpFrom}`,
    subject: `Message from ${body.role} ${body.name}`,
    text: `The following message was sent from the contact form by ${body.role} ${body.name} (${body.email}). \n${body.message}`,
  });

  return new Response("Email Sent", { status: 200 });
};
