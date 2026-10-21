import React, { useState } from 'react';
import { 
  Music, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Play, 
  Pause, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Video, 
  Sliders, 
  Layers, 
  FolderLock, 
  MessageSquare,
  Clapperboard,
  Download,
  Film
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniBeatStudio: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMusic, setSelectedMusic] = useState<string>('Dark Synthwave Beat (140 BPM)');
  const [customMusicName, setCustomMusicName] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('Cyberpunk Protagonist (Neon Visor)');
  const [characterImage, setCharacterImage] = useState<string>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80');
  const [videoPrompt, setVideoPrompt] = useState<string>('High-octane nocturnal pursuit across rooftop neon skyscraper with lightning beat drops.');
  
  const [renderDisplayMode, setRenderDisplayMode] = useState<'studio' | 'chat'>('studio');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState<'analyzing' | 'storyboard' | 'generating_clips' | 'assembling' | 'complete'>('analyzing');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const presetTracks = [
    { title: 'Dark Synthwave Beat (140 BPM)', genre: 'Cyberpunk Phonk', duration: '01:45' },
    { title: 'Heavy Metal Distorted Riff', genre: 'Industrial Rock', duration: '02:10' },
    { title: 'Drum & Bass Velocity', genre: 'D&B 174 BPM', duration: '01:30' },
    { title: 'Nocturnal Lo-Fi Ambient', genre: 'Chillhop Night', duration: '02:00' },
  ];

  const presetCharacters = [
    { name: 'Cyberpunk Protagonist (Neon Visor)', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
    { name: 'Midnight Rocker Singer', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' },
    { name: 'Holographic Android Valkyrie', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
  ];

  const handleCustomMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMusic(file.name);
      setCustomMusicName(file.name);
    }
  };

  const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCharacterImage(reader.result as string);
        setSelectedCharacter(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitToOmni = async () => {
    setStep(4);
    setOrbPhase('processing');
    setRenderProgress(10);
    setRenderStage('analyzing');

    setTimeout(() => {
      setRenderProgress(35);
      setRenderStage('storyboard');
    }, 1200);

    setTimeout(() => {
      setRenderProgress(70);
      setRenderStage('generating_clips');
    }, 2500);

    setTimeout(() => {
      setRenderProgress(95);
      setRenderStage('assembling');
    }, 3800);

    setTimeout(() => {
      setRenderProgress(100);
      setRenderStage('complete');
      setOrbPhase('idle');
    }, 4800);
  };

  const handleSaveMusicVideo = () => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'beat',
        title: `OmniBeat Music Video - ${selectedMusic}`,
        duration: '01:45',
        thumbnail: characterImage,
        tags: ['OmniBeat', 'Music Video', '4K UHD', 'Beat-Synced'],
        details: `Storyline: ${videoPrompt}`
      });
      alert('Music video saved directly to OMNI VAULT!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 font-black">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNIBEAT MUSIC VIDEO CLIENT
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                FREEBEAT.AI WORKFLOW
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Step-by-step music video creation: Choose track, character & prompt Omni AI</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {[
            { num: 1, label: '1. Music' },
            { num: 2, label: '2. Character' },
            { num: 3, label: '3. Prompt Omni' },
            { num: 4, label: '4. Render Pipeline' },
          ].map((s) => (
            <span
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer transition-all ${
                step === s.num
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                  : step > s.num
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        
        {/* STEP 1: CHOOSE MUSIC */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">STEP 1 OF 3</span>
              <h3 className="text-xl font-bold text-white">Choose the Music Track for Your Video</h3>
              <p className="text-xs text-slate-400">Select a high-energy beat or upload your own song track</p>
            </div>

            <div className="space-y-3">
              {presetTracks.map((trk, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMusic(trk.title)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMusic === trk.title
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{trk.title}</h4>
                      <span className="text-xs text-slate-400">{trk.genre} • {trk.duration}</span>
                    </div>
                  </div>
                  {selectedMusic === trk.title && (
                    <Check className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              ))}

              <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-purple-500/50 text-center relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomMusicUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                <span className="text-xs font-semibold text-white block">
                  {customMusicName ? `Uploaded: ${customMusicName}` : 'Or Upload Your Custom Audio Track (MP3/WAV)'}
                </span>
                <span className="text-[10px] text-slate-500">Omni AI will analyze BPM, drops, and mood peaks</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50"
              >
                Next: Choose Character <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE CHARACTER / SINGER */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">STEP 2 OF 3</span>
              <h3 className="text-xl font-bold text-white">Choose the Singer or Main Character</h3>
              <p className="text-xs text-slate-400">Select an iconic avatar or upload a picture of the performer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presetCharacters.map((char, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCharacter(char.name);
                    setCharacterImage(char.img);
                  }}
                  className={`rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    selectedCharacter === char.name
                      ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-xl'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={char.img} alt={char.name} className="w-full h-44 object-cover" />
                  <div className="p-3 bg-slate-900/90">
                    <h5 className="text-xs font-bold text-white truncate">{char.name}</h5>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-purple-500/50 text-center relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCharacterUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <ImageIcon className="w-6 h-6 mx-auto mb-1 text-purple-400" />
              <span className="text-xs font-semibold text-white block">Upload Custom Singer / Protagonist Photo</span>
              <span className="text-[10px] text-slate-500">Omni AI preserves face likeness and stylistic rendering</span>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50"
              >
                Next: Prompt Omni AI <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROMPT OMNI AI WITH THE ORB */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">STEP 3 OF 3</span>
              <h3 className="text-xl font-bold text-white">Describe How You Want the Music Video to Play Out</h3>
              <p className="text-xs text-slate-400">Omni Orb is waiting to ingest your storyline, visual atmosphere, and cues</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-900/50 border border-purple-500/30 shadow-xl">
              <div className="w-28 h-28 mb-3">
                <HoloOrb phase="listening" className="w-full h-full" />
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">OMNI AI DIRECTING PROTOCOL</span>
              <p className="text-xs text-slate-400 text-center max-w-md mt-1">
                "I am holding your track <span className="text-white font-semibold">({selectedMusic})</span> and character anchor. Dictate your vision."
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">Music Video Concept & Storyline</label>
              <textarea
                rows={4}
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Describe scene progression, camera angles, lighting, and how the beat drops should look..."
                className="w-full p-4 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmitToOmni}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm flex items-center gap-2 shadow-2xl shadow-purple-950/70"
              >
                <Sparkles className="w-4 h-4" />
                Submit to Omni AI & Render Video
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CUTS TO OMNI ANALYSIS & RENDER SCREEN */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-purple-500/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">OMNIBEAT LIVE PRODUCTION SUITE</h4>
                  <span className="text-[10px] font-mono text-purple-300">
                    STATUS: {renderStage.toUpperCase()} ({renderProgress}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setRenderDisplayMode('studio')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    renderDisplayMode === 'studio' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Studio Render View
                </button>
                <button
                  onClick={() => setRenderDisplayMode('chat')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    renderDisplayMode === 'chat' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Omni Chat Thoughts
                </button>
              </div>
            </div>

            {renderDisplayMode === 'studio' ? (
              <div className="space-y-6">
                
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-purple-400 font-bold uppercase">
                      {renderStage === 'analyzing' && '1. Analyzing Music & Sonic Vibe...'}
                      {renderStage === 'storyboard' && '2. Generating Reference Images & Storyline...'}
                      {renderStage === 'generating_clips' && '3. Synthesizing 4 Cinematic Video Clips...'}
                      {renderStage === 'assembling' && '4. Stitching Movie & Mastering Audio...'}
                      {renderStage === 'complete' && 'Production Complete • Ready to Watch!'}
                    </span>
                    <span className="font-mono text-white font-black">{renderProgress}%</span>
                  </div>
                  
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${renderProgress}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Reference Scenes Generated by Omni AI:
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { num: 1, title: 'Scene 1: Skyscraper Aerial', img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80' },
                      { num: 2, title: 'Scene 2: Neon Goggles HUD', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80' },
                      { num: 3, title: 'Scene 3: Beat Drop Lasers', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80' },
                      { num: 4, title: 'Scene 4: DarkMisfit Finale', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
                    ].map((sc) => (
                      <div key={sc.num} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={sc.img} alt={sc.title} className="w-full h-24 object-cover" />
                        <div className="p-2 text-[11px] font-semibold text-slate-300 truncate">
                          {sc.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {renderStage === 'complete' && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-[#0c0f17] border-2 border-purple-500/50 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                          MOVIE ASSEMBLED SUCCESSFULLY
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">Final Cut: {selectedMusic}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveMusicVideo}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                          <FolderLock className="w-3.5 h-3.5" />
                          Save to Vault
                        </button>
                      </div>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-purple-500/40 shadow-inner group">
                      <img
                        src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80"
                        alt="Final Movie"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-900/60 backdrop-blur-md"
                      >
                        {isPlayingVideo ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-12 h-12">
                    <HoloOrb phase="processing" className="w-full h-full" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">OMNI AI DIRECTORIAL THOUGHT LOG</h5>
                    <p className="text-slate-400 text-[11px]">Internal cognition stream during video generation</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-slate-300">
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-purple-400 font-bold">[VIBE ANALYSIS]:</span> Detected 140 BPM with heavy sub-bass at 00:45. Marking transition timestamps.
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-bold">[CHARACTER ANCHOR]:</span> Facial structure of {selectedCharacter} normalized into nocturnal neon palette.
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-emerald-400 font-bold">[SCENE SYNTHESIS]:</span> Generating 4 distinct scenes using dynamic camera dolly and prismatic lighting.
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-amber-400 font-bold">[MOVIE MASTERING]:</span> Synchronizing audio transients to video cuts. Applying DarkMisfit cyber grade. Complete!
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start New Video
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
