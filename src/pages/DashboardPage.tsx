import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  Clock,
  Plus,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { GpaCounterCard } from '../components/common/GpaCounterCard';
import { GpaTrendChart } from '../components/charts/GpaTrendChart';
import { GradeDistributionChart } from '../components/charts/GradeDistributionChart';
import { calculateTargetRequirement } from '../utils/gpaCalculator';
import { CAREER_ROLES } from '../data/careerPathways';
import { rankSubjectsForCareer } from '../utils/careerMatcher';
import { QuickAddSubjectModal } from '../components/common/QuickAddSubjectModal';

export const DashboardPage: React.FC = () => {
  const {
    semesters,
    subjects,
    overallGpa,
    totalCredits,
    activeScale,
    preferences,
    semesterBreakdown,
  } = useAcademicData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Active target calculation
  const remainingCredits = 30; // default estimated remaining for bachelor degree (e.g. 120 total)
  const targetResult = calculateTargetRequirement(
    overallGpa,
    totalCredits,
    remainingCredits,
    preferences.targetCgpa,
    activeScale
  );

  // Selected career role alignment
  const activeRole =
    CAREER_ROLES.find((r) => r.id === preferences.targetRole) || CAREER_ROLES[0];
  const careerMatches = rankSubjectsForCareer(activeRole, subjects);
  const topMatchedSubjects = careerMatches.slice(0, 3);

  // Latest semester
  const currentSemester = semesters[semesters.length - 1];
  const currentSemesterSubjects = currentSemester
    ? subjects.filter((s) => s.semesterId === currentSemester.id)
    : [];

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time credit-weighted metrics, honours trajectory, and curriculum tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Course Record</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Metric Cards (Balanced 12-col / 2-col tablet layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6 w-full min-w-0">
        {/* GPA Hero Card */}
        <div className="xl:col-span-4 w-full min-w-0">
          <GpaCounterCard />
        </div>

        {/* Target Progress Card */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Degree Target Objective
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  targetResult.status === 'achieved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : targetResult.status === 'realistic'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : targetResult.status === 'challenging'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {targetResult.status}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 my-2">
              <span className="display-gpa text-slate-900 tnum">
                {preferences.targetCgpa.toFixed(2)}
              </span>
              <span className="text-slate-400 font-medium text-sm sm:text-base">Target CGPA</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 mt-1">
              {targetResult.message}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-500">
              Req: <strong className="text-indigo-600 tnum">{targetResult.requiredGpa > 0 ? targetResult.requiredGpa.toFixed(2) : '0.00'}</strong> on remainder
            </div>
            <Link
              to="/target-planner"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 py-1"
            >
              <span>Detailed Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Current Term / Status Card (Spans 2 on tablet to balance the 3 cards) */}
        <div className="md:col-span-2 xl:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Current Term Status
              </span>
              <span className="text-xs font-medium text-slate-500 truncate">
                {currentSemester?.name || 'Semester Active'}
              </span>
            </div>

            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tnum">
                {currentSemesterSubjects.length}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm ml-2">Enrolled Modules</span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Degree Credits Earned:</span>
                <strong className="text-slate-800 tnum">{totalCredits} credits</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Active University Semesters:</span>
                <strong className="text-slate-800 tnum">{semesters.length} terms</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Scale: {activeScale.name.split(' ')[0]}</span>
            <Link
              to="/calculator"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 py-1"
            >
              <span>Manage Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Visualizations (12-column Grid with min-w-0 for Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full min-w-0">
        {/* GPA Progression Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Academic Trajectory & GPA Trend</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Semester-by-semester term GPA compared against cumulative degree CGPA.
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Target: <span className="font-semibold text-amber-600 tnum">{preferences.targetCgpa.toFixed(2)}</span>
            </div>
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

        {/* Grade Distribution Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col justify-between w-full min-w-0">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
              Grade Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of earned letter grades across your curriculum.
            </p>
            <div className="w-full min-w-0">
              <GradeDistributionChart subjects={subjects} scale={activeScale} />
            </div>
          </div>

          <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Total graded subjects:</span>
            <span className="font-semibold text-slate-700 tnum">{subjects.length}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Career Alignment & Quick Course Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        {/* Career Competency Snapshot: 6 columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <Briefcase className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                    Career Alignment Snapshot
                  </h3>
                  <span className="text-xs text-slate-500 truncate block">
                    Target: <strong className="text-slate-800">{activeRole.title}</strong>
                  </span>
                </div>
              </div>

              <Link
                to="/career-planner"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 py-1"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {topMatchedSubjects.map((match) => (
                <div
                  key={match.subjectId}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-start justify-between gap-3 w-full min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-700 shrink-0">
                        {match.subjectCode}
                      </span>
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {match.subjectTitle}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {match.matchedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium truncate"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-indigo-600 tnum block">
                      {match.relevanceScore}%
                    </span>
                    <span className="text-[10px] text-slate-400">Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 italic">
            * Evaluated using transparent skill matching rules without opaque machine learning.
          </p>
        </div>

        {/* Current Semester Course List: 6 columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  Latest Semester Coursework
                </h3>
                <span className="text-xs text-slate-500 truncate block">
                  {currentSemester?.name || 'All Courses'}
                </span>
              </div>

              <Link
                to="/calculator"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 py-1"
              >
                <span>Full Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {currentSemesterSubjects.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No courses enrolled in this semester yet.
                </div>
              ) : (
                currentSemesterSubjects.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs gap-2 w-full min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono font-semibold text-slate-600 shrink-0">{sub.code}</span>
                      <span className="font-medium text-slate-800 truncate">
                        {sub.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-slate-500 tnum">{sub.credits} cr</span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full min-h-[42px] mt-4 py-2 border border-dashed border-slate-300 hover:border-indigo-500 text-slate-600 hover:text-indigo-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course to This Semester</span>
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultSemesterId={currentSemester?.id}
      />
    </div>
  );
};
