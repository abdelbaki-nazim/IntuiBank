import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const purpose = await prisma.accountPurpose.findUnique({
      where: { id: id },
    });
    if (!purpose)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(purpose);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching account purpose" },
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
    const updatedPurpose = await prisma.accountPurpose.update({
      where: { id: id },
      data: body,
    });
    return NextResponse.json(updatedPurpose);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating account purpose" },
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

    await prisma.accountPurpose.delete({ where: { id: id } });
    return NextResponse.json({ message: "Account purpose deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting account purpose" },
      { status: 500 }
    );
  }
}
