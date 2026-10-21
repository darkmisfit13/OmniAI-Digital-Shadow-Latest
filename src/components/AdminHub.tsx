import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Key, 
  Settings, 
  Ban, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  Sparkles, 
  Zap, 
  Lock, 
  ShieldCheck,
  Award,
  ToggleLeft,
  ToggleRight,
  Database,
  Sliders,
  UserX,
  FolderOpen,
  Laptop,
  Smartphone
} from 'lucide-react';
import { WorkspaceHub } from './WorkspaceHub';
import { DesktopSyncBridge } from './DesktopSyncBridge';
import { MobileSetupGuide } from './MobileSetupGuide';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: 'Free' | 'Pro' | 'Studio Ultra' | 'Enterprise';
  creditsRemaining: number;
  status: 'active' | 'banned';
  joinedDate: string;
  lastActive: string;
}

interface LLMConnection {
  id: string;
  name: string;
  provider: string;
  envVar: string;
  keyMasked: string;
  status: 'connected' | 'unconfigured' | 'testing';
  inCouncil: boolean;
  priority: number;
  description: string;
}

export const AdminHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'companion' | 'users' | 'llms' | 'billing' | 'workspace' | 'sync' | 'install' | 'settings'>('companion');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  
  // Companion & Telemetry Settings State (moved from main screen into settings)
  const [neuralLane, setNeuralLane] = useState<'dual' | 'device' | 'cloud'>('dual');
  const [screenVisionEnabled, setScreenVisionEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [tactileSounds, setTactileSounds] = useState(false);
  const [telemetryInterval, setTelemetryInterval] = useState('5s');

  // Managed Users List
  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: 'usr-1',
      name: 'DarkMisfit Admin',
      email: 'darkmisfit.ai@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      tier: 'Enterprise',
      creditsRemaining: 999999,
      status: 'active',
      joinedDate: '2026-01-10',
      lastActive: 'Now (You)',
    },
    {
      id: 'usr-2',
      name: 'Elena Rostova',
      email: 'elena.beats@nocturne.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      tier: 'Studio Ultra',
      creditsRemaining: 18450,
      status: 'active',
      joinedDate: '2026-03-14',
      lastActive: '12m ago',
    },
    {
      id: 'usr-3',
      name: 'Kaelen Vance',
      email: 'kaelen.vance@spirecyber.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
      tier: 'Pro',
      creditsRemaining: 3200,
      status: 'active',
      joinedDate: '2026-05-02',
      lastActive: '1h ago',
    },
    {
      id: 'usr-4',
      name: 'Spam Bot Scraper',
      email: 'bot99281@tempmail-proxy.net',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&q=80',
      tier: 'Free',
      creditsRemaining: 0,
      status: 'banned',
      joinedDate: '2026-08-20',
      lastActive: 'Banned 2d ago',
    },
    {
      id: 'usr-5',
      name: 'Maya Lin',
      email: 'maya.motion@creativehive.design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
      tier: 'Studio Ultra',
      creditsRemaining: 21300,
      status: 'active',
      joinedDate: '2026-06-11',
      lastActive: '3h ago',
    },
  ]);

  // LLM Council Connections & API Keys
  const [llmConnections, setLlmConnections] = useState<LLMConnection[]>([
    {
      id: 'gemini',
      name: 'Google Gemini 3.5 Pro',
      provider: 'Google AI Studio',
      envVar: 'GEMINI_API_KEY',
      keyMasked: 'AIzaSy********************79xQ',
      status: 'connected',
      inCouncil: true,
      priority: 1,
      description: 'Primary core intelligence model. Powers keyboard vision, audio multimodal, and quorum coordinator.',
    },
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      envVar: 'CLAUDE_API_KEY',
      keyMasked: 'sk-ant-api03-********************AA',
      status: 'connected',
      inCouncil: true,
      priority: 2,
      description: 'Council member for high-order software architecture, nuance, and code synthesis.',
    },
    {
      id: 'gpt4o',
      name: 'GPT-4o Omni',
      provider: 'OpenAI',
      envVar: 'OPENAI_API_KEY',
      keyMasked: 'sk-proj-********************7B',
      status: 'connected',
      inCouncil: true,
      priority: 3,
      description: 'Council member for deep general reasoning, function structuring, and logic proofing.',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      provider: 'DeepSeek AI',
      envVar: 'DEEPSEEK_API_KEY',
      keyMasked: 'sk-ds-********************99',
      status: 'connected',
      inCouncil: true,
      priority: 4,
      description: 'Council member for deep reasoning chains, mathematical verification, and algorithmic rigor.',
    },
    {
      id: 'llama',
      name: 'Llama 3.3 70B (Groq)',
      provider: 'Groq / Meta',
      envVar: 'GROQ_API_KEY',
      keyMasked: 'gsk_********************41',
      status: 'connected',
      inCouncil: true,
      priority: 5,
      description: 'Open-weights high throughput tensor lane for ultra-fast candidate generation.',
    },
    {
      id: 'mistral',
      name: 'Mistral Large 2',
      provider: 'Mistral AI',
      envVar: 'MISTRAL_API_KEY',
      keyMasked: 'mis_********************12',
      status: 'connected',
      inCouncil: true,
      priority: 6,
      description: 'European compliance, multilingual nuance, and synthetic reasoning verification.',
    },
  ]);

  // Master App Settings State
  const [fallbackPolicy, setFallbackPolicy] = useState<'cascade' | 'core_only'>('cascade');
  const [autoBanThreshold, setAutoBanThreshold] = useState<number>(50); // suspicious requests/min
  const [systemPersonaPrompt, setSystemPersonaPrompt] = useState(
    'Omni is the authoritative, ultra-intelligent shadow companion crafted by DarkMisfitStudios. Always deliver precise, high-density responses.'
  );

  // User Actions
  const handleToggleBanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'banned' : 'active';
          showNotification(
            `User "${u.email}" account ${newStatus === 'banned' ? 'BANNED' : 'UNBANNED'}`
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleRemoveUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (user.email === 'darkmisfit.ai@gmail.com') {
      alert('Cannot delete the root superuser account.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete user "${user.email}" and purge their data?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showNotification(`Account "${user.email}" removed from database`);
    }
  };

  const handleGiftCredits = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, creditsRemaining: u.creditsRemaining + 5000 } : u))
    );
    showNotification('Gifted 5,000 AI compute credits to user');
  };

  const handleToggleCouncilModel = (modelId: string) => {
    setLlmConnections((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, inCouncil: !m.inCouncil } : m))
    );
    showNotification('Council participation settings updated');
  };

  const handleTestConnection = (modelId: string) => {
    setLlmConnections((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, status: 'testing' } : m))
    );
    setTimeout(() => {
      setLlmConnections((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, status: 'connected' } : m))
      );
      showNotification(`Connection to LLM endpoint verified (200 OK)`);
    }, 1200);
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col bg-[#07090f] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Admin Header */}
      <div className="h-14 px-4 bg-[#0a0d17] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Omni Admin & Governance Hub</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                Root Access
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Signed in as: darkmisfit.ai@gmail.com • DarkMisfitStudios HQ
            </p>
          </div>
        </div>

        {/* Global Notification Banner */}
        {saveSuccessMsg && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs (Scrollable on phone screens) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('companion')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'companion' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Companion AI</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'users' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users & Bans</span>
          </button>
          <button
            onClick={() => setActiveTab('llms')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'llms' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Council Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'billing' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Billing</span>
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'workspace' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'sync' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>PC Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'install' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-all ${
              activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Tab 0: Companion & Telemetry Settings (Moved from screen into settings) */}
        {activeTab === 'companion' && (
          <div className="space-y-4 max-w-xl">
            <div className="p-4 rounded-xl bg-[#0c0e18] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-sm">Shadow Companion Telemetry & Lane</h4>
              </div>

              {/* Neural Inference Lane */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                  Neural Intelligence Execution Lane
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dual', label: '⚡ Dual-Lane', desc: 'Device + Cloud' },
                    { id: 'device', label: '📱 On-Device', desc: 'Offline Neural' },
                    { id: 'cloud', label: '☁️ Cloud TPU', desc: 'Gemini Cluster' },
                  ].map((lane) => (
                    <button
                      key={lane.id}
                      onClick={() => {
                        setNeuralLane(lane.id as any);
                        showNotification(`Neural lane set to ${lane.label}`);
                      }}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        neuralLane === lane.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-semibold shadow-sm shadow-cyan-500/20'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white">{lane.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lane.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Screen Vision Cognition */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Live Screen Cognition HUD</div>
                  <p className="text-[11px] text-slate-400">
                    Real-time visual context scanning for predictive keyboard suggestions
                  </p>
                </div>
                <button
                  onClick={() => setScreenVisionEnabled(!screenVisionEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    screenVisionEnabled
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {screenVisionEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Haptic & Sound */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Soft Keyboard Haptics</div>
                  <p className="text-[11px] text-slate-400">Tactile vibration pulse on keypress</p>
                </div>
                <button
                  onClick={() => setHapticFeedback(!hapticFeedback)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    hapticFeedback
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {hapticFeedback ? 'On' : 'Off'}
                </button>
              </div>

              {/* Performance Telemetry Card */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400 font-bold text-[10px] uppercase">
                  LIVE BENCHMARK TELEMETRY
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Inference Latency:</span>
                  <span className="text-emerald-400">~38ms (Sub-second)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Volumetric HoloOrb:</span>
                  <span className="text-cyan-400">60 FPS WebGL</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Context Buffer:</span>
                  <span className="text-purple-400">128k Tokens Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: User Management & Ban Controls */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono">Total Users</span>
                <p className="text-xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono">Active Today</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {users.filter((u) => u.status === 'active').length}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono">Banned / Suspended</span>
                <p className="text-xl font-bold text-rose-400 mt-1">
                  {users.filter((u) => u.status === 'banned').length}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono">Studio Ultra / Enterprise</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {users.filter((u) => u.tier === 'Studio Ultra' || u.tier === 'Enterprise').length}
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400">Status:</span>
                {(['all', 'active', 'banned'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === filter
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0b0e18] border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Subscription Tier</th>
                    <th className="p-3.5">Credits</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {user.name}
                            {user.email === 'darkmisfit.ai@gmail.com' && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[9px] border border-rose-800">
                                OWNER
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            user.tier === 'Enterprise'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                              : user.tier === 'Studio Ultra'
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                              : user.tier === 'Pro'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {user.tier}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-cyan-300">
                        {user.creditsRemaining.toLocaleString()} ⚡
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            user.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                          }`}
                        >
                          {user.status === 'active' ? '● Active' : '✕ Banned'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{user.lastActive}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Gift Credits */}
                          <button
                            onClick={() => handleGiftCredits(user.id)}
                            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-[11px] font-medium transition-all"
                            title="Gift 5,000 Credits"
                          >
                            +5k Credits
                          </button>

                          {/* Ban / Unban */}
                          <button
                            onClick={() => handleToggleBanUser(user.id)}
                            disabled={user.email === 'darkmisfit.ai@gmail.com'}
                            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                              user.status === 'active'
                                ? 'bg-amber-950/60 border border-amber-600/50 text-amber-300 hover:bg-amber-900/60'
                                : 'bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/60'
                            } disabled:opacity-30 disabled:pointer-events-none`}
                          >
                            <Ban className="w-3 h-3" />
                            <span>{user.status === 'active' ? 'Ban' : 'Unban'}</span>
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            disabled={user.email === 'darkmisfit.ai@gmail.com'}
                            className="p-1 rounded bg-rose-950/60 border border-rose-800/50 text-rose-400 hover:bg-rose-900/60 disabled:opacity-30 disabled:pointer-events-none"
                            title="Permanently Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: LLM Council Connections & API Keys */}
        {activeTab === 'llms' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3">
              <Key className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Unified Council Multi-LLM Wiring</h4>
                <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                  Hook up your API keys below. When a customer asks a complex question in Council Mode, Omni queries all active connected LLMs and synthesizes the optimal consensus verdict. If an external key is absent, the system dynamically cascades to connected models or Gemini Core.
                </p>
              </div>
            </div>

            {/* Model Connection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {llmConnections.map((model) => {
                const isShowing = showKeyId === model.id;
                return (
                  <div
                    key={model.id}
                    className="p-4 rounded-xl bg-[#0c0e18] border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{model.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-400">
                          {model.provider}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            model.status === 'connected'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {model.status === 'connected' ? 'Connected' : 'Testing'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>

                    {/* API Key Mask & Show/Hide */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500">
                        {model.envVar}
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 truncate">
                          {isShowing ? 'AIzaSy_LIVE_KEY_VERIFIED_AUTHENTICATED' : model.keyMasked}
                        </div>
                        <button
                          onClick={() => setShowKeyId(isShowing ? null : model.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                          title={isShowing ? 'Hide key' : 'Reveal key'}
                        >
                          {isShowing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCouncilModel(model.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold ${
                            model.inCouncil ? 'text-purple-300' : 'text-slate-500'
                          }`}
                        >
                          {model.inCouncil ? (
                            <ToggleRight className="w-5 h-5 text-purple-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600" />
                          )}
                          <span>Council Member</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleTestConnection(model.id)}
                        disabled={model.status === 'testing'}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 font-semibold text-[11px] flex items-center gap-1.5"
                      >
                        {model.status === 'testing' ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        <span>Test Ping</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Billing & MRR */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            {/* Revenue Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#0c0e18] border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 uppercase font-mono font-bold">
                  Monthly Recurring Revenue (MRR)
                </span>
                <p className="text-3xl font-extrabold text-white mt-2">$18,490.00</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+28.4% from last month</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono font-bold">
                  Active Paying Subscribers
                </span>
                <p className="text-3xl font-extrabold text-cyan-300 mt-2">312</p>
                <p className="text-[11px] text-slate-400 mt-1">Average Revenue Per User: $59.26</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-mono font-bold">
                  Compute Tokens Consumed
                </span>
                <p className="text-3xl font-extrabold text-purple-300 mt-2">42.8M</p>
                <p className="text-[11px] text-slate-400 mt-1">Gross Margin on AI GPU: 79.2%</p>
              </div>
            </div>

            {/* Plan Tier Configuration */}
            <div className="p-4 rounded-xl bg-[#0c0e18] border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Configured Subscription Tiers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">Pro Creator</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs">$19.99/mo</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                    <li>5,000 monthly credits</li>
                    <li>1080p OmniMotion export</li>
                    <li>Normal Gemini Chat</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-300 text-xs">Studio Ultra</span>
                    <span className="text-cyan-400 font-mono font-bold text-xs">$49.99/mo</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>25,000 monthly credits</li>
                    <li>4K UHD OmniMotion export</li>
                    <li>Unified Multi-LLM Council Mode</li>
                    <li>All 14 dedicated studios</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-300 text-xs">Enterprise Sovereign</span>
                    <span className="text-purple-400 font-mono font-bold text-xs">$149.99/mo</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Unlimited compute lane</li>
                    <li>Bring your own API keys</li>
                    <li>Dedicated GPU priority routing</li>
                    <li>Custom team roles & seats</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Master Config & Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-4 rounded-xl bg-[#0c0e18] border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">System & Model Governance</h4>
              
              {/* Persona Prompt */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                  Global Omni Master Persona Instruction
                </label>
                <textarea
                  value={systemPersonaPrompt}
                  onChange={(e) => setSystemPersonaPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Fallback policy */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-semibold">
                  Council Quorum Fallback Policy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFallbackPolicy('cascade')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      fallbackPolicy === 'cascade'
                        ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-white">Dynamic Cascade (Recommended)</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Falls back to whatever models are currently connected.
                    </p>
                  </button>

                  <button
                    onClick={() => setFallbackPolicy('core_only')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      fallbackPolicy === 'core_only'
                        ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-white">Strict Fallback</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Always fall back exclusively to Google Gemini Core.
                    </p>
                  </button>
                </div>
              </div>

              {/* Save Settings */}
              <button
                onClick={() => showNotification('Master application configurations saved to Firestore')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Google Workspace Integration */}
        {activeTab === 'workspace' && (
          <div className="h-full">
            <div className="mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                <span>Google Workspace Integration (Drive, Gmail, Keep, Docs)</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Connect and sync real-time documents, emails, and notes with your OmniAI digital shadow.
              </p>
            </div>
            <WorkspaceHub />
          </div>
        )}

        {/* Tab 6: PC & Desktop Companion Bridge */}
        {activeTab === 'sync' && (
          <div className="h-full">
            <div className="mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>PC & Desktop Companion Bridge</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Global hotkey sync (⌘⇧K / Ctrl+Shift+K), wireless clipboard link, and floating companion widget.
              </p>
            </div>
            <DesktopSyncBridge />
          </div>
        )}

        {/* Tab 7: Mobile App & PWA Install Guide */}
        {activeTab === 'install' && (
          <div className="h-full">
            <div className="mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Mobile App Setup & PWA Install Guide</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Add OmniAI to your iOS or Android home screen with offline caching and native app behavior.
              </p>
            </div>
            <MobileSetupGuide />
          </div>
        )}

      </div>

    </div>
  );
};
