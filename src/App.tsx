import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  Settings,
  Lock,
  Camera,
  X,
  User as UserIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Firebase imports
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// === PRIMEASTRA 3D SHIELD LOGO ===
const PrimeAstraLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg
    className={`${className} shrink-0 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-transform duration-300 hover:scale-105`}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="paGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="paStarLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z" fill="url(#paStarLight)" />
    <path d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z" fill="url(#paGradLight)" />
    <path d="M280 85 C310 92 340 108 355 125 L328 148 C315 135 295 120 280 115 Z" fill="url(#paGradLight)" />
    <path d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z" fill="url(#paGradLight)" />
    <path d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z" fill="url(#paGradLight)" />
    <polygon points="380,55 305,108 335,122 360,170" fill="url(#paStarLight)" />
    <polygon points="380,55 335,122 360,170" fill="#6d28d9" />
    <path d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z" fill="url(#paGradLight)" />
  </svg>
);

export default function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase Auth & User Data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ name?: string; email?: string; photoUrl?: string } | null>(null);

  // Modals & Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auth Form State (Login / Register)
  const [isRegistering, setIsRegistering] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Settings Form State (Password change & Photo upload)
  const [newPassword, setNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside click detector to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as { name?: string; email?: string; photoUrl?: string });
          } else {
            setUserData({ email: user.email || '' });
          }
        } catch {
          setUserData({ email: user.email || '' });
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ⌘K Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('globalSearchInput')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Login / Register Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isRegistering) {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const newProfile = {
          uid: cred.user.uid,
          name: authName.trim() || 'User',
          email: authEmail.trim(),
          createdAt: new Date().toISOString(),
          photoUrl: '',
        };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        setUserData(newProfile);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setShowAuthModal(false);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setAuthError(errorObj.message || 'Authentication error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Profile Photo Change (Base64 file format)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), { photoUrl: base64String });
          setUserData((prev) => ({ ...prev, photoUrl: base64String }));
          setSettingsMsg('Profile photo updated successfully!');
        } catch (err) {
          setSettingsError('Failed to update photo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSettingsError('');
    setSettingsMsg('');
    setSettingsLoading(true);

    try {
      await updatePassword(currentUser, newPassword);
      setSettingsMsg('Password updated successfully!');
      setNewPassword('');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setSettingsError(errorObj.message || 'Error updating password. Re-login might be required.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const getInitials = () => {
    if (userData?.name) return userData.name.slice(0, 2).toUpperCase();
    if (currentUser?.email) return currentUser.email.slice(0, 2).toUpperCase();
    return 'SH';
  };

  return (
    <div className="bg-[#ECEEF3] text-slate-800 antialiased min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white flex items-center justify-center p-3 md:p-6 lg:p-8">
      {/* Ambient Background 3D Elements */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -right-8 w-72 h-72 rounded-full clay-sphere opacity-45 blur-[1px] animate-float" />
        <div className="absolute top-28 right-24 w-44 h-44 rounded-full glass-disc opacity-60 animate-float-delayed" />
        <div className="absolute bottom-6 -left-12 w-64 h-64 rounded-full clay-sphere opacity-50 blur-[1.5px] animate-float" />
        <div className="absolute -bottom-16 right-16 w-60 h-60 rounded-full border-[28px] border-purple-200/50 clay-torus opacity-40 animate-float-delayed" />
      </div>

      {/* Master Application Shell Container */}
      <main
        className="relative z-10 w-full max-w-[1360px] bg-white/75 backdrop-blur-2xl rounded-[36px] shadow-floating border border-white/95 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px] max-h-[720px]"
        data-purpose="app-root"
      >
        {/* === Left Navigation Sidebar === */}
        <aside
          className="lg:col-span-3 xl:col-span-3 flex flex-col justify-between bg-[#F8FAFC]/90 rounded-[28px] p-5 border border-slate-200/70 shadow-sm"
          data-purpose="sidebar"
        >
          <div className="space-y-7">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 pt-1 cursor-pointer" onClick={() => setActiveNav('home')}>
              <PrimeAstraLogo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
                  Prime<span className="text-purple-600 font-bold">Astra</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5 block">
                  AI &amp; Wasm Suite
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav aria-label="Main Navigation" className="space-y-1.5">
              <button
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 text-left ${
                  activeNav === 'home'
                    ? 'bg-white text-purple-700 shadow-clay-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser) {
                    setShowSettingsModal(true);
                  } else {
                    setShowAuthModal(true);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 text-left ${
                  activeNav === 'settings'
                    ? 'bg-white text-purple-700 shadow-clay-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Bottom Card */}
          <div className="mt-8 pt-4">
            <div
              onClick={() => {
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                alert('PrimeAstra Pro unlocked!');
              }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-white to-purple-500/5 p-4 rounded-2xl border border-amber-200/80 shadow-sm group hover:border-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 flex items-center justify-center shadow-sm shrink-0 font-bold">
                  <Crown className="w-5 h-5 text-amber-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">Go Premium</h4>
                  <p className="text-[11px] text-slate-500 truncate">Unlock unlimited &amp; AI tools</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </aside>

        {/* === Right Content Area === */}
        <section className="lg:col-span-9 xl:col-span-9 flex flex-col justify-start space-y-6 h-full" data-purpose="main-dashboard">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1" data-purpose="top-header">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Prime<span className="text-purple-600">Astra</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser ? (
                  <>Welcome back, <span className="font-semibold text-purple-700">{userData?.name || currentUser.email}</span></>
                ) : (
                  'All tools. One place. Unlimited possibilities.'
                )}
              </p>
            </div>

            {/* Search Bar, Notification, SH Profile Icon */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="globalSearchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a tool (e.g. PDF, Resume, Image)..."
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Notification Bell */}
              <button
                type="button"
                className="relative p-2.5 bg-white rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition shadow-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white" />
              </button>

              {/* === SH Profile Avatar & Dropdown === */}
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => {
                    if (currentUser) {
                      setIsDropdownOpen(!isDropdownOpen);
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 border border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition flex items-center justify-center overflow-hidden"
                  title={currentUser ? 'Click for Profile & Settings' : 'Click to Login'}
                >
                  {userData?.photoUrl ? (
                    <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-purple-700 font-extrabold text-xs uppercase tracking-wider">
                      {getInitials()}
                    </div>
                  )}
                </div>

                {/* Dropdown Menu when clicking SH */}
                {isDropdownOpen && currentUser && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-floating p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-800 truncate">{userData?.name || 'User'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowSettingsModal(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition cursor-pointer text-left font-semibold"
                    >
                      <Settings className="w-4 h-4 text-purple-600" />
                      <span>Settings &amp; Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        signOut(auth);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer text-left font-semibold mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Clean Workspace Canvas */}
          <div className="flex-1 w-full rounded-[28px] bg-white/45 border border-white/80 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-clay-sm">
            {/* Aapka workspace bilkul pehle jaisa clean rahega */}
          </div>
        </section>
      </main>

      {/* ========================================================
          MODAL 1: LOGIN / REGISTER (Jab SH par bina login ke click ho)
          ======================================================== */}
      {showAuthModal && !currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[390px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <PrimeAstraLogo className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-slate-900">
                {isRegistering ? 'Create PrimeAstra Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isRegistering ? 'Sign up to sync your workspace & tools' : 'Sign in to access your profile'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {isRegistering && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Shubham"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-70 mt-2"
              >
                {authLoading ? 'Please wait...' : isRegistering ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError('');
                }}
                className="text-purple-600 font-bold hover:underline"
              >
                {isRegistering ? 'Log in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: SETTINGS (Photo lagana & Password change option)
          ======================================================== */}
      {showSettingsModal && currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                setSettingsMsg('');
                setSettingsError('');
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Profile &amp; Settings</h3>
            </div>

            {settingsMsg && (
              <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
                {settingsMsg}
              </div>
            )}
            {settingsError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                {settingsError}
              </div>
            )}

            {/* 1. Photo Lagane Ka Option */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 border border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                {userData?.photoUrl ? (
                  <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-purple-700 font-extrabold text-base uppercase">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Profile Photo</p>
                <p className="text-[11px] text-slate-500 mb-2">Upload picture for your account</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer transition shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* 2. Password Change Ka Option */}
            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Change Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={settingsLoading}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-70"
              >
                {settingsLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}