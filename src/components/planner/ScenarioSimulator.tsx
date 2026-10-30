import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, ArrowDown, ArrowRight } from 'lucide-react';
import { GradingScale } from '../../types/academic';
import { getGradePoint } from '../../utils/gpaCalculator';

interface ScenarioCourse {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface ScenarioSimulatorProps {
  currentCgpa: number;
  completedCredits: number;
  scale: GradingScale;
  targetCgpa: number;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentCgpa,
  completedCredits,
  scale,
  targetCgpa,
}) => {
  const [courses, setCourses] = useState<ScenarioCourse[]>([
    { id: '1', name: 'Future Elective 1', credits: 3, grade: 'A' },
    { id: '2', name: 'Future Elective 2', credits: 3, grade: 'A' },
    { id: '3', name: 'Advanced Core Module', credits: 3, grade: 'A-' },
    { id: '4', name: 'Capstone / FYP Phase 1', credits: 4, grade: 'A' },
    { id: '5', name: 'Industry Internship', credits: 3, grade: 'B+' },
  ]);

  const addScenarioCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: `Upcoming Course ${courses.length + 1}`,
        credits: 3,
        grade: 'A',
      },
    ]);
  };

  const updateCourse = (id: string, updates: Partial<ScenarioCourse>) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  // Calculate simulated metrics
  const scenarioCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const scenarioPoints = courses.reduce((sum, c) => {
    const pt = getGradePoint(c.grade, scale) ?? 0;
    return sum + pt * (Number(c.credits) || 0);
  }, 0);

  const scenarioTermGpa =
    scenarioCredits > 0 ? Math.round((scenarioPoints / scenarioCredits) * 100) / 100 : 0;

  // Total combined projected CGPA
  const combinedCredits = completedCredits + scenarioCredits;
  const currentTotalPoints = currentCgpa * completedCredits;
  const combinedTotalPoints = currentTotalPoints + scenarioPoints;
  const projectedCgpa =
    combinedCredits > 0 ? Math.round((combinedTotalPoints / combinedCredits) * 100) / 100 : currentCgpa;

  const cgpaDelta = Math.round((projectedCgpa - currentCgpa) * 100) / 100;
  const meetsTarget = projectedCgpa >= targetCgpa;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Interactive "What-If" Grade Simulator</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Test different upcoming grade combinations to see exact impact on your final degree CGPA.
          </p>
        </div>

        <button
          onClick={addScenarioCourse}
          className="min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course Slot</span>
        </button>
      </div>

      {/* Simulator Course Inputs Table / Cards Container */}
      <div className="overflow-x-auto touch-scroll border border-slate-200 rounded-xl mb-4 w-full min-w-0">
        <table className="w-full text-left text-xs min-w-[340px] sm:min-w-[480px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-2.5 px-3">Simulated Course</th>
              <th className="py-2.5 px-2 sm:px-3 text-center">Credits</th>
              <th className="py-2.5 px-2 sm:px-3 text-center">Assumed Grade</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Points</th>
              <th className="py-2.5 px-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => {
              const pt = getGradePoint(c.grade, scale) ?? 0;
              return (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCourse(c.id, { name: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden font-medium text-slate-800 text-xs sm:text-sm py-1"
                    />
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={c.credits}
                      onChange={(e) =>
                        updateCourse(c.id, { credits: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      className="w-12 text-center border border-slate-200 rounded-lg py-1.5 min-h-[36px] tnum font-semibold"
                    />
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-center">
                    <select
                      value={c.grade}
                      onChange={(e) => updateCourse(c.id, { grade: e.target.value })}
                      className="font-bold border border-slate-200 rounded-lg px-2 py-1.5 min-h-[36px] bg-white text-indigo-700"
                    >
                      {scale.grades.map((g) => (
                        <option key={g.grade} value={g.grade}>
                          {g.grade} ({g.points.toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-right font-mono font-semibold text-slate-700 tnum">
                    {(pt * c.credits).toFixed(1)}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => removeCourse(c.id)}
                      disabled={courses.length <= 1}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                      aria-label="Remove simulated course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simulator Live Outcome Bar (Responsive Flex / Grid) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full min-w-0">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Simulated Upcoming Term Performance
          </span>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tnum">
              {scenarioTermGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">
              term GPA across {scenarioCredits} credits
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="md:hidden flex items-center justify-center text-slate-400 w-full py-0.5">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-full md:w-auto">
            <span className="text-[11px] font-semibold text-slate-500 block">
              New Projected CGPA
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 tnum">
                {projectedCgpa.toFixed(2)}
              </span>
              <span
                className={`text-xs font-bold ${
                  cgpaDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                } tnum`}
              >
                {cgpaDelta >= 0 ? `+${cgpaDelta.toFixed(2)}` : cgpaDelta.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
          <span className="text-xs font-medium text-slate-500 block">
            Target Goal ({targetCgpa.toFixed(2)})
          </span>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${
              meetsTarget
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {meetsTarget ? 'Goal Achieved' : 'Below Target'}
          </span>
        </div>
      </div>
    </div>
  );
};
