import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const cartes = await prisma.magneticCard.findMany({
      select: {
        id: true,
        civility: true,
        status: true,
        cardNumber: true,
        cardHolderName: true,
        observation: true,
        cardType: true,
        account: {
          select: {
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
    return NextResponse.json(cartes);
  } catch (error: any) {
    console.log("magnetic card route :" + error);

    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
