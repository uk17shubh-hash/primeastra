import React from 'react';
import {
  Home,
  LayoutGrid,
  FolderKanban,
  Heart,
  Settings,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { ActiveNav, AppTheme } from '../types';
import { PrimeAstraLogo } from './PrimeAstraLogo';

interface NavigationProps {
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  favoritesCount: number;
  onOpenPremium: () => void;
  theme: AppTheme;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeNav,
  setActiveNav,
  favoritesCount,
  onOpenPremium,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';

  const navItems = [
    {
      id: 'home' as ActiveNav,
      label: 'Home',
      icon: Home,
      badge: null,
      dot: false,
    },
    {
      id: 'all-tools' as ActiveNav,
      label: 'All Tools',
      icon: LayoutGrid,
      badge: '120+',
      dot: false,
    },
    {
      id: 'categories' as ActiveNav,
      label: 'Categories',
      icon: FolderKanban,
      badge: null,
      dot: false,
    },
    {
      id: 'favorites' as ActiveNav,
      label: 'Favorites',
      icon: Heart,
      badge: favoritesCount > 0 ? `${favoritesCount}` : null,
      dot: favoritesCount > 0,
    },
    {
      id: 'settings' as ActiveNav,
      label: 'Settings',
      icon: Settings,
      badge: null,
      dot: false,
    },
  ];

  return (
    <>
      {/* PC / Desktop Left Navigation Sidebar */}
      <aside
        className={`hidden lg:flex lg:col-span-3 xl:col-span-3 flex-col justify-between rounded-[28px] p-5 border transition-all duration-300 ${
          isDark
            ? 'dark-ios-glass-sidebar text-slate-200'
            : 'ios-glass-sidebar text-slate-800'
        }`}
        data-purpose="sidebar"
      >
        {/* Top Section: Brand & Nav Links */}
        <div className="space-y-7">
          {/* Brand Header with PrimeAstra Shield-Star Logo */}
          <div
            onClick={() => setActiveNav('home')}
            className="flex items-center gap-3.5 px-2 pt-1 cursor-pointer group"
            data-purpose="brand-logo"
          >
            {/* PrimeAstra 3D Vector Logo */}
            <PrimeAstraLogo className="w-11 h-11" />
            <div>
              <h1
                className={`text-xl font-extrabold tracking-tight leading-none flex items-center gap-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Prime
                <span className="text-cyan-400 font-bold">
                  Astra
                </span>
              </h1>
              <span
                className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 block ${
                  isDark ? 'text-cyan-400/80' : 'text-slate-400'
                }`}
              >
                AI &amp; WASM SUITE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 text-left ${
                    isActive
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-300 shadow-glow-cyan border border-cyan-400/40 backdrop-blur-md'
                        : 'bg-white/90 text-cyan-700 shadow-clay-sm border border-white backdrop-blur-md'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5 backdrop-blur-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                  data-nav={item.id}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="flex-1 truncate">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                          : 'bg-white/80 text-slate-700 border border-white/90 shadow-sm'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.dot && !item.badge && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: Go Premium Upgrade */}
        <div className="mt-8 pt-4">
          <div
            onClick={onOpenPremium}
            className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDark
                ? 'bg-gradient-to-br from-amber-500/20 via-slate-800/60 to-cyan-500/15 border-amber-500/40 hover:border-amber-400/70 shadow-lg backdrop-blur-md'
                : 'bg-gradient-to-br from-amber-400/20 via-white/60 to-cyan-400/15 border-white/80 hover:border-white shadow-clay-sm backdrop-blur-xl'
            }`}
            data-purpose="premium-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center shadow-sm shrink-0 font-bold group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5 text-amber-950" />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-xs font-bold leading-snug truncate ${
                    isDark ? 'text-amber-200' : 'text-slate-900'
                  }`}
                >
                  PrimeAstra Pro
                </h4>
                <p
                  className={`text-[11px] truncate ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Unlock unlimited &amp; AI tools
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </aside>

      {/* Phone / Mobile Bottom Glass Tab Bar */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 border-t ${
          isDark
            ? 'bg-[#0E1322]/85 backdrop-blur-2xl border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]'
            : 'bg-white/80 backdrop-blur-2xl border-white/80 shadow-[0_-10px_30px_rgba(148,163,184,0.18)]'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
        data-purpose="mobile-bottom-nav"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className="relative flex flex-col items-center justify-center min-h-[44px] py-1 transition-all group"
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-400 shadow-glow-cyan'
                        : 'bg-cyan-600/15 text-cyan-700 shadow-sm'
                      : isDark
                      ? 'text-slate-400 group-hover:text-slate-200'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  {item.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                        isDark
                          ? 'bg-cyan-500 text-slate-950 border-slate-900'
                          : 'bg-cyan-600 text-white border-white shadow-sm'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold tracking-tight mt-0.5 transition-colors ${
                    isActive
                      ? 'text-cyan-400 font-bold'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};