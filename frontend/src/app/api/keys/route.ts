import { handleApiError } from "@/lib/api/response";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import type { CreateApiKeyDTO } from "@/types/api-keys.type";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const token = await getToken({ req: request });

    const apiKeyService = new ApiKeyService();
    const apiKeys = await apiKeyService.getAllApiKeys(
      token?.address,
      page,
      pageSize,
    );

    return NextResponse.json(apiKeys);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateApiKeyDTO;
    const token = await getToken({ req: request });

    const apiKeyService = new ApiKeyService();
    const apiKey = await apiKeyService.createApiKey(body, token?.address);

    return NextResponse.json(apiKey);
  } catch (error) {
    return handleApiError(error);
  }
}
