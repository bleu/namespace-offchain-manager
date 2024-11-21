import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createApiKeySchema } from "@/schemas/api-key.schema";
import type {
  ApiKeyResponseDTO,
  CreateApiKeyDTO,
  PaginatedApiKeyResponse,
} from "@/types/api-keys.type";

export class ApiKeyService {
  async validateCreateApiKey(data: CreateApiKeyDTO) {
    return createApiKeySchema.parseAsync(data);
  }

  async createApiKey(
    data: CreateApiKeyDTO,
    ensOwner: string,
  ): Promise<ApiKeyResponseDTO> {
    const validatedData = await this.validateCreateApiKey(data);

    const apiKey = `nsoma_${randomBytes(32).toString("hex")}`;
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
      isRevoked: newApiKey.isRevoked,
      apiKey: apiKey,
      apiKeyDigest: newApiKey.apiKeyDigest,
      ensOwner: newApiKey.ensOwner,
      updatedAt: newApiKey.updatedAt,
    };
  }

  async getAllApiKeys(
    ensOwner: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaginatedApiKeyResponse> {
    const total = await prisma.apiKey.count({
      where: { ensOwner },
    });

    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const apiKeys = await prisma.apiKey.findMany({
      where: { ensOwner },
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiresAt: true,
        isRevoked: true,
        apiKeyDigest: true,
        ensOwner: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    return {
      data: apiKeys,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async revokeApiKey(id: string): Promise<void> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new Error("API key not found");
    }

    await prisma.apiKey.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async deleteApiKey(id: string): Promise<void> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new Error("API key not found");
    }

    await prisma.apiKey.delete({
      where: { id },
    });
  }
}
