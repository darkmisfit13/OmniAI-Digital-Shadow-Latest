import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running standalone, hide the button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Installed App</span>
      </div>
    );
  }

  // Android / Chromium / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 font-medium transition-all shadow-md active:scale-95 ${
          variant === 'full'
            ? 'w-full justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm text-white shadow-cyan-500/20 hover:brightness-110'
            : 'rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/30'
        }`}
        title="Install Omni Keyboard App on your phone"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 font-medium transition-all active:scale-95 ${
            variant === 'full'
              ? 'w-full justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm text-white hover:brightness-110'
              : 'rounded-lg bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Add to Home Screen for full app experience</p>
                </div>
              </div>

              <div className="space-y-3 my-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-1.5 rounded-lg bg-slate-700 text-cyan-400">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Step 1: Tap Share</span>
                    Tap the Safari <strong>Share button</strong> at the bottom of your screen.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="p-1.5 rounded-lg bg-slate-700 text-cyan-400">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Step 2: Add to Home Screen</span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop or non-detected browser: provide quick install / phone sync prompt
  return (
    <button
      onClick={() => setShowIOSGuide(true)}
      className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700/80 transition"
      title="How to install on your mobile device"
    >
      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
      <span>Install on Phone</span>
    </button>
  );
};
