import { SubnameService } from "@/services/subname.service";
import type { CreateSubnameDTO } from "@/types/subname.types";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSubnameDTO;
    const subnameService = new SubnameService();

    const pack = await subnameService.createSubscriptionPack({
      name: "Basic Pack",
      price: 10.0,
      duration: 30,
      maxSubnames: 5,
    });

    const subname = await subnameService.createSubname({
      ...body,
      subscriptionPackId: pack.id,
    });

    return NextResponse.json(subname);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Subname already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Error creating subname:", error);
    return NextResponse.json(
      { error: "Error creating subname" },
      { status: 500 },
    );
  }
}
