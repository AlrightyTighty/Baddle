import { NextRequest } from "next/server";
import { createUser } from "../db_handler";
// to create a user:
// a username, password, and email must be provided.

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

const PASSWORD_VERIFY_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;

const EMAIL_VERIFY_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const POST = async (request: NextRequest) => {
  const body: UserInfo = await request.json();
  if (!body.username)
    return new Response("A username must be provided.", { status: 400 });
  if (!body.email)
    return new Response("An email must be provided", { status: 400 });
  if (!body.password)
    return new Response("A password must be provided", { status: 400 });

  if (body.username.length < 5 || body.username.length > 20)
    return new Response("Invalid Username.", { status: 400 });
  if (!PASSWORD_VERIFY_REGEX.test(body.password))
    return new Response("Invalid Password.", { status: 400 });
  if (!EMAIL_VERIFY_REGEX.test(body.email))
    return new Response("Invalid Email", { status: 400 });

  // ok all the user info is valid, YAY YIPPEEEEEE

  const result = await createUser(body.username, body.email, body.password);

  if (!result) {
    return new Response("There was an error with registering your account.", {
      status: 500,
    });
  }

  console.log(result.rows);

  return new Response(JSON.stringify(result.rows[0]), { status: 200 });
};
