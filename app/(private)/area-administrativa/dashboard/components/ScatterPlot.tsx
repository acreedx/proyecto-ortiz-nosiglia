"use client";
import { Scatter } from "react-chartjs-2";

interface ScatterChartProps {
  data: { x: number; y: number }[];
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: "Puntos",
        data,
        backgroundColor: "rgba(75,192,192,1)",
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Eje X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Eje Y",
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
};
