import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, LogOut, Settings, LogIn, Wrench, Home } from 'lucide-react';

import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Subcomponents import
import { PrimeAstraLogo } from './components/Logo';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { ToolDirectory } from './tools/ToolDirectory';
import { ResumeMaker } from './tools/ResumeMaker/ResumeMaker';

export default function App() {
  const [activeNav, setActiveNav] = useState<'home' | 'free-tools' | 'resume-maker'>('free-tools');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ name?: string; email?: string; photoUrl?: string } | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as any);
          } else {
            setUserData({ name: user.displayName || '', email: user.email || '', photoUrl: user.photoURL || '' });
          }
        } catch {
          setUserData({ name: user.displayName || '', email: user.email || '', photoUrl: user.photoURL || '' });
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getAvatarImage = () => {
    if (userData?.photoUrl) return userData.photoUrl;
    if (currentUser?.photoURL) return currentUser.photoURL;
    const initial = (userData?.name || currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=7c3aed&color=fff&bold=true&rounded=true`;
  };

  return (
    <div className="bg-[#ECEEF3] text-slate-800 antialiased min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white flex items-center justify-center p-2 sm:p-4 md:p-6 pb-20 md:pb-6">
      <main
        className="relative z-10 w-full max-w-[1360px] bg-white/80 backdrop-blur-2xl rounded-[28px] md:rounded-[36px] shadow-floating border border-white/95 p-3.5 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]"
      >
        {/* Sidebar */}
        <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col justify-start bg-[#F8FAFC]/90 rounded-[28px] p-5 border border-slate-200/70 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 pt-1 cursor-pointer" onClick={() => setActiveNav('home')}>
              <PrimeAstraLogo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Prime<span className="text-purple-600">Astra</span>
                </h1>
                <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5 block">AI &amp; Wasm Suite</span>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition text-left cursor-pointer ${
                  activeNav === 'home'
                    ? 'bg-white text-purple-700 shadow-clay-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Home className="w-5 h-5 text-purple-600" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setActiveNav('free-tools')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition text-left cursor-pointer ${
                  activeNav === 'free-tools' || activeNav === 'resume-maker'
                    ? 'bg-white text-purple-700 shadow-clay-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Wrench className="w-5 h-5 text-purple-600" />
                <span>Free Tools</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Dashboard Area */}
        <section className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col justify-start space-y-4 h-full">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Prime<span className="text-purple-600">Astra</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {currentUser ? (
                    <>Welcome back, <span className="font-semibold text-purple-700">{userData?.name || currentUser.displayName || currentUser.email}</span></>
                  ) : (
                    'All tools. One place.'
                  )}
                </p>
              </div>
              <div className="md:hidden">
                <PrimeAstraLogo className="w-8 h-8" />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button type="button" className="p-2 sm:p-2.5 bg-white rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-800 shadow-sm">
                <Bell className="w-4 h-4" />
              </button>

              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 border border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition flex items-center justify-center overflow-hidden"
                  >
                    <img src={getAvatarImage()} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-52 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-floating p-2 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="font-bold text-slate-800 truncate">{userData?.name || currentUser.displayName || 'User'}</p>
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
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Login / Register</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 w-full rounded-[24px] md:rounded-[28px] bg-white/60 border border-white/90 backdrop-blur-md p-3 sm:p-5 flex flex-col items-center justify-start text-center relative shadow-clay-sm min-h-0">
            {activeNav === 'resume-maker' && (
              <ResumeMaker onBack={() => setActiveNav('free-tools')} />
            )}

            {activeNav === 'free-tools' && (
              <ToolDirectory onSelectTool={() => setActiveNav('resume-maker')} />
            )}

            {activeNav === 'home' && (
              <div className="m-auto p-6 max-w-md bg-white/80 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <PrimeAstraLogo className="w-12 h-12 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Welcome to PrimeAstra</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sidebar se <strong>Free Tools</strong> par click karein aur tools explore karein.
                </p>
                <button
                  onClick={() => setActiveNav('free-tools')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Explore Free Tools &rarr;
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-3 left-8 right-8 z-40 md:hidden bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-floating flex items-center justify-around">
        <button
          onClick={() => setActiveNav('home')}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition cursor-pointer ${
            activeNav === 'home' ? 'text-purple-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px]">Home</span>
        </button>

        <button
          onClick={() => setActiveNav('free-tools')}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition cursor-pointer ${
            activeNav === 'free-tools' || activeNav === 'resume-maker' ? 'text-purple-700 font-bold bg-purple-50' : 'text-slate-500'
          }`}
        >
          <Wrench className="w-4 h-4 text-purple-600" />
          <span className="text-[11px]">Free Tools</span>
        </button>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(profile) => setUserData(profile)}
        />
      )}

      {showSettingsModal && currentUser && (
        <SettingsModal
          currentUser={currentUser}
          userData={userData}
          avatarUrl={getAvatarImage()}
          onClose={() => setShowSettingsModal(false)}
          onUserDataUpdate={(newProfile) => setUserData(newProfile)}
        />
      )}
    </div>
  );
}