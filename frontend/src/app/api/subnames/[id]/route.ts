import { SubnameService } from "@/services/subname-service";
import type { UpdateSubnameDTO } from "@/types/subname.types";
import { ZodError } from "zod";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const subnameService = new SubnameService();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const subname = await subnameService.getSubname(id);

    if (!subname) {
      return NextResponse.json({ error: "Subname not found" }, { status: 404 });
    }

    return NextResponse.json(subname, { status: 200 });
  } catch (error) {
    console.error("Error fetching subname:", error);
    return NextResponse.json({ error: "Error fetching subname" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json() as UpdateSubnameDTO;
    const subnameService = new SubnameService();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const subname = await subnameService.updateSubname(id, body);

    return NextResponse.json(subname, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("Error updating subname:", error);
    return NextResponse.json({ error: "Error updating subname" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const subnameService = new SubnameService();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await subnameService.deleteSubname(id);

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Subname not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Error deleting subname:", error);
    return NextResponse.json({ error: "Error deleting subname" }, { status: 500 });
  }
}