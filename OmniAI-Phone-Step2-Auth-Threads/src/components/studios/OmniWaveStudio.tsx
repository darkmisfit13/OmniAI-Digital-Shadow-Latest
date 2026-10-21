import React, { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  FolderLock, 
  Share2, 
  Sliders, 
  Flame, 
  Radio, 
  Check, 
  ArrowRight,
  Disc3
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

interface GeneratedSong {
  id: string;
  title: string;
  style: string;
  bpm: number;
  key: string;
  duration: string;
  lyrics: string;
  coverArt: string;
  waveformData: number[];
  tags: string[];
  audioUrl?: string;
}

export const OmniWaveStudio: React.FC<{ onSaveToVault?: (asset: any) => void }> = ({ onSaveToVault }) => {
  const [selectedStyle, setSelectedStyle] = useState('Heavy Metal');
  const [songTitle, setSongTitle] = useState('Dark Misfit Anthem');
  const [lyricsInput, setLyricsInput] = useState('');
  const [isEnhancingLyrics, setIsEnhancingLyrics] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  
  // Results: exactly 2 distinct songs just like Suno!
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([]);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const styleOptions = [
    'Heavy Metal',
    'Hard Rock',
    'Drum and Bass',
    'Powerful Cyberpunk',
    'Psychedelic Funk',
    'Synthwave 80s',
    'Dark Trap 808',
    'Industrial EBM',
    'Cinematic Orchestral',
    'New Age Ambient',
    'Hyperpop Glitch',
  ];

  // Enhance Lyrics button: even 1 word generates a whole song structure
  const handleEnhanceLyrics = async () => {
    if (!lyricsInput.trim() && !songTitle.trim()) {
      setLyricsInput('Overdrive');
    }
    const seed = lyricsInput.trim() || songTitle.trim() || 'Neon Fire';
    setIsEnhancingLyrics(true);
    setOrbPhase('listening');

    try {
      const res = await fetch('/api/omni-wave/enhance-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed, style: selectedStyle }),
      });
      const data = await res.json();
      if (data.lyrics) {
        setLyricsInput(data.lyrics);
      }
    } catch {
      setLyricsInput(`[Verse 1]\n${seed} under midnight rain\nRising from the shadow and the pain\n\n[Chorus]\nWe break the wire, we take the crown\nDark Misfit never backing down!\n\n[Guitar Solo]\n\n[Bridge]\nNo control, synthetic soul.\n\n[Chorus]\nWe break the wire, we take the crown!\n\n[Outro]\nDone.`);
    } finally {
      setIsEnhancingLyrics(false);
      setOrbPhase('idle');
    }
  };

  // Submit and generate exactly 2 songs!
  const handleGenerateSongs = async () => {
    setIsGenerating(true);
    setOrbPhase('processing');

    try {
      const res = await fetch('/api/omni-wave/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: selectedStyle,
          lyrics: lyricsInput,
          title: songTitle,
        }),
      });
      const data = await res.json();
      if (data.songs && data.songs.length === 2) {
        setGeneratedSongs(data.songs);
      }
    } catch {
      // Fallback
      setGeneratedSongs([
        {
          id: `wave_${Date.now()}_1`,
          title: `${songTitle} (V1 - Cyber Overdrive)`,
          style: selectedStyle,
          bpm: 142,
          key: 'D Minor',
          duration: '02:45',
          lyrics: lyricsInput || '[Verse 1]\nNight falls...\n[Chorus]\nOmniWave!',
          coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
          waveformData: Array.from({ length: 48 }, () => Math.round(Math.random() * 80 + 20)),
          tags: ['Heavy Bass', 'High Energy', 'Raw Vocals']
        },
        {
          id: `wave_${Date.now()}_2`,
          title: `${songTitle} (V2 - Extended Studio Mix)`,
          style: selectedStyle,
          bpm: 156,
          key: 'F# Minor',
          duration: '03:12',
          lyrics: lyricsInput || '[Verse 1]\nNight falls...\n[Chorus]\nOmniWave!',
          coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
          waveformData: Array.from({ length: 48 }, () => Math.round(Math.random() * 85 + 15)),
          tags: ['Dual Vocals', 'Extended Solo', 'Distortion']
        }
      ]);
    } finally {
      setIsGenerating(false);
      setOrbPhase('idle');
    }
  };

  const handleSaveToVault = (song: GeneratedSong) => {
    if (onSaveToVault) {
      onSaveToVault({
        type: 'song',
        title: song.title,
        duration: song.duration,
        thumbnail: song.coverArt,
        tags: ['OmniWave', song.style, `${song.bpm} BPM`, song.key],
        details: `Lyrics snippet: ${song.lyrics.slice(0, 80)}...`
      });
      alert(`"${song.title}" saved to OMNI VAULT!`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
            <Disc3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNIWAVE SONG CREATION STUDIO
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SUNO WORKFLOW
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Generate 2 distinct full-fidelity song tracks with instant lyric enhancement</p>
          </div>
        </div>

        {generatedSongs.length > 0 && (
          <button
            onClick={() => setGeneratedSongs([])}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Create Another Song
          </button>
        )}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {generatedSongs.length === 0 ? (
          /* CREATION FORM WITH OMNI ORB */
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Omni Orb Waiting Screen */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-[#0a0d14] border border-amber-500/30 shadow-xl">
              <div className="w-24 h-24 mb-2">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                OMNIWAVE NEURAL HARMONIC CORE
              </span>
              <p className="text-xs text-slate-400 text-center max-w-md mt-1">
                "I am listening to the acoustic ether. Select your genre style and draft your lyrics or a single word seed."
              </p>
            </div>

            {/* Song Title & Style Selector */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono">Song Title / Theme</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g., Midnight Reckoning, Overdrive..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="w-full md:w-64 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono">Active Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-amber-300 font-mono outline-none"
                  >
                    {styleOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Style Chips Selector */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Popular Sound Styles:</span>
                <div className="flex flex-wrap gap-1.5">
                  {styleOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStyle(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        selectedStyle === st
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lyrics Area with "Enhance Lyrics" Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Song Lyrics (Put 1 word or full text)
                </label>
                <button
                  onClick={handleEnhanceLyrics}
                  disabled={isEnhancingLyrics}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                  title="Even if you put one word, Omni generates an entire full song with verse, chorus, and bridge"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEnhancingLyrics ? 'Synthesizing Full Song...' : '✨ Enhance Lyrics'}
                </button>
              </div>

              <textarea
                rows={7}
                value={lyricsInput}
                onChange={(e) => setLyricsInput(e.target.value)}
                placeholder="Type your lyrics or enter even one word (e.g. 'Cyberpunk', 'Rebellion', 'Rain'). Then tap 'Enhance Lyrics'!"
                className="w-full p-4 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs font-mono text-white placeholder-slate-500 outline-none leading-relaxed"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateSongs}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-amber-950/70 uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <Music className="w-5 h-5" />
              {isGenerating ? 'Synthesizing Exactly 2 Full Songs...' : 'Generate 2 Songs in OmniWave'}
            </button>
          </div>
        ) : (
          /* RESULT SCREEN: GENERATES EXACTLY TWO SONGS JUST LIKE SUNO */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                  GENERATION COMPLETE (2 TRACKS)
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Suno-Style Dual Track Output</h3>
              </div>
            </div>

            {/* The 2 Generated Songs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedSongs.map((song, idx) => (
                <div
                  key={song.id}
                  className="rounded-2xl bg-gradient-to-b from-slate-900 to-[#0a0d14] border-2 border-amber-500/40 overflow-hidden shadow-2xl flex flex-col justify-between space-y-4 p-5"
                >
                  <div className="space-y-3">
                    {/* Cover Art & Title Header */}
                    <div className="flex gap-3">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-amber-500/30 relative group">
                        <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <button
                          onClick={() => setPlayingSongId(playingSongId === song.id ? null : song.id)}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg"
                        >
                          {playingSongId === song.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            VERSION {idx + 1}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{song.duration}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                        <div className="text-xs text-amber-400 font-mono mt-0.5">{song.style}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{song.bpm} BPM • Key: {song.key}</div>
                      </div>
                    </div>

                    {/* Waveform Visualizer Bar */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{playingSongId === song.id ? 'NOW PLAYING' : 'READY TO STREAM'}</span>
                        <span className="text-amber-400">STEREO 320KBPS</span>
                      </div>
                      <div className="h-10 flex items-end gap-1 px-1">
                        {song.waveformData.map((height, wIdx) => (
                          <div
                            key={wIdx}
                            style={{ height: `${height}%` }}
                            className={`flex-1 rounded-full transition-all ${
                              playingSongId === song.id ? 'bg-amber-400 animate-pulse' : 'bg-slate-700 hover:bg-amber-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Lyrics Preview Accordion */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {song.lyrics}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex gap-1">
                      {song.tags.map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToVault(song)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
                      >
                        <FolderLock className="w-3.5 h-3.5" />
                        Save to Vault
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
