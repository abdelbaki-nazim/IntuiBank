import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  const creditAppId = await params;

  if (!creditAppId) {
    return NextResponse.json(
      { message: "Invalid credit application ID" },
      { status: 400 }
    );
  }

  try {
    const creditApp = await prisma.creditApplication.findUnique({
      where: { id: creditAppId.id },
      include: {
        creditType: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!creditApp) {
      return NextResponse.json(
        { message: "Credit application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(creditApp, { status: 200 });
  } catch (error) {
    console.error("Error fetching credit application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params:  Promise<{ id: string }> }
) {
  const creditAppId = await params;

  if (!creditAppId) {
    return NextResponse.json(
      { message: "Invalid credit application ID" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const { creditTypeId, ...restBody } = body;

    const updatedCreditApp = await prisma.creditApplication.update({
      where: { id: creditAppId.id },
      data: {
        ...restBody,
        creditType: {
          connect: {
            id: creditTypeId,
          },
        },
        receptionDate: restBody.receptionDate
          ? new Date(restBody.receptionDate)
          : undefined,
      },
    });

    return NextResponse.json(updatedCreditApp, { status: 200 });
  } catch (error) {
    console.error("Error updating credit application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
