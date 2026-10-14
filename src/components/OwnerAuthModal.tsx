import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { OWNER_PASSCODES } from '../lib/auth';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Owner & Brand Console Access',
  description = 'This portal contains internal store administration, Printify fulfillment hooks, and brand assets. Please enter the Owner PIN to proceed.',
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (OWNER_PASSCODES.includes(clean)) {
      setError(false);
      sessionStorage.setItem('highdraw_owner_auth', 'true');
      onSuccess();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1C2C24] text-white rounded-sm border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-[#38BDF8] mx-auto mb-2 border border-white/15">
            <Lock size={22} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <img src="/assets/brand/logo_tracer_cyan.png" alt="Tracer" className="h-4 w-auto object-contain" />
            <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
              RESTRICTED BRAND ACCESS
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block">
              Enter Owner Passcode / PIN
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                autoFocus
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Owner PIN (e.g. ken2026)"
                className="w-full bg-black/40 border border-slate-600 rounded px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] transition-colors font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0 text-red-400" />
              <span>Incorrect passcode. Please verify your credentials or contact Ken.</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>UNLOCK OWNER CONSOLE</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              RETURN TO PUBLIC STOREFRONT
            </button>
          </div>
        </form>

        {/* Discrete Hint */}
        <div className="pt-2 border-t border-slate-700/60 text-center">
          <span className="text-[10px] text-slate-400 font-mono">
            High Draw Golf Co. &bull; Ken Cyree Administration
          </span>
        </div>

      </div>
    </div>
  );
};
