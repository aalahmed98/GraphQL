import React from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RadarChart = ({ title, skills }) => {
  if (!skills || skills.length === 0) {
    return <p className="text-center text-white">No skill data available for {title}</p>;
  }

  const skillLabels = skills.map(skill => skill.type);
  const skillValues = skills.map(skill => skill.amount);

  const chartOptions = {
    chart: { type: "radar", toolbar: { show: false } },
    xaxis: {
      categories: skillLabels,
      labels: { style: { colors: "#fff", fontSize: "14px" } },
    },
    yaxis: { show: false },
    stroke: { width: 2, colors: ["#8b5cf6"] },
    fill: { opacity: 0.2 },
    markers: {
      size: 4,
      colors: ["#8b5cf6"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: { theme: "dark" },
    grid: { show: true, borderColor: "#333" },
  };

  const chartSeries = [{ name: title, data: skillValues }];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-800 rounded-xl">
        <ApexChart options={chartOptions} series={chartSeries} type="radar" height={350} />
        <p className="text-center mt-2">{title}</p>
      </div>
    </div>
  );
};

export default RadarChart;
