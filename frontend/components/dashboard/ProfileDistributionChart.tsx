"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardSummary } from "@/lib/types";

interface ProfileDistributionChartProps {
  distribution: DashboardSummary["profileDistribution"];
}

export function ProfileDistributionChart({ distribution }: ProfileDistributionChartProps) {
  if (distribution.length === 0) {
    return <p className="text-sm text-slate-500">No completed assessments yet.</p>;
  }

  const data = distribution.map(({ code, name, count }) => ({
    label: `${code} · ${name}`,
    count,
  }));

  return (
    <div style={{ height: Math.max(160, data.length * 44) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="label" width={150} />
          <Tooltip />
          <Bar dataKey="count" name="Participants" fill="#4f46e5" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}