import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface PrivacyBadgeProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'compact') {
    return (
      <span
        title="UniPath stores your grades strictly in your browser's local storage. No server, no trackers."
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 ${className}`}
      >
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        <span>100% Private & Local</span>
      </span>
    );
  }

  return (
    <div
      title="UniPath stores your grades strictly in your browser's local storage. No server, no trackers."
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/90 border border-slate-200/90 text-slate-700 shadow-xs backdrop-blur-xs ${className}`}
    >
      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
        <Lock className="w-2.5 h-2.5" />
      </div>
      <span>Stored locally in browser • 100% Private</span>
    </div>
  );
};
