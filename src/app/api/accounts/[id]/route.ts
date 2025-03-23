import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accountId = await params;

    const account = await prisma.account.findUnique({
      where: { id: accountId.id },
      include: {
        client: {
          select: {
            id: true,
            type: true,
            status: true,
            personMoral: {
              select: {
                companyName: true,
              },
            },
            personPhysical: {
              select: {
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
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    const [
      creditApplicationsCount,
      creditsCount,
      magneticCardsCount,
      chequesCount,
    ] = await Promise.all([
      prisma.creditApplication.count({
        where: { clientId: account.id },
      }),
      prisma.credit.count({
        where: {
          creditApplication: {
            clientId: account.id,
          },
        },
      }),
      prisma.magneticCard.count({
        where: { accountId: account.id },
      }),
      prisma.cheque.count({
        where: { accountId: account.id },
      }),
    ]);

    const acc = {
      ...account,
      _count: {
        creditApplications: creditApplicationsCount,
        credits: creditsCount,
        magneticCards: magneticCardsCount,
        cheques: chequesCount,
      },
    };

    return NextResponse.json(acc);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accountId = await params;
    const body = await request.json();

    const updatedAccount = await prisma.account.update({
      where: { id: accountId.id },
      data: {
        accountDescription: body.accountDescription,
        accountPurpose: body.accountPurposeId
          ? { connect: { id: body.accountPurposeId } }
          : undefined,
        currency: body.currencyId
          ? { connect: { id: body.currencyId } }
          : undefined,
        currentBalance:
          body.currentBalance !== undefined
            ? parseFloat(body.currentBalance)
            : undefined,
        openedAt: body.openedAt ? new Date(body.openedAt) : undefined,
        status: body.status,
        otherAccountPurposes: body.otherAccountPurposes,
        chapter: body.chapter,
        kycDetails: body.kycDetails,
        kycValidated: body.kycValidated,
        observation: body.observation,
      },
    });
    return NextResponse.json(updatedAccount);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
