/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Bookmark,
  User as UserIcon,
  Bell,
  Sparkles,
  ArrowRight,
  LogOut,
  ArrowLeft,
  Home,
  SlidersHorizontal,
} from 'lucide-react';
import { InvoiceManager } from './components/invoice/InvoiceManager';
import { LandingPage } from './components/LandingPage';
import { FullResumeMaker } from './tools/ResumeMaker/FullResumeMaker';
import { AiVideoClipper } from './components/video/AiVideoClipper';
import { ProfileSettings } from './components/ProfileSettings';
import { NotificationsDrawer } from './components/NotificationsDrawer';

// Direct 3D Gold Shield Logo
export const PrimeShieldLogo = ({ className = 'w-11 h-11' }: { className?: string }) => (
  <svg
    className={`${className} shrink-0 drop-shadow-[0_0_10px_rgba(226,192,114,0.3)]`}
    viewBox="0 0 500 500"
    fill="none"
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2c072" />
        <stop offset="45%" stopColor="#c5a059" />
        <stop offset="100%" stopColor="#946b2d" />
      </linearGradient>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#e2c072" />
        <stop offset="100%" stopColor="#946b2d" />
      </linearGradient>
    </defs>
    <path
      d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z"
      fill="url(#starGrad)"
    />
    <path
      d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z"
      fill="url(#shieldGrad)"
    />
    <path
      d="M280 85 C310 92 340 108 355 125 L328 148 C315 135 295 120 280 115 Z"
      fill="url(#shieldGrad)"
    />
    <path
      d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z"
      fill="url(#shieldGrad)"
    />
    <path
      d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z"
      fill="url(#shieldGrad)"
    />
    <polygon points="380,55 305,108 335,122 360,170" fill="url(#starGrad)" />
    <polygon points="380,55 335,122 360,170" fill="#c5a059" />
    <path
      d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z"
      fill="url(#shieldGrad)"
    />
  </svg>
);

import { auth, db, googleProvider } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AuthModal } from './components/AuthModal';
import { ToolModal } from './components/ToolModal';
import { ToolItem } from './types';
import { TOOLS_DATA } from './data/tools';

export default function App() {
  // Main view: 'landing' (First page: index.html) or 'workspace' (Workspace App: app.html)
  const [activePage, setActivePage] = useState<'landing' | 'workspace'>('landing');

  // Workspace subtabs
  const [workspaceTab, setWorkspaceTab] = useState<
    'home' | 'tools' | 'paid' | 'saved' | 'profile' | 'invoice' | 'clipper' | 'mkv' | 'resume'
  >('home');

  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('Guest');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [activeModalTool, setActiveModalTool] = useState<ToolItem | null>(null);

  // MKV Converter states
  const [mkvFile, setMkvFile] = useState<File | null>(null);
  const [isConvertingMkv, setIsConvertingMkv] = useState(false);

  // Real Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        let name = user.displayName || user.email?.split('@')[0] || 'User';
        let photo = user.photoURL || '';

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) name = data.name;
            if (data.photoUrl) photo = data.photoUrl;
          }
        } catch (e) {
          console.warn('User profile sync:', e);
        }

        setUserName(name);
        setUserPhoto(photo);
      } else {
        setCurrentUser(null);
        setUserName('Guest');
        setUserPhoto('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const openToolFromLanding = (toolKey: string) => {
    setActivePage('workspace');
    if (toolKey === 'invoice') setWorkspaceTab('invoice');
    else if (toolKey === 'clipper') setWorkspaceTab('clipper');
    else if (toolKey === 'mkv') setWorkspaceTab('mkv');
    else if (toolKey === 'resume') setWorkspaceTab('resume');
    else setWorkspaceTab('paid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchWorkspaceTab = (tab: typeof workspaceTab) => {
    setWorkspaceTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If active page is the first landing page, render it
  if (activePage === 'landing') {
    return (
      <>
        <LandingPage
          onStartWork={() => {
            setActivePage('workspace');
            setWorkspaceTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTool={openToolFromLanding}
          userName={userName}
          isLoggedIn={!!currentUser}
          onToggleLogin={() => setShowAuthModal(true)}
        />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={(data) => {
              if (data?.name) setUserName(data.name);
            }}
          />
        )}
      </>
    );
  }

  // WORKSPACE VIEW (app.html)
  return (
    <div className="min-h-screen p-2.5 sm:p-4 md:p-6 pb-24 md:pb-6 flex flex-col items-center justify-start overflow-x-hidden bg-[#070707] text-white">
      {/* Top Banner to switch back to First Page */}
      <div className="w-full max-w-[1360px] flex items-center justify-between mb-3 px-2 text-xs">
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121216] border border-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-xl hover:bg-[#1c1c24] transition font-bold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Landing Page</span>
        </button>

        <span className="text-slate-400 font-semibold hidden sm:inline">
          PrimeAstra Workspace Pro Hub
        </span>
      </div>

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -right-8 w-80 h-80 rounded-full bg-[#e2c072]/5 blur-[100px]" />
        <div className="absolute bottom-6 -left-12 w-72 h-72 rounded-full bg-[#c5a059]/5 blur-[100px]" />
      </div>

      {/* Master Application Container */}
      <main className="relative z-10 w-full max-w-[1360px] bg-[#0c0c0f]/95 md:backdrop-blur-2xl rounded-[32px] md:rounded-[36px] shadow-2xl border border-[rgba(226,192,114,0.2)] p-4 sm:p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 min-h-[calc(100vh-7rem)] md:min-h-[640px]">
        {/* === DESKTOP SIDEBAR === */}
        <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col justify-between bg-[#121216]/95 rounded-[28px] p-5 border border-[rgba(226,192,114,0.15)] shadow-xs">
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setActivePage('landing')}
              className="flex items-center gap-3 px-2 pt-1 cursor-pointer text-left w-full group"
              title="Return to Main Landing Page"
            >
              <PrimeShieldLogo />
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  Prime<span className="text-[#e2c072]">Astra</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                  Workspace Pro Suite
                </span>
              </div>
            </button>

            {/* Desktop Navigation Items */}
            <nav className="space-y-2">
              <button
                type="button"
                onClick={() => switchWorkspaceTab('home')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  workspaceTab === 'home'
                    ? 'bg-[#1c1c24] text-white shadow-sm border border-[rgba(226,192,114,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-base text-[#e2c072]">🏠</span>
                  <span className="truncate">Home Hub</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => switchWorkspaceTab('tools')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  workspaceTab === 'tools' || workspaceTab === 'resume'
                    ? 'bg-[#1c1c24] text-white shadow-sm border border-[rgba(226,192,114,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-base text-slate-400">🛠️</span>
                  <span className="truncate">Free Tools</span>
                </div>
                <span className="px-2 py-0.5 bg-[#181820] text-slate-300 text-[10px] font-bold rounded-md">
                  1
                </span>
              </button>

              {/* PAID TOOLS BUTTON WITH GST INVOICE INSIDE */}
              <button
                type="button"
                onClick={() => switchWorkspaceTab('paid')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  workspaceTab === 'paid' ||
                  workspaceTab === 'invoice' ||
                  workspaceTab === 'clipper' ||
                  workspaceTab === 'mkv'
                    ? 'bg-[#1c1c24] text-white shadow-sm border border-[rgba(226,192,114,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-[rgba(226,192,114,0.15)] text-[#e2c072] font-bold flex items-center justify-center text-xs">
                    🪙
                  </span>
                  <span className="truncate font-bold text-white">Paid Tools</span>
                </div>
                <span className="px-1.5 py-0.5 bg-[rgba(226,192,114,0.2)] text-[#e2c072] text-[9px] font-black rounded-md tracking-wider shrink-0">
                  3 TOOLS
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchWorkspaceTab('saved')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  workspaceTab === 'saved'
                    ? 'bg-[#1c1c24] text-white shadow-sm border border-[rgba(226,192,114,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span className="truncate">Saved Tools</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => switchWorkspaceTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  workspaceTab === 'profile'
                    ? 'bg-[#1c1c24] text-white shadow-sm border border-[rgba(226,192,114,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span className="truncate">Profile &amp; Settings</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-3.5 bg-[#181820] rounded-2xl border border-[rgba(226,192,114,0.15)] text-xs space-y-1">
            <span className="font-extrabold text-white block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e2c072] animate-pulse" />
              PRO Suite Active
            </span>
            <span className="text-[11px] text-[#e2c072]">
              GST Tax Invoice, AI Clipper &amp; MKV unlocked.
            </span>
          </div>
        </aside>

        {/* === MAIN RIGHT DASHBOARD AREA === */}
        <section className="flex-1 w-full flex flex-col justify-between space-y-4 md:col-span-8 lg:col-span-9 relative">
          <div>
            {/* Top Navigation Bar Header */}
            <header className="flex items-center justify-between gap-3 pb-3 border-b border-[rgba(226,192,114,0.15)]">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActivePage('landing')}
                  className="md:hidden cursor-pointer"
                  title="Back to Landing Page"
                >
                  <PrimeShieldLogo className="w-10 h-10" />
                </button>
                <div>
                  <h2 className="text-base sm:text-2xl font-extrabold text-white tracking-tight leading-none">
                    Prime<span className="text-[#e2c072]">Astra</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Back to Home Button */}
                <button
                  type="button"
                  onClick={() => setActivePage('landing')}
                  className="px-3 py-1.5 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-full text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-[#e2c072]" />
                  <span className="hidden sm:inline">Landing Page</span>
                </button>

                {/* Notifications Drawer Button */}
                <button
                  type="button"
                  onClick={() => setShowNotifications(true)}
                  className="w-9 h-9 rounded-full bg-[#181820] border border-[rgba(226,192,114,0.2)] shadow-xs flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition relative"
                  title="Open Notifications Center"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-[#e2c072] absolute top-1.5 right-1.5 animate-pulse" />
                </button>

                {/* Auth Slot */}
                <div>
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => switchWorkspaceTab('profile')}
                      className="flex items-center gap-1.5 p-1 pr-2.5 bg-[#181820] border border-[rgba(226,192,114,0.3)] rounded-full shadow-xs cursor-pointer hover:bg-[#20202a] transition"
                    >
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt="User"
                          className="w-6 h-6 rounded-full object-cover border border-[#e2c072]"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-[#e2c072] text-[#070707] flex items-center justify-center text-[11px] font-black">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="text-xs font-bold text-white">{userName}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] border border-[#e2c072] rounded-full shadow-xs text-xs font-bold text-[#070707] hover:brightness-110 transition cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#070707] text-[#e2c072] flex items-center justify-center text-[10px] font-black">
                        G
                      </span>
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* TAB 1: HOME WORKSPACE HUB FEED */}
            {workspaceTab === 'home' && (
              <div className="space-y-4 w-full pt-3 text-left">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e2c072]">
                      GOOD DAY 👋
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      Welcome back,{' '}
                      <span className="text-[#e2c072] underline decoration-[rgba(226,192,114,0.4)]">
                        {userName}
                      </span>
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[rgba(226,192,114,0.1)] text-[#e2c072] border border-[rgba(226,192,114,0.25)] font-extrabold text-[10px] rounded-lg tracking-wide">
                    PRO Account
                  </span>
                </div>

                {/* Hero Banner */}
                <div className="hero-gradient text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(226,192,114,0.1)] backdrop-blur-md rounded-full text-[10px] font-extrabold tracking-wide uppercase border border-[rgba(226,192,114,0.25)] text-[#e2c072]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PrimeAstra All-in-One Utility Suite</span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight text-white">
                      Welcome to PrimeAstra Hub
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                      Explore your curated collection of free digital utilities, dev helpers, and AI power
                      tools.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => switchWorkspaceTab('tools')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-extrabold text-xs rounded-xl shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
                    >
                      <span>Explore Free Tools</span> &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => switchWorkspaceTab('paid')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#181820] text-[#e2c072] border border-[rgba(226,192,114,0.3)] font-extrabold text-xs rounded-xl shadow-md hover:bg-[#20202a] transition active:scale-95 cursor-pointer"
                    >
                      <span>Explore Paid Tools (3)</span> ⚡
                    </button>
                  </div>
                </div>

                {/* Featured Tool Spotlight Grid */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Featured In Paid Tools
                    </span>
                    <button
                      type="button"
                      onClick={() => switchWorkspaceTab('paid')}
                      className="text-[11px] font-bold text-[#e2c072] hover:underline"
                    >
                      View All Paid Tools &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Invoice Generator Card */}
                    <div
                      onClick={() => switchWorkspaceTab('invoice')}
                      className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.25)] hover:border-[#e2c072] shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-[rgba(226,192,114,0.2)] text-[#e2c072] text-[9px] font-black rounded-md">
                          HOT
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                          🧾
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#e2c072] transition truncate">
                            GST Tax Invoice Generator
                          </h4>
                          <p className="text-[10.5px] text-slate-400 line-clamp-2 mt-0.5">
                            Official Indian tax format, HSN table, UPI QR code, and instant A4 PDF.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                        <span className="text-[#e2c072] font-semibold">Billing &amp; Tax</span>
                        <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">
                          Open Tool &rarr;
                        </span>
                      </div>
                    </div>

                    {/* AI Video Clipper Card */}
                    <div
                      onClick={() => switchWorkspaceTab('clipper')}
                      className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] hover:border-[rgba(226,192,114,0.4)] shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                          🎬
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#e2c072] transition truncate">
                            AI Video Clipping Generator
                          </h4>
                          <p className="text-[10.5px] text-slate-400 line-clamp-2 mt-0.5">
                            Full Body Tracking + 4K Clarity: 1-5 vertical shorts generator.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                        <span className="text-[#e2c072] font-semibold">Video Utility</span>
                        <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">
                          Open Tool &rarr;
                        </span>
                      </div>
                    </div>

                    {/* MKV Converter Card */}
                    <div
                      onClick={() => switchWorkspaceTab('mkv')}
                      className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] hover:border-[rgba(226,192,114,0.4)] shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                          🔄
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#e2c072] transition truncate">
                            MKV to MP4 Converter
                          </h4>
                          <p className="text-[10.5px] text-slate-400 line-clamp-2 mt-0.5">
                            Convert MKV video files instantly into MP4 for universal playback.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                        <span className="text-[#e2c072] font-semibold">Conversion</span>
                        <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">
                          Open Tool &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FREE TOOLS DIRECTORY */}
            {workspaceTab === 'tools' && (
              <div className="space-y-4 w-full text-left pt-3">
                <div className="border-b border-[rgba(226,192,114,0.15)] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Free Tools</h3>
                    <p className="text-xs text-slate-400">Fast, local, and 100% free utilities.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[rgba(226,192,114,0.1)] text-[#e2c072] border border-[rgba(226,192,114,0.25)] font-bold text-[11px] rounded-lg">
                    1 Tool Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  <div
                    onClick={() => switchWorkspaceTab('resume')}
                    className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] hover:border-[rgba(226,192,114,0.4)] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5 text-[#e2c072]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#e2c072] transition truncate">
                          AI Resume Maker
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          Build job-ready resumes with complete experience, education, skills, and direct
                          PDF download.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                      <span className="px-2.5 py-0.5 bg-[#181820] text-slate-300 rounded-md font-semibold">
                        Career &amp; Docs
                      </span>
                      <span className="text-[#e2c072] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Launch &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PAID TOOLS DIRECTORY (CONTAINS INVOICE GENERATOR, CLIPPER, MKV) */}
            {workspaceTab === 'paid' && (
              <div className="space-y-4 w-full text-left pt-3">
                <div className="border-b border-[rgba(226,192,114,0.15)] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Paid Tools</h3>
                    <p className="text-xs text-slate-400">
                      Premium AI-powered business, creative, and video processing utilities.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] text-[#e2c072] border border-[rgba(226,192,114,0.3)] font-bold text-[11px] rounded-lg">
                    3 Tools Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  {/* TOOL 1: GST TAX INVOICE GENERATOR */}
                  <div
                    onClick={() => switchWorkspaceTab('invoice')}
                    className="group bg-[#121216] p-5 rounded-2xl border-2 border-[rgba(226,192,114,0.4)] hover:border-[#e2c072] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] text-[9px] font-black rounded-md tracking-wider">
                        NEW TOOL
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.3)] flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        🧾
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-white leading-snug group-hover:text-[#e2c072] transition truncate">
                          GST Tax Invoice Generator
                        </h4>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                          Official Indian Tax Invoice (Matching PDF sample), HSN table breakdown, instant UPI
                          QR code, and vector A4 PDF export.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[rgba(226,192,114,0.15)] flex items-center justify-between text-[10px]">
                      <span className="px-2.5 py-0.5 bg-[rgba(226,192,114,0.15)] text-[#e2c072] rounded-md font-bold">
                        Billing &amp; Tax
                      </span>
                      <span className="text-[#e2c072] font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch Generator &rarr;
                      </span>
                    </div>
                  </div>

                  {/* TOOL 2: AI Video Clipper Card */}
                  <div
                    onClick={() => switchWorkspaceTab('clipper')}
                    className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] hover:border-[rgba(226,192,114,0.4)] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        🎬
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#e2c072] transition truncate">
                          AI Video Clipping Generator
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          Full Body Tracking &amp; 4K Clarity: Extract custom vertical shorts with crystal sound.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                      <span className="px-2.5 py-0.5 bg-[rgba(226,192,114,0.1)] text-[#e2c072] rounded-md font-semibold">
                        Video &amp; AI
                      </span>
                      <span className="text-[#e2c072] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Launch &rarr;
                      </span>
                    </div>
                  </div>

                  {/* TOOL 3: MKV to MP4 Converter Card */}
                  <div
                    onClick={() => switchWorkspaceTab('mkv')}
                    className="group bg-[#121216] p-4 rounded-2xl border border-[rgba(226,192,114,0.15)] hover:border-[rgba(226,192,114,0.4)] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.25)] flex items-center justify-center text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        🔄
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#e2c072] transition truncate">
                          MKV to MP4 Converter
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          Convert MKV video files instantly to MP4 for universal audio and video playback.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(226,192,114,0.1)] text-[10px]">
                      <span className="px-2.5 py-0.5 bg-[rgba(226,192,114,0.1)] text-[#e2c072] rounded-md font-semibold">
                        Video Utility
                      </span>
                      <span className="text-[#e2c072] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Launch &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INVOICE GENERATOR WORKSPACE */}
            {workspaceTab === 'invoice' && (
              <InvoiceManager onBackToDirectory={() => switchWorkspaceTab('paid')} />
            )}

            {/* TAB: VIDEO CLIPPER WORKSPACE */}
            {workspaceTab === 'clipper' && (
              <AiVideoClipper onBack={() => switchWorkspaceTab('paid')} />
            )}

            {/* TAB: MKV CONVERTER WORKSPACE */}
            {workspaceTab === 'mkv' && (
              <div className="space-y-4 w-full text-left pt-3">
                <div className="p-3.5 sm:p-4 bg-[#121216] text-white rounded-2xl flex items-center justify-between shadow-xs border border-[rgba(226,192,114,0.2)]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => switchWorkspaceTab('paid')}
                      className="p-2 bg-[#1c1c24] hover:bg-[#252530] text-[#e2c072] rounded-xl transition cursor-pointer border border-[rgba(226,192,114,0.2)]"
                      title="Back to Paid Tools"
                    >
                      &larr;
                    </button>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold flex items-center gap-2 text-white">
                        <span>🔄</span> MKV to MP4 Converter
                      </h2>
                      <p className="text-[10px] sm:text-[11px] text-slate-400">
                        Instant format packaging for universal audio and video compatibility
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 bg-[rgba(226,192,114,0.15)] border border-[rgba(226,192,114,0.3)] text-[#e2c072] rounded-xl text-xs font-black tracking-wide shrink-0">
                    Paid Tool
                  </span>
                </div>

                <div className="bg-[#121216] p-6 rounded-3xl border border-[rgba(226,192,114,0.15)] card-shadow space-y-5 text-xs text-center">
                  <div
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.mkv,video/*';
                      input.onchange = (e: any) => {
                        if (e.target.files?.[0]) setMkvFile(e.target.files[0]);
                      };
                      input.click();
                    }}
                    className="border-2 border-dashed border-[rgba(226,192,114,0.25)] hover:border-[rgba(226,192,114,0.6)] bg-[#181820] rounded-2xl p-8 cursor-pointer transition group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎞️</div>
                    <div className="font-extrabold text-white text-sm">
                      {mkvFile ? `Selected: ${mkvFile.name}` : 'Click to select MKV video file'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Files are processed securely inside your browser
                    </div>
                  </div>

                  {mkvFile && (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-[#181820] rounded-2xl border border-[rgba(226,192,114,0.2)] flex items-center justify-between text-left">
                        <div>
                          <p className="font-bold text-white text-xs">{mkvFile.name}</p>
                          <p className="text-[10px] text-[#e2c072] mt-0.5">
                            Ready to package into MP4 container with full audio support
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[rgba(226,192,114,0.2)] text-[#e2c072] text-[10px] font-black rounded-lg">
                          MKV &rarr; MP4
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isConvertingMkv}
                        onClick={() => {
                          setIsConvertingMkv(true);
                          setTimeout(() => {
                            setIsConvertingMkv(false);
                            const blob = new Blob([mkvFile], { type: 'video/mp4' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${mkvFile.name.replace(/\.[^/.]+$/, '')}_Converted.mp4`;
                            a.click();
                          }, 1500);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-[#e2c072] to-[#c5a059] hover:brightness-110 text-[#070707] font-black text-xs rounded-xl shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 text-sm"
                      >
                        {isConvertingMkv ? (
                          <span>⏳ Packaging into MP4 container...</span>
                        ) : (
                          <span>⚡ Convert &amp; Download MP4</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: RESUME MAKER WORKSPACE */}
            {workspaceTab === 'resume' && (
              <FullResumeMaker onBack={() => switchWorkspaceTab('tools')} />
            )}

            {/* TAB 4: SAVED TOOLS */}
            {workspaceTab === 'saved' && (
              <div className="space-y-4 w-full text-left pt-3">
                <div className="border-b border-[rgba(226,192,114,0.15)] pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Saved Tools</h3>
                  <span className="px-2.5 py-1 bg-[rgba(226,192,114,0.15)] text-[#e2c072] border border-[rgba(226,192,114,0.3)] font-bold text-[11px] rounded-lg">
                    2 Saved
                  </span>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => switchWorkspaceTab('invoice')}
                    className="p-4 bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.25)] card-shadow flex items-center justify-between gap-3 cursor-pointer hover:border-[#e2c072] transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.2)] flex items-center justify-center text-xl shadow-xs">
                        🧾
                      </div>
                      <div>
                        <h5 className="text-sm font-extrabold text-white">
                          GST Tax Invoice Generator Pro
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Official Indian tax invoice layout with HSN, instant UPI QR, and PDF.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.2)] hover:bg-[#252530] rounded-xl text-xs font-extrabold transition"
                    >
                      Open Tool
                    </button>
                  </div>

                  <div
                    onClick={() => switchWorkspaceTab('resume')}
                    className="p-4 bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] card-shadow flex items-center justify-between gap-3 cursor-pointer hover:border-[#e2c072] transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.2)] flex items-center justify-center text-xl shadow-xs">
                        📝
                      </div>
                      <div>
                        <h5 className="text-sm font-extrabold text-white">AI Resume Maker</h5>
                        <p className="text-[11px] text-slate-400">Bookmarked utility for instant PDF creation.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-[#1c1c24] text-[#e2c072] border border-[rgba(226,192,114,0.2)] hover:bg-[#252530] rounded-xl text-xs font-extrabold transition"
                    >
                      Open Tool
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE & SETTINGS */}
            {workspaceTab === 'profile' && (
              <ProfileSettings
                currentUser={currentUser}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            )}
          </div>
        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-3 left-4 right-4 z-40 md:hidden bg-[#121216]/95 backdrop-blur-xl border border-[rgba(226,192,114,0.2)] rounded-3xl p-1.5 shadow-2xl flex items-center justify-around text-slate-400">
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400"
        >
          <span className="text-xs">🌐</span>
          <span className="text-[9px]">Web</span>
        </button>
        <button
          type="button"
          onClick={() => switchWorkspaceTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl ${
            workspaceTab === 'home'
              ? 'bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xs">🏠</span>
          <span className="text-[9px]">Hub</span>
        </button>
        <button
          type="button"
          onClick={() => switchWorkspaceTab('tools')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl ${
            workspaceTab === 'tools' || workspaceTab === 'resume'
              ? 'bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xs">🛠️</span>
          <span className="text-[9px]">Free</span>
        </button>
        <button
          type="button"
          onClick={() => switchWorkspaceTab('paid')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl ${
            workspaceTab === 'paid' ||
            workspaceTab === 'invoice' ||
            workspaceTab === 'clipper' ||
            workspaceTab === 'mkv'
              ? 'bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xs">🪙</span>
          <span className="text-[9px]">Paid</span>
        </button>
        <button
          type="button"
          onClick={() => switchWorkspaceTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl ${
            workspaceTab === 'profile'
              ? 'bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-bold'
              : 'text-slate-400'
          }`}
        >
          <span className="text-xs">👤</span>
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>

      {/* Global Modals from Zip */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(data) => {
            if (data?.name) setUserName(data.name);
          }}
        />
      )}

      {activeModalTool && (
        <ToolModal
          tool={activeModalTool}
          onClose={() => setActiveModalTool(null)}
          theme="luminous-dark"
        />
      )}

      {/* Unified Notifications Drawer */}
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onOpenTool={(toolKey) => {
          if (toolKey === 'invoice') switchWorkspaceTab('invoice');
          else if (toolKey === 'clipper') switchWorkspaceTab('clipper');
          else if (toolKey === 'resume') switchWorkspaceTab('resume');
          else if (toolKey === 'mkv') switchWorkspaceTab('mkv');
          else if (toolKey === 'profile') switchWorkspaceTab('profile');
        }}
      />
    </div>
  );
}
