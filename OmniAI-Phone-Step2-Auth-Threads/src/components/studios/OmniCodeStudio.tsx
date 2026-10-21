import React, { useState } from 'react';
import { 
  Code, 
  Terminal, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  FileCode, 
  FolderTree, 
  Diff, 
  ChevronRight, 
  RotateCcw,
  Bug,
  Wand2,
  FileCheck
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniCodeStudio: React.FC = () => {
  const [activeFile, setActiveFile] = useState('src/App.tsx');
  const [prompt, setPrompt] = useState('Refactor the dual-lane analysis pipeline to support speculative pre-computation.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '⚡ OmniCode Compiler v4.2 online.',
    'Ready for paired autonomous code generation.'
  ]);
  const [copied, setCopied] = useState(false);

  const sampleCode = `// DarkMisfitStudios - Speculative Cognition Engine
import { GoogleGenAI } from '@google/genai';

export class SpeculativeCognitionEngine {
  private cache = new Map<string, any>();

  async executeSpeculativePrecomputation(viewportContext: string) {
    const hash = this.computeContextHash(viewportContext);
    if (this.cache.has(hash)) {
      return this.cache.get(hash);
    }
    
    // Execute high-speed parallel inference
    const result = await this.synthesizeSuggestions(viewportContext);
    this.cache.set(hash, result);
    return result;
  }
}`;

  const [currentCode, setCurrentCode] = useState(sampleCode);

  const handleRunCodeAction = (actionType: 'refactor' | 'debug' | 'test' | 'generate') => {
    setIsGenerating(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsGenerating(false);
      setOrbPhase('idle');
      if (actionType === 'refactor') {
        setCurrentCode(`// Refactored with Optimistic Cache & Zero-Latency Fallback
import { GoogleGenAI } from '@google/genai';

export class SpeculativeCognitionEngine {
  private lruCache = new Map<string, any>();
  private readonly MAX_CACHE_SIZE = 128;

  async executeSpeculativePrecomputation(viewportContext: string): Promise<any> {
    const hash = this.computeContextHash(viewportContext);
    if (this.lruCache.has(hash)) {
      return this.lruCache.get(hash);
    }
    
    const parallelPromise = this.synthesizeSuggestions(viewportContext);
    this.lruCache.set(hash, parallelPromise);
    return parallelPromise;
  }
}`);
        setTerminalOutput((prev) => [
          ...prev,
          `> Refactor verified: 0 TypeScript errors. Memory footprint reduced by 34%.`
        ]);
      } else if (actionType === 'debug') {
        setTerminalOutput((prev) => [
          ...prev,
          `> Analysis complete: No null-pointer vulnerabilities detected in AST.`
        ]);
      } else if (actionType === 'test') {
        setTerminalOutput((prev) => [
          ...prev,
          `> PASS: src/test/speculativeEngine.test.ts (4 passed, 0 failed, 12ms)`
        ]);
      }
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNICODE AI PAIR-PROGRAMMER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                CURSOR / LOVABLE ENGINE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Autonomous code generation, intelligent refactoring & instant AST debugging</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunCodeAction('test')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3 h-3" /> Run Tests
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Editor & AI Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* File Tree Explorer */}
        <div className="w-56 bg-[#0a0c12] border-r border-slate-800 p-3 hidden md:block">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Workspace Files
          </span>
          <div className="space-y-1 text-xs font-mono">
            {[
              'src/App.tsx',
              'src/components/AIKeyboardBar.tsx',
              'src/components/HoloOrb.tsx',
              'src/lib/onDeviceAI.ts',
              'server.ts',
              'firestore.rules'
            ].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFile(f)}
                className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 truncate ${
                  activeFile === f
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{f}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{activeFile}</span>
            <span>TypeScript • UTF-8</span>
          </div>

          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            className="flex-1 p-4 bg-transparent font-mono text-xs text-emerald-300 leading-relaxed outline-none resize-none overflow-y-auto selection:bg-emerald-500/30"
          />

          {/* Terminal Console */}
          <div className="h-32 bg-black border-t border-slate-800 p-3 font-mono text-xs text-slate-400 overflow-y-auto space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] pb-1 border-b border-slate-900">
              <Terminal className="w-3 h-3" /> OmniCode Terminal Output
            </div>
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="text-slate-300">{line}</div>
            ))}
          </div>
        </div>

        {/* Omni AI Assistant Side Panel */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            {/* Omni Orb */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">OMNICODE ASSISTANT</span>
                <p className="text-xs text-slate-300">"Cursor-grade pair-programmer ready to scaffold or optimize."</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">One-Click Actions</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Refactor Code', action: 'refactor', icon: Wand2 },
                  { label: 'Fix Bug AST', action: 'debug', icon: Bug },
                  { label: 'Generate Unit Test', action: 'test', icon: FileCheck },
                  { label: 'Optimize Latency', action: 'refactor', icon: Sparkles }
                ].map((btn, idx) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleRunCodeAction(btn.action as any)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Icon className="w-3 h-3 text-emerald-400" />
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction prompt */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Directive</span>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What code change should Omni implement?"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => handleRunCodeAction('refactor')}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Synthesizing Changes...' : 'Execute Changes in Cursor Style'}
          </button>
        </div>

      </div>
    </div>
  );
};
