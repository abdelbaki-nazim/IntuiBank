import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  if (typeof data.amountPaid !== "number") {
    return NextResponse.json({ error: "Invalid paid amount" }, { status: 400 });
  }

  try {
    const currentEntry = await prisma.amortizationEntry.findUnique({
      where: { id },
    });
    if (!currentEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const scheduledPayment = currentEntry.scheduledPayment || 0;

    const differential = scheduledPayment - data.amountPaid;

    const updatedEntry = await prisma.amortizationEntry.update({
      where: { id },
      data: {
        amountPaid: data.amountPaid,
        paid: true,
      },
    });

    const nextEntry = await prisma.amortizationEntry.findFirst({
      where: {
        creditId: currentEntry.creditId,
        installmentNumber: currentEntry.installmentNumber + 1,
      },
    });

    if (nextEntry) {
      await prisma.amortizationEntry.update({
        where: { id: nextEntry.id },
        data: {
          carryOverPayment: (nextEntry.carryOverPayment || 0) + differential,
        },
      });
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
