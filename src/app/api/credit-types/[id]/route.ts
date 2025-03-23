import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const creditType = await prisma.creditType.findUnique({
      where: { id: id },
    });
    if (!creditType)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(creditType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching credit type" },
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
    const updatedCreditType = await prisma.creditType.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedCreditType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating credit type" },
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

    await prisma.creditType.delete({ where: { id: id } });
    return NextResponse.json({ message: "Credit type deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting credit type" },
      { status: 500 }
    );
  }
}
