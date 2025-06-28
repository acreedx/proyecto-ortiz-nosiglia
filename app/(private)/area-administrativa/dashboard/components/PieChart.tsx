"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Distribución",
        data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: "Distribución de usuarios con roles",
          },
        },
      }}
    />
  );
};

export default PieChart;
