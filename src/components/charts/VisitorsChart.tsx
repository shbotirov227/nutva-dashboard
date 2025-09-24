"use client";

import { AgCharts } from "ag-charts-react";
import { formatDate } from "@/lib/formatDate";
import { customChartTheme } from "@/lib/chartTheme";
import { AgCartesianChartOptions } from "ag-charts-community";
import { Visit } from "@/lib/types";

// interface VisitorsData {
//   date: string;
//   totalVisits: number;
// }

interface VisitorsChartProps {
  data: Visit[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const chartData = data?.map((item) => ({
    date:  new Date(item.date),
    totalVisits: item.totalVisits,
  }));

  const options: AgCartesianChartOptions = {
    data: chartData,
    title: { text: "Tashriflar grafigi" },
    series: [
      {
        type: "area",
        xKey: "date",
        yKey: "totalVisits",
        yName: "Tashriflar",
        stroke: "#2c6ed5",
        fill: {
          type: "gradient",
          colorStops: [
            { color: "#7da9e8", stop: 0.2 },
            { color: "#2c6ed5", stop: 1 },
          ],
        },
        tooltip: {
          renderer: ({ datum }: { datum: Visit }) => {
            return {
              content: `<b>${formatDate(datum.date)}</b><br/>Tashriflar: ${datum.totalVisits}`,
            } as any;
          },
        },
      },
    ],
    axes: [
      {
        type: "time",
        position: "bottom",
        label: { format: "%d.%m.%Y" },
      },
      { type: "number", position: "left" },
    ],
    theme: customChartTheme,
  };

  return (
    <div className="w-full h-[500px]">
      <AgCharts className="h-full w-full" data={chartData} options={options} />
    </div>
  );
}
