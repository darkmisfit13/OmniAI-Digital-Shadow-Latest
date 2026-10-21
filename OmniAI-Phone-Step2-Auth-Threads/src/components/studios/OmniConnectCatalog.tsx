import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Plus, 
  ShieldCheck, 
  Zap,
  Globe,
  Lock,
  Search
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

interface IntegrationApp {
  id: string;
  name: string;
  category: string;
  desc: string;
  iconBg: string;
  connected: boolean;
  authType: 'OAuth 2.0' | 'API Key' | 'Webhook';
}

export const OmniConnectCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  const [apps, setApps] = useState<IntegrationApp[]>([
    { id: 'github', name: 'GitHub', category: 'Developer Tools', desc: 'Sync repositories, pull requests, automated commits and branches directly from OmniCode.', iconBg: 'bg-slate-800 text-white', connected: true, authType: 'OAuth 2.0' },
    { id: 'salesforce', name: 'Salesforce CRM', category: 'Enterprise CRM', desc: 'Sync client deals, pipeline leads, and customer conversation records.', iconBg: 'bg-blue-600 text-white', connected: false, authType: 'OAuth 2.0' },
    { id: 'hubspot', name: 'HubSpot', category: 'Marketing & Sales', desc: 'Track marketing campaign leads, inbound contacts, and automated newsletters.', iconBg: 'bg-orange-600 text-white', connected: false, authType: 'OAuth 2.0' },
    { id: 'discord', name: 'Discord', category: 'Community & Voice', desc: 'Deploy automated server bots, voice channel notifications, and studio clip drops.', iconBg: 'bg-indigo-600 text-white', connected: true, authType: 'Webhook' },
    { id: 'stripe', name: 'Stripe Billing', category: 'Payments', desc: 'Manage Creator Pro and Studio Ultra recurring subscriptions & invoicing.', iconBg: 'bg-purple-600 text-white', connected: true, authType: 'API Key' },
    { id: 'figma', name: 'Figma', category: 'Design', desc: 'Import frame layouts, design tokens, and components directly into Omni Cosmic UI Lab.', iconBg: 'bg-rose-600 text-white', connected: false, authType: 'OAuth 2.0' },
    { id: 'slack', name: 'Slack', category: 'Team Chat', desc: 'Dispatch instant alerts on staging build deploys and high-urgency client messages.', iconBg: 'bg-emerald-600 text-white', connected: true, authType: 'OAuth 2.0' },
    { id: 'notion', name: 'Notion', category: 'Knowledge Base', desc: 'Sync meeting transcripts, OmniBeat storyboards, and project documentation.', iconBg: 'bg-slate-900 text-white', connected: false, authType: 'OAuth 2.0' },
    { id: 'shopify', name: 'Shopify Store', category: 'E-Commerce', desc: 'Update merchandise products, track fulfillment, and generate social promos.', iconBg: 'bg-lime-600 text-slate-950', connected: false, authType: 'API Key' },
    { id: 'zapier', name: 'Zapier', category: 'Automation', desc: 'Connect OmniAI webhooks to 5,000+ external business workflows.', iconBg: 'bg-amber-600 text-white', connected: true, authType: 'Webhook' },
    { id: 'webflow', name: 'Webflow CMS', category: 'CMS & Sites', desc: 'Export full-stack generated pages from OmniForge directly into live sites.', iconBg: 'bg-blue-500 text-white', connected: false, authType: 'API Key' },
  ]);

  const handleToggleConnect = (id: string) => {
    setOrbPhase('processing');
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, connected: !app.connected } : app))
    );
    setTimeout(() => setOrbPhase('idle'), 600);
  };

  const filteredApps = apps.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI CONNECT EXTERNAL APP CATALOG
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                ECOSYSTEM DIRECTORY
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Connect GitHub, Salesforce, HubSpot, Stripe, Discord, Slack & Shopify</p>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        
        {/* Banner with Omni Orb */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/30 via-slate-900 to-[#0c0f17] border border-blue-500/30 shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <HoloOrb phase={orbPhase} className="w-full h-full" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-widest block">
              ENTERPRISE TOOL CONNECTIONS
            </span>
            <h4 className="text-base font-bold text-white">The Unified Command Center For All Your Tools</h4>
            <p className="text-xs text-slate-300 mt-1">
              Never switch between fragmented browser tabs again. OmniAI connects with your entire stack so your creative assets and code flow seamlessly.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by name, category, or workflow..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {['all', 'Developer Tools', 'Payments', 'Marketing & Sales', 'Community & Voice', 'Design'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Tools' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* App Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                app.connected
                  ? 'bg-slate-900/90 border-blue-500/40 shadow-lg shadow-blue-950/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${app.iconBg} flex items-center justify-center font-black text-sm shadow-md`}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{app.category}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {app.authType}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{app.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                  app.connected ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {app.connected ? <Check className="w-3 h-3" /> : '•'}
                  {app.connected ? 'ACTIVE & PAIRED' : 'NOT CONNECTED'}
                </span>

                <button
                  onClick={() => handleToggleConnect(app.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    app.connected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                  }`}
                >
                  {app.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
