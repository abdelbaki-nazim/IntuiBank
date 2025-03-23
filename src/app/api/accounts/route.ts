import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        client: {
          include: {
            personMoral: {
              select: {
                companyName: true,
                id: true,
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
        accountPurpose: {
          select: {
            id: true,
            name: true,
          },
        },
        currency: true,
        creditApplications: {
          include: {
            credits: true,
          },
        },
        magneticCards: true,
        cheques: true,
      },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    if (
      !body.userId ||
      !body.accountNumber ||
      !body.accountPurposeId ||
      !body.currencyId ||
      body.currentBalance === undefined ||
      body.currentBalance === null ||
      isNaN(parseFloat(body.currentBalance))
    ) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid." },
        { status: 400 }
      );
    }

    const newAccount = await prisma.account.create({
      data: {
        client: { connect: { id: body.userId } },
        accountNumber: body.accountNumber,
        accountDescription: body.accountDescription,
        accountPurpose: { connect: { id: body.accountPurposeId } },
        currency: { connect: { id: body.currencyId } },
        currentBalance: parseFloat(body.currentBalance),
        openedAt: body.openedAt ? new Date(body.openedAt) : null,
        status: body.status,
        otherAccountPurposes: body.otherAccountPurposes,
        chapter: body.chapter,
        kycDetails: body.kycDetails,
        kycValidated: body.kycValidated,
        observation: body.observation,
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
