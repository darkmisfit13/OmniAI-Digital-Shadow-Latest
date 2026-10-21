import React, { useState } from 'react';
import { 
  Shapes, 
  Sparkles, 
  Download, 
  Layers, 
  Eye, 
  Check, 
  FolderLock, 
  Copy, 
  Wand2,
  Box,
  Palette
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniVectorBrandLab: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [assetType, setAssetType] = useState<'3d_icon' | 'mascot_logo' | 'seamless_pattern' | 'flat_vector' | 'brand_tokens'>('3d_icon');
  const [prompt, setPrompt] = useState('Cyberpunk mechanical skull with neon teal circuit traces and chrome horns.');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [copiedSVG, setCopiedSVG] = useState(false);

  const sampleSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="42" fill="#090d16" stroke="url(#grad)" stroke-width="4" />
  <path d="M30 65 L50 25 L70 65 Z" fill="none" stroke="#06b6d4" stroke-width="3" />
  <circle cx="50" cy="50" r="8" fill="#a855f7" />
</svg>`;

  const handleGenerate = () => {
    setIsSynthesizing(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsSynthesizing(false);
      setOrbPhase('idle');
    }, 1200);
  };

  const handleSaveToVault = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'image',
        title: `Vector Brand - ${assetType}`,
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        tags: ['OmniVector', assetType, 'SVG Ready'],
        details: prompt
      });
      alert('Vector asset saved directly to OMNI VAULT!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Shapes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI VECTOR & BRAND LAB
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                VECTOR & 3D ICONS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Generate 3D app icons, mascot logos, brand token kits & seamless patterns</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToVault}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <FolderLock className="w-3.5 h-3.5" /> Save to Vault
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Canvas Display Viewport */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="w-72 h-72 rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-2xl flex items-center justify-center p-8 relative group">
            <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: sampleSVG }} />
            
            <div className="absolute bottom-3 inset-x-0 mx-auto text-center">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/80 text-emerald-400 border border-emerald-500/30">
                RESOLUTION INDEPENDENT VECTOR
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(sampleSVG);
                setCopiedSVG(true);
                setTimeout(() => setCopiedSVG(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5"
            >
              {copiedSVG ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSVG ? 'SVG Copied' : 'Copy Clean SVG Code'}
            </button>
          </div>
        </div>

        {/* Right Configuration Deck */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            {/* Omni Orb Assistant */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">VECTOR SYNTHESIZER</span>
                <p className="text-xs text-slate-300">"Select branding archetype or generate full 3D app icon kits."</p>
              </div>
            </div>

            {/* Asset Archetype Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Brand Asset Archetype</span>
              <div className="space-y-1">
                {[
                  { id: '3d_icon', label: '3D Volumetric App Icon' },
                  { id: 'mascot_logo', label: 'DarkMisfit Mascot Logo' },
                  { id: 'seamless_pattern', label: 'Seamless Repeat Pattern' },
                  { id: 'flat_vector', label: 'Flat Line Art Vector' },
                  { id: 'brand_tokens', label: 'Full Brand Identity Kit' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAssetType(item.id as any)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      assetType === item.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    ✦ {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">Branding Directives</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isSynthesizing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            {isSynthesizing ? 'Generating Vector Art...' : 'Generate Vector Asset'}
          </button>
        </div>

      </div>
    </div>
  );
};
