import React, { useState, useEffect } from 'react';
import { 
  Keyboard as KeyboardIcon, 
  Sparkles, 
  Eye, 
  Sliders, 
  Send, 
  Copy, 
  Trash2, 
  Check, 
  Cpu, 
  Cloud, 
  Zap, 
  Layers, 
  Flame, 
  Bot, 
  Globe, 
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { HoloOrb, OrbPhase } from './HoloOrb';

interface OmniKeyboardCompanionProps {
  onSendToStudio?: (text: string) => void;
  onSaveToVault?: (asset: any) => void;
}

export const OmniKeyboardCompanion: React.FC<OmniKeyboardCompanionProps> = ({
  onSendToStudio,
  onSaveToVault,
}) => {
  const [typedText, setTypedText] = useState(
    'Assembling the unified intelligence matrix for darkmisfit studios'
  );
  const [selectedTone, setSelectedTone] = useState<'nocturnal_cool' | 'darkmisfit' | 'punchy' | 'diplomatic' | 'deep_technical'>('nocturnal_cool');
  const [activeLane, setActiveLane] = useState<'dual' | 'device' | 'cloud'>('dual');
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [screenContext, setScreenContext] = useState<string>('Visualizing DarkMisfitStudios web layout & live telemetry');
  const [suggestions, setSuggestions] = useState<string[]>([
    '⚡ Execute Multi-LLM Quorum',
    '🎬 Render OmniMotion Timeline',
    '🎵 Synthesize Heavy Metal Drop',
    '🛡️ Open Root Admin Console',
  ]);
  const [copied, setCopied] = useState(false);
  const [isProcessingTone, setIsProcessingTone] = useState(false);

  // Keyboard Rows definition
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ['123', '🌐', 'SPACE', '.', 'ENTER'],
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (key === 'SPACE') {
      setTypedText((prev) => prev + ' ');
    } else if (key === 'ENTER') {
      handleTransformTone(selectedTone);
    } else if (key === 'SHIFT' || key === '123' || key === '🌐') {
      // Functional modifier
    } else {
      setTypedText((prev) => prev + key.toLowerCase());
    }
  };

  const handleTransformTone = async (tone: typeof selectedTone) => {
    setSelectedTone(tone);
    setIsProcessingTone(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsProcessingTone(false);
      setOrbPhase('idle');

      let transformed = typedText;
      if (tone === 'nocturnal_cool') {
        transformed = `🌙 [Nocturnal]: ${typedText.trim()} — calibrated for shadow velocity.`;
      } else if (tone === 'darkmisfit') {
        transformed = `⚡ [DarkMisfit]: ${typedText.trim()} // Unapologetic power, zero compromises.`;
      } else if (tone === 'punchy') {
        transformed = `🔥 ${typedText.trim().toUpperCase()} — Instant impact, maximum retention.`;
      } else if (tone === 'diplomatic') {
        transformed = `🤝 We have architected an optimal consensus pathway: "${typedText.trim()}".`;
      } else {
        transformed = `🛠️ [Technical Matrix]: Latency-bound asynchronous pipeline executing: "${typedText.trim()}".`;
      }
      setTypedText(transformed);
    }, 700);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(typedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090f] text-slate-100 overflow-hidden font-sans">
      
      {/* Phone Screen Vision & HoloOrb Status */}
      <div className="px-3.5 py-2 bg-[#090c14] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <HoloOrb phase={orbPhase} className="w-7 h-7 flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white">Omni Companion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-cyan-400 font-mono">38ms</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
              <Monitor className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{screenContext}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
            DUAL-LANE
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full flex flex-col justify-between">
        
        {/* Live Typing & Predictive Buffer */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0d101c] to-[#0a0d16] border border-cyan-500/30 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  Shadow Keyboard Buffer
                </span>
                {isProcessingTone && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-300 font-mono animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Transforming tone...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setTypedText('')}
                  className="p-1 text-slate-500 hover:text-rose-400"
                  title="Clear buffer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-sans leading-relaxed"
              placeholder="Type on the virtual keys below or keyboard..."
            />

            {/* Quick Actions at bottom of buffer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <span>Chars: {typedText.length}</span>
                <span>•</span>
                <span>Tokens: ~{Math.ceil(typedText.length / 4)}</span>
              </div>

              {onSendToStudio && (
                <button
                  onClick={() => onSendToStudio(typedText)}
                  className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Send to Omni Studios</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold mr-1">
              TONE:
            </span>
            {(
              [
                { id: 'nocturnal_cool', label: '🌙 Nocturnal Cool' },
                { id: 'darkmisfit', label: '⚡ DarkMisfit' },
                { id: 'punchy', label: '🔥 Punchy & Viral' },
                { id: 'diplomatic', label: '🤝 Diplomatic' },
                { id: 'deep_technical', label: '🛠️ Deep Technical' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => handleTransformTone(t.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedTone === t.id
                    ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contextual Smart Suggestion Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => setTypedText((prev) => (prev ? `${prev} ${sug}` : sug))}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 hover:text-cyan-200 transition-all truncate"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Volumetric Soft Keyboard Canvas */}
        <div className="p-3 bg-gradient-to-b from-[#0b0e1a] to-[#070911] border border-slate-800 rounded-2xl shadow-2xl space-y-2 select-none">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1.5">
              {row.map((k, kIdx) => {
                const isSpecial = ['SHIFT', 'BACKSPACE', 'ENTER', '123', 'SPACE', '🌐'].includes(k);
                const isSpace = k === 'SPACE';
                const isEnter = k === 'ENTER';

                return (
                  <button
                    key={kIdx}
                    onClick={() => handleKeyPress(k)}
                    className={`h-11 rounded-lg text-xs md:text-sm font-semibold transition-all duration-100 flex items-center justify-center shadow active:scale-95 ${
                      isSpace
                        ? 'flex-1 max-w-xs bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : isEnter
                        ? 'px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold hover:brightness-110 shadow-cyan-500/20'
                        : isSpecial
                        ? 'px-3 bg-slate-800/90 text-slate-300 hover:bg-slate-700 text-xs'
                        : 'w-8 sm:w-10 bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800/60'
                    }`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
