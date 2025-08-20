"use client";

import { AgCharts } from "ag-charts-react";

interface Product {
  productId: string;
  quantity: number;
}

interface Sale {
  buyerName: string;
  phone: string;
  region: string;
  comment: string;
  products: Product[];
}

export function SalesChart({ data }: { data: Sale[] }) {
  const aggregated = data.reduce<Record<string, number>>((acc, sale) => {
    const totalQuantity = sale.products.reduce((sum, p) => sum + p.quantity, 0);
    acc[sale.region] = (acc[sale.region] || 0) + totalQuantity;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([region, total]) => ({
    region,
    total,
  }));

  const options = {
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
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
      },
      {
        type: "number",
        position: "left",
        nice: true,
      },
    ],
    legend: { enabled: false },
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
