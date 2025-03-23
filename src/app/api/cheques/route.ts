import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const cheques = await prisma.cheque.findMany({
      include: {
        account: {
          select: {
            accountNumber : true,
            client: {
              select: {
                id: true,
                type: true,
                personMoral: {
                  select: {
                    id: true,
                    companyName: true,
                  },
                },
                personPhysical: {
                  select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    maidenName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(cheques);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching cheques" },
      { status: 500 }
    );
  }
}
