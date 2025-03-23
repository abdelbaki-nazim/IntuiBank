import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const currencies = await prisma.currency.findMany();
    return NextResponse.json(currencies);
  } catch (error) {
    return NextResponse.json(
      { error: "Couldn't retrieve currencies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, name, symbol, isActive } = await req.json();

    if (!code || !name) {
      return NextResponse.json(
        { error: "Code and name required" },
        { status: 400 }
      );
    }

    const newCurrency = await prisma.currency.create({
      data: { code, name, symbol, isActive },
    });

    return NextResponse.json(newCurrency, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
