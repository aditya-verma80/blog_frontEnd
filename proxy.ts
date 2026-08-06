import { NextResponse, NextRequest } from "next/server";

const ProtectedRoutes = ["/dashboard", "/blog"];
const AuthRoute = ["/login", "/signup"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isToken = Boolean(req.cookies.get("authToken")?.value);

  const isProtectedRoute = ProtectedRoutes.find((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = AuthRoute.includes(pathname);

  console.log(
    "isProtectedRoute",
    isProtectedRoute,
    "isToken",
    isToken,
    "isAuth",
    isAuthRoute,
  );

  if (isProtectedRoute && !isToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/signup",
    "/blog",
    "/blog/:id/edit",
    "/blog/create",
  ],
};
