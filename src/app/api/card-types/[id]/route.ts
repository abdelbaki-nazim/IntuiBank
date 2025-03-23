import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cardType = await prisma.cardType.findUnique({
      where: { id: id },
    });
    if (!cardType)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cardType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching card type" },
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
    const updatedCardType = await prisma.cardType.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedCardType);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating card type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.cardType.delete({ where: { id: id } });
    return NextResponse.json({ message: "Card type deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting card type" },
      { status: 500 }
    );
  }
}
