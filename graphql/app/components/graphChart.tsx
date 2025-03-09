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

const XPProgressChart = ({ xpData }) => {
  if (!xpData || xpData.length === 0) {
    return <p className="text-center text-white">No XP data available</p>;
  }

  // Format your data for Recharts
  const formattedData = xpData.map((entry, index) => ({
    id: index + 1,
    xp: Number(entry.xp),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">XP Progress</h3>
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
          {/* Hide X-axis labels; remove `hide` if you want them visible */}
          <XAxis hide stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />

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

