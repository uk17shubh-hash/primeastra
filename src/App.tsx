import React, { useState } from 'react';
import { Home, Wrench, Search, Bell, LogIn } from 'lucide-react';
import { PrimeAstraLogo } from './components/Logo';
import { ToolDirectory } from './tools/ToolDirectory';
import { ResumeMaker } from './tools/ResumeMaker/ResumeMaker';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'resume-maker'>('tools');

  return (
    <div className="bg-[#ECEEF3] min-h-screen p-4 flex items-center justify-center">
      <main className="w-full max-w-[1360px] bg-white/80 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px] border border-white">
        {/* Left Sidebar */}
        <aside className="hidden md:flex md:col-span-3 flex-col justify-start bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <PrimeAstraLogo className="w-8 h-8" />
            <span className="font-bold text-lg">Prime<span className="text-purple-600">Astra</span></span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${
                activeTab === 'home' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${
                activeTab === 'tools' || activeTab === 'resume-maker' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Free Tools</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="col-span-1 md:col-span-9 flex flex-col space-y-4">
          <header className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Workspace</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">Login</button>
          </header>

          <div className="flex-1 bg-white/60 rounded-2xl p-4 border border-slate-100">
            {activeTab === 'home' && <div>Home View</div>}
            {activeTab === 'tools' && <ToolDirectory onSelectTool={() => setActiveTab('resume-maker')} />}
            {activeTab === 'resume-maker' && <ResumeMaker onBack={() => setActiveTab('tools')} />}
          </div>
        </section>
      </main>
    </div>
  );
}