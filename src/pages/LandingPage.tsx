import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calculator,
  Target,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { PrivacyBadge } from '../components/common/PrivacyBadge';

export const LandingPage: React.FC = () => {
  // Interactive mini calculator on hero
  const [quickCourses] = useState([
    { name: 'Algorithms', credits: 4, grade: 'A', points: 4.0 },
    { name: 'Database Systems', credits: 3, grade: 'A-', points: 3.7 },
    { name: 'Operating Systems', credits: 3, grade: 'B+', points: 3.3 },
  ]);

  const quickTotalCredits = quickCourses.reduce((sum, c) => sum + c.credits, 0);
  const quickTotalPoints = quickCourses.reduce((sum, c) => sum + c.credits * c.points, 0);
  const quickGpa =
    quickTotalCredits > 0 ? (quickTotalPoints / quickTotalCredits).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] w-full overflow-x-hidden">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 w-full">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight truncate">
                UniPath
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded-xs shrink-0">
                Academic Precision
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:block">
              <PrivacyBadge />
            </div>
            <Link
              to="/dashboard"
              className="min-h-[40px] inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-8 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full min-w-0">
          {/* Left Column (7 cols): Pitch & Benefits */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 w-full min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold max-w-full">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Next-Generation Academic Pathway Intelligence</span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] break-words">
              Calculate with <span className="text-indigo-600">Academic Precision</span>. Plan Pathways with Strategic Clarity.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl">
              UniPath is the definitive academic planning tool for university students. Calculate credit-weighted semester and cumulative GPAs, mathematically reverse-engineer target honors standing, and evaluate course electives against real job market competencies without black-box guesswork.
            </p>

            <div className="pt-1 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-md transition-all hover:shadow-lg active:translate-y-0 text-center"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/calculator"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base px-5 py-3 rounded-xl border border-slate-200 shadow-2xs transition-colors text-center"
              >
                <Calculator className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Try GPA Calculator</span>
              </Link>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-3 grid grid-cols-1 xs:grid-cols-3 gap-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exact Credit Weighting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Skill Matching</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Mini Sandbox */}
          <div className="lg:col-span-5 w-full min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-4 sm:p-6 relative overflow-hidden w-full min-w-0">
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Live Calculation Preview
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Instant Credit-Weighted GPA
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Current Result</span>
                  <span className="display-gpa text-indigo-600 tnum leading-none">
                    {quickGpa}
                  </span>
                </div>
              </div>

              {/* Sample Courses Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden mb-4 bg-slate-50/50">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-2 px-3 text-left">Subject</th>
                      <th className="py-2 px-2 text-center">Credits</th>
                      <th className="py-2 px-2 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quickCourses.map((c, i) => (
                      <tr key={i} className="hover:bg-white">
                        <td className="py-2 px-3 font-medium text-slate-800">{c.name}</td>
                        <td className="py-2 px-2 text-center tnum text-slate-600">{c.credits} cr</td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500 leading-normal mb-4">
                Notice how credit weightings properly scale points: a 4-credit course holds double the impact of a 2-credit course.
              </p>

              <Link
                to="/calculator"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm transition-colors text-center"
              >
                <span>Open Full 8-Semester Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200 w-full min-w-0">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Complete Academic Suite
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
              Engineered for Student Success
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed from the ground up according to rigorous academic computing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                  Precision GPA Engine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Add, edit, and organize courses across semesters. Configure customizable 4.0 or 4.25 scales with accurate credit-weighted point aggregation.
                </p>
              </div>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-4 py-1"
              >
                <span>Calculate GPA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                  Target GPA Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Know the exact average GPA you need in remaining credits to achieve First Class or Second Upper honours before sitting exams.
                </p>
              </div>
              <Link
                to="/target-planner"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-4 py-1"
              >
                <span>Plan Target</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                  Career-Skill Alignment
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rank university electives against real job market requirements. Transparent matching with zero fake AI predictions or black-box scores.
                </p>
              </div>
              <Link
                to="/career-planner"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-4 py-1"
              >
                <span>Explore Careers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                  100% Local Privacy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your grades are personal. All calculations occur inside your browser. No cloud databases, no account credentials, and zero tracking.
                </p>
              </div>
              <Link
                to="/settings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-4 py-1"
              >
                <span>View Privacy Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Methodology & Privacy Notice */}
      <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full min-w-0">
        <div className="bg-slate-900 rounded-2xl text-white p-6 sm:p-10 lg:p-12 shadow-xl w-full min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full min-w-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Data Integrity & Ethics
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-1 mb-3 sm:mb-4">
                No Artificial Hype. Just Proven Mathematics.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Unlike tools that fabricate confidence scores or claim to predict your career using opaque machine learning algorithms, UniPath uses mathematically proven credit formulas and transparent, explainable skill taxonomy matching. You have full visibility into every calculation.
              </p>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Credit-Weighted Formula: GPA = ∑(Credits × GradePoints) ÷ ∑(Credits)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Deterministic Skill Overlap based on industry standard tech frameworks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>One-click CSV transcript and JSON backup export</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-slate-800/80 rounded-xl border border-slate-700/80 w-full min-w-0">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Browser Local Storage Privacy Notice</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                All data is stored directly in your browser's <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">localStorage</code>. Data is not synchronized between devices and will be wiped if you clear your browser cache.
              </p>
              <Link
                to="/dashboard"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors text-center"
              >
                <span>Enter UniPath Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 sm:py-8 text-xs text-slate-500 w-full">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-800">UniPath</span>
            <span>— Academic & Career Pathway Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/calculator" className="hover:text-indigo-600 py-1">GPA Calculator</Link>
            <Link to="/target-planner" className="hover:text-indigo-600 py-1">Target Planner</Link>
            <Link to="/career-planner" className="hover:text-indigo-600 py-1">Career Pathway</Link>
            <Link to="/settings" className="hover:text-indigo-600 py-1">Grading Rules</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
