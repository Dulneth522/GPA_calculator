import { GradingScale, HonorsClassification, Subject, TargetCalculationResult } from '../types/academic';

/**
 * Returns the numerical grade points for a given letter grade in the active scale.
 * If grade is not found or invalid, returns null.
 */
export function getGradePoint(grade: string, scale: GradingScale): number | null {
  const normalized = grade.trim().toUpperCase();
  const match = scale.grades.find(
    (g) => g.grade.trim().toUpperCase() === normalized
  );
  return match !== undefined ? match.points : null;
}

/**
 * Calculate GPA for a collection of subjects using credit-weighted grade points.
 * Handles missing data, zero credits, non-GPA subjects, and invalid grades.
 */
export function calculateGpa(
  subjects: Subject[],
  scale: GradingScale
): {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  gradedSubjectCount: number;
} {
  let totalCredits = 0;
  let totalPoints = 0;
  let gradedSubjectCount = 0;

  for (const subject of subjects) {
    if (!subject.includeInGpa) continue;
    const credits = Number(subject.credits);
    if (isNaN(credits) || credits <= 0) continue;

    const points = getGradePoint(subject.grade, scale);
    if (points !== null) {
      totalCredits += credits;
      totalPoints += points * credits;
      gradedSubjectCount++;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  // Format to 2 decimal places with rounding
  const roundedGpa = Math.round(gpa * 100) / 100;

  return {
    gpa: roundedGpa,
    totalCredits,
    totalPoints: Math.round(totalPoints * 100) / 100,
    gradedSubjectCount,
  };
}

/**
 * Calculates semester-by-semester GPA and running cumulative GPA.
 */
export function calculateSemesterMetrics(
  semesterIds: string[],
  allSubjects: Subject[],
  scale: GradingScale
): Array<{
  semesterId: string;
  semesterGpa: number;
  semesterCredits: number;
  cumulativeGpa: number;
  cumulativeCredits: number;
}> {
  const result: Array<{
    semesterId: string;
    semesterGpa: number;
    semesterCredits: number;
    cumulativeGpa: number;
    cumulativeCredits: number;
  }> = [];

  let runningPoints = 0;
  let runningCredits = 0;

  for (const semId of semesterIds) {
    const semSubjects = allSubjects.filter((s) => s.semesterId === semId && s.includeInGpa);
    let semPoints = 0;
    let semCredits = 0;

    for (const sub of semSubjects) {
      const cr = Number(sub.credits) || 0;
      const pt = getGradePoint(sub.grade, scale);
      if (pt !== null && cr > 0) {
        semPoints += pt * cr;
        semCredits += cr;
      }
    }

    const semesterGpa = semCredits > 0 ? Math.round((semPoints / semCredits) * 100) / 100 : 0;
    runningPoints += semPoints;
    runningCredits += semCredits;
    const cumulativeGpa = runningCredits > 0 ? Math.round((runningPoints / runningCredits) * 100) / 100 : 0;

    result.push({
      semesterId: semId,
      semesterGpa,
      semesterCredits: semCredits,
      cumulativeGpa,
      cumulativeCredits: runningCredits,
    });
  }

  return result;
}

/**
 * Mathematically calculates required GPA to achieve target CGPA.
 * Handles zero remaining credits, bounds checking, and theoretical limits.
 */
export function calculateTargetRequirement(
  currentCgpa: number,
  completedCredits: number,
  remainingCredits: number,
  targetCgpa: number,
  scale: GradingScale
): TargetCalculationResult {
  const maxScaleGpa = scale.maxGpa;
  const passGpa = scale.passGpa;

  // Safe checks
  const safeCurrent = Math.max(0, currentCgpa);
  const safeComp = Math.max(0, completedCredits);
  const safeRem = Math.max(0, remainingCredits);
  const safeTarget = Math.max(0, targetCgpa);

  const totalCredits = safeComp + safeRem;

  // Max possible CGPA if student scores maximum scale GPA on all remaining credits
  const maxPointsPossible = safeCurrent * safeComp + maxScaleGpa * safeRem;
  const maxPossibleCgpa = totalCredits > 0 ? Math.round((maxPointsPossible / totalCredits) * 100) / 100 : safeCurrent;

  // Min possible CGPA if student scores passGpa (or 0) on remaining credits
  const minPointsPossible = safeCurrent * safeComp + 0 * safeRem;
  const minPossibleCgpa = totalCredits > 0 ? Math.round((minPointsPossible / totalCredits) * 100) / 100 : safeCurrent;

  // Case 1: No remaining credits
  if (safeRem <= 0) {
    if (safeCurrent >= safeTarget) {
      return {
        requiredGpa: 0,
        isAchievable: true,
        message: `Goal already reached! You have completed all credits with a ${safeCurrent.toFixed(2)} CGPA, meeting your target of ${safeTarget.toFixed(2)}.`,
        status: 'achieved',
        maxPossibleCgpa: safeCurrent,
        minPossibleCgpa: safeCurrent,
      };
    } else {
      return {
        requiredGpa: 0,
        isAchievable: false,
        message: `With 0 remaining credits, your final CGPA is locked at ${safeCurrent.toFixed(2)}, which is below your target of ${safeTarget.toFixed(2)}.`,
        status: 'impossible',
        maxPossibleCgpa: safeCurrent,
        minPossibleCgpa: safeCurrent,
      };
    }
  }

  // Case 2: Target is higher than max possible GPA in the scale
  if (safeTarget > maxScaleGpa) {
    return {
      requiredGpa: safeTarget,
      isAchievable: false,
      message: `Your target of ${safeTarget.toFixed(2)} exceeds the maximum attainable GPA of ${maxScaleGpa.toFixed(2)} for this scale.`,
      status: 'impossible',
      maxPossibleCgpa,
      minPossibleCgpa,
    };
  }

  // Mathematical formula:
  // TargetTotalPoints = targetCgpa * totalCredits
  // CurrentPoints = currentCgpa * completedCredits
  // NeededPoints = TargetTotalPoints - CurrentPoints
  // RequiredGpa = NeededPoints / remainingCredits
  const targetTotalPoints = safeTarget * totalCredits;
  const currentTotalPoints = safeCurrent * safeComp;
  const neededPoints = targetTotalPoints - currentTotalPoints;
  const rawRequiredGpa = neededPoints / safeRem;
  const requiredGpa = Math.round(rawRequiredGpa * 100) / 100;

  // Case 3: Required GPA is already exceeded (already guaranteed)
  if (requiredGpa <= 0) {
    return {
      requiredGpa: 0,
      isAchievable: true,
      message: `Target secured! Your current performance (${safeCurrent.toFixed(2)}) is high enough that you will maintain at least ${safeTarget.toFixed(2)} across the remaining ${safeRem} credits as long as you pass.`,
      status: 'achieved',
      maxPossibleCgpa,
      minPossibleCgpa,
    };
  }

  // Case 4: Required GPA exceeds the scale's maximum GPA
  if (requiredGpa > maxScaleGpa) {
    return {
      requiredGpa,
      isAchievable: false,
      message: `Mathematically unreachable. You would need an average GPA of ${requiredGpa.toFixed(2)}, but the scale caps at ${maxScaleGpa.toFixed(2)}. The highest possible CGPA you can graduate with is ${maxPossibleCgpa.toFixed(2)}.`,
      status: 'impossible',
      maxPossibleCgpa,
      minPossibleCgpa,
    };
  }

  // Case 5: Extremely challenging (close to max scale)
  if (requiredGpa >= maxScaleGpa - 0.15) {
    return {
      requiredGpa,
      isAchievable: true,
      message: `Achievable with near-perfect grades. You need a ${requiredGpa.toFixed(2)} average across all remaining ${safeRem} credits. You have virtually zero margin for B grades.`,
      status: 'challenging',
      maxPossibleCgpa,
      minPossibleCgpa,
    };
  }

  // Case 6: Realistic
  return {
    requiredGpa,
    isAchievable: true,
    message: `Realistic pathway. Maintaining an average of ${requiredGpa.toFixed(2)} across your next ${safeRem} credits will secure your target CGPA of ${safeTarget.toFixed(2)}.`,
    status: 'realistic',
    maxPossibleCgpa,
    minPossibleCgpa,
  };
}

/**
 * Classifies an overall GPA into honors standing based on university thresholds.
 */
export function getHonorsStanding(
  gpa: number,
  honors: HonorsClassification
): {
  standing: string;
  badgeColor: string;
  nextTier?: { name: string; gap: number };
} {
  if (gpa >= honors.firstClass) {
    return {
      standing: 'First Class Honours',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }
  if (gpa >= honors.secondUpper) {
    const gap = Math.round((honors.firstClass - gpa) * 100) / 100;
    return {
      standing: 'Second Class (Upper Division)',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      nextTier: { name: 'First Class', gap },
    };
  }
  if (gpa >= honors.secondLower) {
    const gap = Math.round((honors.secondUpper - gpa) * 100) / 100;
    return {
      standing: 'Second Class (Lower Division)',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      nextTier: { name: 'Second Upper', gap },
    };
  }
  if (gpa >= honors.pass) {
    const gap = Math.round((honors.secondLower - gpa) * 100) / 100;
    return {
      standing: 'General Degree Pass',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      nextTier: { name: 'Second Lower', gap },
    };
  }
  return {
    standing: 'Academic Probation / Below Pass',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    nextTier: { name: 'Pass Standing', gap: Math.round((honors.pass - gpa) * 100) / 100 },
  };
}
