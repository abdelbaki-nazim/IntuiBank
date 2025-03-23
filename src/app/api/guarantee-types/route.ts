import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const guaranteeTypes = await prisma.guaranteeType.findMany();
    return NextResponse.json(guaranteeTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching guarantee types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const newGuaranteeType = await prisma.guaranteeType.create({
      data: { name, description },
    });
    return NextResponse.json(newGuaranteeType, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating guarantee type" },
      { status: 500 }
    );
  }
}
