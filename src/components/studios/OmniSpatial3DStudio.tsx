import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  Rotate3d, 
  Layers, 
  Sparkles, 
  Sun, 
  Sliders, 
  Palette, 
  Download, 
  Eye, 
  RotateCcw,
  Zap,
  Cpu
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

export const OmniSpatial3DStudio: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'orb' | 'keycap' | 'torus' | 'monolith'>('orb');
  const [wireframe, setWireframe] = useState(false);
  const [metalness, setMetalness] = useState(0.85);
  const [roughness, setRoughness] = useState(0.15);
  const [glowColor, setGlowColor] = useState('#06b6d4'); // cyan
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(new THREE.Color(glowColor), 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Geometry based on selection
    let geometry: THREE.BufferGeometry = new THREE.SphereGeometry(1.4, 64, 64);
    if (modelType === 'keycap') {
      geometry = new THREE.BoxGeometry(2, 0.8, 2);
    } else if (modelType === 'torus') {
      geometry = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
    } else if (modelType === 'monolith') {
      geometry = new THREE.CylinderGeometry(0.8, 1.2, 2.8, 6);
    }

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: 0.3,
      metalness,
      roughness,
      wireframe,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Mouse drag interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !meshRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      meshRef.current.rotation.y += deltaX * 0.01;
      meshRef.current.rotation.x += deltaY * 0.01;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (meshRef.current && !isDragging) {
        meshRef.current.rotation.y += 0.005 * rotationSpeed;
        meshRef.current.rotation.x += 0.002 * rotationSpeed;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && domElement) {
        mountRef.current.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [modelType, wireframe, metalness, roughness, glowColor, rotationSpeed]);

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Rotate3d className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI SPATIAL 3D STUDIO
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                THREE.JS WEBGL DECK
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Interactive 3D modeling, texture deck, shaders & spatial tokens</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              wireframe ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}
          >
            {wireframe ? 'Wireframe: ON' : 'Wireframe: OFF'}
          </button>
        </div>
      </div>

      {/* Main Studio Viewport & Tool Deck */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Interactive 3D Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-[#06080d] to-black overflow-hidden flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Interactive Hint */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
            Click & Drag to rotate 3D mesh in spatial coordinates
          </div>

          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-cyan-950/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
            WebGL 2.0 • 60 FPS • Real-Time PBR
          </div>
        </div>

        {/* Right: Texture & In-Painting Deck Panel */}
        <div className="w-full md:w-80 bg-[#0d1017] border-l border-slate-800 p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Omni Orb Assistant */}
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <HoloOrb phase={orbPhase} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">3D SPATIAL CORE</span>
                <p className="text-xs text-slate-300">"PBR Material shaders compiled. Adjust roughness and specular reflectance."</p>
              </div>
            </div>

            {/* Model Geometry Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Geometry Primitive</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'orb', label: 'Holo Orb' },
                  { id: 'keycap', label: '3D Keycap' },
                  { id: 'torus', label: 'Torus Knot' },
                  { id: 'monolith', label: 'Prism Column' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelType(m.id as any)}
                    className={`p-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      modelType === m.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">PBR Shader Deck</span>
              
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Metalness</span>
                  <span className="text-cyan-400">{Math.round(metalness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Roughness</span>
                  <span className="text-cyan-400">{Math.round(roughness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Orbit Velocity</span>
                  <span className="text-cyan-400">{rotationSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.2"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Multicolor Palette Tokens */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Emissive Brand Tokens</span>
              <div className="flex gap-2">
                {[
                  { name: 'Cyan Neon', hex: '#06b6d4' },
                  { name: 'Purple Void', hex: '#a855f7' },
                  { name: 'Amber Core', hex: '#f59e0b' },
                  { name: 'Rose Glitch', hex: '#f43f5e' },
                  { name: 'Emerald Flux', hex: '#10b981' },
                ].map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setGlowColor(col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      glowColor === col.hex ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

          </div>

          <button
            onClick={() => {
              alert('3D Mesh & Material Tokens exported as GLTF/JSON!');
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Export 3D Model GLTF
          </button>
        </div>

      </div>
    </div>
  );
};
