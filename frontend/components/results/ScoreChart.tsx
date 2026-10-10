"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DIMENSION_COLORS, DIMENSION_ORDER, MAX_SCORE } from "@/lib/dimensions";
import type { Scores } from "@/lib/types";

export function ScoreChart({ scores }: { scores: Scores }) {
  const data = DIMENSION_ORDER.map((dimension) => ({ dimension, score: scores[dimension] }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="dimension" />
          <YAxis domain={[0, MAX_SCORE]} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map(({ dimension }) => (
              <Cell key={dimension} fill={DIMENSION_COLORS[dimension]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}