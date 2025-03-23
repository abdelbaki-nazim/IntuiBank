import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    if (!body.chequeNumber || !body.requestDate) {
      throw new Error("Le numéro de chèque et la date de demande sont requis.");
    }

    const newCheque = await prisma.cheque.create({
      data: {
        accountId: id,
        chequeNumber: body.chequeNumber,
        requestDate: new Date(body.requestDate),
        issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        receptionDate: body.receptionDate ? new Date(body.receptionDate) : null,
        expirationDate: body.expirationDate
          ? new Date(body.expirationDate)
          : null,
        observation: body.observation || null,
      },
    });
    return NextResponse.json(newCheque, { status: 201 });
  } catch (error: any) {
    console.error("Error creating cheque:", error);
    return NextResponse.json(
      { error: error.message || "Error creating cheque" },
      { status: 500 }
    );
  }
}
