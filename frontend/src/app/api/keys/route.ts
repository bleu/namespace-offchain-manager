import { handleApiError } from "@/lib/api/response";
import { withAuth } from "@/lib/withAuth";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import type { CreateApiKeyDTO } from "@/types/api-keys.type";
import { type NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const ensOwner = request.headers.get("ensOwner") || "";
    const apiKeyService = new ApiKeyService();

    const apiKeys = await apiKeyService.getAllApiKeys(ensOwner, page, pageSize);

    return NextResponse.json(apiKeys);
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = (await request.json()) as CreateApiKeyDTO;
    const ensOwner = request.headers.get("ensOwner") || "";
    const apiKeyService = new ApiKeyService();

    const newApiKey = await apiKeyService.createApiKey(body, ensOwner);

    return NextResponse.json(newApiKey);
  } catch (error) {
    return handleApiError(error);
  }
});
