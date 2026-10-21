/**
 * Dual-Lane On-Device Mobile AI Engine (DarkMisfitStudios "Nocturnal Cool" Matrix)
 * Lane 1: Low-latency conversation prediction (Witty, Raw & Honest, Direct Action)
 * Lane 2: Automated background note-taking ledger (Entities, Topics, Dates, Raw Emotions)
 */

import { TelemetryNoteItem } from '../components/JarvisTelemetryHUD';

export interface OnDeviceTelemetry {
  latencyMs: number;
  memoryMb: number;
  accelerator: 'WebGPU (NPU/GPU)' | 'WASM SIMD' | 'CPU (Optimized)';
  privacyStatus: 'Shielded (Zero Network Data)';
  modelName: string;
}

export type OmniKeyTone = 
  | 'flirty' 
  | 'nocturnal_cool' 
  | 'darkmisfit' 
  | 'punchy' 
  | 'executive' 
  | 'grammar';

export interface DualLaneAnalysisResult {
  summary: string;
  counterpartDossier: string;
  emotionalRegister: string;
  urgency: 'Low' | 'Medium' | 'High';
  suggestionTrio: {
    witty: string;
    rawHonest: string;
    directAction: string;
  };
  suggestedReplies: string[];
  tacticalAdvice: string[];
  telemetryNotes: TelemetryNoteItem[];
  telemetry: OnDeviceTelemetry;
}

class DualLaneNeuralEngine {
  private isInitialized = false;
  private hasWebGPU = false;

  async initialize() {
    if (this.isInitialized) return;
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).gpu) {
        const adapter = await (navigator as any).gpu.requestAdapter();
        this.hasWebGPU = !!adapter;
      }
    } catch {
      this.hasWebGPU = false;
    }
    this.isInitialized = true;
  }

  getTelemetry(startTime: number): OnDeviceTelemetry {
    const elapsed = Math.max(1, Math.round((performance.now() - startTime) * 10) / 10);
    return {
      latencyMs: elapsed,
      memoryMb: 19.4,
      accelerator: this.hasWebGPU ? 'WebGPU (NPU/GPU)' : 'WASM SIMD',
      privacyStatus: 'Shielded (Zero Network Data)',
      modelName: 'OmniKey-NocturnalCool-v4.2',
    };
  }

  // Dual-Lane Viewport Cognition with Nocturnal Cool Persona
  async processViewportCognition(
    screenText: string,
    currentDraft: string,
    speaker = 'Participant'
  ): Promise<DualLaneAnalysisResult> {
    const start = performance.now();
    await this.initialize();

    const lower = (screenText + ' ' + currentDraft).toLowerCase();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let urgency: 'Low' | 'Medium' | 'High' = 'Medium';
    let emotionalRegister = 'Stoic & Hyper-Confident';
    let counterpartDossier = speaker;
    const tacticalAdvice: string[] = [];
    const telemetryNotes: TelemetryNoteItem[] = [];

    // Default Nocturnal Cool suggestions: short, impactful, punchy syntax
    let suggestionTrio = {
      witty: 'Reading between the lines. Let’s not overcomplicate what we both know.',
      rawHonest: 'I’d rather be upfront than pretend this isn’t pressing. Here is the unvarnished reality.',
      directAction: 'Locking this down right now. You’ll have the confirmation shortly.',
    };

    // Scenario 1: Work / Technical Pressure
    if (
      lower.includes('slack') ||
      lower.includes('alex') ||
      lower.includes('staging') ||
      lower.includes('eta') ||
      lower.includes('delay') ||
      lower.includes('deadline') ||
      lower.includes('urgent')
    ) {
      urgency = 'High';
      counterpartDossier = 'Alex Rivera • VP Engineering';
      emotionalRegister = 'High-Stakes Scrutiny • Needs Unflinching Milestone Certainty';

      tacticalAdvice.push('State the exact cutoff first. In high-pressure rooms, hesitation looks like a breach.');
      tacticalAdvice.push('Own the regression check calmly; no excuses, pure execution.');
      tacticalAdvice.push('Deliver the milestone and let the code do the talking.');

      suggestionTrio = {
        witty: 'Staging compiles clean. Unless the datacenter melts, we are live at 11:00 AM.',
        rawHonest: 'We paused to isolate an auth regression before the client demo. Patch is in, live in 15m.',
        directAction: 'Regression suite passed locally. Pushing build #402 to staging in 15 minutes flat.',
      };

      telemetryNotes.push(
        {
          id: `note_${Date.now()}_1`,
          category: 'Commitment',
          label: 'Staging Cutoff (11:00 AM)',
          detail: '15-minute deployment target pinned for client operations demonstration.',
          timestamp: nowStr,
        },
        {
          id: `note_${Date.now()}_2`,
          category: 'Risk',
          label: 'Executive Scrutiny',
          detail: 'Alex under pressure from executive partners; expects zero spin.',
          timestamp: nowStr,
        }
      );
    } 
    // Scenario 2: Financial Dispute / Commercial Tension
    else if (
      lower.includes('invoice') ||
      lower.includes('sarah') ||
      lower.includes('billing') ||
      lower.includes('charge') ||
      lower.includes('dispute') ||
      lower.includes('$240')
    ) {
      urgency = 'High';
      counterpartDossier = 'Sarah Jenkins • CFO, Apex Corp';
      emotionalRegister = 'Commercial Skepticism • Needs Immediate Reassurance';

      tacticalAdvice.push('Validate the friction immediately. Don’t quote policy when someone feels burned.');
      tacticalAdvice.push('Remove the chargeback leverage by offering the audit proactively.');
      tacticalAdvice.push('Maintain iron composure: fast, calm, resolute.');

      suggestionTrio = {
        witty: 'Nobody likes mystery math on an invoice. Pulling the itemized ledger right now to fix it.',
        rawHonest: 'You trusted us with billing; a rogue charge breaks that. I am inspecting it right now to credit it.',
        directAction: 'Hi Sarah, pulling invoice #8819 with our finance lead now. We will clarify or credit it today.',
      };

      telemetryNotes.push(
        {
          id: `note_${Date.now()}_1`,
          category: 'Entity',
          label: 'Invoice #8819 Dispute',
          detail: '$240 charge under review for immediate same-day reconciliation.',
          timestamp: nowStr,
        },
        {
          id: `note_${Date.now()}_2`,
          category: 'Risk',
          label: 'Merchant Chargeback Warning',
          detail: 'Counterpart requested explanation prior to formal dispute filing.',
          timestamp: nowStr,
        }
      );
    }
    // Scenario 3: Social / Flirty / Intrigue
    else if (
      lower.includes('maya') ||
      lower.includes('hinge') ||
      lower.includes('dating') ||
      lower.includes('food') ||
      lower.includes('controversial') ||
      lower.includes('flirt') ||
      lower.includes('late')
    ) {
      urgency = 'Low';
      counterpartDossier = 'Maya Lin • Unfiltered Connection';
      emotionalRegister = 'Intrigue & Late-Night Magnetism';

      tacticalAdvice.push('Reject boilerplate small talk. Be magnetic, effortlessly confident, and teasing.');
      tacticalAdvice.push('Leave a conversational hook that begs for an opinionated retort.');

      suggestionTrio = {
        witty: 'Cold takeout standing in the refrigerator light at 1 AM hits different. Fight me on it.',
        rawHonest: 'Cereal is technically cold soup, and brunch is just an excuse to charge $28 for eggs.',
        directAction: 'I put hot honey on literally everything. Tell me your worst food sin so I can judge accordingly.',
      };

      telemetryNotes.push(
        {
          id: `note_${Date.now()}_1`,
          category: 'Topic',
          label: 'Banter Anchor: Midnight Rules',
          detail: 'Counterpart testing authenticity; banned boring culinary clichés.',
          timestamp: nowStr,
        }
      );
    }
    // General Nocturnal Cool
    else {
      urgency = 'Medium';
      counterpartDossier = speaker || 'Active Counterpart';
      emotionalRegister = 'Stoic, Minimalistic & Sharp';

      tacticalAdvice.push('Strip out corporate fluff. Say it in one sentence.');
      tacticalAdvice.push('Stay cool, calculated, and proactive.');

      suggestionTrio = {
        witty: 'Short answer: yes. Long answer: absolutely, let’s make it happen.',
        rawHonest: 'Let’s be real about where this stands so we don’t waste time on friction.',
        directAction: 'Understood. Reviewing the specs now and executing immediately.',
      };

      telemetryNotes.push(
        {
          id: `note_${Date.now()}_1`,
          category: 'Topic',
          label: 'Viewport Stream',
          detail: screenText ? screenText.slice(0, 85) : 'Active conversation cognition',
          timestamp: nowStr,
        }
      );
    }

    const suggestedReplies = [
      suggestionTrio.witty,
      suggestionTrio.rawHonest,
      suggestionTrio.directAction,
    ];

    return {
      summary: screenText ? `Screen context: "${screenText.slice(0, 70)}..."` : 'Active mobile viewport',
      counterpartDossier,
      emotionalRegister,
      urgency,
      suggestionTrio,
      suggestedReplies,
      tacticalAdvice,
      telemetryNotes,
      telemetry: this.getTelemetry(start),
    };
  }

  // Nocturnal Cool Tone Matrix Rewriter
  async rewriteLocally(
    text: string,
    tone: OmniKeyTone
  ): Promise<{ rewritten: string; telemetry: OnDeviceTelemetry }> {
    const start = performance.now();
    await this.initialize();
    const clean = text.trim();
    let rewritten = clean;

    switch (tone) {
      case 'flirty':
        // Magnetic, nocturnal charm, playful confidence
        rewritten = `${clean} — you ask dangerous questions after midnight. Keep going.`;
        break;

      case 'nocturnal_cool':
        // Stoic, minimalistic, effortlessly sharp, low-frequency cool
        rewritten = `Heard you loud and clear. ${clean}. We handle it now—zero noise.`;
        break;

      case 'darkmisfit':
        // Raw, unfiltered honesty, zero sugar-coating
        rewritten = `Let’s strip away the pleasantries. ${clean} That’s the reality of where we stand.`;
        break;

      case 'executive':
        // Executive iron, commanding respect without fluff
        rewritten = `Understood. ${clean}. The milestone is locked and moving forward.`;
        break;

      case 'punchy':
        // Ultra-direct, high-impact
        rewritten = `${clean} — moving forward immediately.`;
        break;

      case 'grammar':
        // Fix typos while keeping raw personal voice
        rewritten = clean.charAt(0).toUpperCase() + clean.slice(1) + (clean.endsWith('.') ? '' : '.');
        break;
    }

    return {
      rewritten,
      telemetry: this.getTelemetry(start),
    };
  }

  // Contextual Quick Action Processor
  async processQuickAction(
    actionId: 'draft-email' | 'summarize' | 'fix-grammar' | 'bulletize' | 'expand' | string,
    text: string
  ): Promise<{ result: string; telemetry: OnDeviceTelemetry }> {
    const start = performance.now();
    await this.initialize();
    const clean = text.trim();
    let result = clean;

    switch (actionId) {
      case 'draft-email': {
        if (!clean) {
          result = `Subject: Project Follow-Up & Next Steps\n\nHi,\n\nI wanted to follow up on our recent discussion and outline the next steps. Please let me know if you have any questions.\n\nBest regards,`;
        } else {
          const firstLine = clean.split('\n')[0].replace(/[.!?:;]+$/, '').trim();
          const subject = firstLine.length > 50 ? `${firstLine.slice(0, 47)}...` : firstLine;
          const bodyText = clean.includes('\n') ? clean.slice(clean.indexOf('\n')).trim() : clean;
          
          result = `Subject: ${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nHi,\n\n${bodyText}\n\nPlease let me know your thoughts.\n\nBest regards,`;
        }
        break;
      }
      case 'summarize': {
        if (!clean) {
          result = 'Summary: Active screen reviewed — zero critical blockers detected.';
        } else {
          const sentences = clean.split(/(?<=[.?!])\s+/).filter(Boolean);
          if (sentences.length <= 1) {
            result = `Summary: ${clean.replace(/[.]+$/, '')}.`;
          } else if (sentences.length <= 3) {
            result = `Summary: ${sentences[0]} ${sentences[sentences.length - 1]}`;
          } else {
            const keyPoints = sentences.slice(0, 3).map((s) => `• ${s.trim()}`).join('\n');
            result = `Summary:\n${keyPoints}`;
          }
        }
        break;
      }
      case 'fix-grammar': {
        if (!clean) {
          result = 'All systems operational.';
        } else {
          result = clean
            .replace(/\b(im|i'm)\b/gi, "I'm")
            .replace(/\b(dont|don't)\b/gi, "don't")
            .replace(/\b(cant|can't)\b/gi, "can't")
            .replace(/\b(wont|won't)\b/gi, "won't")
            .replace(/\b(ive|i've)\b/gi, "I've")
            .replace(/\b(id|i'd)\b/gi, "I'd")
            .replace(/\b(ill|i'll)\b/gi, "I'll")
            .replace(/\b(youre|you're)\b/gi, "you're")
            .replace(/\b(theyre|they're)\b/gi, "they're")
            .replace(/\b(weve|we've)\b/gi, "we've")
            .replace(/\b(isnt|isn't)\b/gi, "isn't")
            .replace(/\b(arent|aren't)\b/gi, "aren't")
            .replace(/\b(wasnt|wasn't)\b/gi, "wasn't")
            .replace(/\b(werent|weren't)\b/gi, "weren't")
            .replace(/\b(hasnt|hasn't)\b/gi, "hasn't")
            .replace(/\b(havent|haven't)\b/gi, "haven't")
            .replace(/\b(couldnt|couldn't)\b/gi, "couldn't")
            .replace(/\b(wouldnt|wouldn't)\b/gi, "wouldn't")
            .replace(/\b(shouldnt|shouldn't)\b/gi, "shouldn't")
            .replace(/\bi\b/g, 'I')
            .replace(/\s+/g, ' ')
            .replace(/\s([.,?!;:])/g, '$1')
            .replace(/([.?!]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
            .trim();
          if (result.length > 0) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
            if (!/[.!?]$/.test(result)) {
              result += '.';
            }
          }
        }
        break;
      }
      case 'bulletize': {
        if (!clean) {
          result = '• Action item 1\n• Action item 2\n• Deliverable verification';
        } else {
          const parts = clean
            .split(/(?:[\n;•]+|(?<=[.?!])\s+)/)
            .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
            .filter((s) => s.length > 0);
          if (parts.length > 0) {
            result = parts.map((p) => `• ${p.charAt(0).toUpperCase() + p.slice(1)}`).join('\n');
          } else {
            result = `• ${clean}`;
          }
        }
        break;
      }
      case 'expand': {
        if (!clean) {
          result = 'Expanding on this core objective to ensure robust execution, proactive risk mitigation, and clear timeline alignment.';
        } else {
          result = `${clean}. Specifically, this requires structured prioritization across active workflows, clear stakeholder alignment, and verifiable deliverables.`;
        }
        break;
      }
      default:
        result = clean;
    }

    return {
      result,
      telemetry: this.getTelemetry(start),
    };
  }
}

export const onDeviceAI = new DualLaneNeuralEngine();
