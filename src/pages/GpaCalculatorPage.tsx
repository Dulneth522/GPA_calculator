import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Calculator,
  Sliders,
  HelpCircle,
  FolderPlus,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { SemesterAccordion } from '../components/calculator/SemesterAccordion';
import { GpaCounterCard } from '../components/common/GpaCounterCard';
import { QuickAddSubjectModal } from '../components/common/QuickAddSubjectModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Modal } from '../components/common/Modal';

export const GpaCalculatorPage: React.FC = () => {
  const {
    semesters,
    subjects,
    activeScale,
    scales,
    setActiveScaleId,
    updateSubject,
    deleteSubject,
    addSemester,
    deleteSemester,
    toggleSemesterStatus,
    overallGpa,
    totalCredits,
    totalPoints,
  } = useAcademicData();

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [targetSemesterId, setTargetSemesterId] = useState<string | undefined>();
  const [isNewSemesterModalOpen, setIsNewSemesterModalOpen] = useState(false);
  const [newSemName, setNewSemName] = useState('');
  const [newSemYear, setNewSemYear] = useState('Year 3');

  // Deletion confirmation modal
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

  const handleOpenAddSubject = (semesterId?: string) => {
    setTargetSemesterId(semesterId);
    setIsAddSubjectOpen(true);
  };

  const handleCreateSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemName.trim()) return;
    addSemester(newSemName.trim(), newSemYear);
    setNewSemName('');
    setIsNewSemesterModalOpen(false);
  };

  const handleDeleteSemesterConfirmed = () => {
    if (semesterToDelete) {
      deleteSemester(semesterToDelete);
      setSemesterToDelete(null);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
            <span>Credit-Weighted GPA Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize coursework by semester, customize grade points, and verify exact mathematical GPAs.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
          {/* New Semester Button */}
          <button
            onClick={() => setIsNewSemesterModalOpen(true)}
            className="min-h-[42px] inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-2xs transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>New Semester</span>
          </button>

          {/* Add Subject Button */}
          <button
            onClick={() => handleOpenAddSubject()}
            className="min-h-[42px] inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* 12-Column Responsive Layout: 8 columns Course Tables, 4 columns Projections Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Dynamic Course Tables (8 Columns) */}
        <div className="lg:col-span-8 space-y-4 w-full min-w-0">
          {semesters.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Semesters Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Get started by creating your first academic term or semester.
              </p>
              <button
                onClick={() => setIsNewSemesterModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Semester</span>
              </button>
            </div>
          ) : (
            semesters.map((sem, idx) => {
              const semSubjects = subjects.filter((s) => s.semesterId === sem.id);
              return (
                <SemesterAccordion
                  key={sem.id}
                  semester={sem}
                  subjects={semSubjects}
                  scale={activeScale}
                  defaultOpen={idx === semesters.length - 1 || idx === 0}
                  onUpdateSubject={updateSubject}
                  onDeleteSubject={deleteSubject}
                  onAddSubject={handleOpenAddSubject}
                  onDeleteSemester={(id) => setSemesterToDelete(id)}
                  onToggleStatus={toggleSemesterStatus}
                />
              );
            })
          )}

          {/* Add new semester dashed card */}
          <button
            onClick={() => setIsNewSemesterModalOpen(true)}
            className="w-full min-h-[48px] py-3.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white/70 hover:bg-indigo-50/30 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all"
          >
            <FolderPlus className="w-4 h-4 shrink-0" />
            <span>Add Next Academic Semester</span>
          </button>
        </div>

        {/* GPA Projection & Scale Sidebar (4 Columns) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 w-full min-w-0">
          {/* GPA Counter Hero Card */}
          <GpaCounterCard />

          {/* Active Scale & Rule Selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 w-full min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                Grading Scale
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100">
                Max {activeScale.maxGpa.toFixed(2)}
              </span>
            </div>

            <select
              value={activeScale.id}
              onChange={(e) => setActiveScaleId(e.target.value)}
              className="w-full min-h-[42px] px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden font-medium mb-3"
            >
              {scales.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>

            {/* Quick Grade Point Mapping Preview */}
            <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
              <div className="grid grid-cols-4 text-center text-[10px] font-bold uppercase text-slate-500 py-1.5 bg-slate-100/70 border-b border-slate-200/60">
                <span>Grade</span>
                <span>Pts</span>
                <span>Grade</span>
                <span>Pts</span>
              </div>
              <div className="p-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {activeScale.grades.slice(0, 8).map((g) => (
                  <div key={g.grade} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{g.grade}</span>
                    <span className="font-mono text-slate-600 tnum">{g.points.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Configure custom point values in <strong className="text-slate-600">Settings</strong>.
            </p>
          </div>

          {/* Mathematical Proof Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2 w-full min-w-0">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              Credit Weighting Formula
            </span>
            <p className="text-[11px] leading-relaxed">
              Cumulative GPA is calculated as total credit points divided by total completed credits:
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-indigo-700 font-bold text-center tnum break-words">
              {totalPoints.toFixed(2)} pts ÷ {totalCredits} credits = {overallGpa.toFixed(2)} CGPA
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Subject Modal */}
      <QuickAddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        defaultSemesterId={targetSemesterId}
      />

      {/* New Semester Modal */}
      <Modal
        isOpen={isNewSemesterModalOpen}
        onClose={() => setIsNewSemesterModalOpen(false)}
        title="Create New Academic Semester"
        description="Add a new term to group your courses and calculate term GPA."
        maxWidth="sm"
      >
        <form onSubmit={handleCreateSemester} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Semester Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Year 3 - Semester 1"
              value={newSemName}
              onChange={(e) => setNewSemName(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Year Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Year 3 or 2025/2026"
              value={newSemYear}
              onChange={(e) => setNewSemYear(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewSemesterModalOpen(false)}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Term</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for deleting a semester */}
      <ConfirmationModal
        isOpen={semesterToDelete !== null}
        onClose={() => setSemesterToDelete(null)}
        onConfirm={handleDeleteSemesterConfirmed}
        title="Delete Semester?"
        message="Deleting this semester will permanently remove all subjects registered within it from your local storage. This action cannot be undone."
        confirmLabel="Yes, Delete Semester"
        isDestructive={true}
      />
    </div>
  );
};
