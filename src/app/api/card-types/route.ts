import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const cardTypes = await prisma.cardType.findMany();
    return NextResponse.json(cardTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching card types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const newCardType = await prisma.cardType.create({
      data: { name, description },
    });
    return NextResponse.json(newCardType, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating card type" },
      { status: 500 }
    );
  }
}
