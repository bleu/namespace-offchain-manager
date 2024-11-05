import { prisma } from '@/lib/prisma'

export class SubnameService {
  async createSubscriptionPack(data: {
    name: string
    price: number
    duration: number
    maxSubnames: number
  }) {
    return prisma.subscriptionPack.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        maxSubnames: data.maxSubnames,
      },
    })
  }

  async createSubname(data: {
    parentName: string
    label: string
    contenthash?: string
    subscriptionPackId: string
    texts: Array<{ key: string; value: string }>
    addresses: Array<{ coin: number; value: string }>
  }) {
    return prisma.subname.create({
      data: {
        parentName: data.parentName,
        label: data.label,
        name: `${data.label}.${data.parentName}`,
        contenthash: data.contenthash,
        subscriptionPackId: data.subscriptionPackId,
        texts: {
          create: data.texts,
        },
        addresses: {
          create: data.addresses,
        },
      },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    })
  }

  async getAllSubnames() {
    return prisma.subname.findMany({
      include: {
        subscriptionPack: true,
        texts: true,
        addresses: true,
      },
    })
  }

  async getSubname(id: string) {
    return prisma.subname.findUnique({
      where: { id },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    })
  }

  async updateSubname(id: string, data: {
    contenthash?: string
    texts?: Array<{ key: string; value: string }>
    addresses?: Array<{ coin: number; value: string }>
  }) {
    if (data.texts) {
      await prisma.subnameText.deleteMany({
        where: { subnameId: id },
      })
    }
    
    if (data.addresses) {
      await prisma.subnameAddress.deleteMany({
        where: { subnameId: id },   
      })
    }

    return prisma.subname.update({
      where: { id },
      data: {
        contenthash: data.contenthash,
        texts: data.texts ? {
          create: data.texts,
        } : undefined,
        addresses: data.addresses ? {
          create: data.addresses,
        } : undefined,
      },
      include: {
        texts: true,
        addresses: true,
        subscriptionPack: true,
      },
    })
  }

  async deleteSubname(id: string) {
    try {
      await Promise.all([
        prisma.subnameText.deleteMany({
          where: { subnameId: id },
        }),
        prisma.subnameAddress.deleteMany({
          where: { subnameId: id },
        }),
      ])

      return await prisma.subname.delete({
        where: { id },
      })
    } catch (error) {
      console.error('Error in deleteSubname:', error)
      throw error
    }
  }
}