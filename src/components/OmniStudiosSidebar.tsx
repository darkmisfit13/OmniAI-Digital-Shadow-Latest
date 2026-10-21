import React from 'react';
import { 
  X, 
  Video, 
  Film, 
  Music, 
  Code, 
  Hammer, 
  Wand2, 
  Search, 
  Shirt, 
  Rotate3d, 
  Smartphone, 
  Palette, 
  Database, 
  Workflow, 
  Network, 
  Sparkles,
  ChevronRight,
  Settings,
  FolderLock,
  MessageSquare,
  Bot
} from 'lucide-react';
import { StudioId } from './OmniStudiosView';
import { HoloOrb } from './HoloOrb';

interface OmniStudiosSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudio: StudioId | null;
  onSelectStudio: (id: StudioId) => void;
  onOpenOmniAIChat?: () => void;
  onOpenSettings?: () => void;
  onOpenVault?: () => void;
}

export const OmniStudiosSidebar: React.FC<OmniStudiosSidebarProps> = ({
  isOpen,
  onClose,
  selectedStudio,
  onSelectStudio,
  onOpenOmniAIChat,
  onOpenSettings,
  onOpenVault,
}) => {
  if (!isOpen) return null;

  const studios = [
    { id: 'motion', name: 'OmniMotion', tag: 'CapCut Video Studio', icon: Video, color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
    { id: 'beat', name: 'OmniBeat', tag: 'Freebeat Music Video', icon: Film, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
    { id: 'wave', name: 'OmniWave', tag: 'Suno Song Generator', icon: Music, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    { id: 'code', name: 'OmniCode', tag: 'Cursor / Lovable Code', icon: Code, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
    { id: 'forge', name: 'OmniForge', tag: 'Full-Stack App Builder', icon: Hammer, color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' },
    { id: 'imagine', name: 'OmniImagine', tag: 'Magic Eraser & Photos', icon: Wand2, color: 'text-pink-400 bg-pink-500/20 border-pink-500/30' },
    { id: 'analyzer', name: 'OmniAnalyzer', tag: 'Site & Social Auditor', icon: Search, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
    { id: 'style', name: 'OmniStyle', tag: 'Wardrobe & Aesthetic', icon: Shirt, color: 'text-violet-400 bg-violet-500/20 border-violet-500/30' },
    { id: 'spatial', name: 'Spatial 3D', tag: 'Three.js Spatial Canvas', icon: Rotate3d, color: 'text-teal-400 bg-teal-500/20 border-teal-500/30' },
    { id: 'mockup', name: 'Viral Mockup', tag: 'Social Feed Safe Zones', icon: Smartphone, color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' },
    { id: 'cosmic', name: 'Cosmic UI Lab', tag: 'Generative Components', icon: Palette, color: 'text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/30' },
    { id: 'architect', name: 'OmniArchitect', tag: 'Database & API Schemas', icon: Database, color: 'text-sky-400 bg-sky-500/20 border-sky-500/30' },
    { id: 'automations', name: 'Automations', tag: 'AI Autonomous Agents', icon: Workflow, color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
    { id: 'connect', name: 'OmniConnect', tag: 'App Integrations Catalog', icon: Network, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-start font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Slide-over Drawer from Left */}
      <div className="relative w-80 max-w-[85vw] bg-[#090b14] border-r border-slate-800/80 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-slate-800 bg-[#07090f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
            <h3 className="font-bold text-xs font-mono uppercase tracking-widest text-slate-300">
              Navigation Drawer
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOP PROMINENT BUTTON: OmniAI - Your Digital Shadow */}
        <div className="p-3 border-b border-slate-800/80 bg-gradient-to-b from-[#0c0f1c] to-[#090b14]">
          <button
            onClick={() => {
              onOpenOmniAIChat?.();
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#0e1726] to-purple-950/80 border border-cyan-500/50 hover:border-cyan-400 text-left transition-all shadow-[0_0_20px_rgba(0,242,254,0.15)] group relative overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-black border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-inner">
                <HoloOrb phase="idle" size="xs" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    OmniAI
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 tracking-wide font-sans mt-0.5">
                  Your Digital Shadow
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </button>
        </div>

        {/* Studios Section Header */}
        <div className="px-3 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 font-bold">
          <span>CREATIVE STUDIOS ({studios.length})</span>
          <span className="text-[9px] text-cyan-400/80 lowercase">spur-of-moment ready</span>
        </div>

        {/* Studios List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5 no-scrollbar">
          {studios.map((st) => {
            const Icon = st.icon;
            const isSelected = selectedStudio === st.id;

            return (
              <button
                key={st.id}
                onClick={() => {
                  onSelectStudio(st.id as StudioId);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg border flex-shrink-0 ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{st.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{st.tag}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* BOTTOM SECTION: SETTINGS BLOCK & GLOBAL VAULT */}
        <div className="p-3 border-t border-slate-800 bg-[#07090f] space-y-2">
          {/* Settings block/button moved from upper right corner */}
          <button
            onClick={() => {
              onClose();
              onOpenSettings?.();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-between transition-all group active:scale-[0.98] shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 group-hover:text-cyan-300">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-xs">Settings & Admin</span>
                <span className="text-[9.5px] text-slate-400 block font-normal">
                  Preferences, Workspace, PC Sync, Admin & Billing
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          {/* Vault Quick Access */}
          {onOpenVault && (
            <button
              onClick={() => {
                onClose();
                onOpenVault();
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-950/20 border border-purple-800/30 hover:border-purple-500/50 text-purple-300 text-xs font-medium flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <FolderLock className="w-3.5 h-3.5 text-purple-400" />
                <span>Global Vault Media Library</span>
              </div>
              <span className="text-[9px] font-mono text-purple-400/80">Shared</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
