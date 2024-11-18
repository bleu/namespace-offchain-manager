import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createApiKeySchema } from "@/schemas/api-key.schema";
import type { ApiKeyResponseDTO, CreateApiKeyDTO } from "@/types/api-keys.type";

export class ApiKeyService {
  async validateCreateApiKey(data: CreateApiKeyDTO) {
    return createApiKeySchema.parseAsync(data);
  }

  async createApiKey(
    data: CreateApiKeyDTO,
    ensOwner: string,
  ): Promise<ApiKeyResponseDTO> {
    const validatedData = await this.validateCreateApiKey(data);

    const apiKey = `ns_${randomBytes(32).toString("hex")}`;
    const apiKeyDigest = createHash("sha256").update(apiKey).digest("hex");

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: validatedData.name,
        apiKeyDigest,
        ensOwner,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      },
    });

    return {
      id: newApiKey.id,
      name: newApiKey.name,
      createdAt: newApiKey.createdAt,
      expiresAt: newApiKey.expiresAt,
      apiKey,
    };
  }

  async getAllApiKeys(ensOwner: string): Promise<ApiKeyResponseDTO[]> {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        ensOwner,
        isRevoked: false,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return apiKeys;
  }

  async revokeApiKey(id: string, ensOwner: string): Promise<void> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new Error("API key not found");
    }

    if (apiKey.ensOwner !== ensOwner) {
      throw new Error("Unauthorized");
    }

    await prisma.apiKey.update({
      where: { id },
      data: { isRevoked: true },
    });
  }
}
