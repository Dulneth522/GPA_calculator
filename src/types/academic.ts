/**
 * UniPath Academic & Career Pathway Intelligence
 * Core Type Definitions
 */

export interface GradeItem {
  grade: string;
  points: number;
  description?: string;
  minPercentage?: number;
}

export interface GradingScale {
  id: string;
  name: string;
  maxGpa: number;
  passGpa: number;
  grades: GradeItem[];
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  credits: number;
  grade: string; // e.g., 'A', 'B+', 'In Progress'
  semesterId: string;
  includeInGpa: boolean;
  skills?: string[];
  category?: 'Core' | 'Elective' | 'General' | 'Internship' | 'Project';
}

export interface Semester {
  id: string;
  name: string; // e.g. "Year 1 - Semester 1"
  academicYear: string; // e.g. "2024/2025"
  isCompleted: boolean;
}

export interface HonorsClassification {
  firstClass: number; // e.g. 3.70
  secondUpper: number; // e.g. 3.30
  secondLower: number; // e.g. 3.00
  pass: number; // e.g. 2.00
}

export interface TargetGpaPlan {
  currentCgpa: number;
  completedCredits: number;
  remainingCredits: number;
  targetCgpa: number;
}

export interface TargetCalculationResult {
  requiredGpa: number;
  isAchievable: boolean;
  message: string;
  status: 'achieved' | 'realistic' | 'challenging' | 'impossible';
  maxPossibleCgpa: number;
  minPossibleCgpa: number;
}

export interface CareerSkill {
  id: string;
  name: string;
  category: 'Languages' | 'Frameworks' | 'Core CS' | 'DevOps' | 'Tools' | 'Soft Skills' | 'Data';
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  recommendedSkills: string[];
  iconName?: string;
  growthOutlook?: string;
}

export interface SubjectRelevanceMatch {
  subjectId: string;
  subjectCode: string;
  subjectTitle: string;
  credits: number;
  relevanceScore: number; // 0 to 100
  matchedSkills: string[];
  recommendedReason: string;
  categoryFit: 'Essential Core' | 'High Impact Elective' | 'Complementary Skill' | 'General Knowledge';
}

export interface UserPreferences {
  activeGradingScaleId: string;
  targetCgpa: number;
  targetRole: string;
  honors: HonorsClassification;
  showDemoData: boolean;
  hasSeenWelcome: boolean;
}
