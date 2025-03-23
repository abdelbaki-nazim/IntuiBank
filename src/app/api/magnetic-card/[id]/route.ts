import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const card = await prisma.magneticCard.findUnique({
      where: { id: id },
      include: {
        cardType: true,
        account: {
          include: {
            client: {
              include: {
                personMoral: true,
                personPhysical: true,
              },
            },
          },
        },
      },
    });
    if (!card) {
      return NextResponse.json(
        { error: "Magnetic card not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching magnetic card" },
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
    const updatedCard = await prisma.magneticCard.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedCard);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating magnetic card" },
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

    const deletedCard = await prisma.magneticCard.delete({
      where: { id: id },
    });
    return NextResponse.json(deletedCard);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting magnetic card" },
      { status: 500 }
    );
  }
}
