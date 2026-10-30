import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useAcademicData } from '../hooks/useAcademicData';
import { CAREER_ROLES } from '../data/careerPathways';
import { rankSubjectsForCareer } from '../utils/careerMatcher';
import { SubjectRelevanceCard } from '../components/career/SubjectRelevanceCard';
import { AddElectiveModal } from '../components/career/AddElectiveModal';
import { Subject } from '../types/academic';

export const CareerPlannerPage: React.FC = () => {
  const {
    subjects,
    availableElectives,
    addCustomElective,
    addSubject,
    semesters,
    preferences,
    updatePreferences,
  } = useAcademicData();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    preferences.targetRole || CAREER_ROLES[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'core'>('all');
  const [isAddElectiveOpen, setIsAddElectiveOpen] = useState(false);

  const activeRole = useMemo(() => {
    return CAREER_ROLES.find((r) => r.id === selectedRoleId) || CAREER_ROLES[0];
  }, [selectedRoleId]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    updatePreferences({ targetRole: roleId });
  };

  // Combine enrolled coursework with available electives catalog
  const candidateSubjects: Subject[] = useMemo(() => {
    const enrolledIds = new Set(subjects.map((s) => s.code));
    const combined = [...subjects];
    for (const elective of availableElectives) {
      if (!enrolledIds.has(elective.code)) {
        combined.push(elective);
      }
    }
    return combined;
  }, [subjects, availableElectives]);

  // Run transparent, explainable ranking engine
  const rankedSubjects = useMemo(() => {
    const ranked = rankSubjectsForCareer(activeRole, candidateSubjects);

    return ranked.filter((m) => {
      const matchesSearch =
        m.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'high') return m.relevanceScore >= 50;
      if (filterType === 'core') return m.categoryFit === 'Essential Core';
      return true;
    });
  }, [activeRole, candidateSubjects, searchQuery, filterType]);

  // Set of enrolled codes
  const enrolledCodeSet = useMemo(() => {
    return new Set(subjects.map((s) => s.code));
  }, [subjects]);

  // Quick enroll elective to latest semester
  const handleAddToSemester = (code: string, title: string, credits: number) => {
    const targetSem = semesters[semesters.length - 1] || semesters[0];
    if (!targetSem) return;

    // Find original subject to grab skills
    const found = candidateSubjects.find((s) => s.code === code);

    addSubject({
      code,
      title,
      credits,
      grade: 'A',
      semesterId: targetSem.id,
      category: found?.category || 'Elective',
      skills: found?.skills,
      includeInGpa: true,
    });
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
            <span>Career & Subject Pathway Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Align elective choices with real industry competencies using transparent, explainable skill matching rules.
          </p>
        </div>

        <button
          onClick={() => setIsAddElectiveOpen(true)}
          className="min-h-[42px] inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Custom Elective</span>
        </button>
      </div>

      {/* Target Job Role Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Your Target Graduate Role:
          </span>
          <span className="text-xs text-indigo-600 font-semibold">
            {CAREER_ROLES.length} predefined career taxonomies
          </span>
        </div>

        {/* Roles Segmented Pills Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {CAREER_ROLES.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`p-3 text-left rounded-xl border transition-all min-h-[58px] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {role.category}
                </div>
                <div className="text-xs font-bold mt-1 line-clamp-2 leading-snug">
                  {role.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Role Detail Hero Box */}
        <div className="mt-4 sm:mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 w-full min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{activeRole.title}</h3>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 shrink-0">
                  {activeRole.growthOutlook}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeRole.description}
              </p>
            </div>
          </div>

          {/* Role Skills Grid */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1.5">
                Mandatory Core Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeRole.requiredSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Recommended Secondary Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeRole.recommendedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[42px] pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex-1 sm:flex-initial text-center ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Courses ({candidateSubjects.length})
          </button>
          <button
            onClick={() => setFilterType('high')}
            className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex-1 sm:flex-initial text-center ${
              filterType === 'high'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            High Match (&gt;50%)
          </button>
          <button
            onClick={() => setFilterType('core')}
            className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex-1 sm:flex-initial text-center ${
              filterType === 'core'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Core Prereq
          </button>
        </div>
      </div>

      {/* Explainability Methodology Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 w-full min-w-0">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Explainable Matching:</strong> Relevance is calculated by comparing course skill tags against {activeRole.title}'s verified industry skills. No opaque AI or fake confidence numbers.
        </p>
      </div>

      {/* Ranked Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
        {rankedSubjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No subjects matched your filter criteria. Try clearing your search query or adding a new elective.
          </div>
        ) : (
          rankedSubjects.map((match) => (
            <SubjectRelevanceCard
              key={match.subjectId}
              match={match}
              isAlreadyRegistered={enrolledCodeSet.has(match.subjectCode)}
              onAddToSemester={handleAddToSemester}
            />
          ))
        )}
      </div>

      {/* Add Custom Elective Modal */}
      <AddElectiveModal
        isOpen={isAddElectiveOpen}
        onClose={() => setIsAddElectiveOpen(false)}
        onAdd={(course) =>
          addCustomElective({
            ...course,
            grade: 'A',
            semesterId: 'unassigned',
            includeInGpa: true,
          })
        }
      />
    </div>
  );
};
