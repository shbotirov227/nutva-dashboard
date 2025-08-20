"use client";

import { AgCharts } from "ag-charts-react";
import { formatDate } from "@/lib/formatDate";

interface VisitorsData {
  date: string;
  totalVisits: number;
}

interface VisitorsChartProps {
  data: VisitorsData[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    totalVisits: item.totalVisits,
  }));

  const options = {
    data: chartData,
    theme: "ag-default",
    title: { text: "Tashriflar grafigi" },
    series: [
      {
        type: "area",
        xKey: "date",
        yKey: "totalVisits",
        yName: "Tashriflar",
        // fill: "rgba(255, 99, 132, 0.2)",
        stroke: "#2c6ed5",
        fill: {
          type: "gradient",
          colorStops: [
            // { color: "#ffffff", stop: 0 },
            { color: "#7da9e8", stop: 0.2 },
            { color: "#2c6ed5", stop: 1 },
          ],
        },
        strokeWidth: 1,
        cornerRadius: 3,
        marker: {
          enabled: true,
          stroke: "#fff",
          strokeWidth: 2,
          size: 7,
          shape: "circle",
          fill: "#2c6ed5",
        },
        tooltip: {
          renderer: ({ datum }: { datum: VisitorsData }) => {
            return {
              content: `<b>${formatDate(datum.date)}</b><br/>Tashriflar: ${datum.totalVisits}`,
            };
          },
          enabled: true,
          format: "Tashriflar: {totalVisits}",
          valueFormatter: ({ value }: { value: number }) => `${value}`,
        },
        highlightStyle: {
          item: {
            fill: "#2c6ed5",
            stroke: "#2c6ed5",
          },
        },
        label: {
          enabled: false,
          formatter: ({ value }: { value: number }) => `${value}`,
        },
      },
    ],
    axis: [
      {
        type: "time",
        position: "bottom",
        label: { format: "%d.%m.%Y" },
        tick: { size: 0 },
      },
      {
        type: "number",
        position: "left",
        nice: true,
      },
    ],
    legend: false,
  };

  return (
    <div className="w-full h-[500px]">
      <AgCharts className="h-full w-full" options={options} />
    </div>
  );
}
