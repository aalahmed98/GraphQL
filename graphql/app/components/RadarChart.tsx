"use client";

import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = ({ userSkills }) => {
  if (!userSkills || userSkills.length === 0) {
    return <p className="text-center text-white">No skill data available</p>;
  }

  const skillLabels = userSkills.map(skill => skill.type);
  const skillValues = userSkills.map(skill => skill.amount);

  const skillsData = {
    labels: skillLabels,
    datasets: [
      {
        label: "User Skills",
        data: skillValues,
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(139, 92, 246)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: "#666" },
        grid: { color: "#333" },
        ticks: { display: false },
        pointLabels: {
          color: "#fff",
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">Highest Skills</h1>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-800 rounded-xl">
        <Radar data={skillsData} options={chartOptions} />
        <p className="text-center mt-2">User Skills</p>
      </div>
    </div>
  );
};

export default RadarChart;
