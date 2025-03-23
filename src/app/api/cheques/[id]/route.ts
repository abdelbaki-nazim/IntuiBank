import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cheque = await prisma.cheque.findUnique({
      where: { id: id },
      include: {
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
    if (!cheque) {
      return NextResponse.json({ error: "Cheque not found" }, { status: 404 });
    }
    return NextResponse.json(cheque);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching cheque" },
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
    const updatedCheque = await prisma.cheque.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedCheque);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating cheque" },
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
    const deletedCheque = await prisma.cheque.delete({
      where: { id: id },
    });
    return NextResponse.json(deletedCheque);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting cheque" },
      { status: 500 }
    );
  }
}
