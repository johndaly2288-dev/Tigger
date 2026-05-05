'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SentimentData {
  source: string;
  sentiment: number;
}

interface SentimentChartProps {
  data: SentimentData[];
}

export default function SentimentChart({ data }: SentimentChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[350px] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Charts...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px] flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Sentiment by Source</h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="source" 
              type="category" 
              tick={{ fontSize: 10, fontWeight: 800, fill: '#111827' }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-100 shadow-lg rounded-lg text-xs">
                      <p className="font-bold">{payload[0].payload.source}</p>
                      <p className="text-blue-600 font-bold">Sentiment: {payload[0].value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="sentiment" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.sentiment > 70 ? '#10b981' : entry.sentiment > 40 ? '#2563eb' : '#dc2626'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-auto pt-4 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2">
        <span className="text-red-500">Negative</span>
        <span>Neutral</span>
        <span className="text-emerald-500">Positive</span>
      </div>
    </div>
  );
}
