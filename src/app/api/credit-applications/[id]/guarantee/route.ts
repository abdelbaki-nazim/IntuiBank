import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const {
      guaranteeTypeId,
      guaranteeValue,
      guaranteeDescription,
      expiryDate,
      observation,
    } = body;

    if (!guaranteeTypeId || guaranteeValue == null) {
      return NextResponse.json(
        {
          error:
            "The fields guaranteeType, guaranteeValue, and guaranteeDescription are required.",
        },
        { status: 400 }
      );
    }

    if (typeof guaranteeValue !== "number" || guaranteeValue <= 0) {
      return NextResponse.json(
        { error: "The guarantee value must be a positive number." },
        { status: 400 }
      );
    }

    let parsedExpiryDate = null;
    if (expiryDate) {
      parsedExpiryDate = new Date(expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        return NextResponse.json(
          { error: "La date d'expiration n'est pas valide." },
          { status: 400 }
        );
      }
    }

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

    const guarantee = await prisma.guarantee.create({
      data: {
        credit: {
          connect: {
            id: credit?.credits?.id,
          },
        },
        guaranteeType: {
          connect: {
            id: guaranteeTypeId,
          },
        },
        description: guaranteeDescription,
        value: guaranteeValue,
        expiryDate: parsedExpiryDate ? parsedExpiryDate : undefined,
        observation: observation || undefined,
      },
    });

    return NextResponse.json(guarantee);
  } catch (error) {
    console.log("garantee route ", error);

    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
