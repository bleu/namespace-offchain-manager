import { handleApiError } from "@/lib/api/response";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import { NextResponse } from "next/server";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const apiKeyService = new ApiKeyService();
    await apiKeyService.revokeApiKey(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const apiKeyService = new ApiKeyService();
    await apiKeyService.deleteApiKey(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
