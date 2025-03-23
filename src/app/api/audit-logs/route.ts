import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = searchParams.get("skip");
  const take = searchParams.get("take");
  const skipNumber = skip ? parseInt(skip, 10) : 0;
  const takeNumber = take ? parseInt(take, 10) : 20;

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { loggedAt: "desc" },
      skip: skipNumber,
      take: takeNumber,
      include: {
        user: true,
      },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
