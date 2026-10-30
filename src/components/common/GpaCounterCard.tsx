import React from 'react';
import { Award, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useAcademicData } from '../../hooks/useAcademicData';

interface GpaCounterCardProps {
  className?: string;
  showDetails?: boolean;
}

export const GpaCounterCard: React.FC<GpaCounterCardProps> = ({
  className = '',
  showDetails = true,
}) => {
  const { overallGpa, totalCredits, activeScale, honorsStanding, semesterBreakdown } =
    useAcademicData();

  // Calculate delta: difference between latest semester GPA and previous cumulative GPA
  const deltaInfo = React.useMemo(() => {
    if (semesterBreakdown.length < 2) {
      return { delta: 0, text: 'Initial term', icon: Minus, color: 'text-slate-500 bg-slate-50 border-slate-200' };
    }
    const latest = semesterBreakdown[semesterBreakdown.length - 1];
    const previous = semesterBreakdown[semesterBreakdown.length - 2];
    const diff = Math.round((latest.semesterGpa - previous.cumulativeGpa) * 100) / 100;

    if (diff > 0) {
      return {
        delta: diff,
        text: `+${diff.toFixed(2)} vs prev`,
        icon: TrendingUp,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    } else if (diff < 0) {
      return {
        delta: diff,
        text: `${diff.toFixed(2)} vs prev`,
        icon: TrendingDown,
        color: 'text-rose-700 bg-rose-50 border-rose-200',
      };
    }
    return {
      delta: 0,
      text: 'Steady',
      icon: Minus,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    };
  }, [semesterBreakdown]);

  const DeltaIcon = deltaInfo.icon;

  return (
    <div
      className={`relative bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 overflow-hidden flex flex-col justify-between w-full min-w-0 ${className}`}
    >
      {/* 2px Indigo Top Accent Rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-600" />

      {/* Header & Meta */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Cumulative GPA (CGPA)
          </span>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            {activeScale.name} (Max {activeScale.maxGpa.toFixed(2)})
          </div>
        </div>

        {/* Delta Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${deltaInfo.color}`}
        >
          <DeltaIcon className="w-3.5 h-3.5" />
          <span>{deltaInfo.text}</span>
        </div>
      </div>

      {/* Main GPA Figure */}
      <div className="my-2 flex flex-wrap items-baseline gap-2 sm:gap-3">
        <span className="display-gpa text-slate-900 tnum">
          {overallGpa.toFixed(2)}
        </span>
        <span className="text-slate-400 font-medium text-base sm:text-lg">
          / {activeScale.maxGpa.toFixed(2)}
        </span>
      </div>

      {/* Honors Badge & Standing */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border truncate ${honorsStanding.badgeColor}`}
          >
            {honorsStanding.standing}
          </span>
        </div>

        {showDetails && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-slate-700 tnum">{totalCredits}</span>
            <span>earned credits</span>
          </div>
        )}
      </div>

      {/* Proximity notice to next tier if applicable */}
      {honorsStanding.nextTier && showDetails && (
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">
            Needs <strong className="text-slate-700 tnum">+{honorsStanding.nextTier.gap.toFixed(2)}</strong> for {honorsStanding.nextTier.name}
          </span>
        </div>
      )}
    </div>
  );
};
