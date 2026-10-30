import React from 'react';
import { SubjectRelevanceMatch } from '../../types/academic';
import { Check, Plus } from 'lucide-react';

interface SubjectRelevanceCardProps {
  match: SubjectRelevanceMatch;
  isAlreadyRegistered: boolean;
  onAddToSemester?: (subjectCode: string, title: string, credits: number) => void;
}

export const SubjectRelevanceCard: React.FC<SubjectRelevanceCardProps> = ({
  match,
  isAlreadyRegistered,
  onAddToSemester,
}) => {
  const getCategoryBadge = () => {
    switch (match.categoryFit) {
      case 'Essential Core':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'High Impact Elective':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Complementary Skill':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getScoreColor = () => {
    if (match.relevanceScore >= 75) return 'text-emerald-700 bg-emerald-500';
    if (match.relevanceScore >= 50) return 'text-indigo-700 bg-indigo-600';
    if (match.relevanceScore >= 30) return 'text-amber-700 bg-amber-500';
    return 'text-slate-600 bg-slate-400';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 transition-all hover:border-slate-300 w-full min-w-0 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2.5 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
              {match.subjectCode}
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getCategoryBadge()}`}
            >
              {match.categoryFit}
            </span>
          </div>

          {/* Relevance Score Pill */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match</span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-none tnum">
                {match.relevanceScore}%
              </div>
            </div>
            <div className="w-10 sm:w-12 bg-slate-100 h-2.5 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreColor().split(' ')[1]}`}
                style={{ width: `${match.relevanceScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug break-words">
          {match.subjectTitle}
        </h4>
        <div className="text-xs text-slate-500 mb-3">
          Weight: <span className="font-semibold text-slate-700">{match.credits} credits</span>
        </div>

        {/* Matched Skills Chips */}
        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Matched Role Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.length > 0 ? (
              match.matchedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50/80 border border-indigo-100 text-indigo-700"
                >
                  <Check className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Foundational module (indirect alignment)
              </span>
            )}
          </div>
        </div>

        {/* Explainable Rationale */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 mb-4 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-semibold block mb-0.5">
            Ranking Reason:
          </strong>
          {match.recommendedReason}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <span className="text-[10px] text-slate-400">
          Explainable Rule Matching
        </span>

        {isAlreadyRegistered ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            <span>Enrolled in Transcript</span>
          </span>
        ) : (
          onAddToSemester && (
            <button
              onClick={() =>
                onAddToSemester(match.subjectCode, match.subjectTitle, match.credits)
              }
              className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 px-3.5 py-2 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Semester</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
