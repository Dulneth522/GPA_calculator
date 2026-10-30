import React from 'react';
import { Trash2, CheckCircle2, CircleSlash, Tag } from 'lucide-react';
import { Subject, GradingScale } from '../../types/academic';
import { getGradePoint } from '../../utils/gpaCalculator';

interface SubjectRowProps {
  subject: Subject;
  scale: GradingScale;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
  onDelete: (id: string) => void;
}

export const SubjectRow: React.FC<SubjectRowProps> = ({
  subject,
  scale,
  onUpdate,
  onDelete,
}) => {
  const currentPoints = getGradePoint(subject.grade, scale);
  const creditPoints = currentPoints !== null && subject.includeInGpa
    ? (currentPoints * (Number(subject.credits) || 0)).toFixed(2)
    : '0.00';

  // Grade color feedback
  const getGradeBadgeStyle = (grade: string) => {
    const pt = getGradePoint(grade, scale) ?? 0;
    if (pt >= 3.7) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pt >= 3.0) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (pt >= 2.0) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (pt >= 1.0) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
      {/* Subject Code & Category */}
      <td className="py-3 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={subject.code}
            onChange={(e) => onUpdate(subject.id, { code: e.target.value.toUpperCase() })}
            placeholder="Code"
            className="w-20 text-xs font-mono font-semibold text-slate-800 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-hidden hover:border-slate-300 py-1"
          />
          {subject.category && (
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200/80">
              {subject.category}
            </span>
          )}
        </div>
      </td>

      {/* Course Title & Skills */}
      <td className="py-3 px-3 sm:px-4">
        <div className="flex flex-col">
          <input
            type="text"
            value={subject.title}
            onChange={(e) => onUpdate(subject.id, { title: e.target.value })}
            placeholder="Course Title"
            className="w-full text-xs sm:text-sm font-medium text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-hidden hover:border-slate-300 py-0.5"
          />
          {subject.skills && subject.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {subject.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-slate-500 bg-slate-100/80 px-1.5 py-0.2 rounded-sm"
                >
                  {skill}
                </span>
              ))}
              {subject.skills.length > 3 && (
                <span className="text-[10px] text-slate-400">
                  +{subject.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </td>

      {/* Credits Input */}
      <td className="py-3 px-2 sm:px-4 text-center">
        <input
          type="number"
          min="0.5"
          step="0.5"
          max="15"
          value={subject.credits}
          onChange={(e) =>
            onUpdate(subject.id, {
              credits: Math.max(0, parseFloat(e.target.value) || 0),
            })
          }
          className="w-14 text-center text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-md py-1 px-1 focus:border-indigo-500 focus:outline-hidden tnum"
        />
      </td>

      {/* Grade Selector */}
      <td className="py-3 px-2 sm:px-4 text-center">
        <select
          value={subject.grade}
          onChange={(e) => onUpdate(subject.id, { grade: e.target.value })}
          className={`text-xs sm:text-sm font-bold border rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${getGradeBadgeStyle(
            subject.grade
          )}`}
        >
          {scale.grades.map((g) => (
            <option key={g.grade} value={g.grade}>
              {g.grade} ({g.points.toFixed(2)})
            </option>
          ))}
        </select>
      </td>

      {/* Grade Points */}
      <td className="py-3 px-2 sm:px-4 text-right hidden md:table-cell text-xs font-mono text-slate-600 tnum">
        {currentPoints !== null ? currentPoints.toFixed(2) : '—'}
      </td>

      {/* Weighted Points */}
      <td className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm font-bold font-mono text-indigo-700 tnum">
        {creditPoints}
      </td>

      {/* Include in GPA toggle & Delete action */}
      <td className="py-3 px-2 sm:px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onUpdate(subject.id, { includeInGpa: !subject.includeInGpa })}
            title={subject.includeInGpa ? 'Included in GPA' : 'Excluded from GPA'}
            className={`p-1 rounded-md transition-colors ${
              subject.includeInGpa
                ? 'text-indigo-600 hover:bg-indigo-50'
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            {subject.includeInGpa ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <CircleSlash className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(subject.id)}
            title="Remove subject"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100"
            aria-label="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
