import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_DAILY_REQUESTS || "40", 10);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creditApplicationId } = body;
    if (!creditApplicationId) {
      return NextResponse.json(
        { error: "Credit application ID is required." },
        { status: 400 }
      );
    }

    const creditApp = await prisma.creditApplication.findUnique({
      where: { id: creditApplicationId },
      include: {
        account: { include: { client: true } },
      },
    });

    if (!creditApp) {
      return NextResponse.json(
        { error: "Credit application not found." },
        { status: 404 }
      );
    }

    if ((creditApp.dailyRequestCount || 0) >= MAX_DAILY_REQUESTS) {
      return NextResponse.json(
        { error: "Daily AI assessment limit reached for this application." },
        { status: 429 }
      );
    }

    const clientCreditApps = await prisma.creditApplication.findMany({
      where: {
        account: { clientId: creditApp.account.clientId },
      },
      select: {
        id: true,
        projectCost: true,
        solicitedAmount: true,
        monthlyIncome: true,
        status: true,
      },
    });

    const statusSummary = {
      PENDING: clientCreditApps.filter((app) => app.status === "PENDING")
        .length,
      INITIATED: clientCreditApps.filter((app) => app.status === "INITIATED")
        .length,
      APPROVED: clientCreditApps.filter((app) => app.status === "APPROVED")
        .length,
      REJECTED: clientCreditApps.filter((app) => app.status === "REJECTED")
        .length,
      CANCELED: clientCreditApps.filter((app) => app.status === "CANCELED")
        .length,
    };

    const currentAppData = {
      projectCost: creditApp.projectCost,
      solicitedAmount: creditApp.solicitedAmount,
      monthlyIncome: creditApp.monthlyIncome,
    };

    const prompt = `
In English please, assess the credit risk for an applicant based on the following current application and their credit history:
      
**Current Application:**
- Project Cost: $${currentAppData.projectCost}
- Solicited Amount: $${currentAppData.solicitedAmount}
- Monthly Income: $${currentAppData.monthlyIncome}

**Credit Application History:**
- Total Applications: ${clientCreditApps.length}
- Pending: ${statusSummary.PENDING}
- Initiated: ${statusSummary.INITIATED}
- Approved: ${statusSummary.APPROVED}
- Rejected: ${statusSummary.REJECTED}
- Canceled: ${statusSummary.CANCELED}

Provide a detailed risk assessment report in a json format, dont mention in reponse this request.
{
  "riskScore": number (0-100, where 0 is low risk and 100 is high risk),
  "riskCategory": string ("Low", "Medium", "High"),
  "riskComments": string (detailed explanation),
  "historyImpact": string (how the history affects the assessment)
}
    `;

    const cohereResponse = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseContent =
      cohereResponse.message?.content?.map((e) => e.text) || "";
    if (!responseContent || responseContent.length === 0) {
      throw new Error("Cohere did not return any content.");
    }

    return NextResponse.json(
      { success: true, text: responseContent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in assess-credit API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
