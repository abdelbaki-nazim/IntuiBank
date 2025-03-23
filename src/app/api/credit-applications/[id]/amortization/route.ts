import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";
import { parse } from "date-fns";

function removeDuplicates(schedule: any[]): any[] {
  const uniqueKeys = new Set();
  return schedule.filter((entry) => {
    const key = entry.installmentNumber;
    if (key === undefined || key === null) return true;
    if (uniqueKeys.has(key)) return false;
    uniqueKeys.add(key);
    return true;
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();
    let { schedule } = body;

    if (!Array.isArray(schedule)) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    schedule = removeDuplicates(schedule);

    const credit = await prisma.creditApplication.findUnique({
      where: {
        id: id,
      },
      select: {
        credits: {
          select: {
            id: true,
          },
        },
      },
    });

    const creditId = credit?.credits?.id;

    if (!creditId) {
      return NextResponse.json(
        { error: "No associated credits" },
        { status: 400 }
      );
    }

    const existingEntries = await prisma.amortizationEntry.findMany({
      where: { creditId },
    });
    if (existingEntries.length > 0) {
      return NextResponse.json(
        { error: "Existing entries have been found" },
        { status: 400 }
      );
    }

    const amortizationEntries = await Promise.all(
      schedule.map(async (entry: any) => {
        if (
          entry.installmentNumber == null ||
          !entry.dueDate ||
          entry.scheduledPayment == null
        ) {
          throw new Error("All fields are required");
        }
        return prisma.amortizationEntry.create({
          data: {
            credit: {
              connect: {
                id: creditId,
              },
            },
            installmentNumber: entry.installmentNumber,
            dueDate: parse(entry.dueDate, "dd/MM/yyyy", new Date()),
            principalPortion: parseFloat(entry.principalPortion),
            interestPortion: parseFloat(entry.interestPortion),
            scheduledPayment: parseFloat(entry.scheduledPayment),
            amountPaid: 0,
            carryOverPayment: 0,
            remainingBalance: parseFloat(entry.remainingBalance),
          },
        });
      })
    );

    await prisma.credit.update({
      where: { id: creditId },
      data: {
        creditApplication: {
          update: {
            status: "APPROVED",
          },
        },
      },
    });

    return NextResponse.json(amortizationEntries);
  } catch (error) {
    console.log("Amortization route :" + error);

    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
