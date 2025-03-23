import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const guarantees = await prisma.guarantee.findMany({
      orderBy: { createdAt: "desc" },
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
        guaranteeType: true,
      },
    });
    return NextResponse.json(guarantees);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured"  },
      { status: 500 }
    );
  }
}
