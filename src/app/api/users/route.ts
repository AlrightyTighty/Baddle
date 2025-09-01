import { NextRequest } from "next/server";
import { createUser, queryDB } from "../db_handler";
import { QueryResult } from "pg";
import { v4 } from "uuid";

// to create a user:
// a username, password, and email must be provided.

interface CreateUserInfo {
  username: string;
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  verified: boolean;
}

const PASSWORD_VERIFY_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;

const EMAIL_VERIFY_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

const JWT_PRIVATE_KEY = process.env.jwtPrivateKey;

export const POST = async (request: NextRequest) => {
  const body: CreateUserInfo = await request.json();
  if (!body.username) return new Response("A username must be provided.", { status: 400 });
  if (!body.email) return new Response("An email must be provided", { status: 400 });
  if (!body.password) return new Response("A password must be provided", { status: 400 });

  if (body.username.length < 5 || body.username.length > 20) return new Response("Invalid Username.", { status: 400 });
  if (!PASSWORD_VERIFY_REGEX.test(body.password)) return new Response("Invalid Password.", { status: 400 });
  if (!EMAIL_VERIFY_REGEX.test(body.email)) return new Response("Invalid Email", { status: 400 });

  // ok all the user info is valid, YAY YIPPEEEEEE

  const result: QueryResult<UserInfo> | null = await createUser(body.username, body.email, body.password);

  if (!result) {
    return new Response("There was an error with registering your account.", {
      status: 500,
    });
  }

  const createdUserInfo: UserInfo = result.rows[0];

  const sessionId: string = v4();

  await queryDB(`INSERT INTO "session" (id, user_id) VALUES ($1, $2)`, [sessionId, createdUserInfo.id]);

  return new Response(sessionId, { status: 200 });
};
