import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type RouteHandler = (
  req: NextRequest,
  context: RouteContext,
) => Promise<NextResponse>;

const getBearerToken = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  return authHeader?.split("Bearer ")[1];
};

const getEnsUserFromApiToken = async (token: string) => {
  const apiTokenDigest = createHash("sha256").update(token).digest("hex");

  const api_token = await prisma.apiToken.findUnique({
    where: {
      apiKeyDigest: apiTokenDigest,
    },
    select: {
      ensOwner: true,
      isRevoked: true,
    },
  });

  if (api_token?.isRevoked) {
    return null;
  }

  return api_token?.ensOwner;
};

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    const session = await getToken({ req });
    let ensOwner = session?.address;

    if (!ensOwner) {
      const token = getBearerToken(req);
      if (token) {
        const ensUser = await getEnsUserFromApiToken(token);
        if (ensUser) {
          ensOwner = ensUser;
        }
      }
    }

    if (!ensOwner) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or revoked token" },
        { status: 401 },
      );
    }

    req.headers.set("ensOwner", ensOwner);
    return handler(req, context);
  };
}

declare module "next/server" {
  interface NextRequest {
    address?: string;
  }
}
