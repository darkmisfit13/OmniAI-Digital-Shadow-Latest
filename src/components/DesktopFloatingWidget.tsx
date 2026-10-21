import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  Send, 
  Eye, 
  RefreshCw, 
  Wand2, 
  Share2, 
  Flame, 
  Shield, 
  ArrowRight,
  GripHorizontal,
  Monitor,
  Zap
} from 'lucide-react';
import { HoloOrb, OrbPhase } from './HoloOrb';

interface DesktopFloatingWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  phoneDraftText: string;
  onSendToPhone: (text: string) => void;
  onSelectSuggestion: (text: string) => void;
  activeScreenName: string;
  isAutoMode?: boolean;
  onToggleAutoMode?: () => void;
  autoPilotTone?: 'rawHonest' | 'witty' | 'directAction';
}

export const DesktopFloatingWidget: React.FC<DesktopFloatingWidgetProps> = ({
  isOpen,
  onToggle,
  phoneDraftText,
  onSendToPhone,
  onSelectSuggestion,
  activeScreenName,
  isAutoMode = false,
  onToggleAutoMode,
  autoPilotTone = 'directAction',
}) => {
  const [isMinimizedPill, setIsMinimizedPill] = useState(false);
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [laptopStream, setLaptopStream] = useState<MediaStream | null>(null);
  const [isCapturingLaptop, setIsCapturingLaptop] = useState(false);
  const [desktopOrbPhase, setDesktopOrbPhase] = useState<OrbPhase>('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Position state for draggable floating toggle
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 20,
    initialY: 70,
  });

  // Nocturnal Cool suggestion trio for laptop workspace
  const [laptopSuggestions, setLaptopSuggestions] = useState<Array<{ tier: string; text: string; tag: string; color: string }>>([
    {
      tier: 'WITTY',
      text: 'Code is clean. Staging deploy hits at 11:00 AM sharp—unless AWS evaporates.',
      tag: 'WITTY',
      color: 'border-[#00f2fe]/40 text-[#00f2fe]',
    },
    {
      tier: 'RAW & HONEST',
      text: 'Caught an auth regression before the client demo. Patch verified, pushing in 15m.',
      tag: 'RAW HONEST',
      color: 'border-[#7f00ff]/40 text-[#c084fc]',
    },
    {
      tier: 'DIRECT ACTION',
      text: 'Regression checks passed locally. Committing build #402 to staging now.',
      tag: 'DIRECT ACTION',
      color: 'border-[#0575e6]/40 text-[#38bdf8]',
    },
  ]);

  // Global hotkey listener (⌘+Shift+K or Ctrl+Shift+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  // Capture laptop screen / active window
  const handleToggleLaptopScreenVision = async () => {
    if (isCapturingLaptop) {
      if (laptopStream) {
        laptopStream.getTracks().forEach((track) => track.stop());
        setLaptopStream(null);
      }
      setIsCapturingLaptop(false);
      setDesktopOrbPhase('idle');
    } else {
      try {
        setDesktopOrbPhase('observing');
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        setLaptopStream(mediaStream);
        setIsCapturingLaptop(true);
        triggerLaptopAnalysis(mediaStream);

        mediaStream.getVideoTracks()[0].onended = () => {
          setIsCapturingLaptop(false);
          setLaptopStream(null);
          setDesktopOrbPhase('idle');
        };
      } catch (err) {
        console.warn('Screen share dismissed or not permitted:', err);
        setDesktopOrbPhase('idle');
      }
    }
  };

  const triggerLaptopAnalysis = async (activeMediaStream?: MediaStream) => {
    setIsAnalyzing(true);
    setDesktopOrbPhase('analyzing');

    try {
      let imageBase64: string | undefined;
      const streamToUse = activeMediaStream || laptopStream;
      if (streamToUse) {
        const video = document.createElement('video');
        video.srcObject = streamToUse;
        video.muted = true;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL('image/jpeg', 0.6);
        }
      }

      const res = await fetch('/api/screen-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          currentInput: inputText || phoneDraftText,
          screenScenario: 'Laptop Workspace (Slack/VS Code/Terminal)',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis?.suggestedReplies?.length) {
          setLaptopSuggestions([
            {
              tier: 'WITTY',
              text: data.analysis.suggestedReplies[0] || 'Clean calculation. Ready to commit.',
              tag: 'WITTY',
              color: 'border-[#00f2fe]/40 text-[#00f2fe]',
            },
            {
              tier: 'RAW & HONEST',
              text: data.analysis.suggestedReplies[1] || 'Unvarnished truth: patch is locking in now.',
              tag: 'RAW HONEST',
              color: 'border-[#7f00ff]/40 text-[#c084fc]',
            },
            {
              tier: 'DIRECT ACTION',
              text: data.analysis.suggestedReplies[2] || 'Verified locally, deploying to staging right now.',
              tag: 'DIRECT ACTION',
              color: 'border-[#0575e6]/40 text-[#38bdf8]',
            },
          ]);
        }
      }
    } catch {
      // Keep nocturnal cool defaults
    } finally {
      setIsAnalyzing(false);
      setDesktopOrbPhase(isCapturingLaptop ? 'observing' : 'idle');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Draggable logic for the minimized pill
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.initialX + deltaX)),
        y: Math.max(10, Math.min(window.innerHeight - 80, dragRef.current.initialY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) {
    // Omnipresent Floating Toggle Capsule that sits on screen everywhere
    return (
      <div 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-50 select-none cursor-pointer group"
      >
        <div 
          onClick={onToggle}
          onMouseDown={handleMouseDown}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#0B0B0C]/95 backdrop-blur-xl border border-[#00f2fe]/40 shadow-[0_0_20px_rgba(0,242,254,0.3),0_10px_30px_rgba(0,0,0,0.8)] hover:border-[#00f2fe] hover:scale-105 active:scale-95 transition-all"
          title="Click to open Omni Key Desktop Companion (⌘+Shift+K)"
        >
          <HoloOrb phase={isCapturingLaptop ? 'observing' : 'idle'} size="sm" />
          
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-bold font-mono tracking-wider text-white">
                OMNI <span className="text-[#00f2fe]">AI</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
            </div>
            <span className="text-[8px] font-mono tracking-wider text-slate-400 mt-0.5">
              Dark Misfit Studios
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-white/10 text-[9px] font-mono text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[#00f2fe]">⌘⇧K</span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Floating Desktop Shadow Companion HUD
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-3 pointer-events-none">
      {/* Backdrop for closing or dismiss */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onToggle}
      />

      {/* Floating System-Wide Dock */}
      <div 
        className="relative w-full max-w-xl bg-[#0B0B0C]/95 backdrop-blur-2xl border border-[#00f2fe]/50 rounded-3xl shadow-[0_0_50px_rgba(0,242,254,0.3),0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden pointer-events-auto flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Neon Halo Stencil border accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#0575e6]" />

        {/* 1. DOCK HEADER WITH EXPLICIT BRANDING */}
        <div className="px-4 py-3 bg-[#000000]/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HoloOrb phase={desktopOrbPhase} size="sm" onClick={() => triggerLaptopAnalysis()} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono tracking-wider text-white">
                  OMNI <span className="text-[#00f2fe]">AI</span>
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40">
                  SHADOW COMPANION
                </span>
              </div>
              <p className="text-[9.5px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                Dark Misfit Studios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400">
              Press <strong className="text-[#00f2fe]">⌘⇧K</strong> or <strong className="text-[#00f2fe]">Ctrl⇧K</strong> to hide
            </span>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-xl bg-black/60 border border-white/10 hover:border-[#00f2fe]/60 text-slate-400 hover:text-white transition"
              title="Close floating overlay"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. LIVE DESKTOP SCREEN VISION & SYNC STRIP */}
        <div className="px-4 py-2.5 bg-[#08080A] border-b border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLaptopScreenVision}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                isCapturingLaptop
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 hover:bg-[#00f2fe]/20 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isCapturingLaptop ? 'Stop Screen Vision' : 'Watch Laptop Screen'}</span>
            </button>

            {isCapturingLaptop && (
              <button
                onClick={() => triggerLaptopAnalysis()}
                disabled={isAnalyzing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#7f00ff]/20 text-[#c084fc] border border-[#7f00ff]/40 hover:bg-[#7f00ff]/30 transition text-[11px]"
              >
                <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>Re-Scan Viewport</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Mode toggle on desktop */}
            {onToggleAutoMode && (
              <button
                onClick={onToggleAutoMode}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition ${
                  isAutoMode
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.3)] animate-pulse'
                    : 'bg-black text-slate-500 border border-white/10 hover:text-slate-300'
                }`}
                title="Toggle Autonomous Auto-Pilot Mode"
              >
                <Zap className="w-3 h-3" />
                <span>{isAutoMode ? 'AUTO: ON' : 'AUTO: OFF'}</span>
              </button>
            )}

            {/* Sync indicator with Phone */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Paired with Phone (Omni Key Mobile)</span>
            </div>
          </div>
        </div>

        {/* 3. SLIDING PREDICTIVE SUGGESTION CAROUSEL */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Nocturnal Cool Instant Completions</span>
            </span>
            <span className="text-[9px] text-slate-500">Tap to copy or insert</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {laptopSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/90 border border-white/10 hover:border-[#00f2fe]/60 transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider mb-2 border ${item.color} bg-black/40`}>
                    {item.tag}
                  </span>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed group-hover:text-white mb-2">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      handleCopy(item.text);
                      onSendToPhone(item.text);
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#00f2fe] hover:underline"
                    title="Copy to laptop clipboard and push to phone"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy & Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectSuggestion(item.text);
                      setInputText(item.text);
                    }}
                    className="text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    Select →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. ACTIVE DESKTOP INPUT & REWRITE DOCK */}
          <div className="pt-2">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-black border border-white/15 focus-within:border-[#00f2fe] transition shadow-inner">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste conversation from laptop..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 font-mono focus:outline-none px-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputText) {
                    onSendToPhone(inputText);
                    handleCopy(inputText);
                  }
                }}
              />

              {inputText && (
                <button
                  onClick={() => {
                    handleCopy(inputText);
                    onSendToPhone(inputText);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] text-xs font-mono font-bold hover:bg-[#00f2fe]/20 transition flex items-center gap-1.5"
                  title="Copy to laptop clipboard and push to phone keyboard"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                  <span>Push to Phone</span>
                </button>
              )}
            </div>

            {/* Quick sync info pill */}
            {phoneDraftText && phoneDraftText !== inputText && (
              <div className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0575e6]/10 border border-[#0575e6]/30 text-[10px] font-mono text-slate-300">
                <span className="truncate pr-2">
                  <strong className="text-[#00f2fe]">Current Phone Draft:</strong> "{phoneDraftText}"
                </span>
                <button
                  onClick={() => setInputText(phoneDraftText)}
                  className="text-[#00f2fe] hover:underline shrink-0"
                >
                  Load to Laptop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 5. FOOTER LINK & INTEGRATION NOTICE */}
        <div className="px-4 py-2 bg-black/90 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Dark Misfit Studios • Nocturnal Cool Core</span>
          <span className="text-[#00f2fe]">Global Hotkey Active (⌘⇧K)</span>
        </div>
      </div>
    </div>
  );
};
