import React, { useState } from 'react';
import { 
  Delete, 
  ArrowUp, 
  Smile, 
  CornerDownLeft, 
  Volume2, 
  VolumeX,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface SoftKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SoftKeyboard: React.FC<SoftKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [isShift, setIsShift] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'alpha' | 'numbers' | 'symbols'>('alpha');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Play mechanical switch click sound using Web Audio API
  const playClick = (type: 'standard' | 'space' | 'enter' = 'standard') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      const freq = type === 'space' ? 420 : type === 'enter' ? 880 : 640;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.035);
      
      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch {
      // Audio context suppressed
    }
  };

  const handleKey = (char: string) => {
    playClick('standard');
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 120);
    const finalChar = isShift ? char.toUpperCase() : char.toLowerCase();
    onKeyPress(finalChar);
  };

  const handleBackspaceClick = () => {
    playClick('standard');
    setActiveKey('backspace');
    setTimeout(() => setActiveKey(null), 120);
    onBackspace();
  };

  const handleSpaceClick = () => {
    playClick('space');
    setActiveKey('space');
    setTimeout(() => setActiveKey(null), 120);
    onSpace();
  };

  const handleEnterClick = () => {
    playClick('enter');
    setActiveKey('enter');
    setTimeout(() => setActiveKey(null), 120);
    onEnter();
  };

  const alphaRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const numberRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', "'", '#', '%'],
  ];

  const symbolRows = [
    ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
    ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
    ['.', ',', '?', '!', '`', '…', '"'],
  ];

  const emojis = [
    '⚡', '🔥', '✨', '💀', '🖤', '💡', '🎯', '🚀',
    '👍', '🤝', '👀', '💯', '🙏', '☕', '💼', '🍷',
  ];

  if (isCollapsed) {
    return (
      <div className="bg-[#000000] px-4 py-2 flex items-center justify-between border-t border-white/10 text-xs text-slate-400">
        <span className="font-mono text-[11px] text-slate-500">Volumetric Keyboard Docked</span>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-[#00f2fe] hover:text-[#38bdf8] font-mono font-semibold text-xs flex items-center gap-1"
          >
            <span>Restore Keyboard</span>
            <span>↑</span>
          </button>
        )}
      </div>
    );
  }

  const currentRows = layoutMode === 'alpha' ? alphaRows : layoutMode === 'numbers' ? numberRows : symbolRows;

  return (
    <div className="bg-[#000000] select-none border-t border-white/10 p-1.5 pb-2 touch-manipulation relative">
      {/* Mini Mechanical Toolbar */}
      <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-mono text-slate-500 mb-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 hover:text-slate-300 transition"
            title="Toggle Mechanical Key Switch Audio"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3 text-[#00f2fe]" /> : <VolumeX className="w-3 h-3" />}
            <span>{soundEnabled ? 'Switch: Linear' : 'Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#00f2fe]/80 font-mono text-[9px] tracking-wider">
            KINETIC 3D CAPS
          </span>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hover:text-slate-200 p-0.5"
              title="Minimize Keyboard"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Emoji Drawer */}
      {showEmojiPicker && (
        <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#0B0B0C] rounded-xl mb-1.5 border border-[#00f2fe]/30 shadow-[0_0_15px_rgba(0,242,254,0.15)] animate-in fade-in duration-100">
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClick('standard');
                onKeyPress(emoji);
              }}
              className="text-lg p-1.5 rounded-lg hover:bg-white/10 active:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Row 1 */}
      <div className="flex justify-center gap-1 mb-1.5">
        {currentRows[0].map((k) => {
          const isPressed = activeKey === k;
          return (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className={`flex-1 max-w-[38px] h-11 rounded-lg keycap-3d text-white font-medium text-sm flex items-center justify-center font-mono ${
                isPressed ? 'depressed' : ''
              }`}
            >
              {isShift && layoutMode === 'alpha' ? k.toUpperCase() : k}
            </button>
          );
        })}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 mb-1.5 px-3">
        {currentRows[1].map((k) => {
          const isPressed = activeKey === k;
          return (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className={`flex-1 max-w-[38px] h-11 rounded-lg keycap-3d text-white font-medium text-sm flex items-center justify-center font-mono ${
                isPressed ? 'depressed' : ''
              }`}
            >
              {isShift && layoutMode === 'alpha' ? k.toUpperCase() : k}
            </button>
          );
        })}
      </div>

      {/* Row 3 with Shift & Backspace */}
      <div className="flex justify-center gap-1 mb-1.5">
        {layoutMode === 'alpha' ? (
          <button
            onClick={() => {
              playClick('standard');
              setIsShift(!isShift);
            }}
            className={`w-11 h-11 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
              isShift
                ? 'keycap-primary-3d text-[#00f2fe]'
                : 'keycap-3d text-slate-300'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              playClick('standard');
              setLayoutMode(layoutMode === 'numbers' ? 'symbols' : 'numbers');
            }}
            className="w-11 h-11 rounded-lg keycap-3d text-slate-200 text-xs font-mono font-bold flex items-center justify-center"
          >
            {layoutMode === 'numbers' ? '#+=' : '123'}
          </button>
        )}

        {currentRows[2].map((k) => {
          const isPressed = activeKey === k;
          return (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className={`flex-1 max-w-[38px] h-11 rounded-lg keycap-3d text-white font-medium text-sm flex items-center justify-center font-mono ${
                isPressed ? 'depressed' : ''
              }`}
            >
              {isShift && layoutMode === 'alpha' ? k.toUpperCase() : k}
            </button>
          );
        })}

        <button
          onClick={handleBackspaceClick}
          className={`w-11 h-11 rounded-lg keycap-3d text-slate-300 text-xs font-mono flex items-center justify-center ${
            activeKey === 'backspace' ? 'depressed' : ''
          }`}
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Row 4: Switch mode, Emoji, Spacebar, Return */}
      <div className="flex justify-center gap-1.5 px-0.5">
        <button
          onClick={() => {
            playClick('standard');
            setLayoutMode(layoutMode === 'alpha' ? 'numbers' : 'alpha');
          }}
          className="w-12 h-11 rounded-lg keycap-3d text-slate-300 text-xs font-mono font-bold flex items-center justify-center"
        >
          {layoutMode === 'alpha' ? '?123' : 'ABC'}
        </button>

        <button
          onClick={() => {
            playClick('standard');
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className={`w-10 h-11 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
            showEmojiPicker
              ? 'keycap-primary-3d text-[#00f2fe]'
              : 'keycap-3d text-slate-300'
          }`}
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Volumetric Spacebar named 'THE VOID' in cool graphic letters */}
        <button
          onClick={handleSpaceClick}
          className={`flex-1 h-11 rounded-lg keycap-3d text-slate-300 text-xs font-mono flex items-center justify-center relative overflow-hidden group border border-[#00f2fe]/20 hover:border-[#00f2fe]/50 ${
            activeKey === 'space' ? 'depressed ring-1 ring-[#00f2fe]/60' : ''
          }`}
          title="The Void"
        >
          {/* Subtle cosmic void backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#0B0B0C] to-black/90" />
          
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-[11px] font-black tracking-[0.38em] uppercase font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] via-slate-100 to-[#7f00ff] drop-shadow-[0_0_8px_rgba(0,242,254,0.65)] group-hover:drop-shadow-[0_0_12px_rgba(0,242,254,0.9)] transition-all">
              THE VOID
            </span>
          </div>

          {/* Holographic glowing line underneath */}
          <div className="absolute inset-x-8 bottom-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe]/70 to-transparent shadow-[0_0_8px_rgba(0,242,254,0.7)]" />
        </button>

        {/* Enter key with Plasma Violet & Electric Cyan depth */}
        <button
          onClick={handleEnterClick}
          className={`w-14 h-11 rounded-lg keycap-primary-3d text-[#00f2fe] font-mono font-bold text-xs flex items-center justify-center ${
            activeKey === 'enter' ? 'depressed' : ''
          }`}
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
