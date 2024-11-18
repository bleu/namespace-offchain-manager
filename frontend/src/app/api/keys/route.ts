import { authOptions } from "@/lib/auth";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import type { CreateApiKeyDTO } from "@/types/api-keys.type";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateApiKeyDTO;
    const apiKeyService = new ApiKeyService();

    const apiKey = await apiKeyService.createApiKey(body, session.user.address);

    return NextResponse.json(apiKey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Error creating API key" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKeyService = new ApiKeyService();
    const apiKeys = await apiKeyService.getAllApiKeys(session.user.address);

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Error fetching API keys" },
      { status: 500 },
    );
  }
}
