import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface XPProgressChartProps {
  xpData: { xp: number | string }[];
}

// Custom tooltip component that only displays the XP value
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300">
        <p className="label text-black">{`XP: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const XPProgressChart: React.FC<XPProgressChartProps> = ({ xpData }) => {
  if (!xpData || xpData.length === 0) {
    return <p className="text-center text-white">No XP data available</p>;
  }

  // Format your data for Recharts, rounding xp to the nearest whole number
  // Remove any extra fields so that the tooltip only sees the xp property
  const formattedData = xpData.map((entry) => ({
    xp: Math.round(Number(entry.xp)),
  }));

  return (
    <div className="w-full bg-card rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-gray-900 dark:text-white">XP Progress</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          {/* Define a gradient for the fill under the line */}
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff99" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00ff99" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          {/* Hide the x-axis completely */}
          <XAxis hide stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip content={<CustomTooltip />} />

          {/* Smooth area line with no dots */}
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#00ff99"
            fill="url(#colorXp)"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPProgressChart;
