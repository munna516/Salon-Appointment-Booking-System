"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOCK_REVENUE_DATA } from "@/constants/payment";

export function RevenueChart() {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm w-full h-[400px]">
      <div className="flex flex-col mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Monthly Revenue</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Your earnings overview for the last 12 months</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_REVENUE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#71717a" }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: "8px", 
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
              formatter={(value: any) => [`$${value}`, "Revenue"]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#059669"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#059669", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
