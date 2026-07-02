"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PaymentMethodChartProps {
  data: { name: string; value: number; color: string }[];
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm w-full h-[400px]">
      <div className="flex flex-col mb-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Payment Methods</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Distribution of accepted methods</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, "Usage"]}
              contentStyle={{ 
                borderRadius: "8px", 
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value, entry, index) => (
                <span className="text-zinc-700 dark:text-zinc-300 font-medium ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
