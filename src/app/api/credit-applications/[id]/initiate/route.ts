import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params:  Promise<{ id: string }> }
) {
  
  try {
    const {id} = await params

    await prisma.creditApplication.update({
      where: { id: id },
      data: { status: "INITIATED" },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
