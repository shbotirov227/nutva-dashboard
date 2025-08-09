/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SalesChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Sales",
        data: data.map((item) => item.amount),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
}