import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Zap,
  X,
  ExternalLink,
} from 'lucide-react';
import { AppTheme, ToolItem } from '../types';
import { PrimeAstraLogo } from './PrimeAstraLogo';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onOpenPremium: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  tools,
  onSelectTool,
  onOpenPremium,
}) => {
  const isDark = theme === 'luminous-dark';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tools for autocomplete preview
  const searchResults = searchQuery.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const notifications = [
    {
      id: 1,
      title: 'AI Resume Architect Added',
      desc: 'ATS score checker and bullet enhancers are now live in the suite.',
      time: 'Just now',
      unread: true,
      icon: Sparkles,
      iconColor: 'text-cyan-400 bg-cyan-950/60',
    },
    {
      id: 2,
      title: 'WebAssembly 2.0 Engine Active',
      desc: 'PDF conversion and canvas compression running with hardware acceleration.',
      time: '12m ago',
      unread: true,
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-50',
    },
    {
      id: 3,
      title: 'Browser Privacy Verified',
      desc: 'All file processing sandboxed strictly in memory. Zero cloud data leaks.',
      time: '1h ago',
      unread: false,
      icon: ShieldCheck,
      iconColor: 'text-emerald-500 bg-emerald-50',
    },
  ];

  return (
    <header
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 relative z-30"
      data-purpose="top-header"
    >
      {/* Left zone: Title & mobile logo */}
      <div className="flex items-center justify-between lg:block w-full sm:w-auto">
        <div className="flex items-center gap-2.5">
          {/* Mobile PrimeAstra Logo */}
          <div className="lg:hidden">
            <PrimeAstraLogo className="w-8 h-8" />
          </div>

          <div>
            <h2
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Prime<span className="text-cyan-400">Astra</span>
            </h2>
            <p className={`text-[11px] sm:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              All tools. One place. Unlimited possibilities.
            </p>
          </div>
        </div>

        {/* Mobile quick Pro button */}
        <button
          type="button"
          onClick={onOpenPremium}
          className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-[11px] shadow-sm"
        >
          <span>PRO</span>
        </button>
      </div>

      {/* Search Bar, Theme Toggle, Notification, Profile */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Omni-Search Bar */}
        <div className="relative w-full sm:w-64 md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search for a tool (e.g. PDF, Resume, Image)..."
            className={`w-full pl-10 pr-12 py-2.5 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none transition-all ${
              isDark
                ? 'dark-ios-glass-input text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400'
                : 'ios-glass-input text-slate-800 focus:ring-2 focus:ring-cyan-500/20 focus:border-white focus:bg-white/70'
            }`}
            id="globalSearchInput"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${
                  isDark
                    ? 'bg-slate-800/80 text-slate-400 border-slate-700'
                    : 'bg-white/80 text-slate-500 border-white/80 shadow-sm'
                }`}
              >
                ⌘K
              </kbd>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-floating border p-2 z-50 overflow-hidden ${
                isDark
                  ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-2xl'
                  : 'bg-white/85 backdrop-blur-2xl border-white/90 text-slate-800 shadow-clay'
              }`}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Suggested Tools
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      onMouseDown={() => {
                        onSelectTool(tool);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold">{tool.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-white/80 text-slate-600 border border-white'
                          }`}
                        >
                          {tool.category}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No matching tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'clay-light' : 'luminous-dark')}
          className={`p-2.5 rounded-2xl border transition shadow-sm ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:text-white backdrop-blur-md'
              : 'bg-white/60 border-white/80 text-slate-600 hover:bg-white/90 hover:text-cyan-600 backdrop-blur-md'
          }`}
          title={isDark ? 'Switch to Pastel Clay Light' : 'Switch to Luminous Obsidian Dark'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className={`relative p-2.5 rounded-2xl border transition shadow-sm ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-md'
                : 'bg-white/60 border-white/80 text-slate-500 hover:text-slate-800 hover:bg-white/90 backdrop-blur-md'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-floating border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-2xl'
                  : 'bg-white/85 backdrop-blur-2xl border-white/90 text-slate-800 shadow-clay'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold">Notifications</span>
                <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-1 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-slate-800 text-cyan-400' : n.iconColor
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold leading-tight truncate">{n.title}</p>
                          <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-9 h-9 rounded-2xl p-0.5 border shadow-sm cursor-pointer transition ${
              isDark
                ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 border-slate-700 hover:ring-2 hover:ring-cyan-400/50'
                : 'bg-gradient-to-tr from-slate-200 to-indigo-100 border-white hover:ring-2 hover:ring-cyan-400/50'
            }`}
          >
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center font-bold text-xs uppercase ${
                isDark ? 'bg-slate-900 text-cyan-300' : 'bg-white text-slate-600'
              }`}
            >
              PA
            </div>
          </div>

          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-floating border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  PA
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">PrimeAstra Desk</p>
                  <p className="text-[10px] text-slate-400 truncate">hello@primeastra.com</p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenPremium();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                    isDark
                      ? 'text-amber-300 hover:bg-slate-800'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span>Pro Plan Active</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                    PRO
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-600 transition flex items-center gap-1.5 ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>WASM Acceleration On</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};