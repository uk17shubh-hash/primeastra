// src/components/Sidebar.tsx
import React from 'react';
import { Home, Wrench, Bookmark, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps): React.JSX.Element {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'free-tools', label: 'Free Tools', icon: Wrench },
    { id: 'saved-tools', label: 'Saved Tools', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4 h-screen select-none">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            PA
          </div>
          <span className="font-bold text-slate-800 text-lg">PrimeAstra</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 text-center font-medium">
        PrimeAstra Utilities • 100% Free
      </div>
    </aside>
  );
}