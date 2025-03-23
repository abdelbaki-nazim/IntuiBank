import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
      creditNumber,
      creditTypeId,
      principalAmount,
      interestRate,
      termInMonths,
      startDate,
      endDate,
      monthlyInstallment,
      approvedAmount,
      transmissionDate,
      accordRecu,
      accordDate,
      deferredMonths,
      bonification,
      amountInLetter,
      secondaryRC,
      rcDate,
      accountNumber,
      clientIdentifier,
      authorizationNumber,
      authorizationDate,
      decisionDate,
      scheduledDueDate,
      authorizedAmount,
      mobilisedAmount,
      disbursementDate,
      numberOfEffects,
      firstDueDate,
      lastDueDate,
      initialDossier,
      dossierNumber,
      amendment,
      observation,
    } = body;

    const existingCredit = await prisma.credit.findUnique({
      where: {
        CreditApplicationId: id,
      },
    });

    if (existingCredit) {
      return NextResponse.json(
        { error: "A credit already exists" },
        { status: 400 }
      );
    }

    await prisma.credit.create({
      data: {
        creditApplication: {
          connect: {
            id: id,
          },
        },
        creditNumber,
        principalAmount,
        interestRate,
        termInMonths,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        monthlyInstallment,
        approvedAmount,
        transmissionDate: transmissionDate
          ? new Date(transmissionDate)
          : undefined,
        accordRecu,
        accordDate: accordDate ? new Date(accordDate) : undefined,
        deferredMonths,
        bonification,
        amountInLetter,
        secondaryRC,
        rcDate: rcDate ? new Date(rcDate) : undefined,
        accountNumber,
        clientIdentifier,
        authorizationNumber,
        authorizationDate: authorizationDate
          ? new Date(authorizationDate)
          : undefined,
        decisionDate: decisionDate ? new Date(decisionDate) : undefined,
        scheduledDueDate: scheduledDueDate
          ? new Date(scheduledDueDate)
          : undefined,
        authorizedAmount,
        mobilisedAmount,
        disbursementDate: disbursementDate
          ? new Date(disbursementDate)
          : undefined,
        numberOfEffects,
        firstDueDate: firstDueDate ? new Date(firstDueDate) : undefined,
        lastDueDate: lastDueDate ? new Date(lastDueDate) : undefined,
        initialDossier,
        dossierNumber,
        amendment,
        observation,
        creditType: {
          connect: {
            id: creditTypeId,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
