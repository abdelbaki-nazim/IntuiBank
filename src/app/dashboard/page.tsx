"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import CurrencyDashboard from "./CurrencyDashboard";
import KLoader from "../components/loader/KLoader";
import LicenseNotification from "../components/licence-notification/LicenseNotification";

const toChartData = (labels: string[], data: number[]) =>
  labels.map((label, i) => ({
    category: label,
    value: data[i],
  }));

export default function StatisticsDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/statistics", { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching statistics:", err);
        setError("Error fetching statistics");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <KLoader />;
  }

  if (error) {
    return (
      <div style={{ marginTop: "16px" }}>
        <h6 style={{ color: "red" }}>{error}</h6>
      </div>
    );
  }

  // Chart 1: Clients by Status (Pie)
  const clientStatusLabels = stats?.clients
    ? Object.keys(stats.clients.byStatus)
    : undefined;
  const clientStatusCounts = clientStatusLabels
    ? clientStatusLabels.map((status) => stats.clients.byStatus[status])
    : undefined;

  const clientStatusChartData =
    clientStatusLabels && clientStatusCounts
      ? toChartData(clientStatusLabels, clientStatusCounts).map((item) =>
          item.category.toUpperCase() === "ACTIVE"
            ? { ...item, explode: true }
            : item
        )
      : undefined;

  // Chart 2: Clients by Type (Donut)
  const clientTypeLabels = Object.keys(stats.clients.byType);
  const clientTypeCounts = clientTypeLabels.map(
    (type) => stats.clients.byType[type]
  );
  const clientTypeChartData = toChartData(clientTypeLabels, clientTypeCounts);

  // Chart 3: Accounts by Purpose (Pie)
  const accountPurposeLabels = stats.accounts.byPurpose.map(
    (item: any) => item.purpose
  );
  const accountPurposeCounts = stats.accounts.byPurpose.map(
    (item: any) => item.count
  );
  const accountsChartData = toChartData(
    accountPurposeLabels,
    accountPurposeCounts
  );

  // Chart 4: User Roles (Pyramid)
  const userRolesLabels = Object.keys(stats.users.byRole);
  const userRolesData = Object.values(stats.users.byRole);
  const userRolesChartData = toChartData(
    userRolesLabels,
    userRolesData as number[]
  );

  // Chart 5: Credits by State (Column)
  const creditStateLabels = Object.keys(stats.credits.byState);
  const creditStateCounts = creditStateLabels.map(
    (state) => stats.credits.byState[state].count
  );
  const creditStatesChartData = toChartData(
    creditStateLabels,
    creditStateCounts
  );

  // Chart 6: Credit Applications by Status (Column)
  const appStatusLabels = Object.keys(stats.applications.byStatus);
  const appStatusCounts = appStatusLabels.map(
    (status) => stats.applications.byStatus[status].count
  );
  const creditAppsChartData = toChartData(appStatusLabels, appStatusCounts);

  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      <CurrencyDashboard />
      <h4>Client Statistics</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        <Card>
          <div style={{ padding: "16px" }}>
            <h6>Clients by Status</h6>
            <Chart>
              <ChartTitle text="Clients by Status" />
              <ChartLegend position="bottom" />
              <ChartSeries>
                <ChartSeriesItem
                  type="pie"
                  data={clientStatusChartData}
                  field="value"
                  categoryField="category"
                  explodeField="explode"
                  tooltip={{ visible: true }}
                  overlay={{ gradient: "sharpBevel" }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "16px" }}>
            <h6>Clients by Type</h6>
            <Chart>
              <ChartTitle text="Clients by Type" />
              <ChartLegend position="bottom" />
              <ChartSeries>
                <ChartSeriesItem
                  type="donut"
                  data={clientTypeChartData}
                  field="value"
                  categoryField="category"
                  tooltip={{ visible: true }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>
      </div>

      <h4 style={{ marginTop: "32px" }}>Financial & User Statistics</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        <Card>
          <div style={{ padding: "16px" }}>
            <h6>Accounts by Purpose</h6>
            <Chart>
              <ChartTitle text="Accounts by Purpose" />
              <ChartLegend position="bottom" />
              <ChartSeries>
                <ChartSeriesItem
                  type="pie"
                  data={accountsChartData}
                  field="value"
                  categoryField="category"
                  tooltip={{ visible: true }}
                  overlay={{ gradient: "roundedBevel" }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>

        <Card>
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h6>User Roles Distribution</h6>
            <Chart
              style={{ width: 280, height: 360, alignSelf: "center" }}
              seriesColors={["#FCE1D2", "#E6E2AF", "#C8D8E4", "#BFD7EA"]}
            >
              <ChartTitle text="User Roles" />
              <ChartLegend position="bottom" />
              <ChartSeries>
                <ChartSeriesItem
                  type="pyramid"
                  data={userRolesChartData}
                  field="value"
                  categoryField="category"
                  tooltip={{ visible: true }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "16px" }}>
            <h6>Credits by State</h6>
            <Chart>
              <ChartTitle text="Credits by State" />
              <ChartLegend position="top" />
              <ChartSeries>
                <ChartSeriesItem
                  type="column"
                  data={creditStatesChartData}
                  field="value"
                  categoryField="category"
                  color={"#00FF7F"}
                  tooltip={{ visible: true }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "16px" }}>
            <h6>Credit Applications by Status</h6>
            <Chart>
              <ChartTitle text="Credit Applications by Status" />
              <ChartLegend position="top" />
              <ChartSeries>
                <ChartSeriesItem
                  type="column"
                  data={creditAppsChartData}
                  field="value"
                  categoryField="category"
                  tooltip={{ visible: true }}
                />
              </ChartSeries>
            </Chart>
          </div>
        </Card>
      </div>

      <FinancialStatsCard stats={stats} />

      <LicenseNotification />
    </div>
  );
}

interface FinancialStats {
  financial: { totalAssets: number };
  credits: { active: number; riskPercentage: number };
  clients: { recentSignups: number };
}

interface FinancialStatsCardProps {
  stats: FinancialStats;
}

const FinancialStatsCard: React.FC<FinancialStatsCardProps> = ({ stats }) => {
  return (
    <Card style={{ marginTop: "32px", width: "300px" }}>
      <CardHeader>
        <h6>Financial Aggregates &amp; Other Stats</h6>
      </CardHeader>
      <CardBody>
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ fontWeight: "bold", padding: "4px 8px" }}>
                Total assets:
              </td>
              <td style={{ textAlign: "right", padding: "4px 8px" }}>
                {stats.financial.totalAssets?.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "4px 8px" }}>
                Active credits:
              </td>
              <td style={{ textAlign: "right", padding: "4px 8px" }}>
                {stats.credits.active} credits
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "4px 8px" }}>
                Credit risk:
              </td>
              <td style={{ textAlign: "right", padding: "4px 8px" }}>
                {(stats.credits.riskPercentage ?? 0).toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "4px 8px" }}>
                New clients:
              </td>
              <td style={{ textAlign: "right", padding: "4px 8px" }}>
                {stats.clients.recentSignups ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};
