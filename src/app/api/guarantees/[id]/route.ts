import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data = await request.json();
  try {
    const updatedGuarantee = await prisma.guarantee.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedGuarantee);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
