import React, { useState } from 'react';
import {
  History,
  Download,
  FileSpreadsheet,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { exportAcademicHistoryToCsv } from '../utils/csvExport';
import { GpaTrendChart } from '../components/charts/GpaTrendChart';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { getGradePoint } from '../utils/gpaCalculator';

export const AcademicHistoryPage: React.FC = () => {
  const {
    semesters,
    subjects,
    activeScale,
    overallGpa,
    totalCredits,
    honorsStanding,
    semesterBreakdown,
    deleteSubject,
    preferences,
  } = useAcademicData();

  const [subjectToDelete, setSubjectToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleExportCsv = () => {
    exportAcademicHistoryToCsv(semesters, subjects, activeScale);
  };

  // Find best semester
  const bestSemester = React.useMemo(() => {
    if (semesterBreakdown.length === 0) return null;
    let best = semesterBreakdown[0];
    for (const item of semesterBreakdown) {
      if (item.semesterGpa > best.semesterGpa) {
        best = item;
      }
    }
    const sem = semesters.find((s) => s.id === best.semesterId);
    return { name: sem?.name || 'Semester', gpa: best.semesterGpa };
  }, [semesterBreakdown, semesters]);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
            <span>Academic History & Official Records</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete chronological transcript of course grades, term metrics, and GPA evolution.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export CSV Transcript</span>
          </button>
        </div>
      </div>

      {/* Snapshot Metrics Bar (1 col on 320px, 2 col on xs/sm, 4 col on lg) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Overall CGPA
          </span>
          <span className="text-xl sm:text-2xl font-black text-indigo-700 tnum block mt-1">
            {overallGpa.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">Scale: {activeScale.maxGpa.toFixed(2)}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Completed Credits
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 tnum block mt-1">
            {totalCredits}
          </span>
          <span className="text-[11px] text-slate-400">Total Degree Units</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Honors Standing
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-2 truncate">
            {honorsStanding.standing}
          </span>
          <span className="text-[11px] text-slate-400">Current classification</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Peak Semester GPA
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 tnum block mt-1">
            {bestSemester ? bestSemester.gpa.toFixed(2) : '—'}
          </span>
          <span className="text-[11px] text-slate-400 truncate block">
            {bestSemester?.name || 'No records'}
          </span>
        </div>
      </div>

      {/* Trajectory Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>GPA Trajectory Across Completed Semesters</span>
          </h3>
          <span className="text-xs text-slate-500">
            {semesters.length} Semesters Recorded
          </span>
        </div>

        <div className="w-full min-w-0">
          <GpaTrendChart
            semesters={semesters}
            breakdown={semesterBreakdown}
            targetGpa={preferences.targetCgpa}
            maxGpa={activeScale.maxGpa}
          />
        </div>
      </div>

      {/* Transcript Ledger grouped by Semester */}
      <div className="space-y-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Chronological Academic Ledger</span>
          </h3>
          <span className="text-xs text-slate-500">
            {subjects.length} total courses registered
          </span>
        </div>

        {semesters.map((sem, sIdx) => {
          const semSubjects = subjects.filter((s) => s.semesterId === sem.id);
          const breakdownItem = semesterBreakdown.find((b) => b.semesterId === sem.id);

          return (
            <div
              key={sem.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0"
            >
              {/* Semester Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sem.name}</h4>
                    <span className="text-[11px] text-slate-500">{sem.academicYear}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Term GPA: </span>
                    <strong className="text-indigo-700 text-sm font-black tnum">
                      {breakdownItem?.semesterGpa.toFixed(2) || '0.00'}
                    </strong>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-slate-500">Cumulative: </span>
                    <strong className="text-slate-900 text-sm font-extrabold tnum">
                      {breakdownItem?.cumulativeGpa.toFixed(2) || '0.00'}
                    </strong>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-slate-500">Credits: </span>
                    <strong className="text-slate-800 tnum">
                      {breakdownItem?.semesterCredits || 0} cr
                    </strong>
                  </div>
                </div>
              </div>

              {/* 1. Mobile Cards View (< md) */}
              <div className="md:hidden divide-y divide-slate-100 p-3 space-y-2.5 bg-slate-50/30">
                {semSubjects.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No subjects recorded in this semester.
                  </div>
                ) : (
                  semSubjects.map((sub) => {
                    const gp = getGradePoint(sub.grade, activeScale) ?? 0;
                    const wp = (gp * sub.credits).toFixed(2);
                    return (
                      <div
                        key={sub.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-800">
                                {sub.code}
                              </span>
                              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                                {sub.category || 'Core'}
                              </span>
                            </div>
                            <h5 className="font-medium text-xs sm:text-sm text-slate-900 mt-1 break-words">
                              {sub.title}
                            </h5>
                          </div>

                          <button
                            onClick={() => setSubjectToDelete({ id: sub.id, title: sub.title })}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
                            aria-label="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="text-slate-500 tnum">{sub.credits} credits</span>
                          <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {sub.grade} ({gp.toFixed(2)})
                          </span>
                          <span className="font-mono font-bold text-indigo-700 tnum">
                            {wp} weighted pts
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 2. Desktop/Tablet Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto touch-scroll">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-3 text-center">Type</th>
                      <th className="py-2.5 px-3 text-center">Credits</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3 text-right">Points</th>
                      <th className="py-2.5 px-3 text-right">Weighted Points</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {semSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400 italic">
                          No subjects recorded in this semester.
                        </td>
                      </tr>
                    ) : (
                      semSubjects.map((sub) => {
                        const gp = getGradePoint(sub.grade, activeScale) ?? 0;
                        const wp = (gp * sub.credits).toFixed(2);
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                              {sub.code}
                            </td>
                            <td className="py-2.5 px-4 font-medium text-slate-900">
                              {sub.title}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                                {sub.category || 'Core'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center tnum text-slate-700 font-semibold">
                              {sub.credits}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {sub.grade}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 tnum">
                              {gp.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700 tnum">
                              {wp}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                onClick={() => setSubjectToDelete({ id: sub.id, title: sub.title })}
                                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                                title="Delete course record"
                                aria-label="Delete course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Subject Confirmation Modal */}
      <ConfirmationModal
        isOpen={subjectToDelete !== null}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) {
            deleteSubject(subjectToDelete.id);
            setSubjectToDelete(null);
          }
        }}
        title="Remove Course Record?"
        message={`Are you sure you want to remove "${subjectToDelete?.title}" from your academic ledger? This will adjust your cumulative GPA calculation.`}
        confirmLabel="Remove Course"
        isDestructive={true}
      />
    </div>
  );
};
