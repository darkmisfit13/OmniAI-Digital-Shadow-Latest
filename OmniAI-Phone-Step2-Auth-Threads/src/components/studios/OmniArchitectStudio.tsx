import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  Radio, 
  Server, 
  Send, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Lock,
  Globe,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { HoloOrb, OrbPhase } from '../HoloOrb';

interface SchemaTable {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[];
}

export const OmniArchitectStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'auth_gateways' | 'api_inspector' | 'sql_terminal' | 'pipeline' | 'webhooks' | 'migration'>('schema');
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('idle');

  // Schema Playground Tables
  const [tables, setTables] = useState<SchemaTable[]>([
    {
      id: 'tbl_users',
      name: 'users',
      x: 40,
      y: 40,
      columns: [
        { name: 'id', type: 'UUID', isPrimary: true },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'role', type: 'ENUM("admin", "creator", "user")' },
        { name: 'created_at', type: 'TIMESTAMPTZ' }
      ]
    },
    {
      id: 'tbl_songs',
      name: 'songs',
      x: 340,
      y: 40,
      columns: [
        { name: 'id', type: 'UUID', isPrimary: true },
        { name: 'user_id', type: 'UUID', isForeign: true },
        { name: 'title', type: 'VARCHAR(255)' },
        { name: 'style', type: 'VARCHAR(100)' },
        { name: 'bpm', type: 'INT' }
      ]
    },
    {
      id: 'tbl_videos',
      name: 'videos',
      x: 180,
      y: 260,
      columns: [
        { name: 'id', type: 'UUID', isPrimary: true },
        { name: 'song_id', type: 'UUID', isForeign: true },
        { name: 'resolution', type: 'VARCHAR(50)' },
        { name: 'render_url', type: 'TEXT' }
      ]
    }
  ]);

  const [relationships, setRelationships] = useState<Array<{ from: string; to: string }>>([
    { from: 'users.id', to: 'songs.user_id' },
    { from: 'songs.id', to: 'videos.song_id' }
  ]);

  // Auth & Logic Gateways toggles
  const [gateways, setGateways] = useState({
    googleOAuth: true,
    stripePayments: true,
    rbacPermissions: true,
    emailPasswordAuth: false,
    multiTenantRoles: true,
  });

  // Auth Pipeline Constructor toggles
  const [pipelineNodes, setPipelineNodes] = useState({
    jwtSecurityLayer: true,
    httpOnlyCookieStorage: true,
    emailValidationWorkflow: false,
    refreshTokenRotation: true,
    rateLimitGuard: true,
  });

  // Swagger API Test States
  const [selectedEndpoint, setSelectedEndpoint] = useState<'GET /api/users' | 'POST /api/users' | 'GET /api/products' | 'POST /api/products' | 'GET /api/orders' | 'POST /api/orders' | 'GET /api/messages' | 'POST /api/messages' | 'POST /api/auth/sign-in'>('GET /api/users');
  const [apiTestResponse, setApiTestResponse] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Webhook targets
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourapp.com/hooks/user-created');
  const [webhookEvent, setWebhookEvent] = useState('database.insert.users');
  const [webhooksList, setWebhooksList] = useState<string[]>([
    'https://api.yourapp.com/hooks/user-created'
  ]);

  // Migration Console States
  const [migrationStatus, setMigrationStatus] = useState<'synced' | 'pending'>('pending');
  const [stageLevel, setStageLevel] = useState<'dev' | 'stage' | 'live'>('dev');

  const handleRunApiTest = () => {
    setIsTestingApi(true);
    setOrbPhase('processing');

    setTimeout(() => {
      setIsTestingApi(false);
      setOrbPhase('idle');
      if (selectedEndpoint === 'GET /api/users') {
        setApiTestResponse(JSON.stringify({
          status: 200,
          latency: '24ms',
          data: [
            { id: 'usr_1', email: 'darkmisfit.ai@gmail.com', role: 'owner' },
            { id: 'usr_2', email: 'creator@studio.io', role: 'creator' }
          ]
        }, null, 2));
      } else if (selectedEndpoint === 'POST /api/auth/sign-in') {
        setApiTestResponse(JSON.stringify({
          status: 200,
          latency: '41ms',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          session: { active: true, expires_in: 3600 }
        }, null, 2));
      } else {
        setApiTestResponse(JSON.stringify({
          status: 200,
          latency: '19ms',
          message: `Endpoint ${selectedEndpoint} executed successfully with mock schema.`
        }, null, 2));
      }
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-3 bg-[#0d1017] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              OMNI ARCHITECT
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                DATABASE & API DESIGN
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Visual schema builder, Swagger API inspector, raw PostgreSQL terminal & auth pipeline</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 overflow-x-auto">
          {[
            { id: 'schema', label: 'Schema Canvas' },
            { id: 'auth_gateways', label: 'Auth Gateways' },
            { id: 'api_inspector', label: 'API Inspector' },
            { id: 'sql_terminal', label: 'PostgreSQL Terminal' },
            { id: 'pipeline', label: 'Auth Pipeline' },
            { id: 'webhooks', label: 'Webhooks' },
            { id: 'migration', label: 'Migration' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                activeTab === t.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        
        {/* TAB 1: VISUAL SCHEMA PLAYGROUND */}
        {activeTab === 'schema' && (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Interactive Schema Canvas
                </span>
                <span className="text-xs text-slate-500">Multicolor glowing relationship connectors</span>
              </div>
              <button
                onClick={() => setRelationships([])}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear Relationships
              </button>
            </div>

            {/* Canvas Playground */}
            <div className="flex-1 min-h-[460px] bg-slate-950/80 rounded-2xl border border-slate-800 relative p-6 overflow-hidden shadow-inner flex flex-wrap gap-6 items-start">
              
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="w-72 rounded-xl bg-slate-900/95 border-2 border-cyan-500/40 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Table Header */}
                  <div className="px-3 py-2 bg-gradient-to-r from-cyan-950 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      {tbl.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">TABLE</span>
                  </div>

                  {/* Columns */}
                  <div className="p-2 space-y-1 font-mono text-xs">
                    {tbl.columns.map((col, cIdx) => (
                      <div
                        key={cIdx}
                        className="px-2 py-1 rounded bg-black/40 border border-slate-800/80 flex items-center justify-between hover:border-cyan-400/50 transition-colors cursor-pointer"
                        title="Click to link relationship line"
                      >
                        <div className="flex items-center gap-1.5">
                          {col.isPrimary && <span className="text-amber-400 text-[10px] font-bold">PK</span>}
                          {col.isForeign && <span className="text-purple-400 text-[10px] font-bold">FK</span>}
                          <span className="text-slate-200">{col.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Glowing Active Relationships Box */}
              <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/40 space-y-1 text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase block text-[10px]">Active Relational Graph:</span>
                {relationships.map((r, idx) => (
                  <div key={idx} className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{r.from}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span className="text-purple-300">{r.to}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: AUTH & LOGIC GATEWAYS */}
        {activeTab === 'auth_gateways' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Authentication & Logic Gateways Control</h4>
              <p className="text-xs text-slate-400">Toggle enterprise-grade authentication and payment hooks into schema</p>
            </div>

            <div className="space-y-3">
              {[
                { key: 'googleOAuth', label: 'Google OAuth Sign-In', desc: 'Secure Google Workspace integration with token rotation' },
                { key: 'stripePayments', label: 'Stripe Payment Gateway', desc: 'Auto-sync checkout sessions & webhook subscriptions' },
                { key: 'rbacPermissions', label: 'Role-Based Permissions (RBAC)', desc: 'Hierarchical owner, admin, creator & member authorization' },
                { key: 'emailPasswordAuth', label: 'Email / Password Auth with Salt', desc: 'Bcrypt hashed password credential handling' },
                { key: 'multiTenantRoles', label: 'Multi-Tenant Role Ownership', desc: 'Database row-level isolation per tenant domain' },
              ].map((gw) => (
                <div key={gw.key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{gw.label}</h5>
                    <p className="text-xs text-slate-400">{gw.desc}</p>
                  </div>
                  <button
                    onClick={() => setGateways((prev) => ({ ...prev, [gw.key]: !(prev as any)[gw.key] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      (gateways as any)[gw.key] ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        (gateways as any)[gw.key] ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE API DOCUMENTATION INSPECTOR (SWAGGER STYLE) */}
        {activeTab === 'api_inspector' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Swagger-Style Live API Docs Inspector</h4>
                <p className="text-xs text-slate-400">Auto-generated REST & GraphQL endpoint reference with interactive live test execution</p>
              </div>
            </div>

            {/* Endpoint Selector Bar */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center">
              {[
                'GET /api/users',
                'POST /api/users',
                'GET /api/products',
                'POST /api/products',
                'GET /api/orders',
                'POST /api/orders',
                'GET /api/messages',
                'POST /api/messages',
                'POST /api/auth/sign-in',
              ].map((ep) => (
                <button
                  key={ep}
                  onClick={() => setSelectedEndpoint(ep as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedEndpoint === ep
                      ? ep.startsWith('GET')
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ep}
                </button>
              ))}

              <button
                onClick={handleRunApiTest}
                disabled={isTestingApi}
                className="ml-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                {isTestingApi ? 'Testing...' : 'Test Request'}
              </button>
            </div>

            {/* Test Results Output */}
            {apiTestResponse && (
              <div className="p-4 rounded-xl bg-black border border-blue-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900 pb-2">
                  <span className="text-emerald-400 font-bold">200 OK • Response Payload</span>
                  <span>Content-Type: application/json</span>
                </div>
                <pre className="text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {apiTestResponse}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SQL SCHEMA RAW TERMINAL */}
        {activeTab === 'sql_terminal' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">PostgreSQL & Prisma Migration Terminal</h4>
                <p className="text-xs text-slate-400">Real-time code representations generated from active visual graph</p>
              </div>
              <button
                onClick={() => alert('SQL migration code copied to clipboard!')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy SQL
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed shadow-2xl">
              <span className="text-slate-500 block mb-2">-- Generated PostgreSQL Schema DDL</span>
              {`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  style VARCHAR(100),
  bpm INT
);

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  resolution VARCHAR(50) DEFAULT '1080p',
  render_url TEXT
);`}
            </div>
          </div>
        )}

        {/* TAB 5: AUTH PIPELINE CONSTRUCTOR */}
        {activeTab === 'pipeline' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">One-Click Auth Pipeline Constructor</h4>
              <p className="text-xs text-slate-400">Toggle security layers directly into Express middleware request chain</p>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'jwtSecurityLayer', label: 'JWT Security Token Layer', desc: 'Stateless signature verification on every authenticated route' },
                { key: 'httpOnlyCookieStorage', label: 'HTTP-Only Cookie Storage', desc: 'Prevents XSS token exfiltration by locking cookies to browser origin' },
                { key: 'emailValidationWorkflow', label: 'Email Validation Workflow', desc: 'Sends magic link verification before activating user record' },
                { key: 'refreshTokenRotation', label: 'Refresh Token Rotation', desc: 'Invalidates previous refresh token immediately upon reuse' },
                { key: 'rateLimitGuard', label: 'Rate Limit Guard (Redis Matrix)', desc: 'Blocks brute force and denial of wallet request flooding' },
              ].map((node) => (
                <div key={node.key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{node.label}</h5>
                    <p className="text-[11px] text-slate-400">{node.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(pipelineNodes as any)[node.key]}
                    onChange={(e) => setPipelineNodes((prev) => ({ ...prev, [node.key]: e.target.checked }))}
                    className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WEBHOOK PAYLOAD BROADCASTER */}
        {activeTab === 'webhooks' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Webhook Payload Broadcaster</h4>
              <p className="text-xs text-slate-400">Configure custom outgoing API POST triggers on database mutations</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Broadcast URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.yourapp.com/hooks/user-created"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono outline-none"
                  />
                  <button
                    onClick={() => {
                      if (webhookUrl) {
                        setWebhooksList((prev) => [...prev, webhookUrl]);
                        alert('Broadcast target registered!');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono"
                  >
                    Add Target
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Active Broadcast Targets:</span>
                {webhooksList.map((target, idx) => (
                  <div key={idx} className="p-2 rounded bg-black/40 text-xs font-mono text-cyan-300 flex items-center justify-between">
                    <span>{target}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">TRIGGER: ON INSERT</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DATABASE MIGRATION CONSOLE */}
        {activeTab === 'migration' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Database Migration Console</h4>
              <p className="text-xs text-slate-400">Visual staging paths tracking updates between development schema & production database</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between">
                {[
                  { level: 'dev', label: '1. Development Schema', badge: 'Active' },
                  { level: 'stage', label: '2. Staging Database', badge: stageLevel === 'stage' || stageLevel === 'live' ? 'Synced' : 'Pending' },
                  { level: 'live', label: '3. Production Live', badge: stageLevel === 'live' ? 'Live' : 'Standby' },
                ].map((st, idx) => (
                  <div key={idx} className="flex-1 text-center space-y-1">
                    <span className="text-xs font-bold text-white block">{st.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      st.badge === 'Live' || st.badge === 'Synced' || st.badge === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {st.badge}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setStageLevel('stage');
                    alert('Promoted development schema to Staging!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Promote to Stage
                </button>
                <button
                  onClick={() => {
                    setStageLevel('live');
                    alert('Promoted stage build to Production Live!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg"
                >
                  Promote to Live
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
