import React from 'react';
import {
  Sun,
  Moon,
  Zap,
  Shield,
  Command,
  Trash2,
  CheckCircle2,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { AppTheme } from '../types';

interface SettingsViewProps {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  setTheme,
  onClearStorage,
}) => {
  const isDark = theme === 'luminous-dark';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2
          className={`text-2xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Suite Preferences &amp; System Settings
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Configure theme rendering, WebAssembly acceleration, and privacy sandboxing.
        </p>
      </div>

      {/* Theme Selection */}
      <div
        className={`rounded-3xl p-5 border ${
          isDark ? 'dark-ios-glass-card' : 'ios-glass-card'
        }`}
      >
        <h3
          className={`text-sm font-bold mb-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Visual Interface Design Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pastel Clay Light */}
          <div
            onClick={() => setTheme('clay-light')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
              !isDark
                ? 'border-violet-600 bg-violet-50/50 shadow-clay-sm'
                : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-xl clay-sphere shadow-sm flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-violet-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pastel Clay &amp; Glass</h4>
                {!isDark && (
                  <span className="text-[9px] bg-violet-600 text-white font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Whimsical pastel claymorphism, 3D lilac torus animations, soft diffuse shadows.
              </p>
            </div>
          </div>

          {/* Luminous Liquid Glass Dark */}
          <div
            onClick={() => setTheme('luminous-dark')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
              isDark
                ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-cyan'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl clay-sphere-dark shadow-sm flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Luminous Liquid Glass</h4>
                {isDark && (
                  <span className="text-[9px] bg-cyan-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Obsidian void foundation with electric cyan specular highlights and optic glow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WASM & Performance */}
      <div
        className={`rounded-3xl p-5 border ${
          isDark ? 'dark-ios-glass-card' : 'ios-glass-card'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              WebAssembly (WASM) Hardware SIMD
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Enabled
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          High-throughput vector calculations, image compression buffers, and document parsers execute
          directly on your local CPU cores without sending bytes over the internet.
        </p>
      </div>

      {/* Keyboard Shortcuts Cheat Sheet */}
      <div
        className={`rounded-3xl p-5 border ${
          isDark ? 'dark-ios-glass-card' : 'ios-glass-card'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Command className="w-5 h-5 text-violet-500 dark:text-cyan-400" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Keyboard Navigation Shortcuts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">Global Omni-Search</span>
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border text-[10px] font-mono font-bold">
              ⌘K / Ctrl+K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">Close Active Modal / Preview</span>
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border text-[10px] font-mono font-bold">
              Esc
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">Copy Result to Clipboard</span>
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border text-[10px] font-mono font-bold">
              ⌘C / Ctrl+C
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">Download Processed Output</span>
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border text-[10px] font-mono font-bold">
              Enter
            </kbd>
          </div>
        </div>
      </div>

      {/* Privacy & Storage */}
      <div
        className={`rounded-3xl p-5 border flex items-center justify-between ${
          isDark ? 'dark-ios-glass-card' : 'ios-glass-card'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Clear Local Tool Memory &amp; Cache
            </h4>
            <p className="text-[11px] text-slate-500">
              Reset favorites and local file buffer histories.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClearStorage}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
        >
          Wipe Cache
        </button>
      </div>
    </div>
  );
};
