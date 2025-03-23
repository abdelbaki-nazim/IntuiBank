"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@progress/kendo-react-layout";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import {
  ChartWizard,
  ChartWizardDataRow,
} from "@progress/kendo-react-chart-wizard";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

interface MagneticCardStat {
  cardTypeId: string;
  _count: { cardTypeId: number };
}

interface MagneticCardStatusStat {
  status: string;
  _count: { status: number };
}

interface StatsResponse {
  magneticCardStats: MagneticCardStat[];
  magneticCardStatusStats: MagneticCardStatusStat[];
  magneticCardNamesByStatus: { [key: string]: string[] };
}

interface CardType {
  id: string;
  name: string;
}

const MagneticCardStatsChart: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });
  const [showWizard, setShowWizard] = useState<boolean>(false);

  const statusTranslations: { [key: string]: string } = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    BLOCKED: "Blocked",
    EXPIRED: "Expired",
    LOST: "Lost",
    STOLEN: "Stolen",
    PENDING: "Pending",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, cardTypesRes] = await Promise.all([
          fetch("/api/magnetic-card/statistics", { next: { revalidate: 0 } }),
          fetch("/api/card-types", { next: { revalidate: 0 } }),
        ]);

        if (!statsRes.ok) {
          throw new Error("Failed to fetch magnetic card statistics");
        }
        if (!cardTypesRes.ok) {
          throw new Error("Failed to fetch card types");
        }

        const statsData: StatsResponse = await statsRes.json();
        const cardTypesData: CardType[] = await cardTypesRes.json();

        setStats(statsData);
        setCardTypes(cardTypesData);
      } catch (err: any) {
        setError(err.message);
        setToast({ open: true, message: err.message, severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onWizardClose = useCallback(() => {
    setShowWizard(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Loader size="large" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "40px" }}>
        {error || "Unknown error"}
      </div>
    );
  }

  const horizontalStatusData = Object.keys(statusTranslations).map(
    (statusKey) => {
      const stat = stats.magneticCardStatusStats.find(
        (s) => s.status === statusKey
      );
      return {
        status: statusTranslations[statusKey],
        count: stat ? stat._count.status : 0,
      };
    }
  );

  const chartWizardData: ChartWizardDataRow[] = stats.magneticCardStats.map(
    (stat) => {
      const ct = cardTypes.find((c) => c.id === stat.cardTypeId);
      return [
        { field: "Card Type", value: ct ? ct.name : stat.cardTypeId },
        { field: "Count", value: stat._count.cardTypeId },
      ];
    }
  );

  const horizontalTypeData = cardTypes.map((ct) => {
    const stat = stats.magneticCardStats.find((s) => s.cardTypeId === ct.id);
    return {
      name: ct.name,
      count: stat ? stat._count.cardTypeId : 0,
    };
  });

  const pieChartData = stats.magneticCardStats.map((stat) => {
    const ct = cardTypes.find((c) => c.id === stat.cardTypeId);
    return {
      category: ct ? ct.name : stat.cardTypeId,
      value: stat._count.cardTypeId,
    };
  });

  return (
    <Card style={{ padding: "20px" }}>
      <h2>Magnetic Card Statistics</h2>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => setShowWizard(true)}>Open Chart Wizard</Button>
      </div>
      {showWizard && (
        <ChartWizard data={chartWizardData} onClose={onWizardClose} />
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ flex: "2" }}>
          <h3>Statistics by Status</h3>
          <Grid data={[horizontalStatusData]}>
            {horizontalStatusData.map((item, index) => (
              <GridColumn
                key={index}
                field={`col${index}`}
                title={item.status}
                cell={() => (
                  <td style={{ textAlign: "center" }}>{item.count}</td>
                )}
              />
            ))}
          </Grid>
        </div>
        <div style={{ flex: "1", height: "300px" }}>
          <h3>Distribution by Card Type</h3>
          <Chart>
            <ChartLegend position="top" />
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                data={pieChartData}
                categoryField="category"
                field="value"
              />
            </ChartSeries>
          </Chart>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Statistics by Card Type</h3>
        <Grid data={horizontalTypeData}>
          <GridColumn field="name" title="Card Type" />
          <GridColumn field="count" title="Count" />
        </Grid>
      </div>

      <NotificationGroup
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {toast.open && (
          <Notification
            type={{ style: toast.severity, icon: true }}
            closable={true}
            onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          >
            {toast.message}
          </Notification>
        )}
      </NotificationGroup>
    </Card>
  );
};

export default MagneticCardStatsChart;
