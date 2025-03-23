import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const financings = await prisma.financing.findMany({
      orderBy: { order: "asc" },
      include: {
        credit: {
          include: {
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
    return NextResponse.json(financings);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured"},
      { status: 500 }
    );
  }
}
