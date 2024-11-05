import { SubnameService } from "@/services/subname.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subnameService = new SubnameService();

    const subnames = await subnameService.getAllSubnames();

    return NextResponse.json(subnames);
  } catch (error) {
    console.error("Error fetching subnames:", error);
    return NextResponse.json(
      { error: "Error fetching subnames" },
      { status: 500 },
    );
  }
}
