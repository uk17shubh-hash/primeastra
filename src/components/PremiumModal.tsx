import React, { useState } from 'react';
import { X, Crown, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppTheme } from '../types';
import { PrimeAstraLogo } from './PrimeAstraLogo';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const isDark = theme === 'luminous-dark';
  const [isUpgraded, setIsUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsUpgraded(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const proPerks = [
    'Unlimited parallel batch compression (up to 500 images at once)',
    'Advanced AI Resume Architect bullet quantification & ATS scanner',
    'Custom vector SVG & branded logo embedded QR Codes',
    'Full client-side PDF OCR with multi-column table preservation',
    'High-priority Multi-Threaded WebAssembly acceleration',
    'Commercial usage license & zero telemetry guarantee',
  ];

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-floating border relative max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'dark-ios-glass-container text-white'
            : 'bg-white/75 backdrop-blur-3xl border border-white/90 text-slate-900 shadow-2xl'
        }`}
      >
        <button
          aria-label="Close modal"
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition ${
            isDark
              ? 'text-slate-400 hover:text-white bg-slate-800'
              : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {isUpgraded ? (
          <div className="text-center py-8 space-y-4">
            <PrimeAstraLogo className="w-16 h-16 mx-auto mb-2" />
            <h3 className="text-2xl font-extrabold tracking-tight">
              Welcome to PrimeAstra Pro!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your browser license has been unlocked. All advanced AI models and multi-file batch WASM
              pipelines are now fully active.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-clay-sm transition"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <PrimeAstraLogo className="w-12 h-12" />
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Pro Membership
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">Unlock PrimeAstra Pro</h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Supercharge your workflow with full AI career acceleration, unlimited multi-gigabyte batch
              processing, and zero throttling.
            </p>

            {/* Pricing Card */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark
                  ? 'bg-slate-800/60 border-cyan-500/30'
                  : 'bg-cyan-50/40 border-cyan-200'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">$9</span>
                  <span className="text-xs text-slate-500 font-semibold ml-1">/ month</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Save 40% with Annual
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {proPerks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Cancel anytime. 14-day refund guarantee.</span>
              <button
                type="button"
                onClick={handleUpgrade}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md hover:from-cyan-300 hover:to-blue-400 transition flex items-center gap-1.5"
              >
                <span>Upgrade to Pro Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};