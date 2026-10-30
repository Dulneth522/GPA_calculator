import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import {
  GradingScale,
  HonorsClassification,
  Semester,
  Subject,
  UserPreferences,
} from '../types/academic';
import {
  calculateGpa,
  calculateSemesterMetrics,
  getHonorsStanding,
} from '../utils/gpaCalculator';
import {
  AppStateData,
  clearAllStorageData,
  loadInitialData,
  resetToDefaultDemo,
  saveStateToStorage,
} from '../utils/storage';

interface AcademicContextType {
  semesters: Semester[];
  subjects: Subject[];
  scales: GradingScale[];
  activeScale: GradingScale;
  preferences: UserPreferences;
  availableElectives: Subject[];

  // Computed
  overallGpa: number;
  totalCredits: number;
  totalPoints: number;
  honorsStanding: { standing: string; badgeColor: string; nextTier?: { name: string; gap: number } };
  semesterBreakdown: Array<{
    semesterId: string;
    semesterGpa: number;
    semesterCredits: number;
    cumulativeGpa: number;
    cumulativeCredits: number;
  }>;

  // Actions
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addSemester: (name: string, academicYear: string) => void;
  deleteSemester: (id: string) => void;
  toggleSemesterStatus: (id: string) => void;
  setActiveScaleId: (scaleId: string) => void;
  updateScale: (updatedScale: GradingScale) => void;
  addNewScale: (newScale: GradingScale) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  addCustomElective: (elective: Omit<Subject, 'id'>) => void;
  removeElective: (id: string) => void;
  resetDemoData: () => void;
  clearUserData: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonStr: string) => boolean;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export function AcademicProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppStateData>(() => loadInitialData());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveStateToStorage(data);
  }, [data]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const activeScale = useMemo(() => {
    return (
      data.scales.find((s) => s.id === data.preferences.activeGradingScaleId) ||
      data.scales[0]
    );
  }, [data.scales, data.preferences.activeGradingScaleId]);

  // Computed Overall GPA
  const overallMetrics = useMemo(() => {
    return calculateGpa(data.subjects, activeScale);
  }, [data.subjects, activeScale]);

  // Honors standing
  const honorsStanding = useMemo(() => {
    return getHonorsStanding(overallMetrics.gpa, data.preferences.honors);
  }, [overallMetrics.gpa, data.preferences.honors]);

  // Semester breakdown
  const semesterBreakdown = useMemo(() => {
    const semIds = data.semesters.map((s) => s.id);
    return calculateSemesterMetrics(semIds, data.subjects, activeScale);
  }, [data.semesters, data.subjects, activeScale]);

  // Actions
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    showToast(`Added "${newSubject.title}" successfully!`);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)),
    }));
  };

  const deleteSubject = (id: string) => {
    const sub = data.subjects.find((s) => s.id === id);
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
    showToast(`Removed "${sub?.title || 'Course'}"`, 'info');
  };

  const addSemester = (name: string, academicYear: string) => {
    const newSem: Semester = {
      id: 'sem-' + Date.now(),
      name,
      academicYear,
      isCompleted: false,
    };
    setData((prev) => ({
      ...prev,
      semesters: [...prev.semesters, newSem],
    }));
    showToast(`Created semester: ${name}`);
  };

  const deleteSemester = (id: string) => {
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.filter((s) => s.id !== id),
      subjects: prev.subjects.filter((s) => s.semesterId !== id),
    }));
    showToast('Semester and related subjects removed.', 'info');
  };

  const toggleSemesterStatus = (id: string) => {
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) =>
        s.id === id ? { ...s, isCompleted: !s.isCompleted } : s
      ),
    }));
  };

  const setActiveScaleId = (scaleId: string) => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        activeGradingScaleId: scaleId,
      },
    }));
    showToast('Grading scale changed.');
  };

  const updateScale = (updatedScale: GradingScale) => {
    setData((prev) => ({
      ...prev,
      scales: prev.scales.map((s) => (s.id === updatedScale.id ? updatedScale : s)),
    }));
    showToast('Grading scale rules updated successfully.');
  };

  const addNewScale = (newScale: GradingScale) => {
    setData((prev) => ({
      ...prev,
      scales: [...prev.scales, newScale],
      preferences: {
        ...prev.preferences,
        activeGradingScaleId: newScale.id,
      },
    }));
    showToast(`Created custom grading scale: ${newScale.name}`);
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  };

  const addCustomElective = (elective: Omit<Subject, 'id'>) => {
    const newElec: Subject = {
      ...elective,
      id: 'custom-elec-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      availableElectives: [newElec, ...prev.availableElectives],
    }));
    showToast(`Added elective: ${newElec.title}`);
  };

  const removeElective = (id: string) => {
    setData((prev) => ({
      ...prev,
      availableElectives: prev.availableElectives.filter((e) => e.id !== id),
    }));
  };

  const resetDemoData = () => {
    const fresh = resetToDefaultDemo();
    setData(fresh);
    showToast('Restored demo academic data.', 'info');
  };

  const clearUserData = () => {
    const empty = clearAllStorageData();
    setData(empty);
    showToast('All stored academic records have been cleared.', 'info');
  };

  const exportBackupJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importBackupJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.semesters || !parsed.subjects || !parsed.scales) {
        throw new Error('Invalid schema format');
      }
      setData(parsed);
      showToast('Backup restored successfully!');
      return true;
    } catch (err) {
      showToast('Failed to import: file is not valid UniPath JSON data.', 'error');
      return false;
    }
  };

  return (
    <AcademicContext.Provider
      value={{
        semesters: data.semesters,
        subjects: data.subjects,
        scales: data.scales,
        activeScale,
        preferences: data.preferences,
        availableElectives: data.availableElectives,
        overallGpa: overallMetrics.gpa,
        totalCredits: overallMetrics.totalCredits,
        totalPoints: overallMetrics.totalPoints,
        honorsStanding,
        semesterBreakdown,
        addSubject,
        updateSubject,
        deleteSubject,
        addSemester,
        deleteSemester,
        toggleSemesterStatus,
        setActiveScaleId,
        updateScale,
        addNewScale,
        updatePreferences,
        addCustomElective,
        removeElective,
        resetDemoData,
        clearUserData,
        exportBackupJson,
        importBackupJson,
        toast,
        showToast,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademicData() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicProvider');
  }
  return context;
}
