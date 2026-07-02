"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueChartProps {
  data?: { name: string; total: number }[];
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name" 
          stroke="#71717a" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          stroke="#71717a" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${value}`} 
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181b", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#8b5cf6"
          strokeWidth={3}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
