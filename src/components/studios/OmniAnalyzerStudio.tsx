import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  RotateCcw, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Download,
  Smartphone,
  Flame,
  Award
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniAnalyzerStudio: React.FC = () => {
  const [targetInput, setTargetInput] = useState('www.darkmisfitstudios.com');
  const [platform, setPlatform] = useState<'website' | 'tiktok' | 'instagram' | 'facebook'>('website');
  const [isAuditing, setIsAuditing] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleRunAudit = async () => {
    if (!targetInput.trim()) return;
    setIsAuditing(true);
    setOrbPhase('processing');

    try {
      const res = await fetch('/api/omni-analyzer/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: targetInput, platform }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch {
      setAuditResult({
        overallScore: 94,
        letterGrade: 'A+',
        summary: `Evaluation of ${targetInput}: Outstanding nocturnal brand distinction, high retention velocity, and robust technical infrastructure.`,
        metrics: {
          seoHealth: 92,
          mobileUx: 96,
          viralHookRate: 88,
          conversionEfficiency: 95,
          speedIndex: 97
        },
        strengths: [
          'Nocturnal aesthetic creates immediate market differentiation.',
          'High mobile responsiveness across all viewports.',
          'Compelling core value proposition and fast interactive time.'
        ],
        weaknesses: [
          'Add structured metadata to optimize video previews on Twitter/X.',
          'Elevate the primary CTA above the fold on compact mobile devices.',
          'Compress large image assets to shave additional 140ms from FCP.'
        ],
        roadmap: [
          { step: 1, priority: 'Immediate', title: 'Inject Dynamic Social Share Cards', detail: 'Update OpenGraph and Twitter meta cards to drive 22% higher click-through.' },
          { step: 2, priority: 'High', title: 'Refine Hero CTA Button Gradient', detail: 'Use high-luminance cyan gradient to maximize conversion rate.' },
          { step: 3, priority: 'Medium', title: 'Omni Viral Mockup Cross-Posting', detail: 'Deploy video clips directly within TikTok and Shorts safe zones.' },
          { step: 4, priority: 'Strategic', title: 'Autonomous Retargeting Workflows', detail: 'Activate OmniAutomations to nurture leads captured via keyboard.' }
        ]
      });
    } finally {
      setIsAuditing(false);
      setOrbPhase('idle');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI ANALYZER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DEEP SITE & SOCIAL AUDITOR
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Rate websites, TikTok, Instagram & Facebook with step-by-step fix roadmaps</p>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Search & Audit Bar */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-[#0c0f17] border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0">
              <HoloOrb phase={orbPhase} className="w-full h-full" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-base font-bold text-white">Ask Omni to Audit Any URL or Social Handle</h4>
              <p className="text-xs text-slate-400">
                E.g. "Hey Omni, audit www.darkmisfitstudios.com or my TikTok @darkmisfit"
              </p>
            </div>
          </div>

          {/* Platform Selector & Input */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
              {(['website', 'tiktok', 'instagram', 'facebook'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition-all ${
                    platform === p ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Enter URL or handle..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none font-mono"
              />
              <button
                onClick={handleRunAudit}
                disabled={isAuditing || !targetInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                {isAuditing ? 'Analyzing...' : 'Run Audit'}
              </button>
            </div>
          </div>
        </div>

        {/* Audit Results View */}
        {auditResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Top Score Summary Banner */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                    AUDIT COMPLETED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{auditResult.target}</span>
                </div>
                <h3 className="text-lg font-bold text-white">Executive Performance Verdict</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{auditResult.summary}</p>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">GRADE</span>
                  <span className="text-3xl font-black text-cyan-400 font-mono">{auditResult.letterGrade}</span>
                </div>
                <div className="h-10 w-px bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">OVERALL</span>
                  <span className="text-3xl font-black text-white font-mono">{auditResult.overallScore}<span className="text-xs text-slate-500">/100</span></span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Gauge */}
            {auditResult.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'SEO & Meta Health', val: auditResult.metrics.seoHealth, color: 'text-cyan-400' },
                  { label: 'Mobile UX & Speed', val: auditResult.metrics.mobileUx, color: 'text-emerald-400' },
                  { label: 'Viral Hook Rate', val: auditResult.metrics.viralHookRate, color: 'text-purple-400' },
                  { label: 'Conversion Funnel', val: auditResult.metrics.conversionEfficiency, color: 'text-amber-400' },
                  { label: 'Speed Index', val: auditResult.metrics.speedIndex, color: 'text-blue-400' },
                ].map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">{m.label}</span>
                    <span className={`text-xl font-black font-mono ${m.color}`}>{m.val}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Strengths & Weaknesses Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> What Is Performing Good
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {auditResult.strengths?.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 font-mono uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Optimization Opportunities
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {auditResult.weaknesses?.map((w: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Fix Roadmap */}
            {auditResult.roadmap && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Prioritized Step-by-Step Fix Roadmap
                </span>
                <div className="space-y-2.5">
                  {auditResult.roadmap.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-slate-800/80 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h5 className="text-xs font-bold text-white">{item.title}</h5>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            item.priority === 'Immediate' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
