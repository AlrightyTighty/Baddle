import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const authenticate = async (request: NextRequest) => {
  if (!process.env.tokenKey)
    return new NextResponse(
      "Whoever is running the backend is a moron. TELL THEM TO SET UP A JWT PRIVATE KEY!",
      { status: 500 }
    );

  const authenticationToken = request.headers.get("Authentication");
  if (!authenticationToken)
    return new NextResponse("You are not logged in", { status: 401 });
  try {
    const user = verify(authenticationToken, process.env.tokenKey);
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
  if (path.startsWith("api/verify") && request.method == "POST")
    return authenticate(request);

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/users, /api/verify"],
};
