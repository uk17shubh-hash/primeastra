import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  LogOut,
  Settings,
  Lock,
  Camera,
  X,
  LogIn,
  FileText,
  Wrench,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Home,
} from 'lucide-react';

// Firebase imports
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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

// === RESUME MAKER TOOL COMPONENT ===
function ResumeMakerTool() {
  const [formData, setFormData] = useState({
    name: 'Shubham Singh',
    title: 'Computer Operator & Executive',
    phone: '+91 9876543210',
    email: 'shubham@example.com',
    address: 'Roorkee, Uttarakhand',
    summary: 'Dedicated professional with hands-on experience in computer operations, digital documentation, and online client management.',
    education: [
      { degree: '12th (Commerce)', board: 'DAV Inter College, UP Board', year: '2016', marks: 'First Division' }
    ],
    experience: [
      { role: 'Computer Operator', company: 'Digital Seva Center', period: '2021 - Present', desc: 'Managed online forms, customer documentation, digital services, and record keeping.' }
    ],
    skills: 'MS Office, Data Entry, Computer Operations, Typing, Documentation',
    languages: 'Hindi, English',
  });

  const [themeColor, setThemeColor] = useState('#1e3a8a');

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', board: '', year: '', marks: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', period: '', desc: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      <div className="p-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-2xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Resume Maker
          </h2>
          <p className="text-[11px] text-purple-100">Live preview & printable PDF ready</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow hover:bg-slate-100 transition cursor-pointer w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF / Print</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Theme Color:</span>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer"
              />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

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

          {/* Education */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold text-slate-800">Education</h3>
              <button onClick={addEducation} className="text-[11px] text-purple-700 font-bold flex items-center gap-1 cursor-pointer">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs relative p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                {formData.education.length > 1 && (
                  <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div>
                  <label className="text-[10px] text-slate-500">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[index].degree = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Board / College</label>
                  <input
                    type="text"
                    value={edu.board}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[index].board = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[index].year = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Marks</label>
                  <input
                    type="text"
                    value={edu.marks}
                    onChange={(e) => {
                      const updated = [...formData.education];
                      updated[index].marks = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold text-slate-800">Experience</h3>
              <button onClick={addExperience} className="text-[11px] text-purple-700 font-bold flex items-center gap-1 cursor-pointer">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-2 text-xs relative p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                {formData.experience.length > 1 && (
                  <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[index].role = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[index].company = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Period</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...formData.experience];
                      updated[index].period = e.target.value;
                      setFormData({ ...formData, experience: updated });
                    }}
                    className="w-full p-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-1">Skills & Languages</h3>
            <div className="space-y-2 text-xs">
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
        </div>

        {/* Right Side: Live A4 Sheet Preview */}
        <div className="lg:col-span-6 bg-slate-200/70 p-2 sm:p-3 rounded-2xl border border-slate-300 flex justify-center lg:sticky lg:top-0 w-full overflow-x-auto">
          <div
            className="w-full min-w-[340px] bg-white shadow-md rounded-lg overflow-hidden flex min-h-[520px] text-slate-800"
            style={{ fontFamily: 'sans-serif' }}
          >
            <div className="w-1/3 text-white p-3 sm:p-4 flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">
                    Contact
                  </h4>
                  <div className="space-y-1.5 text-[9px] sm:text-[10px] text-white/90">
                    <p className="break-all">📞 {formData.phone}</p>
                    <p className="break-all">✉️ {formData.email}</p>
                    <p>📍 {formData.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.split(',').map((s, i) => (
                      <span key={i} className="text-[8px] sm:text-[9px] bg-white/20 px-1 py-0.5 rounded text-white font-medium">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 border-b border-white/20 pb-1 mb-2">
                    Languages
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-white/90">{formData.languages}</p>
                </div>
              </div>
              <div className="text-[8px] text-white/50 pt-3">PrimeAstra Suite</div>
            </div>

            <div className="w-2/3 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="border-b pb-2 mb-3">
                  <h1 className="text-base sm:text-xl font-black" style={{ color: themeColor }}>
                    {formData.name || 'Your Name'}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">{formData.title}</p>
                  {formData.summary && (
                    <p className="text-[9px] sm:text-[10px] text-slate-600 mt-1.5 leading-relaxed">{formData.summary}</p>
                  )}
                </div>

                {formData.experience.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>
                      Experience
                    </h3>
                    <div className="space-y-1.5">
                      {formData.experience.map((exp, i) => (
                        <div key={i} className="text-[9px] sm:text-[10px]">
                          <div className="flex justify-between font-bold">
                            <span>{exp.role}</span>
                            <span className="text-slate-400 font-normal">{exp.period}</span>
                          </div>
                          <p className="text-slate-500">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.education.length > 0 && (
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase mb-1 pb-0.5 border-b border-slate-200" style={{ color: themeColor }}>
                      Education
                    </h3>
                    <div className="space-y-1.5">
                      {formData.education.map((edu, i) => (
                        <div key={i} className="text-[9px] sm:text-[10px] flex justify-between">
                          <div>
                            <p className="font-bold">{edu.degree}</p>
                            <p className="text-slate-500">{edu.board}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400">{edu.year}</span>
                            {edu.marks && <p className="text-slate-600">{edu.marks}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-2 text-[8px] text-slate-400">
                I hereby declare that all information stated above is true and complete.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === MAIN APP COMPONENT ===
export default function App() {
  const [activeNav, setActiveNav] = useState('resume-maker');
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase Auth & User Data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ name?: string; email?: string; photoUrl?: string } | null>(null);

  // Modals & Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Settings Form State
  const [newPassword, setNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

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
            setUserData(userDoc.data() as { name?: string; email?: string; photoUrl?: string });
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

  // Google Sign-In Handler
  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newProfile = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          photoUrl: user.photoURL || '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setUserData(newProfile);
      }
      setShowAuthModal(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setAuthError(errorObj.message || 'Google sign-in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Email / Password Form Submit
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

  // Profile Photo Upload (Base64)
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
        } catch {
          setSettingsError('Failed to update photo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Photo Remove Handler
  const handleRemovePhoto = async () => {
    if (!currentUser) return;
    setSettingsError('');
    setSettingsMsg('');
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { photoUrl: '' });
      setUserData((prev) => ({ ...prev, photoUrl: '' }));
      setSettingsMsg('Profile photo removed!');
    } catch {
      setSettingsError('Failed to remove photo.');
    }
  };

  // Password Change Handler
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
      setSettingsError(errorObj.message || 'Error updating password.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Avatar Photo / Initial Image Resolution
  const getAvatarImage = () => {
    if (userData?.photoUrl) return userData.photoUrl;
    if (currentUser?.photoURL) return currentUser.photoURL;
    const initial = (userData?.name || currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=7c3aed&color=fff&bold=true&rounded=true`;
  };

  return (
    <div className="bg-[#ECEEF3] text-slate-800 antialiased min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white flex items-center justify-center p-2 sm:p-4 md:p-6 pb-20 md:pb-6">
      {/* Background 3D Bubbles */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -right-8 w-72 h-72 rounded-full clay-sphere opacity-45 blur-[1px] animate-float" />
        <div className="absolute top-28 right-24 w-44 h-44 rounded-full glass-disc opacity-60 animate-float-delayed" />
        <div className="absolute bottom-6 -left-12 w-64 h-64 rounded-full clay-sphere opacity-50 blur-[1.5px] animate-float" />
      </div>

      {/* Main Shell */}
      <main
        className="relative z-10 w-full max-w-[1360px] bg-white/80 backdrop-blur-2xl rounded-[28px] md:rounded-[36px] shadow-floating border border-white/95 p-3.5 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]"
        data-purpose="app-root"
      >
        {/* === Left Sidebar (Without Premium Card) === */}
        <aside
          className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col justify-start bg-[#F8FAFC]/90 rounded-[28px] p-5 border border-slate-200/70 shadow-sm"
          data-purpose="sidebar"
        >
          <div className="space-y-6">
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

            <nav aria-label="Main Navigation" className="space-y-4">
              <button
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 text-left cursor-pointer ${
                  activeNav === 'home'
                    ? 'bg-white text-purple-700 shadow-clay-sm border border-purple-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Home className="w-5 h-5 text-purple-600" />
                <span>Home</span>
              </button>

              <div className="pt-2">
                <span className="px-4 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 mb-2">
                  <Wrench className="w-3 h-3 text-purple-500" />
                  Free Tools
                </span>

                <button
                  onClick={() => setActiveNav('resume-maker')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 text-left cursor-pointer ${
                    activeNav === 'resume-maker'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${activeNav === 'resume-maker' ? 'text-white' : 'text-purple-600'}`} />
                  <span>AI Resume Maker</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* === Right Content Area === */}
        <section className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col justify-start space-y-4 h-full" data-purpose="main-dashboard">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 shrink-0" data-purpose="top-header">
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
                  id="globalSearchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-2xl text-xs font-medium placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button
                type="button"
                className="p-2 sm:p-2.5 bg-white rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-800 shadow-sm"
              >
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
            {activeNav === 'resume-maker' ? (
              <ResumeMakerTool />
            ) : (
              <div className="m-auto p-6 max-w-md bg-white/80 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <PrimeAstraLogo className="w-12 h-12 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Welcome to PrimeAstra</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sidebar ya bottom navbar se <strong>AI Resume Maker</strong> select karein.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* === Mobile Floating Bottom Bar (Premium Removed) === */}
      <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-floating flex items-center justify-around">
        <button
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition cursor-pointer ${
            activeNav === 'home' ? 'text-purple-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveNav('resume-maker')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition cursor-pointer ${
            activeNav === 'resume-maker' ? 'text-purple-700 font-bold bg-purple-50 px-3' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span className="text-[10px]">Resume Maker</span>
        </button>

        {currentUser && (
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex flex-col items-center gap-1 p-1.5 text-slate-500 rounded-xl transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px]">Settings</span>
          </button>
        )}
      </div>

      {/* === Auth Modal === */}
      {showAuthModal && !currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[390px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7 text-left">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <PrimeAstraLogo className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-slate-900">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isRegistering ? 'Sign up to sync your resume & tools' : 'Sign in to access your profile'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={authLoading}
              className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 mb-4 shadow-sm transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 my-3 text-slate-400 text-[10px]">
              <div className="flex-1 border-t border-slate-200" />
              <span>OR EMAIL</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {isRegistering && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Shubham Singh"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-70 mt-2"
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
                className="text-purple-600 font-bold hover:underline cursor-pointer"
              >
                {isRegistering ? 'Log in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* === Settings Modal (With Remove Photo Option) === */}
      {showSettingsModal && currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-floating border border-slate-100 p-6 md:p-7 text-left">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                setSettingsMsg('');
                setSettingsError('');
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
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

            {/* Profile Photo Upload / Remove Box */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 border border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                <img src={getAvatarImage()} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Profile Photo</p>
                <p className="text-[11px] text-slate-500 mb-2">Change or remove your profile picture</p>
                
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer transition shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>

                  {/* Remove Photo Button */}
                  {(userData?.photoUrl || currentUser?.photoURL) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-600 hover:bg-rose-100 cursor-pointer transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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