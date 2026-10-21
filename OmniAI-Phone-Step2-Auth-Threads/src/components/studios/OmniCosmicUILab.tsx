import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Glasses, 
  Upload, 
  Copy, 
  Check, 
  Code2, 
  Layers,
  Sliders,
  Eye,
  Wand2
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniCosmicUILab: React.FC = () => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile' | 'spatial'>('desktop');
  const [primaryColor, setPrimaryColor] = useState('#06b6d4'); // cyan
  const [secondaryColor, setSecondaryColor] = useState('#a855f7'); // purple
  const [aestheticMood, setAestheticMood] = useState<'nocturnal_cyber' | 'glassmorphism' | 'neo_brutalist' | 'minimal_dark'>('nocturnal_cyber');
  const [extractedStyle, setExtractedStyle] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const handleImageExtract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrbPhase('processing');
      setTimeout(() => {
        setExtractedStyle('Extracted Palette: High-Luminance Cyber Cyan (#06b6d4) with Deep Void Purple (#581c87). Gradient angle: 135deg.');
        setPrimaryColor('#06b6d4');
        setSecondaryColor('#9333ea');
        setOrbPhase('idle');
      }, 1000);
    }
  };

  const previewComponentCode = `<div className="relative group p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl backdrop-blur-xl">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur-sm -z-10" />
  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">COSMIC TOKEN</span>
  <h3 className="text-xl font-bold text-white mt-1">Creator Pro Pass</h3>
  <div className="text-3xl font-black font-mono text-cyan-300 my-3">$19.99<span className="text-xs text-slate-400">/mo</span></div>
  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg">
    Activate Pass
  </button>
</div>`;

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI COSMIC UI LAB
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                GENERATIVE COMPONENT CANVAS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Generate production React, Vue & WebGL components across Desktop, Mobile & Spatial AR</p>
          </div>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          {[
            { id: 'desktop', label: 'Desktop', icon: Monitor },
            { id: 'tablet', label: 'Tablet', icon: Tablet },
            { id: 'mobile', label: 'Mobile', icon: Smartphone },
            { id: 'spatial', label: 'Spatial AR', icon: Glasses },
          ].map((vp) => {
            const Icon = vp.icon;
            return (
              <button
                key={vp.id}
                onClick={() => setViewport(vp.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  viewport === vp.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {vp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Component Live Canvas */}
        <div className="flex-1 bg-black/80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          
          <div
            className={`transition-all duration-300 flex items-center justify-center ${
              viewport === 'desktop' ? 'w-full max-w-xl' : viewport === 'tablet' ? 'w-[420px]' : viewport === 'mobile' ? 'w-[320px]' : 'w-[480px] p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl bg-cyan-950/10'
            }`}
          >
            {/* Live Generative Pricing Card */}
            <div className="w-full relative group p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-300 transition-all duration-300 shadow-2xl backdrop-blur-xl">
              <div
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
                className="absolute -inset-0.5 rounded-2xl opacity-30 group-hover:opacity-75 transition duration-500 blur-sm -z-10"
              />

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  COSMIC DESIGN TOKEN
                </span>
                <span className="text-xs font-mono text-purple-400">{aestheticMood}</span>
              </div>

              <h3 className="text-xl font-bold text-white mt-1">Responsive Cyber Pricing Card</h3>
              <p className="text-xs text-slate-400 mt-1">Hover tilt gradient border with reactive token injection</p>

              <div className="text-3xl font-black font-mono text-white my-4 flex items-baseline gap-1">
                $19.99 <span className="text-xs font-normal text-slate-400 font-sans">/ month</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 py-3 border-t border-slate-800">
                <div className="flex items-center gap-2">✓ All 13 Omni AI Creative Studios</div>
                <div className="flex items-center gap-2">✓ Multi-Track CapCut & Suno Engines</div>
                <div className="flex items-center gap-2">✓ Instant React 19 / Tailwind Export</div>
              </div>

              <button
                style={{
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                }}
                className="w-full mt-4 py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all"
              >
                Local Mock Action
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-6 text-xs font-mono text-slate-400">
            Viewport: {viewport.toUpperCase()} • Gradient Angle: 135deg • Tailwind v4 Compatible
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            {/* Omni Orb Assistant */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">COSMIC UI TOKEN ENGINE</span>
                <p className="text-xs text-slate-300">"Tune primary colors, aesthetic mood tokens, or upload image to extract style."</p>
              </div>
            </div>

            {/* Extract Style From Image */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Extract Style From Image
              </span>
              <label className="w-full p-2 rounded-lg bg-black/40 border border-dashed border-slate-800 hover:border-cyan-500/50 text-center block text-xs text-slate-400 cursor-pointer">
                Upload UI Screenshot
                <input type="file" accept="image/*" onChange={handleImageExtract} className="hidden" />
              </label>
              {extractedStyle && (
                <p className="text-[10px] font-mono text-cyan-300">{extractedStyle}</p>
              )}
            </div>

            {/* Aesthetic Mood Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Aesthetic Mood</label>
              <select
                value={aestheticMood}
                onChange={(e) => setAestheticMood(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-cyan-300 font-mono outline-none"
              >
                <option value="nocturnal_cyber">Nocturnal Cyber (Dark Misfit)</option>
                <option value="glassmorphism">Glassmorphism Frosted Void</option>
                <option value="neo_brutalist">Neo-Brutalist Stark Contrast</option>
                <option value="minimal_dark">Minimalist Stealth Black</option>
              </select>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Primary Glow</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-8 rounded bg-transparent cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Secondary Accent</span>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full h-8 rounded bg-transparent cursor-pointer"
                />
              </div>
            </div>

          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(previewComponentCode);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'JSX Copied!' : 'Copy React Component JSX'}
          </button>
        </div>

      </div>
    </div>
  );
};
