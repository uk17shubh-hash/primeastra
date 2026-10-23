import React from 'react';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { AppTheme } from '../types';

interface MetricsBarProps {
  theme: AppTheme;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ theme }) => {
  const isDark = theme === 'luminous-dark';

  return (
    <footer
      className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2"
      data-purpose="metrics-summary"
    >
      {/* Highlight 1: 120+ Tools */}
      <div
        className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 ${
          isDark
            ? 'dark-ios-glass-card text-white'
            : 'ios-glass-card text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'bg-purple-50 text-violet-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-base font-extrabold leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              120+
            </div>
            <div
              className={`text-[11px] font-medium mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Tools Available
            </div>
          </div>
        </div>
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          }`}
        >
          <div className="bg-violet-500 h-full rounded-full w-[85%] transition-all duration-500" />
        </div>
      </div>

      {/* Highlight 2: 100% Free to Use */}
      <div
        className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 ${
          isDark
            ? 'dark-ios-glass-card text-white'
            : 'ios-glass-card text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-blue-950/60 text-cyan-400 border border-blue-800/40'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-base font-extrabold leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              100%
            </div>
            <div
              className={`text-[11px] font-medium mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Free to Use
            </div>
          </div>
        </div>
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          }`}
        >
          <div className="bg-blue-500 h-full rounded-full w-[100%] transition-all duration-500" />
        </div>
      </div>

      {/* Highlight 3: Secure & Private */}
      <div
        className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 ${
          isDark
            ? 'dark-ios-glass-card text-white'
            : 'ios-glass-card text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-base font-extrabold leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Secure &amp; Private
            </div>
            <div
              className={`text-[11px] font-medium mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Your data never leaves browser
            </div>
          </div>
        </div>
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          }`}
        >
          <div className="bg-emerald-500 h-full rounded-full w-[95%] transition-all duration-500" />
        </div>
      </div>
    </footer>
  );
};
