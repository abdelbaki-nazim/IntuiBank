import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const [
      userStats,
      clientStatusStats,
      clientTypeStats,
      recentClientSignups,
      accountStats,
      creditStateStats,
      creditApplications,
      totalBalances,
      activeCurrencies,
      recentAudits,
      loginStats,
      creditRisk,
      firstAudit,
      auditCount,
      totalUsers,
      totalClients,
      totalCurrencies,
    ] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: true }),
      prisma.client.groupBy({ by: ["status"], _count: true }),
      prisma.client.groupBy({ by: ["type"], _count: true }),
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.account.groupBy({
        by: ["accountPurposeId"],
        _count: true,
        _sum: { currentBalance: true },
      }),
      prisma.credit.groupBy({
        by: ["status"],
        _count: true,
        _sum: { principalAmount: true },
      }),
      prisma.creditApplication.groupBy({
        by: ["status"],
        _count: true,
        _avg: { solicitedAmount: true },
      }),
      prisma.account.aggregate({
        _sum: { currentBalance: true },
        _avg: { currentBalance: true },
      }),
      prisma.currency.count({ where: { isActive: true } }),
      prisma.auditLog.findMany({
        orderBy: { loggedAt: "desc" },
        take: 10,
        include: { user: true },
      }),
      prisma.loginLog.groupBy({ by: ["isSuccess"], _count: true }),
      prisma.credit.aggregate({
        _count: { id: true },
        where: { status: { in: ["DEFAULTED", "SUSPENDED"] } },
      }),
      prisma.auditLog.findFirst(),
      prisma.auditLog.count(),
      prisma.user.count(),
      prisma.client.count(),
      prisma.currency.count(),
    ]);

    const dailyAverage = firstAudit
      ? auditCount /
        Math.ceil(
          (Date.now() - firstAudit.loggedAt.getTime()) / (1000 * 3600 * 24)
        )
      : 0;

    const accountsByPurpose = await Promise.all(
      accountStats.map(async (stat) => {
        const purpose = await prisma.accountPurpose.findUnique({
          where: { id: stat.accountPurposeId },
        });
        return {
          purpose: purpose?.name,
          count: stat._count,
          totalBalance: stat._sum.currentBalance,
        };
      })
    );

    const [
      activeCredits,
      totalLoginLogs,
      failedLoginAvg,
      pendingCreditApplications,
      activeCreditPortfolio,
    ] = await Promise.all([
      prisma.credit.count({ where: { status: "ACTIVE" } }),
      prisma.loginLog.count(),
      prisma.user.aggregate({ _avg: { failedLoginAttempts: true } }),
      prisma.creditApplication.aggregate({
        _sum: { solicitedAmount: true },
        where: { status: "PENDING" },
      }),
      prisma.credit.aggregate({
        _sum: { principalAmount: true },
        where: { status: "ACTIVE" },
      }),
    ]);

    const successLoginCount = loginStats.find((s) => s.isSuccess)?._count || 0;
    const successRate =
      totalLoginLogs > 0 ? (successLoginCount / totalLoginLogs) * 100 : 0;

    const statistics = {
      users: {
        total: totalUsers,
        byRole: userStats.reduce(
          (acc, { role, _count }) => ({
            ...acc,
            [role.toLowerCase()]: _count,
          }),
          {}
        ),
      },
      clients: {
        total: totalClients,
        byStatus: clientStatusStats.reduce(
          (acc, { status, _count }) => ({
            ...acc,
            [status.toLowerCase()]: _count,
          }),
          {}
        ),
        byType: clientTypeStats.reduce(
          (acc, { type, _count }) => ({
            ...acc,
            [type.toLowerCase()]: _count,
          }),
          {}
        ),
      },
      accounts: {
        total: await prisma.account.count(),
        byPurpose: accountsByPurpose,
        averageBalance: totalBalances._avg.currentBalance,
        totalSystemBalance: totalBalances._sum.currentBalance,
      },
      credits: {
        active: activeCredits,
        byState: creditStateStats.reduce(
          (acc, { status, _count, _sum }) => ({
            ...acc,
            [status.toLowerCase()]: {
              count: _count,
              totalAmount: _sum.principalAmount,
            },
          }),
          {}
        ),
        riskPercentage:
          (creditRisk._count.id / (await prisma.credit.count())) * 100,
      },
      applications: {
        total: await prisma.creditApplication.count(),
        byStatus: creditApplications.reduce(
          (acc, { status, _count, _avg }) => ({
            ...acc,
            [status.toLowerCase()]: {
              count: _count,
              averageAmount: _avg.solicitedAmount,
            },
          }),
          {}
        ),
      },
      system: {
        currencies: {
          active: activeCurrencies,
          total: totalCurrencies,
        },
        auditTrail: {
          recentActions: recentAudits.map((audit) => ({
            action: audit.actionType,
            entity: audit.affectedEntity,
            user: audit.user.email,
            timestamp: audit.loggedAt,
          })),
          dailyAverage,
        },
        auth: {
          successRate,
          failedAttempts: failedLoginAvg,
        },
      },
      financial: {
        totalAssets: totalBalances._sum.currentBalance,
        pendingCreditApplications,
        activeCreditPortfolio,
      },
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("[SUPERADMIN_STATS_ERROR]", error);
    return new NextResponse("An error has occured", { status: 500 });
  }
}
