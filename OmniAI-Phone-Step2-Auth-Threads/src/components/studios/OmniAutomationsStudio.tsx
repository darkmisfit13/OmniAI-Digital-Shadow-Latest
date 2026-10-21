import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Play, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Workflow, 
  Bell, 
  Share2, 
  FileCode,
  FolderLock
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

interface AutomationRecipe {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  status: 'active' | 'idle' | 'triggered';
  lastRun: string;
}

export const OmniAutomationsStudio: React.FC = () => {
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [recipes, setRecipes] = useState<AutomationRecipe[]>([
    {
      id: 'rec_1',
      name: 'OmniBeat Viral Cross-Post Pipeline',
      trigger: 'When new music video is exported in OmniBeat',
      action: 'Automatically format into 9:16 Viral Mockup & push to Social Vault',
      enabled: true,
      status: 'active',
      lastRun: '12 mins ago'
    },
    {
      id: 'rec_2',
      name: 'OmniWave Lyric Archiver',
      trigger: 'When a new song is generated in OmniWave',
      action: 'Extract lyrics, generate album art tokens & sync to Firebase',
      enabled: true,
      status: 'active',
      lastRun: '1 hour ago'
    },
    {
      id: 'rec_3',
      name: 'Lead Capture Keyboard Auto-Triage',
      trigger: 'When keyboard captures customer inquiry on WhatsApp',
      action: 'Run through Council Mode and draft high-conversion direct response',
      enabled: true,
      status: 'active',
      lastRun: '2 hours ago'
    },
    {
      id: 'rec_4',
      name: 'Stale Branch Code Cleanup',
      trigger: 'Every Sunday at midnight (Cron 0 0 * * 0)',
      action: 'Run OmniCode AST test suite and optimize cache memory allocations',
      enabled: false,
      status: 'idle',
      lastRun: '4 days ago'
    }
  ]);

  const [newTrigger, setNewTrigger] = useState('When new video generated');
  const [newAction, setNewAction] = useState('Push to Viral Mockup & notify Slack');
  const [isCreating, setIsCreating] = useState(false);

  const handleToggle = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled, status: !r.enabled ? 'active' : 'idle' } : r))
    );
  };

  const handleTestTrigger = (id: string) => {
    setOrbPhase('processing');
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'triggered', lastRun: 'Just now' } : r))
    );

    setTimeout(() => {
      setOrbPhase('idle');
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'active' } : r))
      );
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI AUTOMATIONS
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                AUTONOMOUS AI AGENTS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Trigger-and-action node automation workflows linking all studios together</p>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        
        {/* Banner with Omni Orb */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-[#0c0f17] border border-amber-500/30 shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <HoloOrb phase={orbPhase} className="w-full h-full" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest block">
              AUTONOMOUS STUDIO PIPELINES
            </span>
            <h4 className="text-base font-bold text-white">Cross-Studio Orchestration Matrix</h4>
            <p className="text-xs text-slate-300 mt-1">
              Have Omni automatically pass songs generated in OmniWave into OmniBeat music videos, then directly guard them through Omni Viral Mockup and archive in the Vault.
            </p>
          </div>
        </div>

        {/* Existing Automation Recipes */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Configured Recipes:</span>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                recipe.enabled
                  ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{recipe.name}</h4>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    recipe.status === 'triggered'
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : recipe.enabled
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {recipe.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono">
                  <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ⚡ {recipe.trigger}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 hidden sm:block" />
                  <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    ➜ {recipe.action}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono block">Last triggered: {recipe.lastRun}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleTestTrigger(recipe.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" /> Test Run
                </button>
                <button
                  onClick={() => handleToggle(recipe.id)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    recipe.enabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      recipe.enabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
