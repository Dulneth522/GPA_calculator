import { GradingScale, HonorsClassification } from '../types/academic';

export const DEFAULT_GRADING_SCALES: GradingScale[] = [
  {
    id: 'scale_standard_4_0',
    name: 'Standard 4.0 System (A+ to F)',
    maxGpa: 4.0,
    passGpa: 2.0,
    grades: [
      { grade: 'A+', points: 4.0, description: 'High Distinction / Superior', minPercentage: 85 },
      { grade: 'A', points: 4.0, description: 'Distinction / Excellent', minPercentage: 80 },
      { grade: 'A-', points: 3.7, description: 'Very Good', minPercentage: 75 },
      { grade: 'B+', points: 3.3, description: 'Good', minPercentage: 70 },
      { grade: 'B', points: 3.0, description: 'Satisfactory / Above Average', minPercentage: 65 },
      { grade: 'B-', points: 2.7, description: 'Average', minPercentage: 60 },
      { grade: 'C+', points: 2.3, description: 'Below Average', minPercentage: 55 },
      { grade: 'C', points: 2.0, description: 'Pass (Minimum credit requirement)', minPercentage: 50 },
      { grade: 'C-', points: 1.7, description: 'Conditional Pass', minPercentage: 45 },
      { grade: 'D+', points: 1.3, description: 'Weak Pass', minPercentage: 40 },
      { grade: 'D', points: 1.0, description: 'Marginal Pass', minPercentage: 35 },
      { grade: 'E', points: 0.0, description: 'Fail', minPercentage: 0 },
      { grade: 'F', points: 0.0, description: 'Fail', minPercentage: 0 },
    ],
  },
  {
    id: 'scale_extended_4_25',
    name: 'Extended 4.25 System (With Honors A+ Bonus)',
    maxGpa: 4.25,
    passGpa: 2.0,
    grades: [
      { grade: 'A+', points: 4.25, description: 'Outstanding Distinction', minPercentage: 90 },
      { grade: 'A', points: 4.0, description: 'Excellent', minPercentage: 80 },
      { grade: 'A-', points: 3.75, description: 'Very Good', minPercentage: 75 },
      { grade: 'B+', points: 3.25, description: 'Good', minPercentage: 70 },
      { grade: 'B', points: 3.0, description: 'Average Good', minPercentage: 65 },
      { grade: 'B-', points: 2.75, description: 'Satisfactory', minPercentage: 60 },
      { grade: 'C+', points: 2.25, description: 'Adequate', minPercentage: 55 },
      { grade: 'C', points: 2.0, description: 'Pass', minPercentage: 50 },
      { grade: 'C-', points: 1.75, description: 'Conditional Pass', minPercentage: 45 },
      { grade: 'D', points: 1.0, description: 'Borderline Pass', minPercentage: 35 },
      { grade: 'E', points: 0.0, description: 'Fail', minPercentage: 0 },
    ],
  },
  {
    id: 'scale_simplified_4_0',
    name: 'Simplified 4.0 Letter Grade (A, B, C, D, F)',
    maxGpa: 4.0,
    passGpa: 2.0,
    grades: [
      { grade: 'A', points: 4.0, description: 'Excellent', minPercentage: 80 },
      { grade: 'B', points: 3.0, description: 'Good', minPercentage: 65 },
      { grade: 'C', points: 2.0, description: 'Satisfactory', minPercentage: 50 },
      { grade: 'D', points: 1.0, description: 'Passing', minPercentage: 40 },
      { grade: 'F', points: 0.0, description: 'Fail', minPercentage: 0 },
    ],
  },
];

export const DEFAULT_HONORS: HonorsClassification = {
  firstClass: 3.70,
  secondUpper: 3.30,
  secondLower: 3.00,
  pass: 2.00,
};
