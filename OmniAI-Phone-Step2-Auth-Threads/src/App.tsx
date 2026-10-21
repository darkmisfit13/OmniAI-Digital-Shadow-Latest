import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Keyboard as KeyboardIcon, 
  Eye, 
  Sparkles, 
  Smartphone, 
  Wifi, 
  Battery, 
  Maximize2, 
  FolderOpen, 
  Code,
  Activity,
  Layers,
  Cpu,
  Laptop,
  Zap,
  Volume2,
  VolumeX,
  MessageSquare,
  Settings,
  FolderLock,
  Menu,
  ChevronLeft,
  Bot
} from 'lucide-react';
import { HoloOrb, OrbPhase } from './components/HoloOrb';
import { AIKeyboardBar } from './components/AIKeyboardBar';
import { SoftKeyboard } from './components/SoftKeyboard';
import { SimulatedAppView, PRESET_SCENARIOS, ScreenScenario } from './components/SimulatedAppView';
import { ScreenVisionHUD } from './components/ScreenVisionHUD';
import { OmniStudiosView, StudioId } from './components/OmniStudiosView';
import { OmniStudiosSidebar } from './components/OmniStudiosSidebar';
import { OmniAIChatRoom } from './components/OmniAIChatRoom';
import { OmniChatAndCouncil } from './components/OmniChatAndCouncil';
import { AdminHub } from './components/AdminHub';
import { VaultAssetsDrawer } from './components/VaultAssetsDrawer';
import { MobileSetupGuide } from './components/MobileSetupGuide';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WorkspaceHub } from './components/WorkspaceHub';
import { KeyboardExtensionBridge } from './components/KeyboardExtensionBridge';
import { DesktopSyncBridge } from './components/DesktopSyncBridge';
import { DesktopFloatingWidget } from './components/DesktopFloatingWidget';
import { JarvisTelemetryHUD } from './components/JarvisTelemetryHUD';
import { onDeviceAI, DualLaneAnalysisResult } from './lib/onDeviceAI';
import { omniVoice } from './lib/omniVoice';

export default function App() {
  const [activeTab, setActiveTab] = useState<'keyboard' | 'chat' | 'vision' | 'workspace' | 'extension' | 'studios' | 'sync' | 'setup' | 'admin'>('keyboard');
  const [isDesktopOverlayActive, setIsDesktopOverlayActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(omniVoice.getVoiceEnabled());
  const typingTimerRef = useRef<any>(null);

  // Studios Sidebar & Vault Drawer & Admin Modals
  const [isStudiosSidebarOpen, setIsStudiosSidebarOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<StudioId>('motion');

  // Autonomous Auto Mode State
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoPilotTone, setAutoPilotTone] = useState<'rawHonest' | 'witty' | 'directAction'>('directAction');
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);
  const [autoDispatchTarget, setAutoDispatchTarget] = useState<string>('');
  const [autoDispatchPreviewText, setAutoDispatchPreviewText] = useState<string>('');
  const autoCountdownTimerRef = useRef<any>(null);

  // Active typing text
  const [currentDraftText, setCurrentDraftText] = useState<string>(PRESET_SCENARIOS[0].defaultDraft);

  // Active screen scenario
  const [currentScenario, setCurrentScenario] = useState<ScreenScenario>(PRESET_SCENARIOS[0]);
  const [customScreenshot, setCustomScreenshot] = useState<string | null>(null);

  // Live Screen Sharing stream
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Keyboard collapsed state
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] = useState(false);

  // Phone frame simulation toggle for desktop screens
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);

  // On-Device AI Mode vs Cloud Mode
  const [isOnDeviceMode, setIsOnDeviceMode] = useState(true);
  const [localLatencyMs, setLocalLatencyMs] = useState(6.4);

  // Jarvis Telemetry HUD state
  const [isTelemetryHUDOpen, setIsTelemetryHUDOpen] = useState(false);

  // Dual-Lane AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [analysisData, setAnalysisData] = useState<DualLaneAnalysisResult>({
    summary: 'Alex Rivera (VP Eng) is demanding an unvarnished ETA on the staging build #402 deployment.',
    counterpartDossier: 'Alex Rivera • VP Engineering • #product-launch',
    emotionalRegister: 'High-Stakes Pressure & Zero-Fluff Accountability',
    urgency: 'High',
    suggestionTrio: {
      witty: 'Code is compiling—unless the server catches fire, staging is live at 11:00 AM.',
      rawHonest: 'The delay was on our auth regression check. We caught the flaw before client demo, pushing in 15m.',
      directAction: 'Fix is verified locally; regression test passing. Pushing build #402 to staging in 15 minutes.',
    },
    suggestedReplies: [
      'Code is compiling—unless the server catches fire, staging is live at 11:00 AM.',
      'The delay was on our auth regression check. We caught the flaw before client demo, pushing in 15m.',
      'Fix is verified locally; regression test passing. Pushing build #402 to staging in 15 minutes.',
    ],
    tacticalAdvice: [
      'Lead with the exact timestamp. Under extreme pressure, adjectives look like excuses.',
      'Acknowledge the client visibility risk without getting defensive.',
      'Commit to immediate channel confirmation the second artifacts hit staging.'
    ],
    telemetryNotes: [
      {
        id: 'init_note_1',
        category: 'Commitment',
        label: 'Build #402 Staging Target',
        detail: 'Commitment to deliver staging deploy within 15 minutes (11:00 AM hard cutoff).',
        timestamp: '10:42 AM',
      },
      {
        id: 'init_note_2',
        category: 'Risk',
        label: 'Client Executive Escalation',
        detail: 'VP of client operations is actively pinging engineering leadership.',
        timestamp: '10:42 AM',
      },
      {
        id: 'init_note_3',
        category: 'Emotion',
        label: 'Executive Urgency',
        detail: 'Uncompromising tone; demands unambiguous milestone certainty.',
        timestamp: '10:42 AM',
      }
    ],
    telemetry: {
      latencyMs: 6.4,
      memoryMb: 19.2,
      accelerator: 'WebGPU (NPU/GPU)',
      privacyStatus: 'Shielded (Zero Network Data)',
      modelName: 'OmniWave-DualLane-v4',
    }
  });

  // Clock in status bar
  const [currentTime, setCurrentTime] = useState('9:41');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours();
      const mins = d.getMinutes();
      const formattedMins = mins < 10 ? `0${mins}` : mins;
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${formattedMins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Sync OmniVoice with HoloOrb kinetic phases
  useEffect(() => {
    const unsubVoice = omniVoice.subscribe((state) => {
      if (state === 'speaking') {
        setOrbPhase('talking');
      } else if (state === 'idle') {
        setOrbPhase((prev) => (prev === 'talking' ? 'idle' : prev));
      }
    });
    return unsubVoice;
  }, []);

  const triggerTypingState = useCallback(() => {
    setOrbPhase('texting');
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setOrbPhase('idle');
    }, 1400);
  }, []);

  // Trigger Dual-Lane Viewport Cognition
  const analyzeActiveScreen = useCallback(async () => {
    setIsAnalyzing(true);
    setOrbPhase('analyzing');

    const screenContextText = `${currentScenario.name} - ${currentScenario.category} (${currentScenario.messages.map(m => m.text).join(' ')})`;
    const speaker = currentScenario.appHeader.title;

    try {
      const result = await onDeviceAI.processViewportCognition(
        screenContextText,
        currentDraftText,
        speaker
      );
      setAnalysisData(result);
      setLocalLatencyMs(result.telemetry.latencyMs);
      setOrbPhase('suggesting');
      return result;
    } catch (err) {
      console.error('Cognition failed:', err);
      setOrbPhase('idle');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentScenario, currentDraftText]);

  // Handle switching scenario
  const handleSelectScenario = (scenario: ScreenScenario) => {
    setCurrentScenario(scenario);
    setCurrentDraftText(scenario.defaultDraft);
    setOrbPhase('observing');
    setTimeout(() => {
      analyzeActiveScreen();
    }, 180);
  };

  // Handle uploading custom screenshot
  const handleUploadScreenshot = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCustomScreenshot(result);
      setOrbPhase('observing');
      setTimeout(() => {
        analyzeActiveScreen();
      }, 250);
    };
    reader.readAsDataURL(file);
  };

  // Toggle real screen sharing with getDisplayMedia
  const handleToggleLiveScreenSharing = async () => {
    if (isStreaming) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
      setIsStreaming(false);
      setOrbPhase('idle');
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          alert('Screen capture API is not supported on this browser/platform. You can still upload screenshots.');
          return;
        }

        const newStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        setStream(newStream);
        setIsStreaming(true);
        setOrbPhase('observing');

        newStream.getVideoTracks()[0].onended = () => {
          setIsStreaming(false);
          setStream(null);
          setOrbPhase('idle');
        };

        setTimeout(() => {
          analyzeActiveScreen();
        }, 900);
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
        setIsStreaming(false);
      }
    }
  };

  // Rewrite current text with target tone
  const handleRewrite = async (style: string) => {
    if (!currentDraftText.trim()) return;
    setIsAnalyzing(true);
    setOrbPhase('typing');

    try {
      const { rewritten, telemetry } = await onDeviceAI.rewriteLocally(
        currentDraftText,
        style as any
      );
      setCurrentDraftText(rewritten);
      setLocalLatencyMs(telemetry.latencyMs);
      setOrbPhase('suggesting');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Keyboard soft touch interactions
  const handleKeyPress = (char: string) => {
    setCurrentDraftText((prev) => prev + char);
    triggerTypingState();
  };

  const handleBackspace = () => {
    setCurrentDraftText((prev) => prev.slice(0, -1));
    triggerTypingState();
  };

  const handleSpace = () => {
    setCurrentDraftText((prev) => prev + ' ');
    triggerTypingState();
  };

  const handleEnter = useCallback((text?: string, isAutoPilot = false) => {
    const final = text || currentDraftText;
    if (!final.trim()) return;

    currentScenario.messages.push({
      sender: 'me',
      text: final,
      time: 'Just now',
      isAutoPilot,
    });
    setCurrentDraftText('');
    setOrbPhase('suggesting');

    setTimeout(() => {
      analyzeActiveScreen();
    }, 900);
  }, [currentDraftText, currentScenario, analyzeActiveScreen]);

  // Trigger autonomous auto-dispatch with countdown
  const triggerAutoPilotDispatch = useCallback(
    (target: string, incomingContext: string, customReply?: string) => {
      const chosenReply =
        customReply ||
        analysisData.suggestionTrio[autoPilotTone] ||
        analysisData.suggestedReplies[0] ||
        'Locking in execution immediately.';

      setAutoDispatchTarget(target);
      setAutoDispatchPreviewText(chosenReply);
      setOrbPhase('auto');

      if (autoCountdownTimerRef.current) {
        clearInterval(autoCountdownTimerRef.current);
      }

      let count = 3;
      setAutoCountdown(count);

      autoCountdownTimerRef.current = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setAutoCountdown(count);
        } else {
          clearInterval(autoCountdownTimerRef.current);
          setAutoCountdown(null);
          handleEnter(chosenReply, true);

          if (omniVoice.getVoiceEnabled()) {
            omniVoice.speak(chosenReply);
          }

          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setAnalysisData((prev) => ({
            ...prev,
            telemetryNotes: [
              {
                id: `auto_${Date.now()}`,
                category: 'Auto-Pilot',
                label: `Auto-Answered: ${target}`,
                detail: `Autonomous dispatch (${autoPilotTone.toUpperCase()}): "${chosenReply}"`,
                timestamp: nowStr,
              },
              ...prev.telemetryNotes,
            ],
          }));
        }
      }, 1000);
    },
    [autoPilotTone, analysisData, handleEnter]
  );

  const handleCancelAutoDispatch = useCallback(() => {
    if (autoCountdownTimerRef.current) {
      clearInterval(autoCountdownTimerRef.current);
    }
    setAutoCountdown(null);
    setOrbPhase('idle');
  }, []);

  const handleInstantAutoDispatch = useCallback(() => {
    if (autoCountdownTimerRef.current) {
      clearInterval(autoCountdownTimerRef.current);
    }
    const replyToSend =
      autoDispatchPreviewText ||
      analysisData.suggestionTrio[autoPilotTone] ||
      analysisData.suggestedReplies[0];
    setAutoCountdown(null);
    handleEnter(replyToSend, true);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAnalysisData((prev) => ({
      ...prev,
      telemetryNotes: [
        {
          id: `auto_${Date.now()}`,
          category: 'Auto-Pilot',
          label: `Instant Auto-Answer: ${autoDispatchTarget || 'Counterpart'}`,
          detail: `Manual override dispatch (${autoPilotTone.toUpperCase()}): "${replyToSend}"`,
          timestamp: nowStr,
        },
        ...prev.telemetryNotes,
      ],
    }));
  }, [autoDispatchPreviewText, analysisData, autoPilotTone, autoDispatchTarget, handleEnter]);

  // Toggle Auto Mode
  const handleToggleAutoMode = useCallback(() => {
    setIsAutoMode((prev) => {
      const next = !prev;
      if (next) {
        setOrbPhase('auto');
        const lastMsg = currentScenario.messages[currentScenario.messages.length - 1];
        if (lastMsg && lastMsg.sender === 'them') {
          setTimeout(() => {
            triggerAutoPilotDispatch(currentScenario.appHeader.title, lastMsg.text);
          }, 400);
        }
      } else {
        if (autoCountdownTimerRef.current) {
          clearInterval(autoCountdownTimerRef.current);
        }
        setAutoCountdown(null);
        setOrbPhase('idle');
      }
      return next;
    });
  }, [currentScenario, triggerAutoPilotDispatch]);

  // Simulate new incoming counterpart message for testing Auto Mode
  const handleSimulateIncomingMessage = useCallback(() => {
    const counterpartReplies: Record<string, string[]> = {
      work_slack: [
        'Client VP is pinging me again. What is our fallback plan if staging isn’t stable by 11:00?',
        'Can you confirm when the database migration script completes on staging?',
      ],
      dating_hinge: [
        'Haha deal! Next question: what is your go-to midnight creative playlist when you are locked in the lab?',
        'Are you more of an impulsive road trip person or meticulous planner?',
      ],
      client_dispute: [
        'Can you confirm in writing that our payment gateway won’t incur any recurring penalty for this charge?',
        'Thank you for looking into this. Please send the adjusted invoice as soon as finance approves.',
      ],
      terminal_bug: [
        'Crash monitor ping: port 8080 reporting high connection drop rate. Check auth middleware overhead.',
        'Core dump written to /var/log/crash.log. Session validation taking >400ms.',
      ],
    };

    const options = counterpartReplies[currentScenario.id] || [
      'Hey, got a quick second to sync on our next steps?',
      'Just following up on your last update, let me know when ready.',
    ];
    const randomReply = options[Math.floor(Math.random() * options.length)];

    currentScenario.messages.push({
      sender: 'them',
      text: randomReply,
      time: 'Just now',
    });

    setOrbPhase('observing');

    analyzeActiveScreen().then((res) => {
      if (isAutoMode) {
        const toneKey = autoPilotTone;
        const candidate = res?.suggestionTrio?.[toneKey] || res?.suggestedReplies?.[0];
        triggerAutoPilotDispatch(currentScenario.appHeader.title, randomReply, candidate);
      }
    });
  }, [currentScenario, isAutoMode, autoPilotTone, analyzeActiveScreen, triggerAutoPilotDispatch]);

  const handleLoadIntoScreenSimulator = (title: string, body: string, sender: string) => {
    const customScenario: ScreenScenario = {
      id: `screen_${Date.now()}`,
      name: title,
      category: 'Workspace',
      icon: FolderOpen,
      appHeader: {
        title: sender,
        subtitle: title,
        avatar: '✉️',
        badge: 'WORKSPACE',
      },
      messages: [
        {
          sender: 'them',
          text: body,
          time: 'Just now',
        },
      ],
      contextHint: `Real-time context from ${title}. Inspecting live dialogue.`,
      defaultDraft: '',
    };
    setCurrentScenario(customScenario);
    setActiveTab('keyboard');
    setOrbPhase('observing');
    setTimeout(() => {
      analyzeActiveScreen();
    }, 250);
  };

  const activeScreenName = isStreaming
    ? 'Live Screen Broadcast'
    : customScreenshot
    ? 'Uploaded Screen Image'
    : currentScenario.name;

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      <OfflineIndicator />

      {/* TOP DESKTOP CONTROLS BAR (Desktop only) */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between mb-2.5 px-2 text-xs font-mono text-slate-400">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
            <span className="font-bold text-white tracking-wider text-xs">Omni AI</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
              PC Sync (⌘⇧K)
            </span>
          </div>
          <span className="text-[8.5px] font-mono text-slate-400 tracking-wider">
            Dark Misfit Studios
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDesktopOverlayActive(!isDesktopOverlayActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition ${
              isDesktopOverlayActive
                ? 'bg-[#00f2fe] text-black border-[#00f2fe] font-bold shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'bg-[#0B0B0C] border-white/10 hover:border-[#00f2fe]/40 text-slate-300 hover:text-white'
            }`}
            title="Launch Floating Desktop Companion Overlay (⌘+Shift+K)"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>{isDesktopOverlayActive ? 'Dock Active' : 'PC Overlay'}</span>
          </button>
          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B0B0C] border border-white/10 hover:border-[#00f2fe]/40 text-slate-300 hover:text-white transition"
            title="Toggle between phone bezel and full view"
          >
            {phoneFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{phoneFrameMode ? 'Full View' : 'Phone Bezel'}</span>
          </button>
          <PWAInstallButton variant="compact" />
        </div>
      </div>

      {/* MAIN PHONE CONTAINER - Pure Matte Black (#000000) Foundation */}
      <div
        className={`w-full flex flex-col bg-[#000000] overflow-hidden transition-all duration-300 ${
          phoneFrameMode
            ? 'sm:max-w-[420px] sm:h-[840px] sm:rounded-[44px] sm:border-[8px] sm:border-[#0B0B0C] sm:shadow-[0_0_80px_rgba(0,242,254,0.18),0_0_120px_rgba(127,0,255,0.15)] sm:ring-1 sm:ring-[#00f2fe]/40'
            : 'max-w-2xl h-screen rounded-none sm:rounded-2xl border-0 sm:border sm:border-white/10'
        } relative h-[100dvh]`}
      >
        {/* 1. NATIVE MOBILE STATUS BAR & HARDWARE NOTCH */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between bg-[#000000] text-[11px] font-mono font-semibold text-slate-400 shrink-0 z-30">
          <span>{currentTime}</span>

          {/* Dynamic Island / Hardware Notch */}
          <div className="w-24 h-4 bg-[#0B0B0C] rounded-full flex items-center justify-center gap-2 border border-white/10 shadow-inner px-2">
            <div className="w-2 h-2 rounded-full bg-black border border-slate-700" />
            <div className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-[#00f2fe] animate-pulse' : 'bg-[#7f00ff]'}`} />
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3 h-3 text-[#00f2fe]" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* 2. APP HEADER: PERMANENT TOP-LEFT STUDIOS TOGGLE & 3D HOLO ORB & DARK MISFIT STUDIOS BRANDING */}
        <header className="px-3 py-2 bg-[#0B0B0C] border-b border-white/10 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            {/* Permanent top-left studio toggle button */}
            <button
              onClick={() => setIsStudiosSidebarOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:text-white transition shadow-sm active:scale-95"
              title="Open Studios Drawer (14 Creative Engines)"
            >
              <Menu className="w-4 h-4 text-[#00f2fe]" />
              <span className="text-[10px] font-mono font-bold tracking-wider hidden xs:inline">Studios</span>
            </button>

            {/* Authentic Three.js 3D HoloOrb */}
            <div className="flex items-center gap-2 pl-0.5">
              <HoloOrb phase={orbPhase} size="sm" onClick={() => analyzeActiveScreen()} />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <h1 className="text-xs font-bold tracking-wider font-mono text-white">
                    Omni <span className="text-[#00f2fe]">AI</span>
                  </h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                </div>
                <span className="text-[8.5px] font-mono tracking-wider text-slate-400 mt-0.5">
                  Dark Misfit Studios
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Action Cockpit */}
          <div className="flex items-center gap-1">
            {/* Quick Voice Toggle */}
            <button
              onClick={() => {
                const next = omniVoice.toggleVoice();
                setIsVoiceEnabled(next);
                if (next) {
                  omniVoice.speak('Omni voice link active.');
                }
              }}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[9.5px] font-mono font-bold transition ${
                isVoiceEnabled
                  ? 'bg-[#00f2fe]/15 border border-[#00f2fe]/40 text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'bg-[#0B0B0C] border border-white/10 text-slate-500 hover:text-white'
              }`}
              title={isVoiceEnabled ? 'OmniVoice Active (Click to mute)' : 'OmniVoice Muted (Click to enable)'}
            >
              {isVoiceEnabled ? <Volume2 className="w-3 h-3 text-[#00f2fe] animate-pulse" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
              <span className="hidden xs:inline">{isVoiceEnabled ? 'VOICE' : 'MUTE'}</span>
            </button>

            {/* Quick Auto Mode Toggle */}
            <button
              onClick={handleToggleAutoMode}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[9.5px] font-mono font-bold transition ${
                isAutoMode
                  ? 'bg-gradient-to-r from-[#00f2fe]/20 to-[#7f00ff]/30 border border-[#00f2fe] text-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.4)] animate-pulse'
                  : 'bg-[#0B0B0C] border border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle Autonomous Auto-Pilot Mode (Omni answers for you)"
            >
              <Zap className={`w-3 h-3 ${isAutoMode ? 'text-[#00f2fe] animate-bounce' : 'text-slate-500'}`} />
              <span className="hidden xs:inline">{isAutoMode ? 'AUTO: ON' : 'AUTO'}</span>
            </button>

            {/* OmniCore HUD Button */}
            <button
              onClick={() => setIsTelemetryHUDOpen(!isTelemetryHUDOpen)}
              className="p-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.2)] hover:bg-[#00f2fe]/20 transition"
              title="Toggle OmniCore Telemetry HUD"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>

            {/* Global Vault Drawer Button */}
            <button
              onClick={() => setIsVaultOpen(true)}
              className="p-1.5 rounded-lg text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 transition"
              title="Open Global Vault Media Library"
            >
              <FolderLock className="w-3.5 h-3.5" />
            </button>

            {/* Settings & Admin Console Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-1.5 rounded-lg text-[10px] font-mono font-bold bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 transition"
              title="Settings & Admin Console (User ban/remove, LLM keys, Billing)"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* 3. MAIN TAB CONTENT AREA */}
        <main className="flex-1 overflow-hidden relative flex flex-col bg-[#000000]">
          {/* SLIDE-UP JARVIS TELEMETRY HUD CARD */}
          <JarvisTelemetryHUD
            isOpen={isTelemetryHUDOpen}
            onClose={() => setIsTelemetryHUDOpen(false)}
            activeScreenTitle={activeScreenName}
            detectedSpeaker={analysisData.counterpartDossier}
            emotionalRegister={analysisData.emotionalRegister}
            telemetryNotes={analysisData.telemetryNotes}
            latencyMs={localLatencyMs}
            npuAccelerator={analysisData.telemetry.accelerator}
            onClearNotes={() => setAnalysisData(prev => ({ ...prev, telemetryNotes: [] }))}
          />

          {/* TAB 1: THE AUTHENTIC KEYBOARD COMMAND STATION */}
          {activeTab === 'keyboard' && (
            <div className="flex flex-col h-full justify-between overflow-hidden">
              {/* Host viewport display where AI watches screen live */}
              <div className="flex-1 overflow-hidden p-2">
                <SimulatedAppView
                  currentScenario={currentScenario}
                  onSelectScenario={handleSelectScenario}
                  customScreenshot={customScreenshot}
                  onUploadScreenshot={handleUploadScreenshot}
                  onClearCustomScreenshot={() => setCustomScreenshot(null)}
                  isLiveScreenSharing={isStreaming}
                  onToggleLiveScreenSharing={handleToggleLiveScreenSharing}
                  currentDraftText={currentDraftText}
                  onSimulateIncomingMessage={handleSimulateIncomingMessage}
                  isAutoMode={isAutoMode}
                />
              </div>

              {/* Keyboard AI Bar + Volumetric 3D Soft Keyboard */}
              <div className="shrink-0 flex flex-col">
                <AIKeyboardBar
                  currentText={currentDraftText}
                  onChangeText={setCurrentDraftText}
                  onSend={handleEnter}
                  suggestedReplies={analysisData.suggestedReplies}
                  suggestionTrio={analysisData.suggestionTrio}
                  liveAdvice={analysisData.tacticalAdvice}
                  onSelectSuggestion={(reply) => setCurrentDraftText(reply)}
                  onRewrite={handleRewrite}
                  onRequestInstantAdvice={() => analyzeActiveScreen()}
                  isAnalyzing={isAnalyzing}
                  orbPhase={orbPhase}
                  screenName={activeScreenName}
                  isOnDeviceMode={isOnDeviceMode}
                  onToggleOnDeviceMode={() => setIsOnDeviceMode(!isOnDeviceMode)}
                  localLatencyMs={localLatencyMs}
                  onOpenTelemetryHUD={() => setIsTelemetryHUDOpen(!isTelemetryHUDOpen)}
                  telemetryNotesCount={analysisData.telemetryNotes.length}
                  isAutoMode={isAutoMode}
                  onToggleAutoMode={handleToggleAutoMode}
                  autoPilotTone={autoPilotTone}
                  onChangeAutoPilotTone={setAutoPilotTone}
                  autoCountdown={autoCountdown}
                  onCancelAutoDispatch={handleCancelAutoDispatch}
                  onInstantAutoDispatch={handleInstantAutoDispatch}
                  autoDispatchTarget={autoDispatchTarget}
                  autoDispatchPreviewText={autoDispatchPreviewText}
                />

                <SoftKeyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  onEnter={() => handleEnter()}
                  onSpace={handleSpace}
                  isCollapsed={isKeyboardCollapsed}
                  onToggleCollapse={() => setIsKeyboardCollapsed(!isKeyboardCollapsed)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI CHATBOT & MULTI-LLM COUNCIL MODE */}
          {activeTab === 'chat' && (
            <div className="h-full overflow-hidden flex flex-col">
              <OmniChatAndCouncil
                onInsertToKeyboard={(text) => {
                  setCurrentDraftText(text);
                  setActiveTab('keyboard');
                }}
              />
            </div>
          )}

          {/* TAB 3: OMNI STUDIOS (14 CREATIVE ENGINES) */}
          {activeTab === 'studios' && (
            <OmniStudiosView
              selectedStudio={selectedStudio}
              onSelectStudio={(id) => setSelectedStudio(id)}
              onBackToHome={() => setActiveTab('keyboard')}
              onOpenSidebar={() => setIsStudiosSidebarOpen(true)}
              onInsertToKeyboard={(text) => {
                setCurrentDraftText(text);
                setActiveTab('keyboard');
              }}
              currentScreenName={activeScreenName}
            />
          )}

          {/* TAB 4: SCREEN VISION HUD */}
          {activeTab === 'vision' && (
            <ScreenVisionHUD
              stream={stream}
              isStreaming={isStreaming}
              onStartStreaming={handleToggleLiveScreenSharing}
              onStopStreaming={handleToggleLiveScreenSharing}
              onManualScan={() => analyzeActiveScreen()}
              isAnalyzing={isAnalyzing}
              analysisData={analysisData}
              onApplyReply={(reply) => {
                setCurrentDraftText(reply);
                setActiveTab('keyboard');
              }}
              activeScreenName={activeScreenName}
            />
          )}

          {/* TAB 5: WORKSPACE HUB */}
          {activeTab === 'workspace' && (
            <WorkspaceHub
              onInsertToKeyboard={(text) => {
                setCurrentDraftText(text);
                setActiveTab('keyboard');
              }}
              onLoadIntoScreenSimulator={handleLoadIntoScreenSimulator}
            />
          )}

          {/* TAB 6: EXTENSION BRIDGE */}
          {activeTab === 'extension' && (
            <KeyboardExtensionBridge />
          )}

          {/* TAB 7: PC SYNC BRIDGE */}
          {activeTab === 'sync' && (
            <DesktopSyncBridge
              onInsertToKeyboard={(text) => {
                setCurrentDraftText(text);
                setActiveTab('keyboard');
              }}
              onToggleDesktopOverlay={() => setIsDesktopOverlayActive(!isDesktopOverlayActive)}
              isDesktopOverlayActive={isDesktopOverlayActive}
            />
          )}

          {/* TAB 8: MOBILE SETUP GUIDE */}
          {activeTab === 'setup' && (
            <MobileSetupGuide
              onTestKeyboard={() => setActiveTab('keyboard')}
            />
          )}

          {/* TAB 9: ADMIN CONSOLE */}
          {activeTab === 'admin' && (
            <div className="h-full overflow-y-auto">
              <AdminHub />
            </div>
          )}
        </main>

        {/* 4. MOBILE BOTTOM TAB NAVIGATION BAR */}
        <nav className="h-14 bg-[#0B0B0C] border-t border-white/10 flex items-center justify-around px-1 shrink-0 z-30 pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'keyboard'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <KeyboardIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Gemini Chatbot & Multi-LLM Council"
          >
            <MessageSquare className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Council</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all relative ${
              activeTab === 'vision'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Vision</span>
            {isStreaming && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('studios');
              setIsStudiosSidebarOpen(true);
            }}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'studios'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="14 Creative Studios (CapCut, Suno, Cursor & more)"
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Studios</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'workspace'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Google Drive, Gmail, Keep"
          >
            <FolderOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'sync'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Laptop & PC Sync (Dark Misfit Studios)"
          >
            <Laptop className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">PC Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              activeTab === 'setup'
                ? 'text-[#00f2fe] font-bold drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono">Install</span>
          </button>
        </nav>

        {/* 5. NATIVE MOBILE HOME INDICATOR BAR */}
        <div className="w-full pb-1 pt-0.5 bg-[#0B0B0C] flex justify-center shrink-0">
          <div className="w-28 h-1 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* 6. SYSTEM-WIDE FLOATING COMPANION WIDGET (OMNI KEY • DARK MISFIT STUDIOS) */}
      <DesktopFloatingWidget
        isOpen={isDesktopOverlayActive}
        onToggle={() => setIsDesktopOverlayActive(!isDesktopOverlayActive)}
        phoneDraftText={currentDraftText}
        onSendToPhone={(text) => setCurrentDraftText(text)}
        onSelectSuggestion={(text) => setCurrentDraftText(text)}
        activeScreenName={activeScreenName}
        isAutoMode={isAutoMode}
        onToggleAutoMode={handleToggleAutoMode}
        autoPilotTone={autoPilotTone}
      />

      {/* 7. PERMANENT STUDIOS SIDEBAR DRAWER (Accessible anytime from top-left toggle) */}
      <OmniStudiosSidebar
        isOpen={isStudiosSidebarOpen}
        onClose={() => setIsStudiosSidebarOpen(false)}
        selectedStudio={selectedStudio}
        onSelectStudio={(id) => {
          setSelectedStudio(id);
          setActiveTab('studios');
          setIsStudiosSidebarOpen(false);
        }}
        onOpenVault={() => {
          setIsVaultOpen(true);
          setIsStudiosSidebarOpen(false);
        }}
      />

      {/* 8. GLOBAL VAULT ASSETS DRAWER */}
      <VaultAssetsDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onInsertToKeyboard={(text) => {
          setCurrentDraftText(text);
          setActiveTab('keyboard');
          setIsVaultOpen(false);
        }}
      />

      {/* 9. SETTINGS & ADMIN CONSOLE MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#090b14] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-3 bg-[#07090f] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white">Omni Settings & Admin Hub</span>
                <span className="text-[10px] font-mono text-slate-400">• Dark Misfit Studios</span>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminHub />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
