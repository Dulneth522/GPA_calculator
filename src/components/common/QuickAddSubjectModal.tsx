import React, { useState } from 'react';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { useAcademicData } from '../../hooks/useAcademicData';

interface QuickAddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSemesterId?: string;
}

export const QuickAddSubjectModal: React.FC<QuickAddSubjectModalProps> = ({
  isOpen,
  onClose,
  defaultSemesterId,
}) => {
  const { semesters, activeScale, addSubject } = useAcademicData();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('3');
  const [grade, setGrade] = useState(activeScale.grades[0]?.grade || 'A');
  const [semesterId, setSemesterId] = useState(
    defaultSemesterId || (semesters[0]?.id ?? '')
  );
  const [category, setCategory] = useState<'Core' | 'Elective' | 'General' | 'Project'>('Core');
  const [skillsInput, setSkillsInput] = useState('');
  const [includeInGpa, setIncludeInGpa] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Update semesterId if defaultSemesterId changes
  React.useEffect(() => {
    if (defaultSemesterId) {
      setSemesterId(defaultSemesterId);
    } else if (semesters.length > 0 && !semesterId) {
      setSemesterId(semesters[0].id);
    }
  }, [defaultSemesterId, semesters, semesterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Subject title is required.');
      return;
    }

    const numCredits = Number(credits);
    if (isNaN(numCredits) || numCredits <= 0) {
      setErrorMessage('Credits must be a positive number (e.g. 1, 2, 3, 4).');
      return;
    }

    if (!semesterId) {
      setErrorMessage('Please select or create a semester first.');
      return;
    }

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    addSubject({
      code: code.trim().toUpperCase() || 'MOD' + Math.floor(1000 + Math.random() * 9000),
      title: title.trim(),
      credits: numCredits,
      grade,
      semesterId,
      category,
      skills: parsedSkills.length > 0 ? parsedSkills : undefined,
      includeInGpa,
    });

    // Reset fields
    setCode('');
    setTitle('');
    setCredits('3');
    setSkillsInput('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Subject Record"
      description="Record a new course with credit weighting and letter grade."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              placeholder="e.g. CS2010"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures & Algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Credits <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="15"
              required
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 tnum"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grade Earned / Target
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full min-h-[44px] px-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 font-medium"
            >
              {activeScale.grades.map((g) => (
                <option key={g.grade} value={g.grade}>
                  {g.grade} ({g.points.toFixed(2)} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Semester
            </label>
            <select
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              className="w-full min-h-[44px] px-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full min-h-[44px] px-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            >
              <option value="Core">Core Prerequisite</option>
              <option value="Elective">Specialization Elective</option>
              <option value="General">General / Breadth</option>
              <option value="Project">Final Year Project</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills Tagged (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, SQL, Algorithms"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 select-none min-h-[36px]">
            <input
              type="checkbox"
              checked={includeInGpa}
              onChange={(e) => setIncludeInGpa(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 shrink-0"
            />
            <span>Include in credit-weighted GPA calculation</span>
          </label>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Course</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
