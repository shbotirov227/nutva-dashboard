import { AgChartThemeName } from "ag-charts-community";

// src/lib/chartTheme.ts
export const customChartTheme = {
  baseTheme: "ag-default" as AgChartThemeName,
  overrides: {
    common: {
      title: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: "sans-serif",
        color: "#1a202c",
      },
      legend: {
        enabled: false,
      },
      series: {
        area: {
          strokeWidth: 1,
          marker: {
            enabled: true,
            stroke: "#fff",
            strokeWidth: 2,
            size: 7,
            shape: "circle",
            fill: "#2c6ed5",
          },
          highlight: {
            item: {
              fill: "#2c6ed5",
              stroke: "#2c6ed5",
            },
          },
        },
      },
      axes: {
        number: {
          nice: true,
          line: { width: 1, stroke: "#d1d5db" },
          tick: { size: 6, width: 1, stroke: "#9ca3af" },
          label: { fontSize: 12, color: "#374151" },
        },
        category: {
          line: { width: 1, stroke: "#d1d5db" },
          tick: { size: 6, width: 1, stroke: "#9ca3af" },
          label: { fontSize: 12, color: "#374151" },
        },
        time: {
          line: { width: 1, stroke: "#d1d5db" },
          tick: { size: 6, width: 1, stroke: "#9ca3af" },
          label: { fontSize: 12, color: "#374151" },
        },
      },
    },
  },
};
