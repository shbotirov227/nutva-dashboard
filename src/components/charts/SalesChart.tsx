"use client";

import { customChartTheme } from "@/lib/chartTheme";
import { PurchaseRequest } from "@/lib/types";
import { AgCartesianChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";

// interface Product {
//   productId: string;
//   quantity: number;
// }

// interface Sale {
//   buyerName: string;
//   phone: string;
//   region: string;
//   comment: string;
//   products: Product[];
// }

export function SalesChart({ data }: { data: PurchaseRequest[] }) {

  if (!data || data.length === 0) {
    return <p>Ma'lumot yo'q</p>;
  }

  const safeData = Array.isArray(data) ? data : [];


  const aggregated = safeData.reduce<Record<string, number>>((acc, sale) => {
    const totalQuantity = sale.products.reduce((sum, p) => sum + p.quantity, 0);
    acc[sale.region] = (acc[sale.region] || 0) + totalQuantity;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([region, total]) => ({
    region,
    total,
  }));

  const options: AgCartesianChartOptions = {
    data: chartData,
    title: { text: "Sotuvlar bo'yicha diagramma" },
    series: [
      {
        type: "area",
        xKey: "region",
        yKey: "total",
        yName: "Mahsulotlar soni",
        fill: "rgba(75,192,192,0.4)",
        stroke: "rgb(75,192,192)",
      },
    ],
    axes: [
      { type: "category", position: "bottom" },
      { type: "number", position: "left" },
    ],
    theme: customChartTheme,
  };

  return (
    <div className="w-full h-[500px]">
      <AgCharts
        className="h-full w-full"
        data={chartData}
        options={options}
      />
    </div>
  );
}
