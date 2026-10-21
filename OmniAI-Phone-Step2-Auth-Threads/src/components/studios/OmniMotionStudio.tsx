import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Scissors, 
  Volume2, 
  Sparkles, 
  Sliders, 
  Download, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  FolderLock, 
  Maximize2, 
  Smartphone, 
  Monitor, 
  Square, 
  Wand2, 
  FastForward, 
  Music, 
  Film, 
  Split, 
  ZoomIn, 
  ZoomOut,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Sparkle,
  Radio,
  FileVideo
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

interface VideoClip {
  id: string;
  name: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  color: string;
  type: 'video' | 'audio' | 'text' | 'fx';
  thumbnailUrl?: string;
  speed: number;
  volume: number;
  text?: string;
  filter?: string;
}

interface OmniMotionStudioProps {
  onSaveToVault?: (asset: any) => void;
}

export const OmniMotionStudio: React.FC<OmniMotionStudioProps> = ({ onSaveToVault }) => {
  // Timeline State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(4.5); // seconds
  const [totalDuration, setTotalDuration] = useState(30.0); // seconds
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1');
  const [activeToolTab, setActiveToolTab] = useState<'edit' | 'audio' | 'text' | 'filters' | 'effects' | 'ai'>('edit');
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  // AI Dialog & Assistance
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('Omni AI Video Engine Ready');

  // Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportResolution, setExportResolution] = useState<'1080p' | '4k' | '720p'>('1080p');
  const [exportFps, setExportFps] = useState<30 | 60>(60);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Layer Clips
  const [videoTrack, setVideoTrack] = useState<VideoClip[]>([
    {
      id: 'clip-1',
      name: 'Cyberpunk Intro Neon Rush',
      startTime: 0,
      duration: 5.0,
      color: 'from-cyan-600 to-blue-700',
      type: 'video',
      speed: 1.0,
      volume: 100,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
      filter: 'Cyberpunk Neon',
    },
    {
      id: 'clip-2',
      name: 'Shadow Companion Orb Reveal',
      startTime: 5.0,
      duration: 6.5,
      color: 'from-purple-600 to-indigo-800',
      type: 'video',
      speed: 1.0,
      volume: 100,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80',
      filter: 'Shadow Glow',
    },
    {
      id: 'clip-3',
      name: 'Nocturnal City Flight Drops',
      startTime: 11.5,
      duration: 8.5,
      color: 'from-amber-600 to-rose-700',
      type: 'video',
      speed: 1.25,
      volume: 100,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
      filter: 'Hyper Vivid',
    },
  ]);

  const [audioTrack, setAudioTrack] = useState<VideoClip[]>([
    {
      id: 'audio-1',
      name: 'Dark Phonk 140BPM Bass Boost',
      startTime: 0,
      duration: 25.0,
      color: 'from-emerald-600 to-teal-800',
      type: 'audio',
      speed: 1.0,
      volume: 90,
    },
  ]);

  const [textTrack, setTextTrack] = useState<VideoClip[]>([
    {
      id: 'text-1',
      name: 'Auto-Caption 1',
      startTime: 1.0,
      duration: 3.5,
      color: 'from-pink-600 to-rose-800',
      type: 'text',
      speed: 1.0,
      volume: 0,
      text: '⚡ STEP INTO THE SHADOW COMPANION',
    },
    {
      id: 'text-2',
      name: 'Auto-Caption 2',
      startTime: 5.2,
      duration: 4.0,
      color: 'from-pink-600 to-rose-800',
      type: 'text',
      speed: 1.0,
      volume: 0,
      text: '🔥 UNIFIED MULTI-MODEL QUORUM',
    },
  ]);

  const [fxTrack, setFxTrack] = useState<VideoClip[]>([
    {
      id: 'fx-1',
      name: 'Chromatic Glitch Transition',
      startTime: 4.8,
      duration: 1.2,
      color: 'from-yellow-600 to-orange-700',
      type: 'fx',
      speed: 1.0,
      volume: 0,
    },
  ]);

  // Video playback simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Format time (00:04.5)
  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    const ms = Math.floor((timeInSec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleSplitClip = () => {
    const clipIndex = videoTrack.findIndex((c) => c.id === selectedClipId);
    if (clipIndex === -1) return;
    const clip = videoTrack[clipIndex];

    if (currentTime > clip.startTime && currentTime < clip.startTime + clip.duration) {
      const firstDuration = currentTime - clip.startTime;
      const secondDuration = clip.duration - firstDuration;

      const firstClip: VideoClip = {
        ...clip,
        duration: Number(firstDuration.toFixed(1)),
      };
      const secondClip: VideoClip = {
        ...clip,
        id: `clip-${Date.now()}`,
        name: `${clip.name} (Part 2)`,
        startTime: Number(currentTime.toFixed(1)),
        duration: Number(secondDuration.toFixed(1)),
      };

      const updated = [...videoTrack];
      updated.splice(clipIndex, 1, firstClip, secondClip);
      setVideoTrack(updated);
      setSelectedClipId(secondClip.id);
      setAiStatusMessage(`Split clip at ${formatTime(currentTime)}`);
    } else {
      setAiStatusMessage(`Playhead must be inside selected clip to split`);
    }
  };

  const handleDeleteClip = () => {
    setVideoTrack((prev) => prev.filter((c) => c.id !== selectedClipId));
    setTextTrack((prev) => prev.filter((c) => c.id !== selectedClipId));
    setSelectedClipId(videoTrack[0]?.id || '');
    setAiStatusMessage('Clip removed from timeline');
  };

  const handleApplyFilter = (filterName: string) => {
    setVideoTrack((prev) =>
      prev.map((c) => (c.id === selectedClipId ? { ...c, filter: filterName } : c))
    );
    setAiStatusMessage(`Applied "${filterName}" filter`);
  };

  const handleSpeedChange = (speedVal: number) => {
    setVideoTrack((prev) =>
      prev.map((c) => (c.id === selectedClipId ? { ...c, speed: speedVal } : c))
    );
    setAiStatusMessage(`Speed adjusted to ${speedVal}x`);
  };

  const handleAiAutoCaptions = () => {
    setIsAiProcessing(true);
    setOrbPhase('processing');
    setAiStatusMessage('Omni analyzing audio track speech waveforms...');

    setTimeout(() => {
      const newCaptions: VideoClip[] = [
        {
          id: `caption-${Date.now()}-1`,
          name: 'AI Caption 1',
          startTime: 0.5,
          duration: 3.2,
          color: 'from-pink-600 to-rose-800',
          type: 'text',
          speed: 1,
          volume: 0,
          text: '🚀 WELCOME TO OMNI MOTION STUDIO',
        },
        {
          id: `caption-${Date.now()}-2`,
          name: 'AI Caption 2',
          startTime: 4.0,
          duration: 3.8,
          color: 'from-pink-600 to-rose-800',
          type: 'text',
          speed: 1,
          volume: 0,
          text: '🎬 CAPCUT-STYLE MOBILE TIMELINE + AI FX',
        },
        {
          id: `caption-${Date.now()}-3`,
          name: 'AI Caption 3',
          startTime: 8.5,
          duration: 4.0,
          color: 'from-pink-600 to-rose-800',
          type: 'text',
          speed: 1,
          volume: 0,
          text: '✨ SYNCHRONIZED BEAT DROPS AUTOMATED',
        },
      ];
      setTextTrack(newCaptions);
      setIsAiProcessing(false);
      setOrbPhase('idle');
      setAiStatusMessage('AI auto-captions generated with bounce animation!');
    }, 1500);
  };

  const handleAiBeatSync = () => {
    setIsAiProcessing(true);
    setOrbPhase('processing');
    setAiStatusMessage('Omni computing rhythmic transients and kick cuts...');

    setTimeout(() => {
      setIsAiProcessing(false);
      setOrbPhase('idle');
      setAiStatusMessage('Timeline cuts mapped to 140 BPM drop transients!');
    }, 1200);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setSavedSuccess(true);
          if (onSaveToVault) {
            onSaveToVault({
              id: `vault-video-${Date.now()}`,
              name: `OmniMotion_Project_${exportResolution}.mp4`,
              type: 'video',
              duration: `${formatTime(totalDuration)}`,
              resolution: exportResolution,
              fps: exportFps,
              aspectRatio: aspectRatio,
              thumbnailUrl: videoTrack[0]?.thumbnailUrl,
              createdAt: new Date().toISOString(),
            });
          }
          return 100;
        }
        return p + 15;
      });
    }, 300);
  };

  const selectedClip = videoTrack.find((c) => c.id === selectedClipId);

  return (
    <div className="h-full flex flex-col bg-[#07080d] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Top Header Bar */}
      <div className="h-12 px-4 bg-[#0a0d14] border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              OmniMotion
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              CapCut Engine v3.8
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-cyan-300 font-semibold">{formatTime(currentTime)}</span>
            <span>/</span>
            <span className="font-mono text-slate-500">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Aspect Ratio & Controls */}
        <div className="flex items-center gap-2">
          {/* Aspect Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                aspectRatio === '9:16' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="TikTok / Reels 9:16"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">9:16</span>
            </button>
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                aspectRatio === '16:9' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="YouTube Cinematic 16:9"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">16:9</span>
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                aspectRatio === '1:1' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Square 1:1"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1:1</span>
            </button>
          </div>

          {/* Safe Zone Toggle */}
          <button
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              showSafeZone
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle TikTok Safe Zone Overlay"
          >
            {showSafeZone ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">Safe Zone</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport (Upper Half) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Preview Canvas Monitor */}
        <div className="flex-1 bg-black/60 relative flex items-center justify-center p-3 overflow-hidden">
          {/* Video Container with Dynamic Aspect Ratio */}
          <div
            className={`relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0c0e17] flex items-center justify-center transition-all duration-300 ${
              aspectRatio === '9:16'
                ? 'h-[92%] aspect-[9/16]'
                : aspectRatio === '16:9'
                ? 'w-[90%] aspect-[16/9]'
                : aspectRatio === '1:1'
                ? 'h-[85%] aspect-square'
                : 'h-[90%] aspect-[4/5]'
            }`}
          >
            {/* Mock Video Frame Imagery */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0e1220] to-slate-900 flex items-center justify-center">
              {selectedClip?.thumbnailUrl ? (
                <img
                  src={selectedClip.thumbnailUrl}
                  alt="Current Frame"
                  className="w-full h-full object-cover filter transition-all duration-300"
                  style={{
                    filter:
                      selectedClip.filter === 'Cyberpunk Neon'
                        ? 'contrast(130%) saturate(180%) hue-rotate(15deg)'
                        : selectedClip.filter === 'Shadow Glow'
                        ? 'brightness(110%) contrast(140%) drop-shadow(0 0 15px #8b5cf6)'
                        : selectedClip.filter === 'Hyper Vivid'
                        ? 'saturate(200%) contrast(120%)'
                        : 'none',
                  }}
                />
              ) : (
                <div className="text-center p-6">
                  <Film className="w-12 h-12 text-slate-700 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-slate-500">Video Canvas Monitor</p>
                </div>
              )}

              {/* Dynamic Captions Rendered on Top */}
              {textTrack.map((cap) => {
                const isActive = currentTime >= cap.startTime && currentTime <= cap.startTime + cap.duration;
                if (!isActive) return null;
                return (
                  <div
                    key={cap.id}
                    className="absolute bottom-16 inset-x-4 text-center z-20 pointer-events-none"
                  >
                    <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-yellow-300 font-extrabold tracking-wide text-sm md:text-base border border-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-bounce">
                      {cap.text}
                    </span>
                  </div>
                );
              })}

              {/* TikTok / Reels Safe Zone Overlay */}
              {showSafeZone && aspectRatio === '9:16' && (
                <div className="absolute inset-0 pointer-events-none border border-dashed border-red-500/30 flex flex-col justify-between p-3 z-10">
                  <div className="flex justify-between items-center text-[9px] font-mono text-red-400/70 bg-red-950/40 px-2 py-0.5 rounded w-max">
                    TOP FEED SAFE ZONE
                  </div>
                  <div className="self-end text-[9px] font-mono text-red-400/70 bg-red-950/40 px-2 py-0.5 rounded">
                    RIGHT ACTION ICONS ZONE
                  </div>
                  <div className="text-[9px] font-mono text-red-400/70 bg-red-950/40 px-2 py-0.5 rounded w-max">
                    CAPTION & SOUND SAFE BOUNDARY
                  </div>
                </div>
              )}
            </div>

            {/* In-Monitor Playback Overlay Controls */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 transform hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>
            </div>

            {/* Timecode Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-cyan-400">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Right / Side Tool Deck & Omni AI Assistant Panel */}
        <div className="w-full md:w-80 bg-[#090b12] border-t md:border-t-0 md:border-l border-slate-800 flex flex-col flex-shrink-0">
          
          {/* Omni Orb AI Companion in Studio */}
          <div className="p-3 bg-gradient-to-b from-slate-900 to-[#090b12] border-b border-slate-800 flex items-center gap-3">
            <HoloOrb phase={orbPhase} className="w-10 h-10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Omni Video Co-Pilot</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">{aiStatusMessage}</p>
            </div>
          </div>

          {/* Quick AI Action Buttons */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
              Omni Intelligence Tools
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAiAutoCaptions}
                disabled={isAiProcessing}
                className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/40 hover:bg-pink-900/50 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Auto-Captions</span>
              </button>
              <button
                onClick={handleAiBeatSync}
                disabled={isAiProcessing}
                className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Music className="w-3.5 h-3.5 text-purple-400" />
                <span>Beat Sync Cuts</span>
              </button>
            </div>
          </div>

          {/* Tool Tab Switcher */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs">
            {(['edit', 'filters', 'effects', 'text', 'audio'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveToolTab(tab)}
                className={`flex-1 py-2 text-center capitalize font-semibold transition-all border-b-2 ${
                  activeToolTab === tab
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Specific Content */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {activeToolTab === 'edit' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-300">Selected Clip</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{selectedClip?.name || 'None'}</span>
                  </div>
                  
                  {/* Speed Controller */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Clip Speed: {selectedClip?.speed || 1}x</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0.5, 1.0, 1.25, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                            selectedClip?.speed === s
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Split & Delete Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSplitClip}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 font-bold flex items-center justify-center gap-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Split Clip</span>
                    </button>
                    <button
                      onClick={handleDeleteClip}
                      className="p-1.5 rounded-lg bg-rose-950/50 border border-rose-600/50 hover:bg-rose-900/60 text-rose-300"
                      title="Delete Clip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 text-[11px]">CapCut Style Presets</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      onClick={() => setAiStatusMessage('Curve Speed Ramp "Montage Flash" applied')}
                      className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left text-[11px]"
                    >
                      ⚡ Flash Ramp
                    </button>
                    <button 
                      onClick={() => setAiStatusMessage('Motion Blur Zoom Transition inserted')}
                      className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left text-[11px]"
                    >
                      🌀 Motion Blur
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeToolTab === 'filters' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400">Cinematic Color LUTs</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Cyberpunk Neon', 'Shadow Glow', 'Hyper Vivid', 'Matrix Green', 'Film Noir 35mm', 'Retro VHS'].map((lut) => (
                    <button
                      key={lut}
                      onClick={() => handleApplyFilter(lut)}
                      className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all ${
                        selectedClip?.filter === lut
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {lut}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeToolTab === 'effects' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400">Video FX & Transitions</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Laser Edge Glow', 'Chromatic Split', 'CRT TV Scanlines', 'Electric Particle', 'Camera Whip Pan', 'Glitch Dissolve'].map((fx) => (
                    <button
                      key={fx}
                      onClick={() => {
                        const newFx: VideoClip = {
                          id: `fx-${Date.now()}`,
                          name: fx,
                          startTime: currentTime,
                          duration: 2.0,
                          color: 'from-amber-600 to-yellow-700',
                          type: 'fx',
                          speed: 1,
                          volume: 0,
                        };
                        setFxTrack((prev) => [...prev, newFx]);
                        setAiStatusMessage(`Inserted ${fx} at playhead`);
                      }}
                      className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-amber-500/50 hover:bg-amber-950/20 text-slate-300 text-left text-xs"
                    >
                      ✨ {fx}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeToolTab === 'text' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400">Dynamic Text & Subtitles</span>
                <button
                  onClick={handleAiAutoCaptions}
                  className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Speech Captions</span>
                </button>
                <button
                  onClick={() => {
                    const newText: VideoClip = {
                      id: `text-${Date.now()}`,
                      name: 'Custom Heading',
                      startTime: currentTime,
                      duration: 3.0,
                      color: 'from-pink-600 to-rose-700',
                      type: 'text',
                      speed: 1,
                      volume: 0,
                      text: '⚡ DARK MISFIT REVOLUTION',
                    };
                    setTextTrack((prev) => [...prev, newText]);
                    setAiStatusMessage('Added custom heading overlay');
                  }}
                  className="w-full py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold"
                >
                  + Add Custom Text Overlay
                </button>
              </div>
            )}

            {activeToolTab === 'audio' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400">Audio Track & Beats</span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Background Music</span>
                    <span className="text-emerald-400 font-mono">140 BPM</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAiBeatSync}
                      className="flex-1 py-1.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold"
                    >
                      Auto-Detect Beats
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CapCut Mobile Timeline & Scrubbing Deck (Lower Half) */}
      <div className="h-52 sm:h-64 bg-[#090c14] border-t border-slate-800 flex flex-col flex-shrink-0">
        
        {/* Playback Controls & Time Scrub Header */}
        <div className="h-10 px-4 bg-[#07090e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Reset to 00:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Timeline Zoom Controls */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setTimelineZoom(Math.max(0.6, timelineZoom - 0.2))}
              className="p-1 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-500">{Math.round(timelineZoom * 100)}%</span>
            <button
              onClick={() => setTimelineZoom(Math.min(2.0, timelineZoom + 0.2))}
              className="p-1 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Track Timeline Viewport */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-2 relative bg-[#06080e]">
          
          {/* Draggable Playhead Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-30 shadow-[0_0_10px_#06b6d4] pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / totalDuration) * 100 * timelineZoom + 120}px` }}
          >
            <div className="w-3.5 h-3.5 -ml-1.5 bg-cyan-400 rounded-sm transform rotate-45 border border-white" />
          </div>

          <div className="min-w-[800px] space-y-2">
            
            {/* Track 1: FX / Transitions */}
            <div className="flex items-center h-8">
              <div className="w-28 text-[11px] font-mono text-amber-400/80 uppercase font-semibold flex items-center gap-1.5 px-2 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FX Track</span>
              </div>
              <div className="flex-1 h-full bg-slate-900/50 rounded-lg relative overflow-hidden border border-slate-800/40">
                {fxTrack.map((clip) => {
                  const left = (clip.startTime / totalDuration) * 100;
                  const width = (clip.duration / totalDuration) * 100;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-0 bottom-0 rounded px-2 text-[10px] flex items-center font-semibold text-white truncate cursor-pointer bg-gradient-to-r ${clip.color} border border-amber-400/40 ${
                        selectedClipId === clip.id ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {clip.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track 2: Text / Auto-Captions */}
            <div className="flex items-center h-8">
              <div className="w-28 text-[11px] font-mono text-pink-400/80 uppercase font-semibold flex items-center gap-1.5 px-2 flex-shrink-0">
                <Type className="w-3.5 h-3.5" />
                <span>Captions</span>
              </div>
              <div className="flex-1 h-full bg-slate-900/50 rounded-lg relative overflow-hidden border border-slate-800/40">
                {textTrack.map((clip) => {
                  const left = (clip.startTime / totalDuration) * 100;
                  const width = (clip.duration / totalDuration) * 100;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-0 bottom-0 rounded px-2 text-[10px] flex items-center font-bold text-white truncate cursor-pointer bg-gradient-to-r ${clip.color} border border-pink-400/50 ${
                        selectedClipId === clip.id ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {clip.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track 3: Main Video Clips (Primary Track) */}
            <div className="flex items-center h-14">
              <div className="w-28 text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5 px-2 flex-shrink-0">
                <Film className="w-3.5 h-3.5" />
                <span>Main Video</span>
              </div>
              <div className="flex-1 h-full bg-slate-900/70 rounded-lg relative overflow-hidden border border-cyan-500/30 flex">
                {videoTrack.map((clip) => {
                  const left = (clip.startTime / totalDuration) * 100;
                  const width = (clip.duration / totalDuration) * 100;
                  const isSelected = selectedClipId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-0 bottom-0 rounded-md p-1.5 flex items-center gap-2 cursor-pointer transition-all bg-gradient-to-r ${clip.color} border ${
                        isSelected ? 'border-white ring-2 ring-cyan-400 shadow-lg' : 'border-slate-700/60'
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {clip.thumbnailUrl && (
                        <img
                          src={clip.thumbnailUrl}
                          alt="thumb"
                          className="w-10 h-full object-cover rounded pointer-events-none"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{clip.name}</p>
                        <p className="text-[9px] font-mono text-cyan-200">
                          {clip.duration}s • {clip.speed}x • {clip.filter || 'Normal'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track 4: Audio / Waveform Music */}
            <div className="flex items-center h-8">
              <div className="w-28 text-[11px] font-mono text-emerald-400/80 uppercase font-semibold flex items-center gap-1.5 px-2 flex-shrink-0">
                <Music className="w-3.5 h-3.5" />
                <span>Sound Track</span>
              </div>
              <div className="flex-1 h-full bg-slate-900/50 rounded-lg relative overflow-hidden border border-slate-800/40">
                {audioTrack.map((clip) => {
                  const left = (clip.startTime / totalDuration) * 100;
                  const width = (clip.duration / totalDuration) * 100;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-0 bottom-0 rounded px-2 text-[10px] flex items-center font-semibold text-white truncate cursor-pointer bg-gradient-to-r ${clip.color} border border-emerald-400/40`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="truncate">{clip.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0c0f18] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white">Export Video Project</h3>
              </div>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setSavedSuccess(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {savedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Video Export Complete!</h4>
                <p className="text-xs text-slate-400">
                  Rendered in {exportResolution} at {exportFps}fps and saved to your Global Vault.
                </p>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setSavedSuccess(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Resolution Pick */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        onClick={() => setExportResolution(res)}
                        className={`py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                          exportResolution === res
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Rate */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Frame Rate</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[30, 60].map((fps) => (
                      <button
                        key={fps}
                        onClick={() => setExportFps(fps as any)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                          exportFps === fps
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>

                {isExporting ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Encoding frames...</span>
                      <span className="font-mono text-cyan-400">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-200"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleExport}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Render & Save to Vault</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
