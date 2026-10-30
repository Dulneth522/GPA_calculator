import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Target,
  Briefcase,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAcademicData } from '../../hooks/useAcademicData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { overallGpa, totalCredits, preferences, honorsStanding } = useAcademicData();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'GPA Calculator', path: '/calculator', icon: Calculator },
    { name: 'Target Planner', path: '/target-planner', icon: Target },
    { name: 'Career Pathway', path: '/career-planner', icon: Briefcase },
    { name: 'Academic History', path: '/history', icon: History },
    { name: 'Settings & Rules', path: '/settings', icon: Settings },
  ];

  // Calculate target progress percentage
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((overallGpa / (preferences.targetCgpa || 4.0)) * 100))
  );

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-20 shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${!isOpen ? 'justify-center px-2' : ''}`
              }
              title={!isOpen ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Target Progress Box (Only when expanded) */}
      {isOpen ? (
        <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              Target Goal
            </span>
            <span className="font-bold text-indigo-700 tnum">
              {preferences.targetCgpa.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Current: <strong className="text-slate-800 tnum">{overallGpa.toFixed(2)}</strong></span>
            <span>{totalCredits} cr</span>
          </div>
        </div>
      ) : (
        <div className="p-2 flex justify-center mb-3" title={`Current CGPA: ${overallGpa.toFixed(2)} / Target: ${preferences.targetCgpa.toFixed(2)}`}>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-indigo-600 leading-none tnum">
              {overallGpa.toFixed(1)}
            </span>
            <span className="text-[9px] text-slate-400">CGPA</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between">
        {isOpen && (
          <span className="text-xs text-slate-400 font-medium px-2">
            UniPath v1.0
          </span>
        )}
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
            !isOpen ? 'mx-auto' : ''
          }`}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
