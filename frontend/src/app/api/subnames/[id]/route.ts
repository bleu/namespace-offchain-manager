import { SubnameService } from "@/services/subname.service";
import type { UpdateSubnameDTO } from "@/types/subname.types";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const subnameService = new SubnameService();
    const subname = await subnameService.getSubname(params.id);

    if (!subname) {
      return NextResponse.json({ error: "Subname not found" }, { status: 404 });
    }

    return NextResponse.json(subname);
  } catch (error) {
    console.error("Error fetching subname:", error);
    return NextResponse.json(
      { error: "Error fetching subname" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = (await request.json()) as UpdateSubnameDTO;
    const subnameService = new SubnameService();

    const subname = await subnameService.updateSubname(params.id, body);

    return NextResponse.json(subname);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Subname not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Error updating subname:", error);
    return NextResponse.json(
      { error: "Error updating subname" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const subnameService = new SubnameService();
    await subnameService.deleteSubname(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Subname not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Error deleting subname:", error);
    return NextResponse.json(
      { error: "Error deleting subname" },
      { status: 500 },
    );
  }
}
