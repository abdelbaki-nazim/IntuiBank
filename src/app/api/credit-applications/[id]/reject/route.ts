import { NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updatedApplication = await prisma.creditApplication.update({
      where: { id: id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
