import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Skill {
  type: string;
  amount: number;
}

interface RadarChartProps {
  title: string;
  skills: Skill[];
}

const RadarChart = ({ title, skills }: RadarChartProps) => {
  if (!skills || skills.length === 0) {
    return <p className="text-center text-white">No skill data available for {title}</p>;
  }

  // Remove "skill_" prefix from each label
  const skillLabels = skills.map(skill => skill.type.replace(/^skill_/, ""));
  const skillValues = skills.map(skill => skill.amount);

  const chartOptions: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      animations: { enabled: true },
      width: 500,  // Force chart width
      height: 520, // Force chart height
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

      <h2 className="text-white text-2xl font-bold mt-12 mb-1 underline">{title}</h2>
      {/* Fixed container ensures consistent dimensions */}
      <div className="w-[500px] h-[550px] p-4 rounded-xl mx-auto">
        <ApexChart
          options={chartOptions}
          series={chartSeries}
          type="radar"
          width={500}
          height={520}
        />
      </div>
    </div>
  );
};

export default RadarChart;
