import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  FolderLock, 
  Share2, 
  Sparkles, 
  Eye, 
  RotateCcw, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Music2, 
  Check, 
  Download,
  AlertTriangle,
  Layers,
  Flame
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniViralMockupStudio: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [platform, setPlatform] = useState<'tiktok' | 'reels' | 'shorts' | 'spotify' | 'appstore'>('tiktok');
  const [creatorHandle, setCreatorHandle] = useState('@darkmisfit');
  const [caption, setCaption] = useState('When the beat drops in OmniBeat ⚡ No one makes music like this. Link in bio.');
  const [audioTrackLabel, setAudioTrackLabel] = useState('DarkMisfit Protocol Anthem - Original Sound');
  const [hashtags, setHashtags] = useState('#OmniAI #Cyberpunk #DarkMisfit #NewMusic #AITools');
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [mockupImage, setMockupImage] = useState('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80');
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const handlePushToVault = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'motion',
        title: `Viral Mockup (${platform.toUpperCase()}) - ${creatorHandle}`,
        thumbnail: mockupImage,
        tags: ['ViralMockup', platform, 'SafeZone Guarded'],
        details: `${caption} | ${hashtags}`
      });
      alert('Mockup pushed directly to OMNI VAULT!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 font-black">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI VIRAL MOCKUP & SAFE ZONE GUARD
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                ZERO-BLOCKING GUARANTEE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Preview TikTok, Reels, Shorts & Spotify Canvas. Red grid shows where UI overlays cover your text.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Safe Zone Toggle */}
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              showSafeZones
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {showSafeZones ? 'Safe Zones: ON' : 'Safe Zones: OFF'}
          </button>

          <button
            onClick={handlePushToVault}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <FolderLock className="w-3.5 h-3.5" />
            Push to Vault
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Center: Live Phone Viewport Simulator */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
          
          {/* Phone Frame */}
          <div className="relative h-[90%] aspect-[9/19.5] rounded-[42px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col select-none">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 inset-x-0 mx-auto w-24 h-5 bg-black rounded-full z-30" />

            {/* Background Media */}
            <img
              src={mockupImage}
              alt="Social Media Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* SAFE ZONE OVERLAY RED GRID */}
            {showSafeZones && (
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between">
                
                {/* Top UI Region (12% Profile & Tiles) */}
                <div className="h-[12%] bg-red-500/25 border-b-2 border-red-500 border-dashed flex items-center justify-center p-1 text-center">
                  <span className="text-[9px] font-mono font-black text-white bg-red-600/90 px-1.5 py-0.5 rounded shadow">
                    TOP UI (12% BLOCKED)
                  </span>
                </div>

                {/* Middle Clear Region with Left & Right Safe Borders */}
                <div className="flex-1 flex justify-between">
                  {/* Left Column (8%) */}
                  <div className="w-[8%] bg-red-500/20 border-r border-red-500/60 border-dashed" />
                  
                  {/* Center Clear Safe Sanctuary */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-black/60 px-2 py-1 rounded border border-emerald-500/40">
                      ✓ SAFE CLEAR REGION (PUT TEXT HERE)
                    </span>
                  </div>

                  {/* Right Column (18% Like / Comment / Share Rail) */}
                  <div className="w-[18%] bg-red-500/25 border-l-2 border-red-500 border-dashed flex items-center justify-center text-center">
                    <span className="text-[8px] font-mono font-black text-white bg-red-600/90 px-1 py-0.5 rounded -rotate-90">
                      18% BLOCKED
                    </span>
                  </div>
                </div>

                {/* Bottom UI Region (22% Caption & Audio) */}
                <div className="h-[22%] bg-red-500/25 border-t-2 border-red-500 border-dashed flex items-center justify-center p-1 text-center">
                  <span className="text-[9px] font-mono font-black text-white bg-red-600/90 px-1.5 py-0.5 rounded shadow">
                    BOTTOM UI & CAPTION (22% BLOCKED)
                  </span>
                </div>

              </div>
            )}

            {/* Simulated Native Social UI Elements */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
              
              {/* Top Navigation Header */}
              <div className="pt-6 flex items-center justify-between text-white text-xs font-bold drop-shadow">
                <span className="opacity-80">LIVE</span>
                <div className="flex gap-4">
                  <span className="opacity-60">Following</span>
                  <span className="border-b-2 border-white pb-0.5">For You</span>
                </div>
                <span className="opacity-80">🔍</span>
              </div>

              {/* Bottom Details & Right Rail */}
              <div className="flex items-end justify-between pb-2">
                
                {/* Left: Creator handle, caption, music label */}
                <div className="flex-1 pr-4 space-y-1.5 drop-shadow-md">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {creatorHandle}
                    <span className="text-[10px] text-cyan-400">✓</span>
                  </h4>
                  <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed">
                    {caption}
                  </p>
                  <p className="text-[10px] font-mono text-cyan-300">
                    {hashtags}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-200 font-mono">
                    <Music2 className="w-3 h-3 text-cyan-300 animate-spin" />
                    <span className="truncate">{audioTrackLabel}</span>
                  </div>
                </div>

                {/* Right: Social Action Column */}
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/20 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart className="w-6 h-6 text-white drop-shadow" />
                    <span className="text-[10px] font-bold mt-0.5">142.8K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-6 h-6 text-white drop-shadow" />
                    <span className="text-[10px] font-bold mt-0.5">3,490</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bookmark className="w-6 h-6 text-white drop-shadow" />
                    <span className="text-[10px] font-bold mt-0.5">12.1K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Share2 className="w-6 h-6 text-white drop-shadow" />
                    <span className="text-[10px] font-bold mt-0.5">Share</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="mt-3 text-xs font-mono text-slate-400">
            Keep vital text inside the clear region. The red grid shows where social app UI blocks your media!
          </div>
        </div>

        {/* Right Configuration Deck & Omni Orb Assistant */}
        <div className="w-full md:w-84 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Omni Orb Assistant */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">VIRAL SAFE ZONE RADAR</span>
                <p className="text-xs text-slate-300">"Never let TikTok comment buttons cover your video text again."</p>
              </div>
            </div>

            {/* Platform Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Target Social Platform</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'tiktok', label: 'TikTok' },
                  { id: 'reels', label: 'IG Reels' },
                  { id: 'shorts', label: 'YT Shorts' },
                  { id: 'spotify', label: 'Spotify Canvas' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as any)}
                    className={`p-2 rounded-lg text-xs font-mono font-bold text-center transition-all ${
                      platform === p.id
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator Metadata Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Creator Handle</label>
                <input
                  type="text"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Caption & Hook</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Audio Track Label</label>
                <input
                  type="text"
                  value={audioTrackLabel}
                  onChange={(e) => setAudioTrackLabel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Hashtag Injection</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg text-xs text-cyan-300 font-mono outline-none"
                />
              </div>

            </div>

            {/* Safe Zone Details Box */}
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-1 text-[10px] font-mono text-slate-400">
              <div className="flex justify-between text-rose-400 font-bold">
                <span>Top UI Region:</span> <span>12%</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold">
                <span>Bottom Caption UI:</span> <span>22%</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold">
                <span>Right Action Rail:</span> <span>18%</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Safe Clear Sanctuary:</span> <span>48%</span>
              </div>
            </div>

          </div>

          <button
            onClick={handlePushToVault}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Push Guarded Mockup to Vault
          </button>
        </div>

      </div>
    </div>
  );
};
