import { CareerRole, Subject, SubjectRelevanceMatch } from '../types/academic';

/**
 * Transparent, deterministic rule-based matching engine.
 * Computes exact skill overlap and generates human-readable explanations.
 * No black-box ML or fake confidence indicators are used.
 */
export function rankSubjectsForCareer(
  role: CareerRole,
  subjects: Subject[]
): SubjectRelevanceMatch[] {
  const reqSet = new Set(role.requiredSkills.map((s) => s.toLowerCase().trim()));
  const recSet = new Set(role.recommendedSkills.map((s) => s.toLowerCase().trim()));

  const matches: SubjectRelevanceMatch[] = subjects.map((subject) => {
    const subjectSkills = subject.skills || [];
    const matchedRequired: string[] = [];
    const matchedRecommended: string[] = [];

    for (const skill of subjectSkills) {
      const normalized = skill.toLowerCase().trim();
      if (reqSet.has(normalized)) {
        matchedRequired.push(skill);
      } else if (recSet.has(normalized)) {
        matchedRecommended.push(skill);
      }
    }

    const allMatched = [...matchedRequired, ...matchedRecommended];

    // Transparent scoring calculation:
    // Required skills carry 25 points each (max contribution up to 75%)
    // Recommended skills carry 12 points each
    // Core curriculum category provides a foundational 10-point bonus if at least 1 skill matches
    let rawScore = 0;
    rawScore += matchedRequired.length * 28;
    rawScore += matchedRecommended.length * 14;

    if (subject.category === 'Core' && allMatched.length > 0) {
      rawScore += 10;
    }

    // Scale to max 100
    const relevanceScore = Math.min(100, Math.max(5, Math.round(rawScore)));

    // Categorization fit
    let categoryFit: SubjectRelevanceMatch['categoryFit'] = 'General Knowledge';
    if (matchedRequired.length >= 2 || relevanceScore >= 75) {
      categoryFit = 'Essential Core';
    } else if (matchedRequired.length >= 1 || relevanceScore >= 50) {
      categoryFit = 'High Impact Elective';
    } else if (matchedRecommended.length >= 1 || relevanceScore >= 25) {
      categoryFit = 'Complementary Skill';
    }

    // Transparent, explainable reason string
    let recommendedReason = '';
    if (matchedRequired.length > 0 && matchedRecommended.length > 0) {
      recommendedReason = `Directly satisfies ${matchedRequired.length} essential requirement(s) (${matchedRequired.join(
        ', '
      )}) plus ${matchedRecommended.length} recommended industry skill(s).`;
    } else if (matchedRequired.length > 0) {
      recommendedReason = `Addresses core prerequisite competencies: ${matchedRequired.join(', ')} specified for ${
        role.title
      }.`;
    } else if (matchedRecommended.length > 0) {
      recommendedReason = `Enhances candidate profile with valuable secondary tools: ${matchedRecommended.join(
        ', '
      )}.`;
    } else {
      recommendedReason = `General foundational module. Provides broader academic context without direct skill overlap for ${
        role.title
      }.`;
    }

    return {
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectTitle: subject.title,
      credits: subject.credits,
      relevanceScore,
      matchedSkills: allMatched,
      recommendedReason,
      categoryFit,
    };
  });

  // Sort descending by score, then credits
  return matches.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return b.credits - a.credits;
  });
}
