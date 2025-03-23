import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.amortizationEntry.findMany({
      orderBy: {},
      include: {
        credit: {
          include: {
            amortizationEntries: {
              orderBy: { installmentNumber: "asc" },
              include: { history: true },
            },
            creditApplication: {
              include: {
                account: {
                  include: {
                    client: {
                      include: {
                        personPhysical: true,
                        personMoral: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
