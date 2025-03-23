import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const credits = await prisma.credit.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        legalAction: true,
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
    });
    return NextResponse.json(credits);
  } catch (error) {
    console.error("Error loading credits and legal actions", error);
    return NextResponse.json(
      { error: "Error loading credits and legal actions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAction = await prisma.creditLegalAction.create({
      data,
    });
    return NextResponse.json(newAction, { status: 201 });
  } catch (error) {
    console.error("Error creating legal action", error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
