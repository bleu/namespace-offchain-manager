import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { handleApiError } from "./lib/api/response";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  } catch (error) {
    return handleApiError(error);
  }
}

export const config = {
  matcher: "/api/keys/:path*",
};
