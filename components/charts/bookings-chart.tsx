"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BookingsChartProps {
  data?: { name: string; bookings: number }[];
}

export function BookingsChart({ data = [] }: BookingsChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={40}>
        <XAxis 
          dataKey="name" 
          stroke="#71717a" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#71717a" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181b", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}
          itemStyle={{ color: "#fff" }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar 
          dataKey="bookings" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
