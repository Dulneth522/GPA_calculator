import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Plus,
  RotateCcw,
  Sliders,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Calculator,
  Target,
  Briefcase,
  History,
  Settings,
  Lock,
} from 'lucide-react';
import { PrivacyBadge } from './PrivacyBadge';
import { useAcademicData } from '../../hooks/useAcademicData';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenQuickAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenQuickAddModal,
}) => {
  const location = useLocation();
  const { preferences, resetDemoData, overallGpa, activeScale } = useAcademicData();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'GPA Calculator', path: '/calculator', icon: Calculator },
    { label: 'Target Planner', path: '/target-planner', icon: Target },
    { label: 'Career Pathway', path: '/career-planner', icon: Briefcase },
    { label: 'Academic History', path: '/history', icon: History },
    { label: 'Settings & Rules', path: '/settings', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Left: Brand & Mobile/Desktop Toggles */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-label="Toggle sidebar navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Drawer Trigger (Minimum 44x44px touch target) */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 active:bg-slate-200"
                aria-label="Open mobile navigation drawer"
                aria-expanded={mobileDrawerOpen}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo & Name */}
              <Link to="/dashboard" className="flex items-center gap-2 group min-w-0 shrink">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
                    UniPath
                    <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Academic
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal leading-none hidden md:inline truncate">
                    Precision Pathway Intelligence
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Privacy & Scale Status (Hidden on smaller screens to save room) */}
            <div className="hidden xl:flex items-center gap-3">
              <PrivacyBadge />
              <Link
                to="/settings"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                title="Click to view grading scale settings"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Scale: {activeScale.name.split(' ')[0]}</span>
              </Link>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick CGPA Badge */}
              <div
                title={`Cumulative GPA on ${activeScale.name}`}
                className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 sm:px-2.5 py-1 text-xs shrink-0"
              >
                <span className="text-slate-500 font-medium text-[11px] sm:text-xs">CGPA:</span>
                <span className="font-bold text-indigo-600 tnum text-xs sm:text-sm">
                  {overallGpa.toFixed(2)}
                </span>
              </div>

              {/* Quick Add Course Button (Desktop/Tablet) */}
              {onOpenQuickAddModal && (
                <button
                  onClick={onOpenQuickAddModal}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-lg shadow-xs transition-colors shrink-0 min-h-[38px]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Add Course</span>
                  <span className="md:hidden">Add</span>
                </button>
              )}

              {/* Demo Reset Helper if demo data is active */}
              {preferences.showDemoData && (
                <button
                  onClick={resetDemoData}
                  title="Reset coursework to sample demonstration data"
                  className="hidden 2xl:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              )}

              {/* Public Overview Link */}
              <Link
                to="/landing"
                className="text-xs text-slate-600 hover:text-indigo-600 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1 shrink-0 min-h-[36px]"
                title="View public overview page"
              >
                <span className="hidden xs:inline">Overview</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-y-0 left-0 w-[min(320px,85vw)] bg-white shadow-2xl flex flex-col z-50 border-r border-slate-200 animate-in slide-in-from-left duration-250"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900">UniPath</span>
                  <span className="block text-[10px] text-slate-400">Academic Platform</span>
                </div>
              </div>

              {/* Close Button with 44x44px touch target */}
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy & Scale Status Banner inside Drawer */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cumulative GPA:</span>
                <span className="font-bold text-indigo-700 tnum text-sm">
                  {overallGpa.toFixed(2)} / {activeScale.maxGpa.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>100% Client-Side Private Storage</span>
              </div>
            </div>

            {/* Navigation Links with generous 44px min touch targets */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 space-y-2.5 bg-white">
              {onOpenQuickAddModal && (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenQuickAddModal();
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course Record</span>
                </button>
              )}

              {preferences.showDemoData && (
                <button
                  onClick={() => {
                    resetDemoData();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full min-h-[40px] flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Coursework</span>
                </button>
              )}

              <Link
                to="/landing"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 py-1.5"
              >
                <span>Platform Landing Overview</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
