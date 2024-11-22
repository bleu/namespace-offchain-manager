import { handleApiError } from "@/lib/api/response";
import { withAuth } from "@/lib/withAuth";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import { type NextRequest, NextResponse } from "next/server";

export const PUT = withAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      const apiKeyService = new ApiKeyService();
      await apiKeyService.revokeApiKey(id);

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return handleApiError(error);
    }
  },
);

export const DELETE = withAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      const apiKeyService = new ApiKeyService();
      await apiKeyService.deleteApiKey(id);

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return handleApiError(error);
    }
  },
);
