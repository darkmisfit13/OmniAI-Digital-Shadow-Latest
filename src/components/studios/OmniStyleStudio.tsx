import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Sliders, 
  Layers, 
  RotateCcw, 
  Check, 
  User, 
  ShieldCheck, 
  Image as ImageIcon,
  FolderLock,
  ArrowRight,
  Split,
  Eye,
  Shirt
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniStyleStudio: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [prompt, setPrompt] = useState('Change clothes to a silver cyberpunk space suit with glowing blue accents and metallic collar.');
  const [beforeImage, setBeforeImage] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80');
  const [afterImage, setAfterImage] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [faceAnchorEnabled, setFaceAnchorEnabled] = useState(true);
  const [backgroundCanvas, setBackgroundCanvas] = useState<'preserve' | 'neon_city' | 'space_station' | 'dark_studio'>('preserve');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isTransforming, setIsTransforming] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const presetWardrobes = [
    'Silver Cyberpunk Space Suit',
    'Tactical Black Streetwear Hoodie',
    'High-Luminance Holographic Jacket',
    'Executive Midnight Tuxedo',
    'Prismatic Neon Racing Leathers',
  ];

  const handleTransform = () => {
    if (!prompt.trim()) return;
    setIsTransforming(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsTransforming(false);
      setOrbPhase('idle');
      setAfterImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
    }, 1400);
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBeforeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToVault = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'image',
        title: `OmniStyle: ${prompt.slice(0, 40)}`,
        thumbnail: afterImage,
        tags: ['OmniStyle', 'Digital Wardrobe', 'Face-Anchored'],
        details: `Transformed outfit to: ${prompt}`
      });
      alert('Transformed outfit saved directly to OMNI VAULT!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 font-black">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNISTYLE DIGITAL WARDROBE & APPEARANCE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                SPLIT-SCREEN WORKFLOW
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Digital wardrobe swap with 100% Face Identity Anchor & before/after comparison</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload Photo
            <input type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
          </label>
          <button
            onClick={handleSaveToVault}
            className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <FolderLock className="w-3.5 h-3.5" /> Save to Vault
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Split-Screen Before & After Viewport */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
          
          <div className="relative w-full max-w-xl aspect-[3/4] rounded-2xl overflow-hidden border border-violet-500/40 shadow-2xl select-none group">
            
            {/* After Image (Background layer) */}
            <img
              src={afterImage}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped layer by slider) */}
            <div
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={beforeImage}
                alt="Before Transformation"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Divider Line */}
            <div
              style={{ left: `${sliderPosition}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-violet-400 pointer-events-none shadow-[0_0_10px_#a855f7]"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center text-slate-950 font-bold text-xs shadow-lg">
                ⇄
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
              BEFORE
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-violet-950/80 backdrop-blur-md text-[10px] font-mono text-violet-300 border border-violet-500/40 font-bold">
              AFTER (OMNISTYLE)
            </div>

            {isTransforming && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-violet-300 font-mono text-xs gap-2">
                <span className="w-3 h-3 rounded-full bg-violet-400 animate-ping" />
                Preserving face anchor & swapping digital fabrics...
              </div>
            )}
          </div>

          {/* Interactive Split Slider Controller */}
          <div className="w-full max-w-xl flex items-center gap-3 mt-3 px-4">
            <span className="text-[11px] font-mono text-slate-400">Before</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
              className="flex-1 accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono text-violet-400">After ({sliderPosition}%)</span>
          </div>
        </div>

        {/* Right Configuration & Omni Orb Assistant */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Omni Orb Assistant */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-violet-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-violet-400 font-bold uppercase block">OMNISTYLE WARDROBE</span>
                <p className="text-xs text-slate-300">"Face geometry anchored. Describe any outfit or textile swap."</p>
              </div>
            </div>

            {/* Prompt Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">Outfit Description</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Change clothes to a silver cyberpunk space suit..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none leading-relaxed"
              />
            </div>

            {/* Preset Digital Wardrobe Badges */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Quick Wardrobe Swap</span>
              <div className="space-y-1">
                {presetWardrobes.map((pw, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(`Change clothes to ${pw.toLowerCase()} with high-contrast nocturnal details.`);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-violet-300 transition-colors truncate"
                  >
                    ✨ {pw}
                  </button>
                ))}
              </div>
            </div>

            {/* Face Identity Anchor Toggle */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Face Identity Anchor</span>
                </div>
                <input
                  type="checkbox"
                  checked={faceAnchorEnabled}
                  onChange={(e) => setFaceAnchorEnabled(e.target.checked)}
                  className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Preserves 100% facial landmarks and authentic eye, nose & jaw structure while modifying attire.
              </p>
            </div>

            {/* Background Canvas Target */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Background Canvas</label>
              <select
                value={backgroundCanvas}
                onChange={(e) => setBackgroundCanvas(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-violet-300 font-mono outline-none"
              >
                <option value="preserve">Preserve Original Background</option>
                <option value="neon_city">Neon Cyberpunk Metropolis</option>
                <option value="space_station">Orbital Space Station Chamber</option>
                <option value="dark_studio">DarkMisfit Nocturnal Studio</option>
              </select>
            </div>

          </div>

          <button
            onClick={handleTransform}
            disabled={isTransforming}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-950/50 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isTransforming ? 'Swapping Wardrobe...' : 'Swap Digital Wardrobe Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
