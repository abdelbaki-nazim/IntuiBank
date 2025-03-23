import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    
    const creditApplicationId = await params;
    const financingsData = await req.json();

    if (!Array.isArray(financingsData)) {
      return NextResponse.json(
        {
          message:
            "Invalid data format. Expected an array of financing records.",
        },
        { status: 400 }
      );
    }

    const creditRecord = await prisma.creditApplication.findUnique({
      where: { id: creditApplicationId.id },
      select: {
        credits: {
          select: { id: true },
        },
      },
    });

    if (!creditRecord || !creditRecord.credits) {
      return NextResponse.json(
        { message: "Credit record not found" },
        { status: 404 }
      );
    }

    const credit = await prisma.creditApplication.findUnique({
      where: {
        id: creditApplicationId.id,
      },
      select: {
        credits: {
          select: {
            id: true,
          },
        },
      },
    });

    const createdFinancings = await Promise.all(
      financingsData.map(async (financing: any) => {
        return await prisma.financing.create({
          data: {
            credit: {
              connect: { id: credit?.credits?.id },
            },
            type: financing.type,
            value: financing.value,
            order: financing.order,
            observation: financing.observation,
          },
        });
      })
    );

    return NextResponse.json(createdFinancings, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
