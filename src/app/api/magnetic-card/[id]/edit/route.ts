import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const data: any = {
      cardNumber: body.cardNumber,
      cardHolderName: body.cardHolderName,
      cvv: body.cvv,
      status: body.status,
      cardTypeId: body.cardTypeId,
      civility: body.civility || null,
      requestDate: body.requestDate ? new Date(body.requestDate) : null,
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
      receptionDate: body.receptionDate ? new Date(body.receptionDate) : null,
      expirationDate: body.expirationDate
        ? new Date(body.expirationDate)
        : null,
      address: body.address || null,
      wilaya: body.wilaya || null,
      commune: body.commune || null,
      postalCode: body.postalCode || null,
      deliveryMethod: body.deliveryMethod || "ENVOI",
      creationOrRenewal: body.creationOrRenewal || "CREATION",
      pinCodeReceived: body.pinCodeReceived || null,
      pinCodeReceptionDate: body.pinCodeReceptionDate
        ? new Date(body.pinCodeReceptionDate)
        : null,
      pinCodeDeliveryDate: body.pinCodeDeliveryDate
        ? new Date(body.pinCodeDeliveryDate)
        : null,
      otpCodeReceived: body.otpCodeReceived || null,
      otpCodeReceptionDate: body.otpCodeReceptionDate
        ? new Date(body.otpCodeReceptionDate)
        : null,
      otpCodeDeliveryDate: body.otpCodeDeliveryDate
        ? new Date(body.otpCodeDeliveryDate)
        : null,
      observation: body.observation || null,
    };

    const updatedCard = await prisma.magneticCard.update({
      where: { id: id },
      data,
    });

    return NextResponse.json(updatedCard);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error updating magnetic card" },
      { status: 500 }
    );
  }
}
