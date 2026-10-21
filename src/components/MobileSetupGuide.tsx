import React from 'react';
import { 
  Smartphone, 
  Download, 
  Layers, 
  ShieldCheck, 
  Share2, 
  Sliders, 
  Volume2, 
  Cpu, 
  Zap,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileSetupGuideProps {
  onTestKeyboard?: () => void;
}

export const MobileSetupGuide: React.FC<MobileSetupGuideProps> = ({ onTestKeyboard }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-slate-100 bg-[#000000] font-mono">
      {/* 1. APP INSTALLATION HERO */}
      <div className="p-5 rounded-2xl bg-[#0B0B0C] border border-[#00f2fe]/40 shadow-[0_0_35px_rgba(0,242,254,0.2)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black border border-[#00f2fe]/60 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Smartphone className="w-6 h-6 text-[#00f2fe]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">OMNIAI SHADOW COMPANION DEPLOYMENT</h2>
            <p className="text-[10px] text-slate-400">Install as standalone native mobile app (PWA)</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-[11px]">
          Runs with zero browser headers at 60fps on mobile hardware, utilizing WebGPU and NPU acceleration for instant sub-10ms viewport perception.
        </p>

        <div className="pt-2">
          <PWAInstallButton variant="full" />
        </div>
      </div>

      {/* 2. DUAL-LANE COGNITION ARCHITECTURE */}
      <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f2fe]" />
          <h3 className="text-xs font-bold text-white tracking-wider">DUAL-LANE PIPELINE SPECIFICATION</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-black/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#00f2fe] flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Lane 1: Low-Latency Conversation Stream
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Computes 3 predictive response tiers directly above the keyboard layout row (Witty, Raw & Honest, Direct Action), allowing 1-tap population.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-black/80 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#7f00ff] flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Lane 2: Automated Background Ledger
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Silently parses ongoing conversation streams for counterparty entities, dates, deadlines, and emotional subtext, accessible via the OmniCore Telemetry HUD.
            </p>
          </div>
        </div>
      </div>

      {/* 3. STEP-BY-STEP PHONE EXTENSION GUIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* iOS Setup */}
        <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-white/10 space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            🍎 Apple iOS Setup
          </span>
          <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Open this URL in <strong>Safari</strong></li>
            <li>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></li>
            <li>Enable keyboard extension in <strong>Settings → Keyboards</strong></li>
            <li>Toggle <strong>Allow Full Access</strong> for live viewport perception</li>
          </ol>
        </div>

        {/* Android Setup */}
        <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-white/10 space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            🤖 Android Setup
          </span>
          <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Open in <strong>Chrome</strong> and tap <strong>Install App</strong></li>
            <li>Activate in <strong>Settings → System → Languages & Input</strong></li>
            <li>Grant <strong>Accessibility Service</strong> for viewport awareness</li>
            <li>Supports system-wide floating window multitasking</li>
          </ol>
        </div>
      </div>

      {/* 4. PRIVACY SHIELD */}
      <div className="p-3.5 rounded-2xl bg-black border border-[#00f2fe]/30 flex items-start gap-2.5 text-xs text-slate-300">
        <Lock className="w-4 h-4 text-[#00f2fe] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block text-[11px]">Zero Data Leakage Register</strong>
          <span className="text-[10px] text-slate-400 leading-relaxed">
            All token transformations and PII scrubbing execute on the local Neural Processing Unit (NPU).
          </span>
        </div>
      </div>

      <button
        onClick={onTestKeyboard}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#0575e6] text-black font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:brightness-110 transition active:scale-98"
      >
        Launch Volumetric 3D Keyboard
      </button>
    </div>
  );
};
