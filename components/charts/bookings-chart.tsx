"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Tue", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Wed", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Thu", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Fri", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Sat", bookings: Math.floor(Math.random() * 50) + 10 },
  { name: "Sun", bookings: Math.floor(Math.random() * 50) + 10 },
];

export function BookingsChart() {
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
