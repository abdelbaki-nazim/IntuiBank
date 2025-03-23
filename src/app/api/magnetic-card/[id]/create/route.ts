import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  try {
    const {id} = await params

    const body = await request.json();
    const newCard = await prisma.magneticCard.create({
      data: {
        accountId: id,
        cardNumber: body.cardNumber,
        cardHolderName: body.cardHolderName,
        cvv: body.cvv,
        status: body.status,
        civility: body.civility || null,
        requestDate: body.requestDate ? new Date(body.requestDate) : undefined,
        issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
        deliveryDate: body.deliveryDate
          ? new Date(body.deliveryDate)
          : undefined,
        receptionDate: body.receptionDate
          ? new Date(body.receptionDate)
          : undefined,
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
          : undefined,
        pinCodeDeliveryDate: body.pinCodeDeliveryDate
          ? new Date(body.pinCodeDeliveryDate)
          : undefined,
        otpCodeReceived: body.otpCodeReceived || null,
        otpCodeReceptionDate: body.otpCodeReceptionDate
          ? new Date(body.otpCodeReceptionDate)
          : undefined,
        otpCodeDeliveryDate: body.otpCodeDeliveryDate
          ? new Date(body.otpCodeDeliveryDate)
          : undefined,
        observation: body.observation || null,
        cardTypeId: body.cardTypeId,
      },
    });
    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating magnetic card" },
      { status: 500 }
    );
  }
}
