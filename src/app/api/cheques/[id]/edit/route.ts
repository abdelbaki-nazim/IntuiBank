import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const {id} = await params

    const body = await request.json();

    if (!body.chequeNumber || !body.requestDate) {
      return NextResponse.json(
        { error: "Le numéro de chèque et la date de demande sont requis." },
        { status: 400 }
      );
    }

    const data = {
      chequeNumber: body.chequeNumber,
      requestDate: new Date(body.requestDate),
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
      receptionDate: body.receptionDate ? new Date(body.receptionDate) : null,
      expirationDate: body.expirationDate
        ? new Date(body.expirationDate)
        : null,
      observation: body.observation || null,
    };

    const updatedCheque = await prisma.cheque.update({
      where: { id: id },
      data,
    });

    return NextResponse.json(updatedCheque, { status: 200 });
  } catch (error: any) {
    console.error("Error updating cheque:", error);
    return NextResponse.json(
      { error: error.message || "Error updating cheque" },
      { status: 500 }
    );
  }
}
