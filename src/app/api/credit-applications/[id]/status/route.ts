import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);

  const relatedDatas = searchParams.get("getAllRelatedData");

  const includeRelatedData = relatedDatas === "true";

  try {
    const applicationId = await params;

    const [creditApplicationDetails, creditDetails] = await Promise.all([
      prisma.creditApplication.findFirst({
        where: { id: applicationId.id },
        include: {
          creditType: {
            select: {
              id: true,
              name: true,
            },
          },
          account: includeRelatedData
            ? {
                include: {
                  client: {
                    include: {
                      identityDocuments: true,
                      personMoral: true,
                      personPhysical: true,
                    },
                  },
                },
              }
            : undefined,
        },
      }),
      prisma.credit.findFirst({
        where: { CreditApplicationId: applicationId.id },
      }),
    ]);

    const creditId = creditDetails?.id;

    const [guarantee, financing, amortization] = creditId
      ? await Promise.all([
          prisma.guarantee.findFirst({
            where: { creditId },
          }),
          prisma.financing.findMany({
            where: { creditId },
            orderBy: {
              order: "asc",
            },
          }),
          prisma.amortizationEntry.findMany({
            where: { creditId },
            orderBy: {
              installmentNumber: "asc",
            },
          }),
        ])
      : [null, null, null];

    const responseData = {
      CreditApplication: {
        exists: Boolean(creditApplicationDetails),
        data: creditApplicationDetails || null,
      },
      creditDetails: {
        exists: Boolean(creditDetails),
        data: creditDetails || null,
      },
      guarantee: {
        exists: Boolean(guarantee),
        data: guarantee || null,
      },
      amortization: {
        exists: (amortization ?? []).length > 0,
        data: amortization || null,
      },
      financing: {
        exists: (financing ?? []).length > 0,
        data: financing || null,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
