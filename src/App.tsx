// src/App.tsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ResumeMaker from './tools/ResumeMaker';
import Login from './Login';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { ResumeData } from './types/resume';
import { Bell, LogOut } from 'lucide-react';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [themeColor, setThemeColor] = useState<string>('#1e3a8a');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('Guest');
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState<ResumeData>({
    fullName: 'Shubham Singh',
    jobTitle: 'Computer Operator & Executive',
    phone: '+91 9876543210',
    email: 'shubham@example.com',
    location: 'Roorkee, Uttarakhand',
    summary:
      'Dedicated professional with hands-on experience in computer operations, digital documentation, and online client management.',
    skills: 'MS Office, Data Entry, Computer Operations, Typing, Documentation',
    languages: 'Hindi, English',
    experience: [
      {
        id: 1,
        role: 'Computer Operator',
        company: 'Shubh Online Store',
        duration: '2023 - Present',
        details: 'Managed digital services, client documentation, printing, and online forms.',
      },
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'University / Institute',
        year: '2024',
      },
    ],
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserName(user.displayName || user.email?.split('@')[0] || 'Shubh');
        addNotification(`Welcome back, ${user.displayName || 'User'}!`, 'info');
      } else {
        setCurrentUser(null);
        setUserName('Guest');
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      addNotification('Logged out successfully', 'info');
    } catch (err: any) {
      addNotification(err.message || 'Error logging out', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-800">PrimeAstra</h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-0.5 rounded-full">
              {activeTab === 'home' ? 'Home' : activeTab === 'free-tools' ? 'Free Tools' : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => addNotification('All systems running smoothly!', 'info')}
              type="button"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700 capitalize">{userName}</span>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'home' && (
            <Dashboard
              onOpenResumeMaker={() => {
                setActiveTab('free-tools');
                addNotification('Switched to Free Tools: AI Resume Maker', 'info');
              }}
              onExploreTools={() => setActiveTab('free-tools')}
            />
          )}

          {activeTab === 'free-tools' && (
            <ResumeMaker
              formData={formData}
              setFormData={setFormData}
              themeColor={themeColor}
              setThemeColor={setThemeColor}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'saved-tools' && (
            <div className="max-w-4xl mx-auto py-12 text-center text-slate-400 font-medium">
              No saved tools yet. Bookmark tools from the Free Tools section.
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto py-8">
              {currentUser ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-lg">
                  <h3 className="text-base font-bold text-slate-800">Profile & Account</h3>
                  <div className="text-sm space-y-2 text-slate-600">
                    <p><strong>Name:</strong> {userName}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="mt-4 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Login />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App(): React.JSX.Element {
  return (
    <NotificationProvider>
      <MainLayout />
    </NotificationProvider>
  );
}