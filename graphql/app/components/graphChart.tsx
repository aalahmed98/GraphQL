import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
      <div className="custom-tooltip bg-card border border-border p-2 rounded shadow">
        <p className="label text-foreground">{`XP: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const XPProgressChart: React.FC<XPProgressChartProps> = ({ xpData }) => {
  if (!xpData || xpData.length === 0) {
    return <p className="text-center text-muted-foreground">No XP data available</p>;
  }

  // Format your data for Recharts, rounding xp to the nearest whole number
  // Remove any extra fields so that the tooltip only sees the xp property
  const formattedData = xpData.map((entry) => ({
    xp: Math.round(Number(entry.xp)),
  }));

  return (
    <div className="w-full bg-card rounded-xl shadow p-0">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={formattedData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
              <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          {/* Minimal grid: only horizontal lines, muted color */}
          {/* Remove CartesianGrid for a cleaner look */}
          <XAxis hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--primary)", fillOpacity: 0.05 }} />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="var(--primary)"
            fill="url(#colorXp)"
            strokeWidth={3}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPProgressChart;
