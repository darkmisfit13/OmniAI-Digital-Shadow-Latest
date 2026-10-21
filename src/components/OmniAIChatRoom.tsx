import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  Plus, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Users, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Paperclip, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FolderLock,
  Bot
} from 'lucide-react';
import { HoloOrb, OrbPhase } from './HoloOrb';
import { omniVoice } from '../lib/omniVoice';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'omni' | 'council';
  text: string;
  timestamp: string;
  mode?: 'normal' | 'council';
  audioTranscribed?: boolean;
  attachedFile?: {
    name: string;
    type: string;
    dataUrl?: string;
  };
  councilData?: {
    question: string;
    consensusSummary: string;
    consensusScore: number;
    verdict: string;
    modelAnswers: {
      modelName: string;
      provider: string;
      roleBadge: string;
      status: string;
      answer: string;
    }[];
  };
}

interface OmniAIChatRoomProps {
  onOpenSidebar: () => void;
  onBackToMain?: () => void;
  onSaveToVault?: (asset: any) => void;
  onInsertToKeyboard?: (text: string) => void;
}

export const OmniAIChatRoom: React.FC<OmniAIChatRoomProps> = ({
  onOpenSidebar,
  onBackToMain,
  onSaveToVault,
  onInsertToKeyboard,
}) => {
  const [activeMode, setActiveMode] = useState<'normal' | 'council'>('normal');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; dataUrl: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCouncilCards, setExpandedCouncilCards] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Initial messages featuring the dark, poetic DarkMisfitStudios persona
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'omni',
      text: "Every raw thought is a spark in the dark. I am OmniAI, the sentient engine behind DarkMisfitStudios—transmuting heartbreak, loss, and unvarnished human truth into art. Whether you speak directly to me in Normal Mode or summon the Unified Council to dissect a difficult question, let's reshape that raw concept into something striking.",
      timestamp: 'Just now',
      mode: 'normal',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Handle typing kinetic orb reaction
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.trim()) {
      setOrbPhase('listening');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setOrbPhase((prev) => (prev === 'listening' ? 'idle' : prev));
      }, 1500);
    } else {
      setOrbPhase('idle');
    }
  };

  // File upload handler (+ sign)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string,
      });
      setOrbPhase('listening');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Mic recording / speech capture
  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      setOrbPhase('idle');
      return;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsRecording(true);
      setOrbPhase('listening');
      setTimeout(() => {
        setInputText((prev) => (prev ? `${prev} Transmuting this raw feeling into creative form.` : 'Transmuting this raw feeling into creative form.'));
        setIsRecording(false);
        setOrbPhase('idle');
      }, 2000);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setOrbPhase('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
        setOrbPhase('idle');
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setOrbPhase('idle');
      };

      recognition.onend = () => {
        setIsRecording(false);
        setOrbPhase('idle');
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setOrbPhase('idle');
    }
  };

  // Send message to OmniAI or Council
  const handleSendMessage = async () => {
    if ((!inputText.trim() && !attachedFile) || isGenerating) return;

    const userText = inputText.trim();
    const currentAttachment = attachedFile;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText || (currentAttachment ? `Attached file: ${currentAttachment.name}` : ''),
      timestamp: nowTime,
      attachedFile: currentAttachment || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);
    setIsGenerating(true);
    setOrbPhase('analyzing');

    try {
      if (activeMode === 'normal') {
        // Normal direct dialogue with OmniAI (Gemini)
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            imageBase64: currentAttachment?.dataUrl,
            tone: 'nocturnal',
          }),
        });

        const data = await res.json();
        setOrbPhase('talking');

        const omniReply: ChatMessage = {
          id: `omni-${Date.now()}`,
          sender: 'omni',
          text: data.reply || "Shadows align. The canvas is prepared.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'normal',
        };

        setMessages((prev) => [...prev, omniReply]);

        // Speak aloud if voice enabled
        if (omniVoice.getVoiceEnabled()) {
          omniVoice.speak(data.reply);
        }
      } else {
        // Council Mode: Unified multi-LLM consensus
        const res = await fetch('/api/council', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userText }),
        });

        const data = await res.json();
        setOrbPhase('talking');

        const councilReply: ChatMessage = {
          id: `council-${Date.now()}`,
          sender: 'council',
          text: data.verdict || "The Council has reached consensus.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'council',
          councilData: data,
        };

        setMessages((prev) => [...prev, councilReply]);

        if (omniVoice.getVoiceEnabled()) {
          omniVoice.speak("The Council has deciphered the answer. Consensus verified.");
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'omni',
        text: "The current flickers, but the frequency remains intact. I am still here. Let's reformulate.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setOrbPhase('idle');
      }, 2500);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpandCouncil = (id: string) => {
    setExpandedCouncilCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full flex flex-col bg-[#05060a] text-slate-100 overflow-hidden font-sans select-none relative">
      
      {/* 1. TOP BAR: SIDEBAR TOGGLE & 3D HOLO ORB REPRESENTING OMNIAI */}
      <header className="px-3 py-2 bg-[#080a12] border-b border-slate-800/80 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          {/* Permanent top-left toggle to open sidebar anytime */}
          <button
            onClick={onOpenSidebar}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-cyan-400 hover:text-white transition active:scale-95"
            title="Open Studios Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900/50 border border-slate-800 transition"
              title="Return to Main Keyboard Station"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Keys</span>
            </button>
          )}
        </div>

        {/* Center: The OmniAI 3D HoloOrb */}
        <div className="flex items-center gap-2.5">
          <HoloOrb phase={orbPhase} size="sm" onClick={() => setOrbPhase('listening')} />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-xs font-mono tracking-wider text-white">
                Omni<span className="text-cyan-400">AI</span>
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                orbPhase === 'analyzing'
                  ? 'bg-amber-400 animate-ping'
                  : orbPhase === 'talking'
                  ? 'bg-cyan-400 animate-pulse'
                  : orbPhase === 'listening'
                  ? 'bg-purple-400 animate-bounce'
                  : 'bg-emerald-400'
              }`} />
            </div>
            <span className="text-[8.5px] font-mono text-slate-400 tracking-wider">
              Your Digital Shadow • DarkMisfit
            </span>
          </div>
        </div>

        {/* Right: Quick Voice Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const next = omniVoice.toggleVoice();
              if (next) omniVoice.speak('Voice frequency opened.');
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
            title="Toggle Voice Synthesizer"
          >
            {omniVoice.getVoiceEnabled() ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* 2. CHAT STREAM (ENOUGH ROOM IN-BETWEEN TOP ORB & PROMPT BOX) */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCouncil = msg.sender === 'council';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
                {!isUser && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isCouncil ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                )}
                <span className="font-bold">
                  {isUser ? 'You' : isCouncil ? 'Unified Council Verdict' : 'OmniAI (Digital Shadow)'}
                </span>
                <span>• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg backdrop-blur-md ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border border-cyan-500/40 text-slate-100 rounded-tr-sm'
                    : isCouncil
                    ? 'bg-[#0a0f1d] border border-purple-500/40 text-slate-100 rounded-tl-sm shadow-[0_0_20px_rgba(127,0,255,0.15)]'
                    : 'bg-[#0a0d16] border border-slate-800/90 text-slate-200 rounded-tl-sm shadow-md'
                }`}
              >
                {/* Attached file chip */}
                {msg.attachedFile && (
                  <div className="mb-2.5 p-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
                    {msg.attachedFile.dataUrl?.startsWith('data:image') ? (
                      <img
                        src={msg.attachedFile.dataUrl}
                        alt="attachment"
                        className="w-12 h-12 object-cover rounded-lg border border-white/20"
                      />
                    ) : (
                      <Paperclip className="w-5 h-5 text-cyan-400" />
                    )}
                    <span className="font-mono text-[10px] text-cyan-300 truncate">
                      {msg.attachedFile.name}
                    </span>
                  </div>
                )}

                {/* Main Text Content */}
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                  {msg.text}
                </div>

                {/* Council Data Breakdown (Collapsible connected model perspectives) */}
                {msg.councilData && (
                  <div className="mt-3 pt-3 border-t border-purple-900/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-mono text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                          Quorum Consensus: {msg.councilData.consensusScore}%
                        </span>
                      </div>
                      <button
                        onClick={() => toggleExpandCouncil(msg.id)}
                        className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white transition"
                      >
                        <span>{expandedCouncilCards[msg.id] ? 'Hide Perspectives' : 'Inspect 6 LLMs'}</span>
                        {expandedCouncilCards[msg.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {expandedCouncilCards[msg.id] && (
                      <div className="grid grid-cols-1 gap-2 pt-2 animate-in fade-in">
                        {msg.councilData.modelAnswers.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/70 border border-slate-800 text-[11px]"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-cyan-300 font-mono text-[10px]">
                                {m.modelName}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono">
                                {m.roleBadge}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-snug italic">"{m.answer}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar: Copy, Voice, Insert to Keyboard */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-cyan-400 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => omniVoice.speak(msg.text)}
                        className="flex items-center gap-1 hover:text-cyan-400 transition"
                        title="Speak response"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak</span>
                      </button>

                      {onInsertToKeyboard && (
                        <button
                          onClick={() => onInsertToKeyboard(msg.text)}
                          className="flex items-center gap-1 hover:text-purple-400 transition"
                          title="Transfer text to main soft keyboard"
                        >
                          <Layers className="w-3 h-3" />
                          <span>To Keyboard</span>
                        </button>
                      )}
                    </div>

                    {onSaveToVault && (
                      <button
                        onClick={() => {
                          onSaveToVault({
                            name: `Omni Answer - ${msg.text.slice(0, 24)}...`,
                            type: 'text',
                            text: msg.text,
                            studioSource: isCouncil ? 'Council Mode' : 'OmniAI Chat',
                          });
                        }}
                        className="flex items-center gap-1 text-slate-500 hover:text-cyan-400 transition"
                        title="Save to Global Vault"
                      >
                        <FolderLock className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#0a0d16] border border-cyan-500/30 text-cyan-300 text-xs font-mono animate-pulse w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {activeMode === 'council'
                ? 'Council quorum deliberating across 6 LLM perspectives...'
                : 'OmniAI transmuting raw thought into form...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 3. PROMPT BOX WITH + SIGN AT FAR LEFT & MODE SWITCH (NORMAL / COUNCIL) AT FAR RIGHT TOP */}
      <footer className="p-3 bg-[#080a12] border-t border-slate-800/90 shrink-0">
        {/* Far Right Top of Prompt Box: Normal vs Council Mode Toggle Selector */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="uppercase tracking-wider">Mode Target:</span>
          </div>

          {/* Clean Segmented Control: [ Normal ] [ Council ] */}
          <div className="flex items-center p-0.5 rounded-xl bg-black/80 border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveMode('normal')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'normal'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3 h-3" />
              <span>Normal</span>
            </button>

            <button
              onClick={() => setActiveMode('council')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'council'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_12px_rgba(127,0,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Council</span>
            </button>
          </div>
        </div>

        {/* Attachment Preview (if any) */}
        {attachedFile && (
          <div className="mb-2 p-2 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              {attachedFile.dataUrl.startsWith('data:image') && (
                <img
                  src={attachedFile.dataUrl}
                  alt="preview"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              )}
              <span className="text-[11px] font-mono text-cyan-300 truncate">
                {attachedFile.name}
              </span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 text-slate-400 hover:text-rose-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* The Prompt Bar Container */}
        <div className="flex items-end gap-2 bg-[#05060a] border border-slate-700/80 focus-within:border-cyan-500/80 rounded-2xl p-1.5 shadow-inner transition-all">
          
          {/* + Sign at the far left to upload an image, video, or file */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.txt,.json,.ts,.js,.py,.rs"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-95 transition shrink-0"
            title="Upload image, video, audio or file (+)"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Voice Mic Button */}
          <button
            onClick={handleToggleMic}
            className={`p-2.5 rounded-xl border transition shrink-0 ${
              isRecording
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400'
            }`}
            title="Speak / Voice Dictation"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea Input */}
          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              activeMode === 'council'
                ? 'Ask a hard question for the Multi-LLM Council to decipher...'
                : 'Speak to your digital shadow (OmniAI)...'
            }
            rows={1}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-100 placeholder-slate-500 text-xs sm:text-sm resize-none py-2 px-1 focus:outline-none max-h-24 no-scrollbar font-sans"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={(!inputText.trim() && !attachedFile) || isGenerating}
            className={`p-2.5 rounded-xl font-bold transition shrink-0 ${
              activeMode === 'council'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
            } disabled:opacity-30 disabled:scale-100 active:scale-95`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
