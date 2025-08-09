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

interface VisitorsData {
  date: string;
  count: number;
}

interface VisitorsChartProps {
  data: VisitorsData[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Tashriflar",
        data: data.map((item) => item.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
        },
      },
      title: {
        display: true,
        text: "Tashriflar grafigi",
        color: "hsl(var(--foreground))",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "hsl(var(--foreground))",
        },
      },
      y: {
        ticks: {
          color: "hsl(var(--foreground))",
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
}