import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "./app/api/db_handler";
import { UserInfo } from "./app/api/users/route";

const authenticate = async (request: NextRequest) => {
  const authenticationToken = request.headers.get("Authorization");

  console.log("Doing authentication");

  if (!authenticationToken) return new NextResponse("You are not logged in", { status: 401 });

  const userInfo = await queryDB<UserInfo>(`SELECT "id", "username", "email", "verified" FROM "user" WHERE "id"=(SELECT user_id FROM session WHERE "id"=$1);`, [authenticationToken]);

  if (userInfo.length == 0) return new NextResponse("Invalid session id", { status: 401 });

  const newHeaders = new Headers(request.headers);
  newHeaders.set("x-user-info", JSON.stringify(userInfo[0]));

  return NextResponse.next({
    request: {
      headers: newHeaders,
    },
  });
};

const middlewareMap: {
  [path: string]: (request: NextRequest) => Promise<NextResponse>;
} = {
  "/api/users": authenticate,
  "/api/verify": authenticate,
};

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  console.log("middleware in use");

  if (path.startsWith("/api/verify") && request.method == "POST") return await authenticate(request);

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/verify"],
};
