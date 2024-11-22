import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "./api/response";
import { createHash } from "./utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type RouteHandler = (
  req: NextRequest,
  context: RouteContext,
) => Promise<NextResponse>;

const getBearerToken = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null;
};

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (session?.address) {
        (request as any).address = session.address;
        return await handler(request, context);
      }

      const bearerToken = getBearerToken(request);
      if (!bearerToken) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        );
      }

      try {
        const apiKeyDigest = await createHash(bearerToken);

        const apiKey = await prisma.apiToken.findUnique({
          where: {
            apiKeyDigest: apiKeyDigest,
            isRevoked: false,
          },
          select: {
            ensOwner: true,
          },
        });

        if (!apiKey?.ensOwner) {
          return NextResponse.json(
            { error: "Invalid API key" },
            { status: 401 },
          );
        }

        (request as any).address = apiKey.ensOwner;
        return await handler(request, context);
      } catch (error) {
        return handleApiError(error);
      }
    } catch (error) {
      return handleApiError(error);
    }
  };
}

declare module "next/server" {
  interface NextRequest {
    address?: string;
  }
}
