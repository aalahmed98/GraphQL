import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const XPProgressChart = ({ xpData }) => {
  if (!xpData || !Array.isArray(xpData) || xpData.length === 0) {
    return <p className="text-center text-white">No XP data available</p>;
  }

  // Format xpData for Recharts
  const formattedData = xpData.map((entry, index) => ({
    id: index + 1,
    xp: Number(entry.xp),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">XP Progress</h3>
        {/* SVG Icon for XP */}
        <svg className="w-6 h-6 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
   
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="xp" stroke="#00ff99" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      {/* Additional SVG for Display */}
      <div className="flex justify-center mt-4">
        <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  );
};

export default XPProgressChart;
