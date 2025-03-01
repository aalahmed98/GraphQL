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

// Register radar chart components in Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  // Example data for the "Technical Skills" chart
  const technicalSkillsData = {
    labels: ["Prog", "Algo", "Sys-Admin", "Front-End", "Back-End", "Game", "Stats", "Tcp"],
    datasets: [
      {
        label: "Technical Skills",
        data: [8, 7, 6, 6, 5, 4, 4, 3], // Example skill values
        backgroundColor: "rgba(139, 92, 246, 0.2)", // Tailwind 'purple-500' with alpha
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(139, 92, 246)",
      },
    ],
  };

  // Example data for the "Technologies" chart
  const technologiesData = {
    labels: ["Go", "Js", "Html", "Css", "Unix", "Docker", "Sql"],
    datasets: [
      {
        label: "Technologies",
        data: [7, 8, 6, 5, 6, 5, 7],
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(139, 92, 246)",
      },
    ],
  };

  // Optional Chart.js config to tweak how the radar looks
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          color: "#666", // color of the radial lines
        },
        grid: {
          color: "#333", // color of the concentric circles
        },
        ticks: {
          display: false, // hide numeric ticks if you only want the polygons
        },
        pointLabels: {
          color: "#fff", // label color (e.g. "Prog", "Algo", etc.)
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend if you only want the polygon
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div
      // Tailwind classes to create a dark section with a wave pattern background
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center"
      // Optionally add custom background patterns via CSS or a background-image
      // style={{
      //   backgroundImage: `url('/your-wave-pattern.png')`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <h1 className="text-2xl font-bold mb-8">Highest Skills</h1>

      <div className="flex flex-wrap gap-8 justify-center">
        {/* Left Radar Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-800 rounded-xl">
          <Radar data={technicalSkillsData} options={chartOptions} />
          <p className="text-center mt-2">Technical Skills</p>
        </div>

        {/* Right Radar Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-800 rounded-xl">
          <Radar data={technologiesData} options={chartOptions} />
          <p className="text-center mt-2">Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
