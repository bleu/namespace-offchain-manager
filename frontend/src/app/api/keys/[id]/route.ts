import { authOptions } from "@/lib/auth";
import { ApiKeyService } from "@/services/api-key/api-key-service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKeyService = new ApiKeyService();
    await apiKeyService.revokeApiKey(id, session.user.address);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "API key not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
    }

    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Error revoking API key" },
      { status: 500 },
    );
  }
}
