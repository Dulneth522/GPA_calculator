import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Plus,
  Save,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { GradingScale } from '../types/academic';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const {
    scales,
    activeScale,
    setActiveScaleId,
    updateScale,
    addNewScale,
    preferences,
    updatePreferences,
    resetDemoData,
    clearUserData,
    exportBackupJson,
    importBackupJson,
    showToast,
  } = useAcademicData();

  // Controlled active scale editing
  const [editingScale, setEditingScale] = useState<GradingScale>(activeScale);
  const [isNewScaleModalOpen, setIsNewScaleModalOpen] = useState(false);
  const [newScaleName, setNewScaleName] = useState('');
  const [newScaleMax, setNewScaleMax] = useState('4.0');

  // Confirmation Modals
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Sync editing scale when active scale switches
  React.useEffect(() => {
    setEditingScale(activeScale);
  }, [activeScale]);

  const handleGradePointChange = (gradeIndex: number, newPoint: number) => {
    const updatedGrades = [...editingScale.grades];
    updatedGrades[gradeIndex] = {
      ...updatedGrades[gradeIndex],
      points: Math.max(0, newPoint),
    };
    setEditingScale({
      ...editingScale,
      grades: updatedGrades,
    });
  };

  const handleSaveScale = (e: React.FormEvent) => {
    e.preventDefault();
    updateScale(editingScale);
  };

  const handleCreateNewScale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScaleName.trim()) return;

    const maxG = parseFloat(newScaleMax) || 4.0;
    const newCustomScale: GradingScale = {
      id: 'scale_custom_' + Date.now(),
      name: newScaleName.trim(),
      maxGpa: maxG,
      passGpa: 2.0,
      grades: [
        { grade: 'A+', points: maxG, description: 'Highest Distinction' },
        { grade: 'A', points: 4.0, description: 'Excellent' },
        { grade: 'A-', points: 3.7, description: 'Very Good' },
        { grade: 'B+', points: 3.3, description: 'Good' },
        { grade: 'B', points: 3.0, description: 'Average' },
        { grade: 'B-', points: 2.7, description: 'Satisfactory' },
        { grade: 'C+', points: 2.3, description: 'Marginal' },
        { grade: 'C', points: 2.0, description: 'Pass' },
        { grade: 'D', points: 1.0, description: 'Conditional Pass' },
        { grade: 'E', points: 0.0, description: 'Fail' },
      ],
    };

    addNewScale(newCustomScale);
    setIsNewScaleModalOpen(false);
    setNewScaleName('');
  };

  const handleExportJson = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unipath_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('JSON backup file downloaded.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl w-full min-w-0">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
          <span>Settings & Grading Architecture</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure university grade-point mappings, honors thresholds, local storage preferences, and data backups.
        </p>
      </div>

      {/* Section 1: Active Grading Scale & Custom Point Mappings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>University Grading Scale & Grade Points</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or customize the grade points corresponding to each letter grade.
            </p>
          </div>

          <button
            onClick={() => setIsNewScaleModalOpen(true)}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>New Custom Scale</span>
          </button>
        </div>

        {/* Scale Switcher Dropdown */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Active University Scale:
          </label>
          <select
            value={activeScale.id}
            onChange={(e) => setActiveScaleId(e.target.value)}
            className="w-full min-h-[44px] px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden font-medium"
          >
            {scales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Max GPA: {s.maxGpa.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Grade-Point Mapping Matrix */}
        <form onSubmit={handleSaveScale} className="space-y-4">
          <div className="border border-slate-200 rounded-xl overflow-x-auto touch-scroll w-full min-w-0">
            <table className="w-full text-left text-xs min-w-[420px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Grade</th>
                  <th className="py-2.5 px-3 sm:px-4">Grade Points (Weight)</th>
                  <th className="py-2.5 px-3 sm:px-4">Academic Standing</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right hidden sm:table-cell">Typical %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {editingScale.grades.map((item, idx) => (
                  <tr key={item.grade} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900 text-sm">
                      {item.grade}
                    </td>
                    <td className="py-2 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={editingScale.maxGpa + 0.5}
                          value={item.points}
                          onChange={(e) =>
                            handleGradePointChange(idx, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 min-h-[36px] px-2 py-1 border border-slate-200 rounded-lg font-mono font-bold text-indigo-700 tnum focus:border-indigo-600 focus:outline-hidden text-center"
                        />
                        <span className="text-[11px] text-slate-400">pts</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">
                      {item.description || 'Standard Grade'}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-right text-slate-400 font-mono hidden sm:table-cell">
                      {item.minPercentage ? `${item.minPercentage}%+` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Grading Scale Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Degree Classification Cutoffs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
          Honors & Degree Classification Boundaries
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Adjust the minimum CGPA required for First Class, Second Upper, and Second Lower honours.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
              First Class (Min CGPA)
            </label>
            <input
              type="number"
              step="0.01"
              value={preferences.honors.firstClass}
              onChange={(e) =>
                updatePreferences({
                  honors: {
                    ...preferences.honors,
                    firstClass: parseFloat(e.target.value) || 3.7,
                  },
                })
              }
              className="w-full min-h-[44px] px-3 text-sm font-bold border border-slate-200 rounded-xl text-emerald-700 tnum"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
              Second Upper (Min CGPA)
            </label>
            <input
              type="number"
              step="0.01"
              value={preferences.honors.secondUpper}
              onChange={(e) =>
                updatePreferences({
                  honors: {
                    ...preferences.honors,
                    secondUpper: parseFloat(e.target.value) || 3.3,
                  },
                })
              }
              className="w-full min-h-[44px] px-3 text-sm font-bold border border-slate-200 rounded-xl text-indigo-700 tnum"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
              Second Lower (Min CGPA)
            </label>
            <input
              type="number"
              step="0.01"
              value={preferences.honors.secondLower}
              onChange={(e) =>
                updatePreferences({
                  honors: {
                    ...preferences.honors,
                    secondLower: parseFloat(e.target.value) || 3.0,
                  },
                })
              }
              className="w-full min-h-[44px] px-3 text-sm font-bold border border-slate-200 rounded-xl text-blue-700 tnum"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
              General Pass (Min CGPA)
            </label>
            <input
              type="number"
              step="0.01"
              value={preferences.honors.pass}
              onChange={(e) =>
                updatePreferences({
                  honors: {
                    ...preferences.honors,
                    pass: parseFloat(e.target.value) || 2.0,
                  },
                })
              }
              className="w-full min-h-[44px] px-3 text-sm font-bold border border-slate-200 rounded-xl text-amber-700 tnum"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Privacy, Backup & Storage Persistence Notice */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Browser Local Storage & Privacy Notice
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              UniPath operates strictly on client-side browser storage (<code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono">localStorage</code>). No personal data or grades are transmitted to any remote server or database.
            </p>
            <p className="text-xs text-amber-700 font-semibold mt-2">
              ⚠️ Important: Data may be cleared if you clear your browser cache, browse in incognito mode, or switch devices. Use the JSON backup tools below to safely store your records.
            </p>
          </div>
        </div>

        {/* JSON Export / Import */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleExportJson}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Backup</span>
          </button>

          <label className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Restore from JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Section 4: Data Management & Reset with Confirmation */}
      <div className="bg-white rounded-xl border border-rose-200/80 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Data Management & Danger Zone</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Reset demo records to starting state or wipe all saved courses from this device.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span>Reset to Demo Coursework</span>
          </button>

          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Saved Records</span>
          </button>
        </div>
      </div>

      {/* Create Scale Modal */}
      <Modal
        isOpen={isNewScaleModalOpen}
        onClose={() => setIsNewScaleModalOpen(false)}
        title="Create Custom Grading Scale"
        description="Provide a descriptive name and maximum GPA cap for your university scale."
        maxWidth="sm"
      >
        <form onSubmit={handleCreateNewScale} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Scale Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. My University 4.0 Standard"
              value={newScaleName}
              onChange={(e) => setNewScaleName(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum GPA
            </label>
            <input
              type="number"
              step="0.01"
              min="1.0"
              max="10.0"
              value={newScaleMax}
              onChange={(e) => setNewScaleMax(e.target.value)}
              className="w-full min-h-[44px] px-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden tnum font-bold text-indigo-700"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewScaleModalOpen(false)}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Create Scale
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset to Demo Coursework?"
        message="This will overwrite your existing records with the default sample computer science curriculum. You can export a JSON backup first if you have custom records."
        confirmLabel="Reset to Demo"
        isDestructive={false}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearUserData}
        title="Delete All Saved Records?"
        message="This will permanently delete all courses, custom grading scales, and saved preferences from this browser's local storage. This action cannot be undone."
        confirmLabel="Yes, Clear All Data"
        isDestructive={true}
      />
    </div>
  );
};
