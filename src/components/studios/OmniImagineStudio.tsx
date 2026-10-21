import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Wand2, 
  Scissors, 
  Eraser, 
  Layers, 
  Sliders, 
  Download, 
  RotateCcw, 
  Eye, 
  Check, 
  Brush, 
  FolderLock, 
  Zap, 
  Sun, 
  Contrast, 
  Maximize2
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniImagineStudio: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [prompt, setPrompt] = useState('Cyberpunk neon warrior overlooking dark skyscraper, cinematic volumetric lighting, 8k.');
  const [imageSrc, setImageSrc] = useState<string>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&q=80');
  const [activeTool, setActiveTool] = useState<'generate' | 'watermark' | 'bg_remove' | 'magic_eraser' | 'enhance' | 'relight'>('generate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [brushSize, setBrushSize] = useState(25);
  const [isBrushing, setIsBrushing] = useState(false);
  const [hasErasedItem, setHasErasedItem] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolAction = (tool: 'watermark' | 'bg_remove' | 'magic_eraser' | 'enhance' | 'relight') => {
    setActiveTool(tool);
    setIsProcessing(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsProcessing(false);
      setOrbPhase('idle');
      if (tool === 'magic_eraser') {
        setHasErasedItem(true);
      }
    }, 1200);
  };

  const handleGenerateNew = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsProcessing(false);
      setOrbPhase('idle');
      setImageSrc('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80');
    }, 1600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToVault = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'image',
        title: `OmniImagine Edit - ${activeTool}`,
        thumbnail: imageSrc,
        tags: ['OmniImagine', activeTool, 'Photoshop Grade'],
        details: `Edited with OmniImagine AI: ${prompt.slice(0, 60)}`
      });
      alert('Image saved directly to OMNI VAULT!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 font-black">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI IMAGINE PHOTO & ART STUDIO
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                PHOTOSHOP & PHOTOS WORKFLOW
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Image generation, magic brush eraser, background removal & watermark purge</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Photo
          </button>
          <button
            onClick={handleSaveToVault}
            className="px-3.5 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <FolderLock className="w-3.5 h-3.5" /> Save to Vault
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Image Canvas Viewport */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
          
          <div className="relative max-w-2xl max-h-[75vh] rounded-2xl overflow-hidden border border-pink-500/30 shadow-2xl shadow-pink-950/40 group">
            <img
              src={imageSrc}
              alt="Canvas"
              className="w-full h-full object-contain select-none"
            />

            {/* Magic Brush Simulation Area */}
            {activeTool === 'magic_eraser' && !hasErasedItem && (
              <div className="absolute inset-0 bg-pink-500/10 cursor-crosshair flex items-center justify-center">
                <div className="p-3 rounded-xl bg-black/80 backdrop-blur-md border border-pink-500/40 text-center space-y-1">
                  <span className="text-xs font-bold text-pink-300 font-mono flex items-center gap-1.5 justify-center">
                    <Brush className="w-3.5 h-3.5" /> Google Photos Magic Eraser Mode
                  </span>
                  <p className="text-[11px] text-slate-400">Click or circle any object/person to highlight and delete seamlessly</p>
                  <button
                    onClick={() => handleToolAction('magic_eraser')}
                    className="mt-2 px-3 py-1 rounded bg-pink-500 text-slate-950 text-xs font-bold font-mono"
                  >
                    Erase Highlighted Area Now
                  </button>
                </div>
              </div>
            )}

            {hasErasedItem && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Check className="w-3 h-3" /> Magic Eraser In-Painted Successfully
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-pink-400 font-mono text-xs gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-400 animate-ping" />
                Omni AI Processing Image Transformation...
              </div>
            )}
          </div>

          {/* Active Tool Status Sub-bar */}
          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>TOOL: <strong className="text-pink-400 uppercase">{activeTool.replace('_', ' ')}</strong></span>
            {activeTool === 'magic_eraser' && (
              <div className="flex items-center gap-2">
                <span>Brush Size:</span>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                  className="w-24 accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-pink-400">{brushSize}px</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Tool Belt & Omni Orb Assistant */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Omni Orb Assistant */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-pink-400 font-bold uppercase block">OMNI IMAGINE CORE</span>
                <p className="text-xs text-slate-300">"Select any photo editing tool or command me to re-render in 8K."</p>
              </div>
            </div>

            {/* Prompt Generator Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">Image Prompt / Directives</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe image generation or edit..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none leading-relaxed"
              />
              <button
                onClick={handleGenerateNew}
                disabled={isProcessing}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate / Re-Imagine
              </button>
            </div>

            {/* The Full Photo Editing Tool Belt */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                Advanced Editing Tools
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'watermark', label: 'Purge Watermark', icon: Scissors, desc: 'Clean logos' },
                  { id: 'bg_remove', label: 'Remove BG', icon: Scissors, desc: 'Instant alpha mask' },
                  { id: 'magic_eraser', label: 'Magic Eraser', icon: Eraser, desc: 'Circle & delete' },
                  { id: 'enhance', label: '4K Upscale', icon: Wand2, desc: 'Sharpness & details' },
                  { id: 'relight', label: 'Nocturnal Relight', icon: Sun, desc: 'Volumetric cyan/rose' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = activeTool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleToolAction(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1 text-pink-400" />
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[9px] text-slate-400 truncate">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setImageSrc('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&q=80');
              setHasErasedItem(false);
            }}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Revert to Original Photo
          </button>
        </div>

      </div>
    </div>
  );
};
