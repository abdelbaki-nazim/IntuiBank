import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const currency = await prisma.currency.findUnique({
      where: { id: id },
    });
    if (!currency)
      return NextResponse.json(
        { error: "Currency not found" },
        { status: 404 }
      );
    return NextResponse.json(currency);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching currency" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const updatedCurrency = await prisma.currency.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedCurrency);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating currency" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.currency.delete({ where: { id: id } });
    return NextResponse.json({ message: "Currency deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting currency" },
      { status: 500 }
    );
  }
}
