"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { InterviewReportSummary } from "@/types/interview";

const ACCENT = "#6366f1"; // indigo-500 — validated 3:1+ against the gray-900 surface
const SURFACE = "#111827"; // gray-900 card surface, used as the marker ring
const GRID = "#1f2937"; // gray-800 hairline
const MUTED_TEXT = "#6b7280"; // gray-500 axis ink

interface ScorePoint {
  date: number;
  score: number;
  title: string;
}

function formatTick(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface TooltipContentProps {
  active?: boolean;
  payload?: { payload: ScorePoint }[];
}

function ScoreTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 shadow-xl">
      <p className="mb-1 max-w-52 truncate text-xs font-medium text-gray-300">{point.title}</p>
      <p className="text-xs text-gray-500">
        {new Date(point.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p className="mt-1.5 text-sm font-bold text-gray-100">
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: ACCENT }} />
        {point.score}% match
      </p>
    </div>
  );
}

export default function ScoreHistoryChart({ reports }: { reports: InterviewReportSummary[] }) {
  // A trend needs at least two points
  if (reports.length < 2) return null;

  const data: ScorePoint[] = reports
    .map((r) => ({
      date: new Date(r.createdAt).getTime(),
      score: r.matchScore,
      title: r.title,
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
            Match Score History
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            How your fit has trended across {reports.length} reports
          </p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
            <CartesianGrid stroke={GRID} strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTick}
              tick={{ fill: MUTED_TEXT, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: GRID }}
              minTickGap={40}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: MUTED_TEXT, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<ScoreTooltip />}
              cursor={{ stroke: MUTED_TEXT, strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={ACCENT}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill={ACCENT}
              fillOpacity={0.1}
              dot={{ r: 4, fill: ACCENT, stroke: SURFACE, strokeWidth: 2 }}
              activeDot={{ r: 5, fill: ACCENT, stroke: SURFACE, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
