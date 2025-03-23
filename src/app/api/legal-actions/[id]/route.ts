import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../../lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  try {
    const updatedAction = await prisma.creditLegalAction.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error("Error updating legal action", error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
