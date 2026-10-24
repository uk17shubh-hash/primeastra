import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Layers, 
  FileText, 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  Search, 
  Bell, 
  SlidersHorizontal,
  Bookmark,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'resume'>('home');
  const [activeTemplate, setActiveTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');
  const [themeColor, setThemeColor] = useState('#1e3a8a');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('Guest');

  // Resume State
  const [formData, setFormData] = useState({
    name: 'Shubham Singh',
    title: 'Computer Operator & Executive',
    phone: '+91 9876543210',
    email: 'shubham@example.com',
    address: 'Roorkee, Uttarakhand',
    summary: 'Dedicated professional with hands-on experience in computer operations, digital documentation, and online client management.',
    skills: 'MS Office, Data Entry, Computer Operations, Typing, Documentation',
    languages: 'Hindi, English'
  });

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().name) {
            setUserName(snap.data().name);
          } else {
            setUserName(user.displayName || user.email?.split('@')[0] || 'User');
          }
        } catch {
          setUserName(user.displayName || user.email?.split('@')[0] || 'User');
        }
      } else {
        setCurrentUser(null);
        setUserName('Guest');
      }
    });
    return () => unsub();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          photoUrl: user.photoURL || '',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-slate-50 to-slate-100 text-slate-800 p-2 sm:p-4 md:p-6 pb-24 md:pb-6 flex flex-col items-center justify-start antialiased">
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -right-8 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl"></div>
        <div className="absolute bottom-6 -left-12 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[1360px] bg-white/80 md:backdrop-blur-2xl rounded-[28px] md:rounded-[36px] md:shadow-2xl md:border md:border-white/95 p-3 sm:p-5 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[620px]">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col justify-between bg-[#F8FAFC]/90 rounded-[28px] p-5 border border-slate-200/70 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-500/20">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Prime<span className="text-purple-600">Astra</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5 block">Workspace Hub</span>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  activeView === 'home'
                    ? 'bg-white text-purple-700 shadow-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Home className="w-5 h-5 text-purple-600" />
                <span>Home Hub</span>
              </button>

              <button
                onClick={() => setActiveView('resume')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all text-left cursor-pointer ${
                  activeView === 'resume'
                    ? 'bg-white text-purple-700 shadow-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileText className="w-5 h-5 text-purple-600" />
                <span>AI Resume Maker</span>
              </button>
            </nav>
          </div>

          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-xs">
            <span className="font-extrabold text-purple-700 block">PRO Suite Active</span>
            <span className="text-[11px] text-slate-500">All tools unlocked with zero limits.</span>
          </div>
        </aside>

        {/* RIGHT DASHBOARD (PC + Mobile Adaptive) */}
        <section className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col justify-start space-y-4 h-full">
          
          {/* Top Bar */}
          <header className="flex items-center justify-between gap-3 pt-1 pb-2 border-b md:border-b-0 border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="md:hidden w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-500/20">
                P
              </div>
              <div>
                <h2 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Prime<span className="text-purple-600">Astra</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Workspace Hub</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" className="w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 relative">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
              </button>

              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-xs text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-black">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-rose-500 font-bold">Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-xs text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[11px] font-black">G</span>
                  <span className="text-purple-600 font-bold">Login</span>
                </button>
              )}
            </div>
          </header>

          {/* VIEW 1: HOME FEED */}
          {activeView === 'home' && (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">GOOD DAY 👋</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                    Welcome back, <span className="text-purple-600">{userName}</span>
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-purple-100/80 text-purple-700 font-extrabold text-[10px] rounded-lg tracking-wide">
                  PRO Account
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tools, utilities &amp; AI prompts..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs font-semibold placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/25"
                />
                <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-purple-600/25 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-extrabold tracking-wide uppercase border border-white/20">
                  <span className="text-amber-300">★</span>
                  <span>All-in-One Utility Suite</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                    Welcome to PrimeAstra Hub
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-100/90 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                    Explore your curated collection of free digital utilities, dev helpers, and AI power tools.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('resume')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-purple-800 font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                >
                  <span>Explore Free Tools</span>
                  <span>&rarr;</span>
                </button>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center max-w-lg mx-auto">
                  <div>
                    <div className="text-base sm:text-lg font-extrabold">1+</div>
                    <div className="text-[9px] sm:text-[10px] text-purple-200 font-medium">Live Tools</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-extrabold">Zero</div>
                    <div className="text-[9px] sm:text-[10px] text-purple-200 font-medium">Ads or Limits</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-extrabold">Instant</div>
                    <div className="text-[9px] sm:text-[10px] text-purple-200 font-medium">PDF Export</div>
                  </div>
                </div>
              </div>

              {/* Trending Tools (Only Real Tool: AI Resume Maker) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">Trending Tools</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-extrabold text-[9px] rounded-md">Hot</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">100% Free Access</span>
                </div>

                <div
                  onClick={() => setActiveView('resume')}
                  className="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm hover:border-purple-400 hover:shadow-md transition active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                      📝
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-sm font-extrabold text-slate-800 truncate">AI Resume Maker</h5>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 font-extrabold text-[9px] rounded">Live &amp; Ready</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">Build job-ready resumes with 3 templates, live preview &amp; instant PDF download.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer">
                    Open &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: AI RESUME MAKER WORKSPACE */}
          {activeView === 'resume' && (
            <div className="space-y-4 w-full text-left">
              <div className="p-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveView('home')}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition cursor-pointer"
                    title="Back to Home"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      AI Resume Maker
                    </h2>
                    <p className="text-[11px] text-purple-100">Live preview &amp; printable PDF ready</p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition cursor-pointer w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF / Print</span>
                </button>
              </div>

              {/* Form & Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Inputs */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Template & Color Selector */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-600" />
                        Select Template:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(['modern', 'classic', 'executive'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setActiveTemplate(t)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition capitalize ${
                              activeTemplate === t ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Theme Color:</span>
                        <input
                          type="color"
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 border-b pb-1">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Job Title / Post</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Mobile</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-semibold text-slate-500">Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-semibold text-slate-500">Profile Summary</label>
                        <textarea
                          rows={2}
                          value={formData.summary}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills & Languages */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <h3 className="text-xs font-bold text-slate-800 border-b pb-1">Skills &amp; Languages</h3>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Languages</label>
                      <input
                        type="text"
                        value={formData.languages}
                        onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Container */}
                <div className="lg:col-span-6 bg-slate-200/80 p-2 sm:p-3 rounded-2xl border border-slate-300 flex justify-center lg:sticky lg:top-0 w-full overflow-x-auto">
                  <div className="w-full min-w-[320px]">
                    {activeTemplate === 'modern' && (
                      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex min-h-[460px] text-slate-800 font-sans">
                        <div className="w-1/3 text-white p-3 sm:p-4 flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-[9px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-0.5 mb-1.5">Contact</h5>
                              <div className="space-y-1 text-[8.5px] text-white/90">
                                <p className="break-all">📞 {formData.phone}</p>
                                <p className="break-all">✉️ {formData.email}</p>
                                <p>📍 {formData.address}</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[9px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-0.5 mb-1.5">Skills</h5>
                              <div className="flex flex-wrap gap-1">
                                {formData.skills.split(',').map((s, i) => (
                                  <span key={i} className="text-[8px] bg-white/20 px-1 py-0.5 rounded text-white font-medium">
                                    {s.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[9px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-0.5 mb-1.5">Languages</h5>
                              <p className="text-[8.5px] text-white/90">{formData.languages}</p>
                            </div>
                          </div>
                          <div className="text-[7.5px] text-white/50 pt-2">PrimeAstra Suite</div>
                        </div>
                        <div className="w-2/3 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="border-b pb-2 mb-2">
                              <h2 className="text-base sm:text-lg font-black" style={{ color: themeColor }}>{formData.name}</h2>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">{formData.title}</p>
                              <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">{formData.summary}</p>
                            </div>
                            <div className="mb-2">
                              <h4 className="text-[10px] font-bold uppercase mb-0.5 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>Experience</h4>
                              <div className="text-[9.5px] flex justify-between font-bold"><span>Computer Operator</span><span className="text-slate-400 font-normal">2021 - Present</span></div>
                              <p className="text-[8.5px] text-slate-500">Digital Seva Center</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold uppercase mb-0.5 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>Education</h4>
                              <div className="text-[9.5px] flex justify-between font-bold"><span>12th (Commerce)</span><span className="text-slate-400 font-normal">2016</span></div>
                              <p className="text-[8.5px] text-slate-500">DAV Inter College, UP Board | First Division</p>
                            </div>
                          </div>
                          <div className="border-t pt-1.5 text-[8px] text-slate-400 text-center">Verified Client Document</div>
                        </div>
                      </div>
                    )}

                    {activeTemplate === 'classic' && (
                      <div className="w-full bg-white shadow-md rounded-lg p-5 flex flex-col justify-between min-h-[460px] text-slate-800 font-serif">
                        <div>
                          <div className="text-center border-b pb-2.5 mb-2.5">
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">{formData.name}</h2>
                            <p className="text-[10px] font-semibold text-slate-600 uppercase mt-0.5">{formData.title}</p>
                            <p className="text-[8.5px] text-slate-500 mt-0.5">{formData.phone} | {formData.email} | {formData.address}</p>
                          </div>
                          <div className="mb-2.5">
                            <h4 className="text-[10px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Summary</h4>
                            <p className="text-[8.5px] text-slate-600 leading-relaxed">{formData.summary}</p>
                          </div>
                          <div className="mb-2.5">
                            <h4 className="text-[10px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Experience</h4>
                            <p className="text-[8.5px] font-bold">Computer Operator - Digital Seva Center (2021 - Present)</p>
                          </div>
                          <div className="mb-2.5">
                            <h4 className="text-[10px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Education</h4>
                            <p className="text-[8.5px]"><strong>12th Commerce</strong> - DAV Inter College (First Division)</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase border-b pb-0.5 mb-1" style={{ color: themeColor }}>Skills</h4>
                            <p className="text-[8.5px] text-slate-700">{formData.skills}</p>
                          </div>
                        </div>
                        <div className="border-t pt-1 text-[8px] text-slate-400 text-center">PrimeAstra Classic Template</div>
                      </div>
                    )}

                    {activeTemplate === 'executive' && (
                      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between min-h-[460px] text-slate-800 font-sans">
                        <div>
                          <div className="p-3.5 text-white" style={{ backgroundColor: themeColor }}>
                            <h2 className="text-base font-black">{formData.name}</h2>
                            <p className="text-[10px] font-medium text-white/90">{formData.title}</p>
                            <p className="text-[8px] text-white/80 mt-1">📞 {formData.phone} | ✉️ {formData.email} | 📍 {formData.address}</p>
                          </div>
                          <div className="p-3.5 space-y-2.5">
                            <div>
                              <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Profile</h4>
                              <p className="text-[8.5px] text-slate-600 leading-relaxed">{formData.summary}</p>
                            </div>
                            <div>
                              <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Experience</h4>
                              <p className="text-[8.5px] font-bold text-slate-800">Computer Operator - Digital Seva Center</p>
                            </div>
                            <div>
                              <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Skills</h4>
                              <p className="text-[8.5px] text-slate-700">{formData.skills}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 border-t text-[8px] text-slate-400 text-center">Executive Template</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-3 left-4 right-4 z-40 md:hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-1.5 shadow-xl flex items-center justify-around text-slate-400">
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition cursor-pointer ${
            activeView === 'home'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => setActiveView('resume')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition cursor-pointer ${
            activeView === 'resume'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Free Tools</span>
        </button>

        <button
          onClick={() => setActiveView('home')}
          className="flex flex-col items-center gap-1 py-1 px-4 rounded-2xl text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Saved</span>
        </button>

        <button
          onClick={currentUser ? handleLogout : handleGoogleLogin}
          className="flex flex-col items-center gap-1 py-1 px-4 rounded-2xl text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-[10px] font-semibold">{currentUser ? 'Logout' : 'Profile'}</span>
        </button>
      </nav>

    </div>
  );
}