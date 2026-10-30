import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface AddElectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: { code: string; title: string; credits: number; skills: string[]; category: 'Elective' | 'Core' }) => void;
}

export const AddElectiveModal: React.FC<AddElectiveModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('3');
  const [skills, setSkills] = useState('');
  const [category, setCategory] = useState<'Elective' | 'Core'>('Elective');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Course title is required');
      return;
    }

    const cr = parseFloat(credits) || 3;
    const parsedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onAdd({
      code: code.trim().toUpperCase() || 'ELEC' + Math.floor(100 + Math.random() * 900),
      title: title.trim(),
      credits: cr,
      skills: parsedSkills,
      category,
    });

    setCode('');
    setTitle('');
    setSkills('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add University Subject to Career Evaluation"
      description="Enter the course title and the tech skills or knowledge it covers."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              placeholder="e.g. CS4150"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Caching & Redis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Credits
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 tnum"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Curriculum Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full min-h-[44px] px-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 font-medium"
            >
              <option value="Elective">Specialization Elective</option>
              <option value="Core">Core Prerequisite</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Associated Skills (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Docker, Redis, Microservices, REST APIs"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            The ranking engine will match these skills against the selected job role.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
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
            <span>Add Course</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
