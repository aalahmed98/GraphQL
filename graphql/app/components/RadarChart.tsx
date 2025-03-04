"use client";

import React from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RadarChart = ({ userSkills }) => {
  if (!userSkills || userSkills.length === 0) {
    return <p className="text-center text-white">No skill data available</p>;
  }

  const skillLabels = userSkills.map(skill => skill.type);
  const skillValues = userSkills.map(skill => skill.amount);

  const chartOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: skillLabels,
      labels: { style: { colors: "#fff", fontSize: "14px" } },
    },
    yaxis: {
      show: false,
    },
    stroke: {
      width: 2,
      colors: ["#8b5cf6"],
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
      colors: ["#8b5cf6"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      show: true,
      borderColor: "#333",
    },
  };

  const chartSeries = [
    {
      name: "User Skills",
      data: skillValues,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">Highest Skills</h1>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-800 rounded-xl">
        <ApexChart options={chartOptions} series={chartSeries} type="radar" height={350} />
        <p className="text-center mt-2">User Skills</p>
      </div>
    </div>
  );
};

export default RadarChart;
