import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: number;
  username: string;
  email: string;
  verified: boolean;
}

const authenticate = async (request: NextRequest) => {
  if (!process.env.jwtPrivateKey)
    return new NextResponse(
      "Whoever is running the backend is a moron. TELL THEM TO SET UP A JWT PRIVATE KEY!",
      { status: 500 }
    );

  const authenticationToken = request.headers.get("Authorization");

  console.log("Doing authentication");

  if (!authenticationToken)
    return new NextResponse("You are not logged in", { status: 401 });
  try {
    const user = await jwtVerify(
      authenticationToken,
      new TextEncoder().encode(process.env.jwtPrivateKey)
    );
    const newHeaders = new Headers(request.headers);

    newHeaders.set("x-user-info", JSON.stringify(user));

    return NextResponse.next({ request: { headers: newHeaders } });
  } catch (e) {
    return new NextResponse("You could not be authenticated.", { status: 401 });
  }
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

  if (path.startsWith("/api/verify") && request.method == "POST")
    return await authenticate(request);

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/verify"],
};
