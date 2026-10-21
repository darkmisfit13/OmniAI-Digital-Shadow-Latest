import React from 'react';
import { 
  Briefcase, 
  Heart, 
  Mail, 
  Users, 
  Terminal, 
  Upload, 
  Sparkles, 
  Video,
  ShieldAlert,
  Flame,
  Activity,
  Zap
} from 'lucide-react';

export interface ScreenScenario {
  id: string;
  name: string;
  category: string;
  icon: any;
  appHeader: {
    title: string;
    subtitle: string;
    avatar: string;
    badge?: string;
  };
  messages: Array<{
    sender: 'them' | 'me';
    text: string;
    time: string;
    isAutoPilot?: boolean;
  }>;
  contextHint: string;
  defaultDraft: string;
}

export const PRESET_SCENARIOS: ScreenScenario[] = [
  {
    id: 'work_slack',
    name: 'Work Slack',
    category: 'Work',
    icon: Briefcase,
    appHeader: {
      title: 'Alex Rivera (VP Eng)',
      subtitle: 'Active now • #product-launch',
      avatar: '👨‍💼',
      badge: 'HIGH STAKES',
    },
    messages: [
      {
        sender: 'them',
        text: 'The client VP is asking why staging build #402 is delayed. Did you deploy the auth patch yet? Need an unvarnished ETA right now.',
        time: '10:42 AM',
      },
    ],
    contextHint: 'Alex is under intense executive scrutiny. Demands unambiguous certainty; zero filler words.',
    defaultDraft: 'Fix is verified locally; regression test passing. Pushing build #402 to staging in 15 minutes.',
  },
  {
    id: 'dating_hinge',
    name: 'Hinge Match',
    category: 'Social',
    icon: Heart,
    appHeader: {
      title: 'Maya Lin',
      subtitle: '2 miles away • Just matched',
      avatar: '✨',
      badge: 'UNFILTERED',
    },
    messages: [
      {
        sender: 'them',
        text: 'Haha okay but what’s your most controversial food opinion? And please do not say pineapple on pizza 😂',
        time: '9:15 PM',
      },
    ],
    contextHint: 'Maya is testing conversational authenticity. Avoid generic assistant clichés; be specific and magnetic.',
    defaultDraft: 'Cold takeout eaten directly out of the box in the refrigerator light at 1 AM hits different. Fight me.',
  },
  {
    id: 'client_dispute',
    name: 'Client Email',
    category: 'Finance',
    icon: Mail,
    appHeader: {
      title: 'Billing Breach: Apex Corp',
      subtitle: 'From: Sarah Jenkins (CFO)',
      avatar: '📊',
      badge: 'DISPUTE RISK',
    },
    messages: [
      {
        sender: 'them',
        text: 'We noticed an unexpected $240 charge on our corporate invoice #8819. Can someone explain this line item before we dispute it with our credit card merchant?',
        time: '11:05 AM',
      },
    ],
    contextHint: 'Sarah feels commercially breached. Validate her shock, prevent the merchant dispute, and offer same-day audit and credit.',
    defaultDraft: 'Hi Sarah, inspecting invoice #8819 immediately with our billing team. Expect clarity or full credit today.',
  },
  {
    id: 'terminal_bug',
    name: 'Terminal Crash',
    category: 'Dev',
    icon: Terminal,
    appHeader: {
      title: 'Crash Log: worker-auth',
      subtitle: 'node:v22.14 • Exit code 1',
      avatar: '⚡',
      badge: 'CRITICAL',
    },
    messages: [
      {
        sender: 'them',
        text: 'FATAL: TypeError: Cannot read properties of undefined (reading "bearerToken") at verifySession (/app/auth.js:84:22). Server down.',
        time: '3:01 PM',
      },
    ],
    contextHint: 'Missing optional chaining on auth header for healthcheck pings. Fix: req.headers?.authorization?.split(" ")[1]',
    defaultDraft: 'The auth header is undefined on unauthenticated health-pings. Adding safe optional chaining.',
  },
];

interface SimulatedAppViewProps {
  currentScenario: ScreenScenario;
  onSelectScenario: (scenario: ScreenScenario) => void;
  customScreenshot: string | null;
  onUploadScreenshot: (file: File) => void;
  onClearCustomScreenshot: () => void;
  isLiveScreenSharing: boolean;
  onToggleLiveScreenSharing: () => void;
  currentDraftText: string;
  onSimulateIncomingMessage?: () => void;
  isAutoMode?: boolean;
}

export const SimulatedAppView: React.FC<SimulatedAppViewProps> = ({
  currentScenario,
  onSelectScenario,
  customScreenshot,
  onUploadScreenshot,
  onClearCustomScreenshot,
  isLiveScreenSharing,
  onToggleLiveScreenSharing,
  currentDraftText,
  onSimulateIncomingMessage,
  isAutoMode = false,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadScreenshot(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] text-slate-100 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.9)]">
      {/* Top scenario selector ribbon */}
      <div className="flex items-center gap-1.5 p-2 bg-[#0B0B0C] border-b border-white/10 overflow-x-auto no-scrollbar">
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#00f2fe] px-2 shrink-0">
          HOST VIEWPORT:
        </span>

        {PRESET_SCENARIOS.map((scenario) => {
          const isSelected = !customScreenshot && !isLiveScreenSharing && currentScenario.id === scenario.id;
          const Icon = scenario.icon;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                if (customScreenshot) onClearCustomScreenshot();
                onSelectScenario(scenario);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/60 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                  : 'bg-black/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{scenario.name}</span>
            </button>
          );
        })}

        {/* Test incoming message trigger for Auto-Mode testing */}
        {onSimulateIncomingMessage && (
          <button
            onClick={onSimulateIncomingMessage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap bg-gradient-to-r from-[#00f2fe]/15 to-[#7f00ff]/20 text-[#00f2fe] border border-[#00f2fe]/40 hover:bg-[#00f2fe]/30 transition shadow-[0_0_12px_rgba(0,242,254,0.2)]"
            title="Trigger an incoming message from the counterpart to see Omni Key calculate and answer for you"
          >
            <Zap className="w-3 h-3 text-[#00f2fe] animate-pulse" />
            <span>+ Incoming Msg</span>
          </button>
        )}

        {/* Live screen share toggle button */}
        <button
          onClick={onToggleLiveScreenSharing}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
            isLiveScreenSharing
              ? 'bg-[#7f00ff]/30 text-[#c084fc] border border-[#7f00ff] animate-pulse shadow-[0_0_15px_rgba(127,0,255,0.4)]'
              : 'bg-black/80 text-slate-400 hover:text-white border border-white/5'
          }`}
          title="Share active device screen with system-wide vision"
        >
          <Video className="w-3 h-3 text-[#7f00ff]" />
          <span>{isLiveScreenSharing ? 'Screen Live ●' : 'Live Screen'}</span>
        </button>

        {/* Upload custom phone screenshot button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
            customScreenshot
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-black/80 text-slate-400 hover:text-white border border-white/5'
          }`}
          title="Upload screenshot of any mobile app"
        >
          <Upload className="w-3 h-3 text-[#00f2fe]" />
          <span>{customScreenshot ? 'Image ✓' : 'Upload'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Screen display container */}
      <div className="flex-1 relative overflow-y-auto p-3 flex flex-col justify-between min-h-[200px] bg-[#000000]">
        {customScreenshot ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative max-h-[220px] rounded-xl overflow-hidden border border-[#00f2fe]/40 shadow-[0_0_25px_rgba(0,242,254,0.2)] group">
              <img
                src={customScreenshot}
                alt="Uploaded mobile screen"
                className="max-h-[220px] object-contain rounded-xl"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={onClearCustomScreenshot}
                  className="px-2 py-1 rounded-md bg-black/80 text-slate-200 text-[10px] font-mono hover:bg-black transition backdrop-blur-sm border border-white/10"
                >
                  Clear Screen
                </button>
              </div>
            </div>
            <p className="text-[10px] font-mono text-[#00f2fe] mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Omni Cognition actively parsing uploaded viewport
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Simulated App Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0B0B0C] border border-white/10 flex items-center justify-center text-sm shadow-inner">
                  {currentScenario.appHeader.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">
                      {currentScenario.appHeader.title}
                    </span>
                    {currentScenario.appHeader.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#7f00ff]/20 text-[#c084fc] border border-[#7f00ff]/40">
                        {currentScenario.appHeader.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                    {currentScenario.appHeader.subtitle}
                  </span>
                </div>
              </div>

              {/* Viewport Perception Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/90 border border-[#00f2fe]/40 text-[9px] font-mono text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                <span>Viewport Feed</span>
              </div>
            </div>

            {/* Simulated Messages / Host Viewport Stream */}
            <div className="space-y-2 py-1">
              {currentScenario.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'them' ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${
                      msg.sender === 'them'
                        ? 'bg-[#0B0B0C] text-slate-100 rounded-tl-sm border border-white/10'
                        : 'bg-gradient-to-r from-[#0575e6] to-[#7f00ff] text-white rounded-tr-sm shadow-[0_0_15px_rgba(5,117,230,0.3)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5 px-1 flex items-center gap-1">
                    {msg.isAutoPilot && (
                      <span className="text-[#00f2fe] flex items-center gap-0.5 font-bold">
                        <Zap className="w-2.5 h-2.5" /> AUTO-PILOT •
                      </span>
                    )}
                    <span>{msg.time}</span>
                  </span>
                </div>
              ))}

              {/* Active Volumetric Typing Reflection */}
              {currentDraftText && (
                <div className="flex flex-col items-end pt-1 animate-in fade-in duration-150">
                  <div className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed bg-[#0B0B0C] border border-[#00f2fe]/50 text-slate-100 rounded-tr-sm shadow-[0_0_15px_rgba(0,242,254,0.15)] font-mono">
                    <span>{currentDraftText}</span>
                    <span className="inline-block w-1.5 h-3 ml-1 bg-[#00f2fe] animate-pulse align-middle" />
                  </div>
                  <span className="text-[9px] font-mono text-[#00f2fe]/80 mt-0.5 px-1">
                    Streaming into host input field...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tactical Subtext Footer */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="truncate max-w-[80%] italic">
            Cognition: {currentScenario.contextHint}
          </span>
          <span className="text-[#00f2fe] font-mono text-[9px]">
            {currentDraftText.length} chars
          </span>
        </div>
      </div>
    </div>
  );
};
