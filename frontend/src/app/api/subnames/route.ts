import { SubnameService } from "@/services/subname-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");
    const parentNames = searchParams
      .get("parentNames")
      ?.split(",")
      .filter(Boolean);

    const subnameService = new SubnameService();
    const subnames = await subnameService.getAllSubnames(
      page,
      pageSize,
      parentNames,
    );

    return NextResponse.json(subnames);
  } catch (error) {
    console.error("Error fetching subnames:", error);
    return NextResponse.json(
      { error: "Error fetching subnames" },
      { status: 500 },
    );
  }
}
