import { prisma } from "@/lib/prisma";
import {
  createSubnameSchema,
  updateSubnameSchema,
} from "@/schemas/subname.schema";
import type {
  CreateSubnameDTO,
  PaginatedResponse,
  SubnameResponseDTO,
  SubscriptionPackResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";
import { Prisma } from "@prisma/client";

export class SubnameService {
  async createSubscriptionPack(data: {
    name: string;
    price: number;
    duration: number;
    maxSubnames: number;
  }): Promise<SubscriptionPackResponseDTO> {
    return await prisma.subscriptionPack.create({
      data: {
        name: data.name,
        price: new Prisma.Decimal(data.price),
        duration: data.duration,
        maxSubnames: data.maxSubnames,
      },
    });
  }

  async validateCreateSubname(data: CreateSubnameDTO) {
    return createSubnameSchema.parseAsync(data);
  }

  async validateUpdateSubname(data: UpdateSubnameDTO) {
    return updateSubnameSchema.parseAsync(data);
  }

  async createSubname(data: CreateSubnameDTO): Promise<SubnameResponseDTO> {
    const validatedData = await this.validateCreateSubname({
      ...data,
    });

    const existingSubname = await prisma.subname.findFirst({
      where: {
        parentName: validatedData.parentName,
        label: validatedData.label,
        ensOwner: validatedData.ensOwner,
      },
    });

    if (existingSubname) {
      throw new Error("Subname already exists");
    }

    return await prisma.subname.create({
      data: {
        parentName: validatedData.parentName,
        label: validatedData.label,
        name: `${validatedData.label}.${validatedData.parentName}`,
        contenthash: validatedData.contenthash ?? null,
        subscriptionPackId: data.subscriptionPackId,
        ensOwner: validatedData.ensOwner,
        texts: {
          create: validatedData.texts,
        },
        addresses: {
          create: validatedData.addresses,
        },
      },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    });
  }

  async getAllSubnames(
    page = 1,
    pageSize = 10,
    parentNames?: string[]
  ): Promise<PaginatedResponse<SubnameResponseDTO>> {
    if (!parentNames?.length) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          pageSize,
          totalPages: 0,
          hasMore: false,
        },
      };
    }

    const total = await prisma.subname.count({
      where: {
        parentName: {
          in: parentNames,
        },
      },
    });

    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const subnames = await prisma.subname.findMany({
      where: {
        parentName: {
          in: parentNames,
        },
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subscriptionPack: true,
        texts: true,
        addresses: true,
      },
    });

    return {
      data: subnames,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async getSubname(id: string): Promise<SubnameResponseDTO | null> {
    const subname = await prisma.subname.findUnique({
      where: { id },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    });

    if (!subname) return null;

    return subname;
  }

  async getSubnameFromOnwer(
    id: string,
    ensOwner: string
  ): Promise<SubnameResponseDTO | null> {
    const subname = await prisma.subname.findUnique({
      where: { id, ensOwner },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    });

    if (!subname) return null;

    return subname;
  }

  async updateSubname(
    id: string,
    data: UpdateSubnameDTO,
    ensOwner: string
  ): Promise<SubnameResponseDTO> {
    const validatedData = await this.validateUpdateSubname(data);

    const existingSubname = await this.getSubnameFromOnwer(id, ensOwner);
    if (!existingSubname) {
      throw new Error("Subname not found");
    }

    if (validatedData.texts) {
      await prisma.subnameText.deleteMany({
        where: { subnameId: id },
      });
    }

    if (validatedData.addresses) {
      await prisma.subnameAddress.deleteMany({
        where: { subnameId: id },
      });
    }

    const subname = await prisma.subname.update({
      where: { id },
      data: {
        contenthash: validatedData.contenthash ?? null,
        texts: validatedData.texts
          ? {
              create: validatedData.texts,
            }
          : undefined,
        addresses: validatedData.addresses
          ? {
              create: validatedData.addresses,
            }
          : undefined,
      },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    });

    return subname;
  }

  async deleteSubname(id: string, ensOwner: string): Promise<void> {
    try {
      const existingSubname = await this.getSubnameFromOnwer(id, ensOwner);
      if (!existingSubname) {
        throw new Error("Subname not found");
      }

      await Promise.all([
        prisma.subnameText.deleteMany({
          where: { subnameId: id },
        }),
        prisma.subnameAddress.deleteMany({
          where: { subnameId: id },
        }),
      ]);

      await prisma.subname.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error in deleteSubname:", error);
      throw error;
    }
  }
}
