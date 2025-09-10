import { NextRequest } from "next/server";
import { createTransport } from "nodemailer";
import { makeVerificationLink, queryDB } from "../db_handler";

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

interface VerificationCodeInfo {
  id: number;
  verification_code: string;
  user_id: number;
  time_issued: Date;
}

export const POST = async (request: NextRequest) => {
  const userInfo = request.headers.get("x-user-info");
  if (!userInfo)
    return new Response("Failed to retrieve user info from headers", {
      status: 400,
    });
  const body: UserInfo = JSON.parse(userInfo);

  // create verification link

  console.log(body);

  const result = await makeVerificationLink(body.id);
  if (!result) return new Response("Couldn't make code", { status: 500 });

  const isUserVerified = (
    await queryDB<{ verified: boolean }>(
      `SELECT "verified" FROM "user" WHERE "id" = $1;`,
      [body.id]
    )
  )[0].verified;

  if (isUserVerified)
    return new Response("User is already verified", { status: 403 });

  const uuid_code = result.rows[0].verification_code;

  if (!uuid_code) {
    return new Response("There was an error generating the UUID link.", {
      status: 500,
    });
  }

  await transporter.sendMail({
    from: `"Baddle Support" <${EMAIL_CONFIG.smtpFrom}>`,
    to: `${body.email}`,
    subject: "Verify your account",
    text: `Hello, ${body.username}. Click on the following link to verify your account. https://baddle.fun/api/verify?verificationCode=${uuid_code}`,
  });

  return new Response("OK.", { status: 200 });
};

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("verificationCode");
  if (!code)
    return new Response("No verification code provided", { status: 400 });

  try {
    const verificationInfoQuery = `SELECT * FROM "verification_code" WHERE verification_code = $1;`;
    const verificationInfo = (
      await queryDB<VerificationCodeInfo>(verificationInfoQuery, [code])
    )[0];
    if (!verificationInfo)
      return new Response("Account not found.", { status: 404 });

    if (new Date().getTime() - verificationInfo.time_issued.getTime() > 90000)
      return new Response(
        "Expired verification code. Please generate a new one",
        { status: 410 }
      );

    const verifyUserQuery = `UPDATE "user" SET verified = TRUE WHERE id = $1;`;
    await queryDB(verifyUserQuery, [verificationInfo.user_id]);

    return new Response("Successfully verified your account.", { status: 200 });
  } catch (e) {
    return new Response("Something went wrong internally. " + e, {
      status: 500,
    });
  }
};
