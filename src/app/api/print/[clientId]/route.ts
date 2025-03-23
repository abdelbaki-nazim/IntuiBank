import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const { searchParams } = new URL(request.url);
  const tablesParam = searchParams.get("tables");
  let tables: string[] = [];
  if (tablesParam) {
    tables = tablesParam.split(",").map((t) => t.trim());
  }

  const data: any = {};

  try {
    if (tables.includes("client")) {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      });
      data.client = client;
    }
    if (tables.includes("personPhysical")) {
      const personPhysical = await prisma.personPhysical.findUnique({
        where: { clientId },
        include: { activities: true },
      });
      data.personPhysical = personPhysical;
    }
    if (tables.includes("personMoral")) {
      const personMoral = await prisma.personMoral.findUnique({
        where: { clientId },
      });
      data.personMoral = personMoral;
    }
    if (tables.includes("accounts")) {
      const accounts = await prisma.account.findMany({
        where: { clientId },
        include: {
          accountPurpose: true,
          currency: true,
          creditApplications: true,
          magneticCards: true,
          cheques: true,
        },
      });
      data.accounts = accounts;
    }
    if (tables.includes("identityDocuments")) {
      const identityDocuments = await prisma.identityDocument.findMany({
        where: { clientId },
      });
      data.identityDocuments = identityDocuments;
    }
    if (tables.includes("creditApplications")) {
      const creditApplications = await prisma.creditApplication.findMany({
        where: { clientId },
        include: { credits: true },
      });
      data.creditApplications = creditApplications;
    }
    if (tables.includes("credits")) {
      const credits = await prisma.credit.findMany({
        where: {
          creditApplication: { clientId },
        },
        include: {
          amortizationEntries: true,
          guarantees: true,
          financings: true,
          legalAction: true,
        },
      });
      data.credits = credits;
    }
    if (tables.includes("amortizationEntries")) {
      const amortizationEntries = await prisma.amortizationEntry.findMany({
        where: {
          credit: {
            creditApplication: { clientId },
          },
        },
      });
      data.amortizationEntries = amortizationEntries;
    }
    if (tables.includes("guarantees")) {
      const guarantees = await prisma.guarantee.findMany({
        where: {
          credit: {
            creditApplication: { clientId },
          },
        },
        include: { guaranteeType: true },
      });
      data.guarantees = guarantees;
    }
    if (tables.includes("financings")) {
      const financings = await prisma.financing.findMany({
        where: {
          credit: {
            creditApplication: { clientId },
          },
        },
      });
      data.financings = financings;
    }
    if (tables.includes("creditLegalActions")) {
      const creditLegalActions = await prisma.creditLegalAction.findMany({
        where: {
          credit: {
            creditApplication: { clientId },
          },
        },
      });
      data.creditLegalActions = creditLegalActions;
    }
    if (tables.includes("currencies")) {
      const currencies = await prisma.currency.findMany();
      data.currencies = currencies;
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching print data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
