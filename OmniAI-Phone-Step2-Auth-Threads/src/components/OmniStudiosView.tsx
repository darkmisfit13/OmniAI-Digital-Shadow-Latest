import React from 'react';
import { 
  Film, 
  Video, 
  Music, 
  Code, 
  Hammer, 
  Wand2, 
  Search, 
  Shirt, 
  Rotate3d, 
  Smartphone, 
  Palette, 
  Database, 
  Workflow, 
  Network, 
  ChevronLeft,
  Sparkles,
  Layers
} from 'lucide-react';

// Import all dedicated studios
import { OmniMotionStudio } from './studios/OmniMotionStudio';
import { OmniBeatStudio } from './studios/OmniBeatStudio';
import { OmniWaveStudio } from './studios/OmniWaveStudio';
import { OmniCodeStudio } from './studios/OmniCodeStudio';
import { OmniForgeStudio } from './studios/OmniForgeStudio';
import { OmniImagineStudio } from './studios/OmniImagineStudio';
import { OmniAnalyzerStudio } from './studios/OmniAnalyzerStudio';
import { OmniStyleStudio } from './studios/OmniStyleStudio';
import { OmniSpatial3DStudio } from './studios/OmniSpatial3DStudio';
import { OmniViralMockupStudio } from './studios/OmniViralMockupStudio';
import { OmniCosmicUILab } from './studios/OmniCosmicUILab';
import { OmniArchitectStudio } from './studios/OmniArchitectStudio';
import { OmniAutomationsStudio } from './studios/OmniAutomationsStudio';
import { OmniConnectCatalog } from './studios/OmniConnectCatalog';

export type StudioId = 
  | 'motion' 
  | 'beat' 
  | 'wave' 
  | 'code' 
  | 'forge' 
  | 'imagine' 
  | 'analyzer' 
  | 'style' 
  | 'spatial' 
  | 'mockup' 
  | 'cosmic' 
  | 'architect' 
  | 'automations' 
  | 'connect';

interface OmniStudiosViewProps {
  onInsertToKeyboard?: (text: string) => void;
  currentScreenName?: string;
  onSaveToVault?: (asset: any) => void;
  selectedStudio: StudioId;
  onSelectStudio?: (id: StudioId) => void;
  onBackToHome?: () => void;
  onOpenSidebar?: () => void;
}

const studioMeta: Record<StudioId, { name: string; tag: string; icon: any }> = {
  motion: { name: 'OmniMotion', tag: 'CapCut Video Editor', icon: Video },
  beat: { name: 'OmniBeat', tag: 'Freebeat Music Video', icon: Film },
  wave: { name: 'OmniWave', tag: 'Suno Song Creator', icon: Music },
  code: { name: 'OmniCode', tag: 'Cursor / Lovable Code', icon: Code },
  forge: { name: 'OmniForge', tag: 'Full-Stack App Builder', icon: Hammer },
  imagine: { name: 'OmniImagine', tag: 'Photo & Magic Eraser', icon: Wand2 },
  analyzer: { name: 'OmniAnalyzer', tag: 'Site & Social Auditor', icon: Search },
  style: { name: 'OmniStyle', tag: 'Wardrobe & Aesthetic', icon: Shirt },
  spatial: { name: 'Spatial 3D', tag: 'Three.js Spatial Canvas', icon: Rotate3d },
  mockup: { name: 'Viral Mockup', tag: 'Social Feed Safe Zones', icon: Smartphone },
  cosmic: { name: 'Cosmic UI Lab', tag: 'Generative UI Sandbox', icon: Palette },
  architect: { name: 'OmniArchitect', tag: 'DB & API Schemas', icon: Database },
  automations: { name: 'Automations', tag: 'AI Autonomous Agents', icon: Workflow },
  connect: { name: 'OmniConnect', tag: 'App Integrations Catalog', icon: Network },
};

export const OmniStudiosView: React.FC<OmniStudiosViewProps> = ({
  onInsertToKeyboard,
  currentScreenName,
  onSaveToVault,
  selectedStudio = 'motion',
  onSelectStudio,
  onBackToHome,
  onOpenSidebar,
}) => {
  const meta = studioMeta[selectedStudio] || studioMeta.motion;
  const Icon = meta.icon;

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Sleek Mobile Studio Top Bar with Back Button */}
      <div className="h-11 px-3 bg-[#0a0d16] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-1 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-0.5 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            <Icon className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-xs text-white">{meta.name}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ({meta.tag})
            </span>
          </div>
        </div>

        {/* Change Studio button */}
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Switch Studio</span>
          </button>
        )}
      </div>

      {/* Render the Active Studio Component */}
      <div className="flex-1 overflow-hidden">
        {selectedStudio === 'motion' && <OmniMotionStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'beat' && <OmniBeatStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'wave' && <OmniWaveStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'code' && <OmniCodeStudio />}
        {selectedStudio === 'forge' && <OmniForgeStudio />}
        {selectedStudio === 'imagine' && <OmniImagineStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'analyzer' && <OmniAnalyzerStudio />}
        {selectedStudio === 'style' && <OmniStyleStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'spatial' && <OmniSpatial3DStudio />}
        {selectedStudio === 'mockup' && <OmniViralMockupStudio onSaveToVault={onSaveToVault} />}
        {selectedStudio === 'cosmic' && <OmniCosmicUILab />}
        {selectedStudio === 'architect' && <OmniArchitectStudio />}
        {selectedStudio === 'automations' && <OmniAutomationsStudio />}
        {selectedStudio === 'connect' && <OmniConnectCatalog />}
      </div>

    </div>
  );
};
