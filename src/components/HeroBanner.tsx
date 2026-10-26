import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { AppTheme, UserRecord } from '../types';
import { PrimeAstraLogo } from './PrimeAstraLogo';

interface HeroBannerProps {
  onExplore: () => void;
  currentUser: UserRecord;
  theme: AppTheme;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore, theme }) => {
  const isDark = theme === 'luminous-dark';

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] p-6 lg:p-8 border transition-all duration-300 h-full w-full flex items-center justify-between box-border ${
        isDark
          ? 'bg-gradient-to-r from-slate-900/80 via-cyan-950/40 to-blue-950/30 border-cyan-500/20 shadow-glow-cyan backdrop-blur-2xl'
          : 'bg-gradient-to-r from-cyan-100/60 via-blue-50/50 to-indigo-50/50 border-white/80 shadow-clay backdrop-blur-2xl'
      }`}
      data-purpose="hero-banner"
    >
      {/* Left Details */}
      <div className="relative z-10 max-w-lg space-y-3.5">
        {/* Tag Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full shadow-sm border backdrop-blur-xl ${
            isDark
              ? 'bg-slate-900/80 border-cyan-500/40 text-cyan-300'
              : 'bg-white/80 border-cyan-200 text-cyan-900 shadow-sm'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current text-cyan-400" />
          <span className="text-[11px] font-bold tracking-wide">PrimeAstra Smart Toolkit</span>
        </div>

        {/* Hero Heading */}
        <h3
          className={`text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.1] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          All Tools. Zero Friction.
        </h3>

        {/* Subtitle */}
        <p
          className={`text-xs sm:text-sm font-medium leading-relaxed max-w-md ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Fast, client-side, and privacy-first digital tools for creators and engineers.
          No servers, no tracking, instant speed.
        </p>

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onExplore}
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 group border cursor-pointer ${
              isDark
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-glow-cyan border-cyan-300 backdrop-blur-md'
                : 'bg-white/90 hover:bg-white text-slate-900 hover:shadow-md border-white/90 shadow-clay-sm'
            }`}
          >
            <span>Explore All 120+ Tools</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right 3D Centerpiece with Glowing PrimeAstra Shield Logo */}
      <div
        aria-hidden="true"
        className="relative w-64 h-64 lg:w-72 lg:h-72 flex items-center justify-center select-none shrink-0 pr-2 lg:pr-6"
      >
        {/* Ambient Orbit Rings */}
        <div className="absolute w-48 h-48 lg:w-56 lg:h-56 rounded-full border border-cyan-400/25 animate-pulse-subtle" />
        <div className="absolute w-60 h-60 lg:w-68 lg:h-68 rounded-full border border-blue-500/15 animate-float" />

        {/* Centerpiece Vector Logo */}
        <div className="relative z-10 animate-float-delayed">
          <PrimeAstraLogo className="w-36 h-36 lg:w-44 lg:h-44 drop-shadow-[0_0_36px_rgba(0,242,254,0.8)]" />
        </div>
      </div>
    </div>
  );
};