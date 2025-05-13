"use client"; // necesario si usas Next 13+ con Server Components

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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  data: number[];
}

export default function LineChart({ labels, data }: LineChartProps) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Ventas",
            data,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: "Citas del último año",
          },
        },
      }}
    />
  );
}
