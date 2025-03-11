import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface AuditStatsCardProps {
  auditRatio: number | string;
  totalUp: number;
  totalDown: number;
}

const AuditStatsCard: React.FC<AuditStatsCardProps> = ({ auditRatio, totalUp, totalDown }) => {
  const ratioValue = Math.min(Math.max(Number(auditRatio), 0), 2);
  const data = [{ name: "Ratio", value: ratioValue * 50 }];
  const totalUpMB = totalUp ? (Number(totalUp) / 1000).toFixed(2) : "0.00";
  const totalDownMB = totalDown ? (Number(totalDown) / 1000).toFixed(2) : "0.00";
  const maxValue = Math.max(Number(totalUp), Number(totalDown), 1);

  return (
    <div className="audit-card flex items-center p-4">
      {/* Left: Circular gauge */}
      <div className="relative">
        <RadialBarChart
          width={150}
          height={150}
          cx="50%"
          cy="50%"
          innerRadius="80%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" fill="#00ff99" background />
        </RadialBarChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="ratio-number text-white font-bold">{auditRatio}</span>
        </div>
      </div>

      {/* Right: Sent & Received Bars */}
      <div className="flex flex-col ml-4 space-y-4">
        <div className="flex items-center space-x-2">
        <span className="text-white font-medium">Sent&nbsp;&#x2935;</span>

          <div className="w-32 bg-gray-700 h-3 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${(Number(totalUp) / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-white font-medium">{totalUpMB} MB</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Received&nbsp;&#x2934; </span>
          <div className="w-32 bg-gray-700 h-3 rounded">
            <div
              className="h-3 bg-red-500 rounded"
              style={{ width: `${(Number(totalDown) / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-white font-medium">{totalDownMB} MB</span>
        </div>
      </div>
    </div>
  );
};

export default AuditStatsCard;
