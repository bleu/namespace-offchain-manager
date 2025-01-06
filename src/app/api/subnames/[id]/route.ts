import { withAuth } from "@/lib/withAuth";
import { SubnameService } from "@/services/subname/subname-service";
import type { UpdateSubnameDTO } from "@/types/subname.types";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    return NextResponse.json(
      { error: "Error fetching subname" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      const body = (await request.json()) as UpdateSubnameDTO;
      const subnameService = new SubnameService();

      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      const subname = await subnameService.updateSubname(
        id,
        body,
        request.headers.get("ensOwner") as string
      );

      return NextResponse.json(subname, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: error.errors },
          { status: 400 }
        );
      }
      console.error("Error updating subname:", error);
      return NextResponse.json(
        { error: "Error updating subname" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuth(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const subnameService = new SubnameService();

      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      await subnameService.deleteSubname(
        id,
        request.headers.get("ensOwner") as string
      );

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      if (error instanceof Error && error.message === "Subname not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      console.error("Error deleting subname:", error);
      return NextResponse.json(
        { error: "Error deleting subname" },
        { status: 500 }
      );
    }
  }
);
