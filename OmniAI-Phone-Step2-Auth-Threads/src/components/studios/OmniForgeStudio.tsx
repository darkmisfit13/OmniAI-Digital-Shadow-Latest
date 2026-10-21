import React, { useState } from 'react';
import { 
  Hammer, 
  Sparkles, 
  Layout, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Play, 
  ExternalLink, 
  Code2, 
  FolderLock, 
  Check, 
  RotateCcw,
  Zap,
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniForgeStudio: React.FC = () => {
  const [appIdeaPrompt, setAppIdeaPrompt] = useState('Create a nocturnal cyberpunk landing page for Dark Misfit Studios with 3D product showcase and Stripe billing.');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isBuilt, setIsBuilt] = useState(false);

  const handleStartForge = () => {
    if (!appIdeaPrompt.trim()) return;
    setIsBuilding(true);
    setOrbPhase('processing');
    setBuildProgress(15);

    setTimeout(() => setBuildProgress(40), 1000);
    setTimeout(() => setBuildProgress(75), 2200);
    setTimeout(() => {
      setBuildProgress(100);
      setIsBuilding(false);
      setIsBuilt(true);
      setOrbPhase('idle');
    }, 3200);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black">
            <Hammer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNIFORGE FULL-STACK BUILDER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                LOVABLE WORKFLOW
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Generate, scaffold, and render interactive web apps from natural language</p>
          </div>
        </div>

        {isBuilt && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setActiveViewport('desktop')}
                className={`p-1.5 rounded ${activeViewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveViewport('tablet')}
                className={`p-1.5 rounded ${activeViewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Tablet"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveViewport('mobile')}
                className={`p-1.5 rounded ${activeViewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsBuilt(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Build
            </button>
          </div>
        )}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {!isBuilt ? (
          /* Prompt & Omni Greeting */
          <div className="max-w-2xl mx-auto space-y-6 py-6">
            
            {/* The Iconic Omni Greeting */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-[#0c0f17] border border-indigo-500/40 shadow-2xl">
              <div className="w-28 h-28 mb-3">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <h4 className="text-xl font-black text-white tracking-wide">
                "So, what are we breaking today?"
              </h4>
              <p className="text-xs text-slate-300 text-center max-w-md mt-1 leading-relaxed">
                Omni AI is ready to construct your full-stack web application, architecture, responsive frontend, and endpoints like in Lovable.
              </p>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                What App or Website Do You Want to Build?
              </label>
              <textarea
                rows={4}
                value={appIdeaPrompt}
                onChange={(e) => setAppIdeaPrompt(e.target.value)}
                placeholder="Describe your site, dashboard, store, or portal..."
                className="w-full p-4 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none leading-relaxed"
              />
            </div>

            {/* Progress bar when building */}
            {isBuilding && (
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">Forging Full-Stack Application...</span>
                  <span className="text-white">{buildProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${buildProgress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleStartForge}
              disabled={isBuilding || !appIdeaPrompt.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-blue-600 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-indigo-950/70 uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {isBuilding ? 'Forging App in Lovable Style...' : 'Commence Full-Stack Build in OmniForge'}
            </button>
          </div>
        ) : (
          /* Live Interactive App Preview */
          <div className="h-full flex flex-col space-y-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                  LIVE APP RENDERED
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Dark Misfit Studios Web Application</h4>
              </div>
              <span className="text-xs font-mono text-cyan-400">0 Errors • React 19 + Tailwind v4 + Express</span>
            </div>

            {/* The Rendered Viewport Frame */}
            <div className="flex-1 flex justify-center bg-black/60 rounded-2xl border border-slate-800 p-4 overflow-hidden">
              <div
                className={`h-full bg-[#090b10] rounded-xl border border-indigo-500/30 shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ${
                  activeViewport === 'desktop' ? 'w-full' : activeViewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                }`}
              >
                {/* Browser bar */}
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded bg-black/50 text-[11px] font-mono text-slate-400 truncate border border-slate-800">
                    https://darkmisfitstudios.com/preview
                  </div>
                </div>

                {/* Simulated Built Application Canvas */}
                <div className="p-8 space-y-8 flex-1">
                  
                  {/* Hero */}
                  <div className="text-center space-y-3 max-w-2xl mx-auto py-8">
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest font-bold">
                      THE NEXT GENERATION OF CREATIVE AI
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      Where Shadows Shape The Future
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      Dark Misfit Studios delivers high-voltage music creation, video editing, and cybernetic AI companion tools. Built with zero corporate fluff.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50">
                        Launch OmniAI Free
                      </button>
                      <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                        Explore Studios
                      </button>
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'OmniWave Suno Engine', desc: 'Synthesize full dual-track songs with intelligent lyric expansion.' },
                      { title: 'OmniMotion CapCut Suite', desc: 'Multi-track timeline video editor with kinetic auto-subtitles.' },
                      { title: 'OmniBeat Music Videos', desc: 'Sync protagonist likeness to dynamic beat drops and lighting.' }
                    ].map((card, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span className="text-xs font-mono text-indigo-400 font-bold uppercase">0{idx + 1}</span>
                        <h5 className="text-sm font-bold text-white">{card.title}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
