import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Semester } from '../../types/academic';

interface GpaTrendChartProps {
  semesters: Semester[];
  breakdown: Array<{
    semesterId: string;
    semesterGpa: number;
    semesterCredits: number;
    cumulativeGpa: number;
    cumulativeCredits: number;
  }>;
  targetGpa?: number;
  maxGpa?: number;
}

export const GpaTrendChart: React.FC<GpaTrendChartProps> = ({
  semesters,
  breakdown,
  targetGpa = 3.75,
  maxGpa = 4.0,
}) => {
  const chartData = breakdown.map((item, idx) => {
    const sem = semesters.find((s) => s.id === item.semesterId);
    // Short label e.g. Y1S1
    const name = sem?.name ? sem.name.replace('Year ', 'Y').replace(' - Semester ', 'S') : `T${idx + 1}`;
    return {
      name,
      fullName: sem?.name || `Semester ${idx + 1}`,
      semesterGpa: item.semesterGpa,
      cumulativeGpa: item.cumulativeGpa,
      credits: item.semesterCredits,
      totalCredits: item.cumulativeCredits,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="h-60 sm:h-72 flex items-center justify-center text-xs sm:text-sm text-slate-400">
        No semester data recorded yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs">
          <p className="font-bold text-slate-900 mb-1">{data.fullName}</p>
          <div className="space-y-1">
            <p className="flex items-center justify-between gap-4 text-indigo-600 font-semibold">
              <span>Cumulative GPA:</span>
              <span className="tnum">{data.cumulativeGpa.toFixed(2)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-emerald-600 font-medium">
              <span>Semester GPA:</span>
              <span className="tnum">{data.semesterGpa.toFixed(2)}</span>
            </p>
            <p className="flex items-center justify-between gap-4 text-slate-500 pt-1 border-t border-slate-100">
              <span>Semester Credits:</span>
              <span className="tnum">{data.credits} cr</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-60 sm:h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            domain={[0, Math.ceil(maxGpa)]}
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            ticks={[0, 1.0, 2.0, 3.0, 3.5, 4.0]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }}
          />

          {targetGpa && (
            <ReferenceLine
              y={targetGpa}
              stroke="#D97706"
              strokeDasharray="4 4"
              label={{
                value: `Target ${targetGpa.toFixed(2)}`,
                position: 'insideTopRight',
                fill: '#D97706',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="cumulativeGpa"
            name="Cumulative CGPA"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 3.5, fill: '#4F46E5', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 5, fill: '#4338CA' }}
          />
          <Line
            type="monotone"
            dataKey="semesterGpa"
            name="Semester Term GPA"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={{ r: 3, fill: '#10B981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
