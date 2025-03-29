import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken");

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } 

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/generate-travel-plans/:path*",
    "/user-form/:path*",
    "/generate-itinerary/:path*",
    "/generate-activities/:path*",
    "/generate-acomodations/:path*",
    "/generate-country/:path*",
  ],
};