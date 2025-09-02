import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "../db_handler";
import { compare } from "bcrypt";
import { v4 } from "uuid";
import { cookies } from "next/headers";

interface LoginInfo {
  usernameOrEmail: string;
  password: string;
}

export const POST = async (request: NextRequest) => {
  const body: LoginInfo = await request.json();
  if (!body.usernameOrEmail) return new Response("A username or email must be provided.", { status: 400 });
  if (!body.password) return new Response("A password must be provided", { status: 400 });

  const usersFound = await queryDB<{ id: string; password: string }>(`SELECT "id", "password" FROM "user" WHERE username = $1 OR email = $1;`, [body.usernameOrEmail]);
  if (usersFound.length == 0) return new NextResponse("Information was incorrect or not registered with Baddle.", { status: 401 });

  const user = usersFound[0];

  if (!compare(body.password, user.password)) return new NextResponse("Information was incorrect or not registered with Baddle.", { status: 401 });

  const sessionId: string = v4();

  await queryDB(`INSERT INTO "session" (id, user_id) VALUES ($1, $2);`, [sessionId, user.id]);

  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  (await cookies()).set({
    name: "sessionToken",
    value: sessionId,
    httpOnly: true,
    path: "/",
    maxAge: oneWeekInSeconds,
    sameSite: "strict",
  });

  return new Response("Login successful", { status: 200 });
};
