import { GradingScale, Semester, Subject, UserPreferences } from '../types/academic';
import { DEFAULT_GRADING_SCALES } from '../data/defaultGradingScales';
import { DEMO_PREFERENCES, DEMO_SEMESTERS, DEMO_SUBJECTS } from '../data/demoAcademicData';
import { UNIVERSITY_AVAILABLE_ELECTIVES } from '../data/careerPathways';

const STORAGE_KEYS = {
  SEMESTERS: 'unipath_semesters_v1',
  SUBJECTS: 'unipath_subjects_v1',
  SCALES: 'unipath_scales_v1',
  PREFS: 'unipath_prefs_v1',
  AVAILABLE_ELECTIVES: 'unipath_electives_v1',
};

export interface AppStateData {
  semesters: Semester[];
  subjects: Subject[];
  scales: GradingScale[];
  preferences: UserPreferences;
  availableElectives: Subject[];
}

export function loadInitialData(): AppStateData {
  try {
    const rawSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
    const rawSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const rawScales = localStorage.getItem(STORAGE_KEYS.SCALES);
    const rawPrefs = localStorage.getItem(STORAGE_KEYS.PREFS);
    const rawElectives = localStorage.getItem(STORAGE_KEYS.AVAILABLE_ELECTIVES);

    return {
      semesters: rawSemesters ? JSON.parse(rawSemesters) : DEMO_SEMESTERS,
      subjects: rawSubjects ? JSON.parse(rawSubjects) : DEMO_SUBJECTS,
      scales: rawScales ? JSON.parse(rawScales) : DEFAULT_GRADING_SCALES,
      preferences: rawPrefs ? JSON.parse(rawPrefs) : DEMO_PREFERENCES,
      availableElectives: rawElectives ? JSON.parse(rawElectives) : UNIVERSITY_AVAILABLE_ELECTIVES,
    };
  } catch (err) {
    console.warn('Failed to parse localStorage data, falling back to defaults:', err);
    return {
      semesters: DEMO_SEMESTERS,
      subjects: DEMO_SUBJECTS,
      scales: DEFAULT_GRADING_SCALES,
      preferences: DEMO_PREFERENCES,
      availableElectives: UNIVERSITY_AVAILABLE_ELECTIVES,
    };
  }
}

export function saveStateToStorage(state: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(state.semesters));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(state.subjects));
    localStorage.setItem(STORAGE_KEYS.SCALES, JSON.stringify(state.scales));
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(state.preferences));
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_ELECTIVES, JSON.stringify(state.availableElectives));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export function clearAllStorageData(): AppStateData {
  try {
    localStorage.removeItem(STORAGE_KEYS.SEMESTERS);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.SCALES);
    localStorage.removeItem(STORAGE_KEYS.PREFS);
    localStorage.removeItem(STORAGE_KEYS.AVAILABLE_ELECTIVES);
  } catch (e) {
    console.error(e);
  }

  return {
    semesters: [
      { id: 'sem-1', name: 'Year 1 - Semester 1', academicYear: 'Year 1', isCompleted: false },
    ],
    subjects: [],
    scales: DEFAULT_GRADING_SCALES,
    preferences: {
      ...DEMO_PREFERENCES,
      showDemoData: false,
    },
    availableElectives: UNIVERSITY_AVAILABLE_ELECTIVES,
  };
}

export function resetToDefaultDemo(): AppStateData {
  const freshData: AppStateData = {
    semesters: DEMO_SEMESTERS,
    subjects: DEMO_SUBJECTS,
    scales: DEFAULT_GRADING_SCALES,
    preferences: DEMO_PREFERENCES,
    availableElectives: UNIVERSITY_AVAILABLE_ELECTIVES,
  };
  saveStateToStorage(freshData);
  return freshData;
}
