import React, { useState, useEffect } from 'react';
import {
  Target,
  Info,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { calculateTargetRequirement } from '../utils/gpaCalculator';
import { TargetProjectionCard } from '../components/planner/TargetProjectionCard';
import { ScenarioSimulator } from '../components/planner/ScenarioSimulator';

export const TargetPlannerPage: React.FC = () => {
  const { overallGpa, totalCredits, activeScale, preferences, updatePreferences } =
    useAcademicData();

  // Controlled input states with fallback defaults
  const [currentCgpa, setCurrentCgpa] = useState<number>(overallGpa);
  const [completedCredits, setCompletedCredits] = useState<number>(totalCredits);
  const [remainingCredits, setRemainingCredits] = useState<number>(30);
  const [targetCgpa, setTargetCgpa] = useState<number>(preferences.targetCgpa);
  const [useLiveSync, setUseLiveSync] = useState<boolean>(true);

  // Keep synced with recorded coursework unless user manually disconnects live sync
  useEffect(() => {
    if (useLiveSync) {
      setCurrentCgpa(overallGpa);
      setCompletedCredits(totalCredits);
    }
  }, [overallGpa, totalCredits, useLiveSync]);

  const targetResult = calculateTargetRequirement(
    currentCgpa,
    completedCredits,
    remainingCredits,
    targetCgpa,
    activeScale
  );

  const handleSaveTargetPreference = () => {
    updatePreferences({ targetCgpa });
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
            <span>Target GPA & Honors Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mathematically reverse-engineer the exact average grades you need on future credits to reach your goal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer min-h-[40px] select-none">
            <input
              type="checkbox"
              checked={useLiveSync}
              onChange={(e) => setUseLiveSync(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Sync with Records</span>
          </label>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Left Form Panel: Inputs & Target Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 w-full min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              Degree Parameters
            </h3>
            <p className="text-xs text-slate-500 mb-4 sm:mb-5">
              Adjust variables to test what is mathematically required.
            </p>

            <div className="space-y-4">
              {/* Target CGPA */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Target Degree CGPA
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Max: {activeScale.maxGpa.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max={activeScale.maxGpa}
                    value={targetCgpa}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setTargetCgpa(val);
                    }}
                    className="flex-1 min-h-[44px] px-3 text-base font-bold text-indigo-700 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:bg-white tnum"
                  />
                  <button
                    onClick={handleSaveTargetPreference}
                    className="min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shrink-0"
                  >
                    Set as Goal
                  </button>
                </div>

                {/* Quick Honors Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-slate-400 block w-full xs:w-auto">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setTargetCgpa(preferences.honors.firstClass)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    First Class ({preferences.honors.firstClass.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetCgpa(preferences.honors.secondUpper)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    Second Upper ({preferences.honors.secondUpper.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetCgpa(preferences.honors.secondLower)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Second Lower ({preferences.honors.secondLower.toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Current CGPA */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Current Cumulative CGPA
                  </label>
                  {useLiveSync && (
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Auto-synced
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max={activeScale.maxGpa}
                  value={currentCgpa}
                  disabled={useLiveSync}
                  onChange={(e) => setCurrentCgpa(parseFloat(e.target.value) || 0)}
                  className={`w-full min-h-[44px] px-3 text-sm font-semibold border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden tnum ${
                    useLiveSync ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-900'
                  }`}
                />
              </div>

              {/* Completed Credits & Remaining Credits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Completed Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={completedCredits}
                    disabled={useLiveSync}
                    onChange={(e) => setCompletedCredits(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full min-h-[44px] px-3 text-sm font-semibold border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden tnum ${
                      useLiveSync ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Remaining Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={remainingCredits}
                    onChange={(e) => setRemainingCredits(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-h-[44px] px-3 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden tnum"
                  />
                </div>
              </div>

              {/* Total credits display */}
              <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>Total Expected Degree Credits:</span>
                <span className="font-bold text-slate-800 tnum">
                  {completedCredits + remainingCredits} credits
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 text-xs text-slate-600 w-full min-w-0">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Mathematical Derivation</span>
            </h4>
            <p className="text-[11px] leading-relaxed break-words">
              Formula:
              <br />
              <code className="text-indigo-700 font-mono font-semibold break-all">
                ReqGPA = [(Target × TotalCr) - (Current × CompCr)] ÷ RemCr
              </code>
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] space-y-1 overflow-x-auto touch-scroll">
              <div className="whitespace-nowrap">Target Points: {targetCgpa.toFixed(2)} × {completedCredits + remainingCredits} = <strong>{(targetCgpa * (completedCredits + remainingCredits)).toFixed(2)}</strong></div>
              <div className="whitespace-nowrap">Earned Points: {currentCgpa.toFixed(2)} × {completedCredits} = <strong>{(currentCgpa * completedCredits).toFixed(2)}</strong></div>
              <div className="whitespace-nowrap">Needed Points: <strong className="text-indigo-600">{Math.max(0, (targetCgpa * (completedCredits + remainingCredits)) - (currentCgpa * completedCredits)).toFixed(2)}</strong></div>
            </div>
          </div>
        </div>

        {/* Right Output Panel: Target Projection Card & Sandbox (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 w-full min-w-0">
          <TargetProjectionCard
            result={targetResult}
            targetCgpa={targetCgpa}
            currentCgpa={currentCgpa}
            remainingCredits={remainingCredits}
            completedCredits={completedCredits}
            maxScaleGpa={activeScale.maxGpa}
          />

          <ScenarioSimulator
            currentCgpa={currentCgpa}
            completedCredits={completedCredits}
            scale={activeScale}
            targetCgpa={targetCgpa}
          />
        </div>
      </div>
    </div>
  );
};
