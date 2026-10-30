import React from 'react';
import { Target, CheckCircle, Flame, ShieldAlert, TrendingUp } from 'lucide-react';
import { TargetCalculationResult } from '../../types/academic';

interface TargetProjectionCardProps {
  result: TargetCalculationResult;
  targetCgpa: number;
  currentCgpa: number;
  remainingCredits: number;
  completedCredits: number;
  maxScaleGpa: number;
}

export const TargetProjectionCard: React.FC<TargetProjectionCardProps> = ({
  result,
  targetCgpa,
  currentCgpa,
  remainingCredits,
  completedCredits,
  maxScaleGpa,
}) => {
  const getStatusBadge = () => {
    switch (result.status) {
      case 'achieved':
        return {
          icon: CheckCircle,
          label: 'Target Secured',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          accent: 'bg-emerald-500',
        };
      case 'realistic':
        return {
          icon: TrendingUp,
          label: 'Mathematically Feasible',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          accent: 'bg-indigo-600',
        };
      case 'challenging':
        return {
          icon: Flame,
          label: 'High Ambition / Tight Margin',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          accent: 'bg-amber-500',
        };
      case 'impossible':
      default:
        return {
          icon: ShieldAlert,
          label: 'Statistically Unreachable',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          accent: 'bg-rose-600',
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
      <div className={`h-1.5 w-full ${badge.accent}`} />

      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Target className="w-5 h-5 text-indigo-600 shrink-0" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
              Target Pathway Assessment
            </h3>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${badge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Primary Required Metric Box */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Required Average GPA on Remaining Credits
            </div>
            <div className="flex flex-wrap items-baseline gap-2 mt-1">
              <span className="display-gpa text-slate-900 tnum">
                {result.requiredGpa > 0 ? result.requiredGpa.toFixed(2) : '0.00'}
              </span>
              <span className="text-slate-400 font-medium text-sm sm:text-base">
                / {maxScaleGpa.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 shrink-0">
            <div className="text-xs text-slate-500">Across Remaining</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tnum">
              {remainingCredits} <span className="text-xs font-normal text-slate-500">credits</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Total degree: {completedCredits + remainingCredits} credits
            </div>
          </div>
        </div>

        {/* Rationale Explanation */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {result.message}
        </p>

        {/* Boundary Analysis Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-medium text-slate-500">
              Theoretical Maximum CGPA
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 tnum">
              {result.maxPossibleCgpa.toFixed(2)}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              (Straight top grades in all remaining)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-medium text-slate-500">
              Target Delta to Cover
            </span>
            <span className="text-base sm:text-lg font-bold text-indigo-600 tnum">
              {(targetCgpa - currentCgpa >= 0 ? '+' : '') +
                (targetCgpa - currentCgpa).toFixed(2)}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              (From current {currentCgpa.toFixed(2)} to {targetCgpa.toFixed(2)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
