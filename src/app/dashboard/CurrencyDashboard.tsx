"use client";

import { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { Loader } from "@progress/kendo-react-indicators";

const formatYearMonth = (dateStr: string): string => {
  const [year, month] = dateStr.split("-");
  return `${year}/${month}`;
};

export default function CurrencyAreaChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const base = "USD";
  const symbols = "EUR,GBP,CHF,CAD";

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 8);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const url = `https://api.frankfurter.app/${formatDate(
      startDate
    )}..${formatDate(endDate)}?from=${base}&to=${symbols}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const transformedData = Object.entries(data.rates)
            .map(([date, rates]) => ({
              date: formatYearMonth(date),
              ...(rates as Record<string, number>),
            }))
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

          const totalPoints = 16;
          const sampledData: any[] = [];
          if (transformedData.length >= totalPoints) {
            const step = Math.floor(transformedData.length / totalPoints);
            for (let i = 0; i < totalPoints; i++) {
              sampledData.push(transformedData[i * step]);
            }
          } else {
            sampledData.push(...transformedData);
          }
          setChartData(sampledData);
          setLoading(false);
        } else {
          setError("Failed to fetch currency data");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching currency data:", err);
        setError("Error fetching currency data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "64px"
        }}
      >
        <Loader type={"pulsing"} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "16px" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Chart
        {...({
          categoryAxis: {
            baseUnit: "months",
            baseUnitStep: 6,
            labels: {
              dateFormats: { months: "yyyy/MM" },
              rotation: 0,
            },
          },
        } as any)}
      >
        <ChartTitle text="Currency Exchange Rates (Last 8 Years)" />
        <ChartLegend position="bottom" />
        <ChartSeries>
          <ChartSeriesItem
            type="area"
            data={chartData}
            field="EUR"
            categoryField="date"
            name="EUR"
          />
          <ChartSeriesItem
            type="area"
            data={chartData}
            field="GBP"
            categoryField="date"
            name="GBP"
          />
          <ChartSeriesItem
            type="area"
            data={chartData}
            field="CHF"
            categoryField="date"
            name="CHF"
          />
          <ChartSeriesItem
            type="area"
            data={chartData}
            field="CAD"
            categoryField="date"
            name="CAD"
          />
        </ChartSeries>
      </Chart>
    </div>
  );
}
