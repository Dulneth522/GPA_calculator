import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { QuickAddSubjectModal } from '../components/common/QuickAddSubjectModal';
import { useAcademicData } from '../hooks/useAcademicData';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { preferences, updatePreferences, toast } = useAcademicData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-[#0F172A] w-full overflow-x-hidden">
      {/* Demo Data Notice Banner */}
      {preferences.showDemoData && (
        <div className="bg-indigo-900 text-white text-xs px-3 sm:px-4 py-2 border-b border-indigo-800">
          <div className="max-w-[1440px] mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start sm:items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] bg-indigo-500/30 border border-indigo-400/40 px-1.5 py-0.5 rounded-xs shrink-0 mt-0.5 sm:mt-0">
                Sample
              </span>
              <span className="text-indigo-100 text-xs leading-tight">
                Previewing demo university coursework. Add or edit records to customize.
              </span>
            </div>

            <div className="flex items-center justify-end shrink-0">
              <button
                onClick={() => updatePreferences({ showDemoData: false })}
                className="text-xs text-indigo-200 hover:text-white underline underline-offset-2 py-0.5 px-1"
                aria-label="Dismiss demo data notice"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar with Mobile Drawer */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenQuickAddModal={() => setIsQuickAddOpen(true)}
      />

      {/* Body Area with Desktop Sidebar and Responsive Main Content */}
      <div className="flex-1 flex overflow-hidden w-full min-w-0">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
          <div className="max-w-[1440px] mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Quick Add Subject Dialog */}
      <QuickAddSubjectModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Global Responsive Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-sm sm:max-w-md"
        >
          {toast.type === 'success' && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="flex-1">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
