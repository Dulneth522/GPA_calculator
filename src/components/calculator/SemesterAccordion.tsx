import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  CheckCircle2,
  CircleSlash,
} from 'lucide-react';
import { Semester, Subject, GradingScale } from '../../types/academic';
import { calculateGpa, getGradePoint } from '../../utils/gpaCalculator';
import { SubjectRow } from './SubjectRow';

interface SemesterAccordionProps {
  semester: Semester;
  subjects: Subject[];
  scale: GradingScale;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
  onAddSubject: (semesterId: string) => void;
  onDeleteSemester: (id: string) => void;
  onToggleStatus: (id: string) => void;
  defaultOpen?: boolean;
}

export const SemesterAccordion: React.FC<SemesterAccordionProps> = ({
  semester,
  subjects,
  scale,
  onUpdateSubject,
  onDeleteSubject,
  onAddSubject,
  onDeleteSemester,
  onToggleStatus,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const metrics = calculateGpa(subjects, scale);

  const getGradeBadgeStyle = (grade: string) => {
    const pt = getGradePoint(grade, scale) ?? 0;
    if (pt >= 3.7) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pt >= 3.0) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (pt >= 2.0) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (pt >= 1.0) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200 w-full min-w-0">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Accordion trigger & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-slate-200/70 text-slate-500 transition-colors shrink-0"
            aria-label={isOpen ? 'Collapse semester' : 'Expand semester'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {semester.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0">
                {semester.academicYear}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{subjects.length} course(s)</span>
              <span>•</span>
              <span className="tnum font-semibold text-slate-700">{metrics.totalCredits} credits</span>
            </div>
          </div>
        </div>

        {/* Right side metrics and actions */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          {/* Semester GPA Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500">GPA:</span>
            <span className="text-sm font-extrabold text-indigo-700 tnum">
              {metrics.gpa.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {/* Status Toggle Button */}
            <button
              onClick={() => onToggleStatus(semester.id)}
              title={semester.isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}
              className={`min-h-[36px] inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                semester.isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {semester.isCompleted ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Done</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Active</span>
                </>
              )}
            </button>

            {/* Add Course in this semester (Min 40x40px touch area) */}
            <button
              onClick={() => onAddSubject(semester.id)}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 bg-white transition-colors"
              title="Add subject to this semester"
              aria-label="Add subject to this semester"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Delete Semester */}
            <button
              onClick={() => onDeleteSemester(semester.id)}
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete this semester and all its courses"
              aria-label="Delete this semester"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="w-full min-w-0">
          {subjects.length === 0 ? (
            <div className="py-8 text-center px-4 bg-white">
              <p className="text-sm text-slate-500 mb-2">
                No subjects registered for {semester.name} yet.
              </p>
              <button
                onClick={() => onAddSubject(semester.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add your first subject</span>
              </button>
            </div>
          ) : (
            <>
              {/* 1. Mobile Cards View (< md breakpoint) */}
              <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3 bg-slate-50/40">
                {subjects.map((sub) => {
                  const pt = getGradePoint(sub.grade, scale);
                  const wp = pt !== null && sub.includeInGpa
                    ? (pt * (Number(sub.credits) || 0)).toFixed(2)
                    : '0.00';

                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      {/* Top Row: Code, Category & Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sub.code}
                            onChange={(e) =>
                              onUpdateSubject(sub.id, { code: e.target.value.toUpperCase() })
                            }
                            placeholder="Code"
                            className="w-20 text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:border-indigo-500 focus:outline-hidden"
                          />
                          {sub.category && (
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                              {sub.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* GPA Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateSubject(sub.id, { includeInGpa: !sub.includeInGpa })
                            }
                            title={sub.includeInGpa ? 'Included in GPA' : 'Excluded from GPA'}
                            className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg ${
                              sub.includeInGpa ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                            aria-label={sub.includeInGpa ? 'Included in GPA' : 'Excluded from GPA'}
                          >
                            {sub.includeInGpa ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <CircleSlash className="w-5 h-5" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onDeleteSubject(sub.id)}
                            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg"
                            aria-label="Remove subject"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Course Title */}
                      <div>
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => onUpdateSubject(sub.id, { title: e.target.value })}
                          placeholder="Course Title"
                          className="w-full text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-hidden min-h-[42px]"
                        />
                      </div>

                      {/* Bottom Row: Credits, Grade, Weighted Points */}
                      <div className="grid grid-cols-3 gap-2 items-center pt-1">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Credits
                          </label>
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            max="15"
                            value={sub.credits}
                            onChange={(e) =>
                              onUpdateSubject(sub.id, {
                                credits: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-full min-h-[40px] text-center text-sm font-semibold border border-slate-200 rounded-lg bg-white tnum"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Grade
                          </label>
                          <select
                            value={sub.grade}
                            onChange={(e) => onUpdateSubject(sub.id, { grade: e.target.value })}
                            className={`w-full min-h-[40px] text-xs font-bold border rounded-lg px-2 bg-white ${getGradeBadgeStyle(
                              sub.grade
                            )}`}
                          >
                            {scale.grades.map((g) => (
                              <option key={g.grade} value={g.grade}>
                                {g.grade} ({g.points.toFixed(1)})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-right">
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Weighted Pts
                          </label>
                          <div className="min-h-[40px] flex items-center justify-end font-mono font-bold text-indigo-700 text-sm tnum">
                            {wp}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Mobile Subtotal Summary Card */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 font-medium">
                  <div>
                    <span className="text-slate-500">Term Total: </span>
                    <strong className="text-slate-900 tnum">{metrics.totalCredits} credits</strong>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600 tnum">{metrics.totalPoints.toFixed(2)} pts</span>
                  </div>
                  <div className="font-extrabold text-indigo-700 text-sm tnum">
                    GPA {metrics.gpa.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* 2. Desktop/Tablet Table View (md and above) */}
              <div className="hidden md:block overflow-x-auto touch-scroll">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3 sm:px-4">Code</th>
                      <th className="py-2.5 px-3 sm:px-4">Subject Title</th>
                      <th className="py-2.5 px-2 sm:px-4 text-center">Credits</th>
                      <th className="py-2.5 px-2 sm:px-4 text-center">Grade</th>
                      <th className="py-2.5 px-2 sm:px-4 text-right hidden lg:table-cell">Points</th>
                      <th className="py-2.5 px-2 sm:px-4 text-right">Weighted</th>
                      <th className="py-2.5 px-2 sm:px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map((sub) => (
                      <SubjectRow
                        key={sub.id}
                        subject={sub}
                        scale={scale}
                        onUpdate={onUpdateSubject}
                        onDelete={onDeleteSubject}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50/50 text-xs font-semibold text-slate-700">
                      <td colSpan={2} className="py-2.5 px-3 sm:px-4">
                        Subtotal for {semester.name}
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-slate-900 tnum">
                        {metrics.totalCredits} cr
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center text-slate-500">
                        {metrics.gradedSubjectCount} graded
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-right hidden lg:table-cell text-slate-500">
                        —
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-right font-extrabold text-indigo-700 tnum">
                        {metrics.totalPoints.toFixed(2)} pts
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-right">
                        <span className="text-indigo-600 font-bold tnum">
                          GPA {metrics.gpa.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
