import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientId,
      id,
      creditTypeId,
      creditTypeAbbrev,
      creditCode,
      activity,
      sector,
      activityBranch,
      specificZone,
      clientStatus,
      projectCost,
      solicitedAmount,
      receptionDate,
      realEstateToFinance,
      realEstateValue,
      promoter,
      monthlyIncome,
      guaranteeIncome,
      theoreticalInstallment,
      apport,
      pnr,
    } = body;

    if (!clientId || !creditTypeId || !solicitedAmount) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { accounts: true },
    });

    if (!client || client.accounts.length === 0) {
      return NextResponse.json(
        {
          error: "Client must have a bank account",
        },
        { status: 400 }
      );
    }

    const creditApplication = await prisma.creditApplication.create({
      data: {
        account: {
          connect: { id: id },
        },
        creditType: {
          connect: { id: creditTypeId },
        },
        creditTypeAbbrev,
        creditCode,
        activity,
        sector,
        activityBranch,
        specificZone,
        clientStatus,
        projectCost,
        solicitedAmount,
        receptionDate: receptionDate ? new Date(receptionDate) : undefined,
        realEstateToFinance,
        realEstateValue,
        promoter,
        monthlyIncome,
        guaranteeIncome,
        theoreticalInstallment,
        apport,
        pnr,
        status: "PENDING",
      },
    });

    return NextResponse.json(creditApplication, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const demandes = await prisma.creditApplication.findMany({
      include: {
        account: {
          include: {
            client: {
              include: {
                personMoral: true,
                personPhysical: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(demandes);
  } catch (error) {
    console.error("Error fetching credit applications:", error);
    return NextResponse.json(
      { message: "An error has occured" },
      { status: 500 }
    );
  }
}
