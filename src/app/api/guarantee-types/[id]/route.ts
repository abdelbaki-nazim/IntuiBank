import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const guaranteeType = await prisma.guaranteeType.findUnique({
      where: { id: id },
    });
    if (!guaranteeType)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(guaranteeType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching guarantee type" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const updatedGuaranteeType = await prisma.guaranteeType.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedGuaranteeType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating guarantee type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.guaranteeType.delete({ where: { id: id } });
    return NextResponse.json({ message: "Guarantee type deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting guarantee type" },
      { status: 500 }
    );
  }
}
