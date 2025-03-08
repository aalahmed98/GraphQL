import React from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

//A const to represent the two skills charts
const RadarChart = ({ title, skills }) => {
  if (!skills || skills.length === 0) {
    return <p className="text-center text-white">No skill data available for {title}</p>;
  }

  const skillLabels = skills.map(skill => skill.type);
  const skillValues = skills.map(skill => skill.amount);

  const chartOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    xaxis: {
      categories: skillLabels,
      labels: { style: { colors: "#fff", fontSize: "14px" } },
    },
    yaxis: { show: false },
    stroke: { width: 2, colors: ["#8b5cf6"] },
    fill: { opacity: 0.3 },
    markers: {
      size: 5,
      colors: ["#8b5cf6"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: { theme: "dark" },
    grid: { show: true, borderColor: "#333" },
  };

  const chartSeries = [{ name: title, data: skillValues }];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-white text-lg font-bold mb-4">{title}</h2>
      <div className="w-[500px] h-[550px] bg-gray-800 p-4 rounded-xl">
        <ApexChart options={chartOptions} series={chartSeries} type="radar" height={520} />
      </div>
    </div>
  );
};


export default RadarChart;
