import React, { useState } from 'react';
import { HoloOrb, OrbPhase } from './HoloOrb';
import { 
  Sparkles, 
  Wand2, 
  Send, 
  Copy, 
  Check, 
  Mic, 
  RotateCcw, 
  Flame, 
  Briefcase, 
  Smile, 
  Shield, 
  Activity, 
  Database,
  Layers,
  ChevronRight,
  Info,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { omniVoice } from '../lib/omniVoice';

interface SuggestionTrio {
  witty: string;
  rawHonest: string;
  directAction: string;
}

interface AIKeyboardBarProps {
  currentText: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
  suggestedReplies: string[];
  suggestionTrio?: SuggestionTrio;
  liveAdvice: string[];
  onSelectSuggestion: (text: string) => void;
  onRewrite: (style: string) => void;
  onRequestInstantAdvice: () => void;
  isAnalyzing: boolean;
  orbPhase: OrbPhase;
  screenName: string;
  isOnDeviceMode?: boolean;
  onToggleOnDeviceMode?: () => void;
  localLatencyMs?: number;
  onOpenTelemetryHUD: () => void;
  telemetryNotesCount: number;
  isAutoMode?: boolean;
  onToggleAutoMode?: () => void;
  autoPilotTone?: 'rawHonest' | 'witty' | 'directAction';
  onChangeAutoPilotTone?: (tone: 'rawHonest' | 'witty' | 'directAction') => void;
  autoCountdown?: number | null;
  onCancelAutoDispatch?: () => void;
  onInstantAutoDispatch?: () => void;
  autoDispatchTarget?: string;
  autoDispatchPreviewText?: string;
}

export const AIKeyboardBar: React.FC<AIKeyboardBarProps> = ({
  currentText,
  onChangeText,
  onSend,
  suggestedReplies,
  suggestionTrio,
  liveAdvice,
  onSelectSuggestion,
  onRewrite,
  onRequestInstantAdvice,
  isAnalyzing,
  orbPhase,
  screenName,
  isOnDeviceMode = true,
  onToggleOnDeviceMode,
  localLatencyMs = 6.8,
  onOpenTelemetryHUD,
  telemetryNotesCount = 3,
  isAutoMode = false,
  onToggleAutoMode,
  autoPilotTone = 'directAction',
  onChangeAutoPilotTone,
  autoCountdown = null,
  onCancelAutoDispatch,
  onInstantAutoDispatch,
  autoDispatchTarget = '',
  autoDispatchPreviewText = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleCopy = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMicDictate = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsListening(true);
      setTimeout(() => {
        onChangeText(currentText ? `${currentText} (voice thought captured)` : 'Addressing the issue right now.');
        setIsListening(false);
      }, 1400);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChangeText(currentText ? `${currentText} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const toneOptions = [
    { id: 'darkmisfit', label: 'DarkMisfit (Raw)', icon: Flame, color: 'text-[#7f00ff]' },
    { id: 'punchy', label: 'Punchy & Fast', icon: Sparkles, color: 'text-[#00f2fe]' },
    { id: 'diplomatic', label: 'Diplomatic', icon: Shield, color: 'text-[#0575e6]' },
    { id: 'flirty', label: 'Witty & Charismatic', icon: Smile, color: 'text-pink-400' },
    { id: 'professional', label: 'Executive', icon: Briefcase, color: 'text-blue-400' },
  ];

  // Prepare the 3 distinct register carousel cards
  const carouselItems = [
    {
      tier: 'Casual / Witty',
      text: suggestionTrio?.witty || suggestedReplies[0] || 'Short answer: yes, moving forward.',
      color: 'border-[#00f2fe]/40 text-slate-100 bg-[#0B0B0C]/90 hover:border-[#00f2fe]',
      tag: 'WITTY',
      tagColor: 'text-[#00f2fe] bg-[#00f2fe]/10 border-[#00f2fe]/30',
    },
    {
      tier: 'Deep / Raw Honest',
      text: suggestionTrio?.rawHonest || suggestedReplies[1] || 'I’d rather be upfront than pretend this isn’t pressing.',
      color: 'border-[#7f00ff]/40 text-slate-100 bg-[#0B0B0C]/90 hover:border-[#7f00ff]',
      tag: 'DEEP & HONEST',
      tagColor: 'text-[#c084fc] bg-[#7f00ff]/15 border-[#7f00ff]/30',
    },
    {
      tier: 'Direct / Action',
      text: suggestionTrio?.directAction || suggestedReplies[2] || 'Locking this in immediately with full verification.',
      color: 'border-[#0575e6]/40 text-slate-100 bg-[#0B0B0C]/90 hover:border-[#0575e6]',
      tag: 'DIRECT ACTION',
      tagColor: 'text-[#38bdf8] bg-[#0575e6]/15 border-[#0575e6]/30',
    },
  ];

  return (
    <div className="flex flex-col bg-[#000000] border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] relative z-20">
      {/* 1. TOP INTELLIGENCE STATUS STRIP */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B0B0C] border-b border-white/10 text-xs">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {/* OmniCore Telemetry HUD Trigger Button */}
          <button
            onClick={onOpenTelemetryHUD}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] hover:bg-[#00f2fe]/20 text-[10px] font-mono font-bold transition shadow-[0_0_10px_rgba(0,242,254,0.15)] shrink-0"
            title="Open OmniCore Telemetry HUD (Lane 2 Memory Ledger)"
          >
            <Activity className="w-3 h-3 text-[#00f2fe] animate-pulse" />
            <span>OmniCore ({telemetryNotesCount})</span>
          </button>

          {/* Real-time Advice Pill */}
          <div 
            onClick={onOpenTelemetryHUD}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/10 text-[11px] text-slate-300 hover:text-white cursor-pointer truncate transition max-w-[65%]"
            title="Click to inspect real-time notes"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping shrink-0" />
            <span className="truncate font-mono text-[10px]">
              {liveAdvice[0] || 'Omni watching screen... tap for live coaching.'}
            </span>
          </div>

          {/* Autonomous Auto-Pilot Mode Toggle */}
          {onToggleAutoMode && (
            <button
              onClick={onToggleAutoMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition shrink-0 ${
                isAutoMode
                  ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#7f00ff]/30 text-[#00f2fe] border border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.4)] animate-pulse'
                  : 'bg-black/90 text-slate-500 border border-white/10 hover:text-slate-300'
              }`}
              title="Toggle Autonomous Auto-Pilot Mode (Omni Key answers for you)"
            >
              <Zap className={`w-3 h-3 ${isAutoMode ? 'text-[#00f2fe] animate-bounce' : 'text-slate-500'}`} />
              <span>{isAutoMode ? 'AUTO: ON' : 'AUTO: OFF'}</span>
            </button>
          )}

          {/* On-Device NPU Status Badge */}
          {onToggleOnDeviceMode && (
            <button
              onClick={onToggleOnDeviceMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition shrink-0 ${
                isOnDeviceMode
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-[#7f00ff]/15 text-[#a855f7] border border-[#7f00ff]/40'
              }`}
              title="Toggle On-Device Local Processing vs Cloud Gemini"
            >
              <span>{isOnDeviceMode ? `⚡ ${localLatencyMs}ms NPU` : '☁️ Cloud'}</span>
            </button>
          )}
        </div>

        {/* Tone menu toggle */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setShowToneMenu(!showToneMenu)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              showToneMenu
                ? 'bg-[#7f00ff]/20 text-[#c084fc] border-[#7f00ff]/50'
                : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Rewrite Tone (DarkMisfit Register)"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="hidden sm:inline text-[11px] font-mono">Tone</span>
          </button>
        </div>
      </div>

      {/* AUTONOMOUS AUTO-DISPATCH ACTIVE BANNER */}
      {isAutoMode && autoCountdown !== null && (
        <div className="px-3 py-2 bg-gradient-to-r from-[#0B0B0C] via-[#05141c] to-[#0B0B0C] border-b border-[#00f2fe]/60 shadow-[0_0_25px_rgba(0,242,254,0.3)] animate-in slide-in-from-top-2 duration-150 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2fe]">
                <Zap className="w-3.5 h-3.5 text-[#00f2fe]" />
                <span>AUTO-ANSWERING IN {autoCountdown}s...</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-[#7f00ff]/20 text-[#c084fc] border border-[#7f00ff]/40 uppercase font-bold">
                {autoPilotTone}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onInstantAutoDispatch}
                className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#00f2fe] to-[#0575e6] text-black text-[10px] font-mono font-bold hover:brightness-110 active:scale-95 shadow-[0_0_12px_rgba(0,242,254,0.4)] transition"
              >
                Send Now ⚡
              </button>
              <button
                onClick={onCancelAutoDispatch}
                className="px-2 py-0.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/40 text-[10px] font-mono hover:bg-red-500/25 transition"
              >
                Override
              </button>
            </div>
          </div>

          {/* Countdown timer bar */}
          <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#0575e6] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${Math.max(10, ((autoCountdown || 1) / 3) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-200">
            <span className="truncate italic pr-2">
              "{autoDispatchPreviewText || currentText || 'Generating optimal response...'}"
            </span>
            {autoDispatchTarget && (
              <span className="text-[9px] text-slate-400 shrink-0">
                To: {autoDispatchTarget}
              </span>
            )}
          </div>
        </div>
      )}

      {/* AUTONOMOUS AUTO-PILOT COCKPIT STRIP (When Auto Mode is ON but idle) */}
      {isAutoMode && autoCountdown === null && (
        <div className="px-3 py-1.5 bg-[#05141c]/60 border-b border-[#00f2fe]/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[10px] text-[#00f2fe]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="font-bold">AUTO-PILOT ACTIVE:</span>
            <span className="text-slate-300">Omni Key will autonomously answer incoming messages.</span>
          </div>

          {onChangeAutoPilotTone && (
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-slate-500">Tone:</span>
              <select
                value={autoPilotTone}
                onChange={(e) => onChangeAutoPilotTone(e.target.value as any)}
                className="bg-black text-[10px] text-[#00f2fe] border border-white/10 rounded px-1.5 py-0.5 focus:outline-none font-mono"
              >
                <option value="directAction">Direct Action</option>
                <option value="rawHonest">Raw & Honest</option>
                <option value="witty">Witty & Magnetic</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* TONE POPOVER / SELECTOR */}
      {showToneMenu && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-2 bg-[#0B0B0C] border-b border-white/10 animate-in slide-in-from-top-2 duration-150">
          {toneOptions.map((tone) => {
            const Icon = tone.icon;
            return (
              <button
                key={tone.id}
                onClick={() => {
                  onRewrite(tone.id);
                  setShowToneMenu(false);
                }}
                disabled={!currentText.trim() || isAnalyzing}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/70 border border-white/10 hover:border-[#00f2fe]/50 hover:bg-black/90 transition text-center disabled:opacity-40"
              >
                <Icon className={`w-4 h-4 mb-1 ${tone.color}`} />
                <span className="text-[10px] font-mono text-slate-200">{tone.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. SLIDING PREDICTIVE SUGGESTION CAROUSEL WITH ANCHORED 3D ORB */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#000000] border-b border-white/10 relative">
        {/* Sliding Carousel of 3 Tailored Conversational Responses */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-xs text-[#00f2fe] animate-pulse px-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
              <span>Omni dual-lane engine reading viewport & drafting responses...</span>
            </div>
          ) : (
            carouselItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(item.text)}
                className={`flex flex-col items-start p-2 rounded-xl border text-left shadow-md transition-all active:scale-95 shrink-0 max-w-[240px] sm:max-w-[280px] group ${item.color}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold tracking-wider border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      omniVoice.speak(item.text);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-[#00f2fe] transition"
                    title="Speak suggestion with OmniVoice"
                  >
                    <Volume2 className="w-3 h-3" />
                  </span>
                </div>
                <span className="text-[11px] font-medium leading-snug line-clamp-2 text-slate-200 group-hover:text-white">
                  {item.text}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Anchored Flagship 3D WebGL Volumetric Core Orb (Far Right of Suggestion Bar) */}
        <div 
          onClick={onRequestInstantAdvice}
          className="shrink-0 pl-1.5 flex items-center justify-center border-l border-white/10"
          title="Omni Core 3D Volumetric Core — Tap to analyze active screen"
        >
          <HoloOrb phase={orbPhase} size="sm" />
        </div>
      </div>

      {/* 3. ACTIVE TYPING DOCK */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0B0B0C] border-t border-white/10">
        <button
          onClick={handleMicDictate}
          className={`p-2 rounded-xl border transition ${
            isListening
              ? 'bg-[#7f00ff]/20 text-[#00f2fe] border-[#00f2fe] animate-pulse shadow-[0_0_12px_rgba(0,242,254,0.5)]'
              : 'bg-black text-slate-400 border-white/10 hover:text-white'
          }`}
          title="Dictate raw thoughts"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* OmniVoice Speak Button */}
        <button
          onClick={() => {
            if (currentText) {
              omniVoice.speak(currentText);
            } else {
              omniVoice.speak('OmniAI shadow companion active. Standing by for screen cognition.');
            }
          }}
          className="p-2 rounded-xl border bg-black text-slate-400 border-white/10 hover:text-[#00f2fe] hover:border-[#00f2fe]/40 transition"
          title="Listen to OmniVoice"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Input buffer */}
        <div className="relative flex-1">
          <input
            type="text"
            value={currentText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSend(currentText);
              }
            }}
            placeholder="Type with Omni AI • Dark Misfit Studios..."
            className="w-full rounded-xl bg-[#000000] border border-white/15 px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f2fe]/80 focus:ring-1 focus:ring-[#00f2fe]/40 font-mono transition pr-8 shadow-inner"
          />
          {currentText && (
            <button
              onClick={() => onChangeText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5 font-bold"
              title="Clear text"
            >
              ×
            </button>
          )}
        </div>

        {/* Copy to system clipboard */}
        <button
          onClick={handleCopy}
          disabled={!currentText}
          className={`p-2 rounded-xl border transition disabled:opacity-30 ${
            copied
              ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/50 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
              : 'bg-black text-slate-300 border-white/10 hover:bg-[#18181b]'
          }`}
          title="Copy text to phone clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-[#00f2fe]" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Send / Commit into input stream */}
        <button
          onClick={() => onSend(currentText)}
          disabled={!currentText}
          className="p-2 rounded-xl bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#0575e6] text-black font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:brightness-110 active:scale-95 transition disabled:opacity-40"
          title="Send into conversation"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
