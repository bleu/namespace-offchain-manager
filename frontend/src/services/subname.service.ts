import { prisma } from "@/lib/prisma";
import {
  createSubnameSchema,
  updateSubnameSchema,
} from "@/schemas/subname.schema";
import type {
  CreateSubnameDTO,
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
    const pack = await prisma.subscriptionPack.create({
      data: {
        name: data.name,
        price: new Prisma.Decimal(data.price),
        duration: data.duration,
        maxSubnames: data.maxSubnames,
      },
    });

    return {
      ...pack,
      price: Number(pack.price),
    };
  }

  async validateCreateSubname(data: CreateSubnameDTO) {
    return createSubnameSchema.parseAsync(data);
  }

  async validateUpdateSubname(data: UpdateSubnameDTO) {
    return updateSubnameSchema.parseAsync(data);
  }

  async createSubname(data: CreateSubnameDTO): Promise<SubnameResponseDTO> {
    const validatedData = await this.validateCreateSubname(data);

    const existingSubname = await prisma.subname.findFirst({
      where: {
        parentName: validatedData.parentName,
        label: validatedData.label,
      },
    });

    if (existingSubname) {
      throw new Error("Subname already exists");
    }

    const subname = await prisma.subname.create({
      data: {
        parentName: validatedData.parentName,
        label: validatedData.label,
        name: `${validatedData.label}.${validatedData.parentName}`,
        contenthash: validatedData.contenthash ?? null,
        subscriptionPackId: data.subscriptionPackId,
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

    return {
      ...subname,
      contenthash: subname.contenthash ?? null,
      subscriptionPack: {
        ...subname.subscriptionPack,
        price: Number(subname.subscriptionPack.price),
      },
    };
  }

  async getAllSubnames(): Promise<SubnameResponseDTO[]> {
    const subnames = await prisma.subname.findMany({
      include: {
        subscriptionPack: true,
        texts: true,
        addresses: true,
      },
    });

    return subnames.map((subname) => ({
      ...subname,
      contenthash: subname.contenthash ?? null,
      subscriptionPack: {
        ...subname.subscriptionPack,
        price: Number(subname.subscriptionPack.price),
      },
    }));
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

    return {
      ...subname,
      contenthash: subname.contenthash ?? null,
      subscriptionPack: {
        ...subname.subscriptionPack,
        price: Number(subname.subscriptionPack.price),
      },
    };
  }

  async updateSubname(
    id: string,
    data: UpdateSubnameDTO,
  ): Promise<SubnameResponseDTO> {
    const validatedData = await this.validateUpdateSubname(data);

    const existingSubname = await this.getSubname(id);
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

    return {
      ...subname,
      contenthash: subname.contenthash ?? null,
      subscriptionPack: {
        ...subname.subscriptionPack,
        price: Number(subname.subscriptionPack.price),
      },
    };
  }

  async deleteSubname(id: string): Promise<void> {
    try {
      const existingSubname = await this.getSubname(id);
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
