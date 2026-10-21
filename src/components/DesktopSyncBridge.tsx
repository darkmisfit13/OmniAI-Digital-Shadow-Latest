import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Share2, 
  Sliders, 
  Terminal, 
  QrCode, 
  Radio, 
  ExternalLink,
  Code2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { HoloOrb } from './HoloOrb';

interface DesktopSyncBridgeProps {
  onInsertToKeyboard?: (text: string) => void;
  onToggleDesktopOverlay?: () => void;
  isDesktopOverlayActive?: boolean;
}

export const DesktopSyncBridge: React.FC<DesktopSyncBridgeProps> = ({
  onInsertToKeyboard,
  onToggleDesktopOverlay,
  isDesktopOverlayActive,
}) => {
  const [activePlatform, setActivePlatform] = useState<'macos' | 'windows' | 'browser'>('macos');
  const [pairingPin] = useState('742-890');
  const [isSyncing, setIsSyncing] = useState(false);
  const [pairedDevice, setPairedDevice] = useState<string | null>('MacBook Pro M3 Max');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Cross-device synced clipboard items
  const [syncedClipboard, setSyncedClipboard] = useState<Array<{ id: string; device: string; text: string; time: string }>>([
    {
      id: 'clip_1',
      device: 'Laptop (VS Code)',
      text: 'const authHeaders = { Authorization: `Bearer ${token}` };',
      time: '2 mins ago',
    },
    {
      id: 'clip_2',
      device: 'Phone (Omni Key)',
      text: 'Regression suite passed locally. Pushing build #402 in 15 minutes.',
      time: '6 mins ago',
    },
    {
      id: 'clip_3',
      device: 'Laptop (Slack)',
      text: 'Alex Rivera: Client VP requested unvarnished ETA on staging deployment.',
      time: '12 mins ago',
    },
  ]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // macOS Native Global System-Wide Floating Window (Swift / SwiftUI)
  const macosSwiftCode = `//
// OmniKeyDesktopOverlay.swift
// macOS System-Wide Floating Overlay HUD with Global Shortcut (⌘+Shift+K)
// Dark Misfit Studios • OmniAI Systems
//

import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    var statusItem: NSStatusItem!
    var overlayWindow: NSPanel!
    var globalHotkeyMonitor: Any?

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        setupStatusBarItem()
        setupFloatingOverlayWindow()
        registerGlobalHotkey()
    }

    private func setupStatusBarItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.title = "⚡ OmniKey"
            button.action = #selector(toggleOverlay)
        }
    }

    private func setupFloatingOverlayWindow() {
        // Floating borderless panel that sits on top of all full-screen desktop applications
        overlayWindow = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 420, height: 160),
            styleMask: [.nonactivatingPanel, .borderless],
            backing: .buffered,
            defer: false
        )
        overlayWindow.level = .floating
        overlayWindow.isFloatingPanel = true
        overlayWindow.backgroundColor = NSColor(calibratedRed: 0.043, green: 0.043, blue: 0.047, alpha: 0.94)
        overlayWindow.isOpaque = false
        overlayWindow.hasShadow = true
        overlayWindow.center()
        
        // Host SwiftUI Omni Key Nocturnal Cool input dock
        overlayWindow.contentView = NSHostingView(rootView: OmniKeyVolumetricBarView())
    }

    private func registerGlobalHotkey() {
        // Global monitor for ⌘ + Shift + K across whole macOS system
        globalHotkeyMonitor = NSEvent.addGlobalMonitorForEvents(matching: .keyDown) { [weak self] event in
            if event.modifierFlags.contains([.command, .shift]) && event.charactersIgnoringModifiers == "K" {
                self?.toggleOverlay()
            }
        }
    }

    @objc func toggleOverlay() {
        if overlayWindow.isVisible {
            overlayWindow.orderOut(nil)
        } else {
            // Position above active focused desktop app (Slack, VS Code, Browser)
            let mouseLoc = NSEvent.mouseLocation
            overlayWindow.setFrameOrigin(NSPoint(x: mouseLoc.x - 210, y: mouseLoc.y - 180))
            overlayWindow.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
        }
    }
}

struct OmniKeyVolumetricBarView: View {
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("Omni Key")
                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(red: 0.0, green: 0.949, blue: 0.996))
                Text("Dark Misfit Studios")
                    .font(.system(size: 9, weight: .medium, design: .monospaced))
                    .foregroundColor(Color.gray)
                Spacer()
                Text("⌘⇧K to toggle")
                    .font(.system(size: 9, design: .monospaced))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 12)
            .padding(.top, 8)
            
            // Sliding suggestions for active window
            HStack(spacing: 6) {
                SuggestionChipView(tag: "WITTY", text: "Code compiling. Live at 11:00 AM sharp.")
                SuggestionChipView(tag: "HONEST", text: "Fix verified locally. Pushing build #402 in 15m.")
            }
            .padding(.horizontal, 8)
        }
        .frame(width: 420, height: 160)
        .background(Color(red: 0.043, green: 0.043, blue: 0.047))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.cyan.opacity(0.4), lineWidth: 1))
        .cornerRadius(16)
    }
}`;

  // Windows / Linux System-Wide HUD (Tauri / Rust Global Shortcut)
  const windowsRustCode = `//
// main.rs - Tauri 2.0 Global System-Wide Overlay HUD
// Dark Misfit Studios • OmniAI Systems
//

use tauri::{Manager, GlobalShortcutManager};

#[tauri::command]
fn sync_clipboard_to_phone(text: String) {
    println!("[OmniKey Tunnel] Syncing text to mobile: {}", text);
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            
            // Set window always on top with no borders for universal desktop HUD
            window.set_always_on_top(true)?;
            window.set_decorations(false)?;

            // Register universal Windows system-wide hotkey: Ctrl + Shift + K
            let mut shortcuts = app.global_shortcut_manager();
            let window_clone = window.clone();
            shortcuts.register("Ctrl+Shift+K", move || {
                if window_clone.is_visible().unwrap_or(false) {
                    window_clone.hide().unwrap();
                } else {
                    window_clone.show().unwrap();
                    window_clone.set_focus().unwrap();
                }
            })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running OmniKey desktop companion");
}`;

  // Chrome / Edge / Brave Manifest V3 System SidePanel & Overlay
  const browserManifest = `{
  "manifest_version": 3,
  "name": "Omni Key - Dark Misfit Studios",
  "version": "4.2.0",
  "description": "System-wide nocturnal cool keyboard assistant and live viewport cognition.",
  "permissions": ["activeTab", "sidePanel", "clipboardRead", "clipboardWrite", "storage"],
  "action": {
    "default_title": "Open Omni Key"
  },
  "side_panel": {
    "default_path": "index.html"
  },
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+K",
        "mac": "Command+Shift+K"
      },
      "description": "Toggle Omni Key system dock"
    }
  }
}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-slate-100 bg-[#000000] font-mono">
      {/* 1. BRANDING & LAPTOP SYNC HEADER */}
      <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#00f2fe]/40 shadow-[0_0_30px_rgba(0,242,254,0.2)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wider">Omni Key</h2>
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
              Dark Misfit Studios
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{pairedDevice ? 'DESKTOP LINKED' : 'UNPAIRED'}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-[11px]">
          Seamlessly mirror Omni Key between your mobile phone and laptop/PC. Type on either device with synchronized memory ledgers, shared clipboards, and a global system-wide toggle overlay.
        </p>

        {/* Live Laptop Overlay Toggle Switcher */}
        <div className="pt-1 flex items-center justify-between p-3 rounded-xl bg-black border border-white/10">
          <div>
            <span className="text-xs font-bold text-white block">
              Desktop Floating Overlay Toggle
            </span>
            <span className="text-[10px] text-slate-400">
              Hotkey: <strong className="text-[#00f2fe]">⌘+Shift+K</strong> (Mac) or <strong className="text-[#00f2fe]">Ctrl+Shift+K</strong> (PC)
            </span>
          </div>

          <button
            onClick={onToggleDesktopOverlay}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
              isDesktopOverlayActive
                ? 'bg-[#00f2fe] text-black shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : 'bg-[#0B0B0C] text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            {isDesktopOverlayActive ? 'Dock Active ●' : 'Launch Dock'}
          </button>
        </div>
      </div>

      {/* 2. DEVICE PAIRING TUNNEL */}
      <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[#00f2fe]" />
            <span>CROSS-DEVICE NEURAL TUNNEL</span>
          </span>
          <span className="text-[10px] text-slate-500">AES-256 Encrypted</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-black border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block">LINKED COMPUTER</span>
            <p className="font-bold text-white text-xs truncate">
              {pairedDevice || 'No laptop linked'}
            </p>
            <span className="text-[9px] text-[#00f2fe] flex items-center gap-1">
              <Check className="w-3 h-3" /> Bi-directional sync active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block">PAIRING PIN</span>
            <p className="font-mono font-bold text-[#00f2fe] text-sm tracking-wider">
              {pairingPin}
            </p>
            <span className="text-[9px] text-slate-500">Enter on laptop client</span>
          </div>
        </div>

        {/* Live Synced Clipboard Stream */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>LIVE SYNCED CLIPBOARD (PHONE ⇄ LAPTOP)</span>
          </span>

          <div className="space-y-1.5">
            {syncedClipboard.map((clip) => (
              <div
                key={clip.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/80 border border-white/5 text-xs hover:border-[#00f2fe]/40 transition group"
              >
                <div className="overflow-hidden flex-1 pr-2">
                  <div className="flex items-center gap-2 text-[9px] text-slate-400 mb-0.5">
                    <span className="font-bold text-[#00f2fe]">{clip.device}</span>
                    <span>•</span>
                    <span>{clip.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 truncate font-mono">
                    {clip.text}
                  </p>
                </div>

                <button
                  onClick={() => onInsertToKeyboard?.(clip.text)}
                  className="px-2 py-1 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-[10px] font-bold hover:bg-[#00f2fe]/20 transition shrink-0"
                >
                  Insert
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. NATIVE DESKTOP SYSTEM-WIDE APP CODE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#7f00ff]" />
            <span>NATIVE SYSTEM-WIDE DESKTOP COMPANION PACKAGES</span>
          </span>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActivePlatform('macos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
              activePlatform === 'macos'
                ? 'bg-[#00f2fe] text-black shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                : 'bg-[#0B0B0C] text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            macOS MenuBar & Overlay (Swift)
          </button>

          <button
            onClick={() => setActivePlatform('windows')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
              activePlatform === 'windows'
                ? 'bg-[#7f00ff] text-white shadow-[0_0_12px_rgba(127,0,255,0.3)]'
                : 'bg-[#0B0B0C] text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            Windows/Linux HUD (Tauri/Rust)
          </button>

          <button
            onClick={() => setActivePlatform('browser')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
              activePlatform === 'browser'
                ? 'bg-[#0575e6] text-white shadow-[0_0_12px_rgba(5,117,230,0.3)]'
                : 'bg-[#0B0B0C] text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            Browser Global SidePanel
          </button>
        </div>

        {/* Code Box */}
        <div className="rounded-2xl bg-[#0B0B0C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-3.5 py-2 bg-black border-b border-white/10 text-xs">
            <span className="font-mono text-[#00f2fe] text-[11px]">
              {activePlatform === 'macos'
                ? 'OmniKeyDesktopOverlay.swift (macOS ⌘⇧K HUD)'
                : activePlatform === 'windows'
                ? 'src-tauri/src/main.rs (Windows/Linux Global Hotkey)'
                : 'manifest.json (Chrome Manifest V3 SidePanel)'}
            </span>

            <button
              onClick={() => {
                const code =
                  activePlatform === 'macos'
                    ? macosSwiftCode
                    : activePlatform === 'windows'
                    ? windowsRustCode
                    : browserManifest;
                handleCopyCode(code, activePlatform);
              }}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              {copiedKey === activePlatform ? (
                <Check className="w-3.5 h-3.5 text-[#00f2fe]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === activePlatform ? 'Copied' : 'Copy Package'}</span>
            </button>
          </div>

          <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre max-h-64 leading-relaxed bg-[#050508]">
            {activePlatform === 'macos'
              ? macosSwiftCode
              : activePlatform === 'windows'
              ? windowsRustCode
              : browserManifest}
          </pre>
        </div>
      </div>
    </div>
  );
};
