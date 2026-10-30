import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Subject, GradingScale } from '../../types/academic';
import { getGradePoint } from '../../utils/gpaCalculator';

interface GradeDistributionChartProps {
  subjects: Subject[];
  scale: GradingScale;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  subjects,
  scale,
}) => {
  // Compute count per grade
  const gradeCounts: Record<string, number> = {};
  for (const g of scale.grades) {
    gradeCounts[g.grade] = 0;
  }

  for (const s of subjects) {
    const norm = s.grade.trim().toUpperCase();
    if (gradeCounts[norm] !== undefined) {
      gradeCounts[norm]++;
    }
  }

  const data = scale.grades
    .filter((g) => gradeCounts[g.grade] > 0 || ['A+', 'A', 'B+', 'B', 'C'].includes(g.grade))
    .map((g) => ({
      grade: g.grade,
      count: gradeCounts[g.grade] || 0,
      points: g.points,
    }));

  const getColor = (points: number) => {
    if (points >= 3.7) return '#10B981'; // emerald
    if (points >= 3.0) return '#4F46E5'; // indigo
    if (points >= 2.0) return '#3B82F6'; // blue
    if (points >= 1.0) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="grade"
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <Tooltip
            formatter={(value: any) => [`${value} Course(s)`, 'Frequency']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.points)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
