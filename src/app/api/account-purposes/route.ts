import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const accountPurposes = await prisma.accountPurpose.findMany();
    return NextResponse.json(accountPurposes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching account purposes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, isActive } = body;
    const newPurpose = await prisma.accountPurpose.create({
      data: { name, description, isActive },
    });
    return NextResponse.json(newPurpose, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating account purpose" },
      { status: 500 }
    );
  }
}
