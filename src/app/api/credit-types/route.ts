import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const creditTypes = await prisma.creditType.findMany();
    return NextResponse.json(creditTypes);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching credit types" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const newCreditType = await prisma.creditType.create({
      data: { name, description },
    });
    return NextResponse.json(newCreditType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating credit type" }, { status: 500 });
  }
}

