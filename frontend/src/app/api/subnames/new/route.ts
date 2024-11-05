import { SubnameService } from "@/services/subname.service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
      const body = await request.json()
      const subnameService = new SubnameService()
      console.log('Request body:', body)
  
      const pack = await subnameService.createSubscriptionPack({
        name: "Basic Pack",
        price: 10.00,
        duration: 30,
        maxSubnames: 5
      })
      
      const subname = await subnameService.createSubname({
        ...body,
        subscriptionPackId: pack.id
      })
      
      return NextResponse.json(subname)
    } catch (error) {
      console.error('Error creating subname:', error)
      return NextResponse.json(
        { error: 'Error creating subname' },
        { status: 500 }
      )
    }
  }