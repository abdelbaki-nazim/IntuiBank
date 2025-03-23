import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(request: Request) {
  try {
    const magneticCardStats = await prisma.magneticCard.groupBy({
      by: ["cardTypeId"],
      _count: { cardTypeId: true },
    });

    const magneticCardStatusStats = await prisma.magneticCard.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const cards = await prisma.magneticCard.findMany({
      select: {
        status: true,
        cardType: {
          select: {
            name: true,
          },
        },
      },
    });

    const magneticCardNamesByStatus: { [key: string]: string[] } = {};

    cards.forEach((card) => {
      const status = card.status;
      const cardName = card.cardType.name;
      if (magneticCardNamesByStatus[status]) {
        if (!magneticCardNamesByStatus[status].includes(cardName)) {
          magneticCardNamesByStatus[status].push(cardName);
        }
      } else {
        magneticCardNamesByStatus[status] = [cardName];
      }
    });

    return NextResponse.json(
      {
        magneticCardStats,
        magneticCardStatusStats,
        magneticCardNamesByStatus,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching magnetic card statistics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
