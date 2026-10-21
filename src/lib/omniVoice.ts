// OmniVoice Engine for OmniAI - Your Shadow Companion
// High-tech nocturnal stoic voice synthesis & speech cognition

export type VoiceState = 'idle' | 'speaking' | 'listening';

type VoiceCallback = (state: VoiceState, text?: string) => void;

class OmniVoiceEngine {
  private isEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<VoiceCallback> = new Set();
  private recognition: any = null;
  private isListening: boolean = false;
  private activeState: VoiceState = 'idle';

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omni_voice_enabled');
      if (saved !== null) {
        this.isEnabled = saved === 'true';
      }

      // Pre-warm SpeechSynthesis voices
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.getPreferredVoice();
        };
      }
    }
  }

  public subscribe(cb: VoiceCallback): () => void {
    this.listeners.add(cb);
    cb(this.activeState);
    return () => this.listeners.delete(cb);
  }

  private notify(state: VoiceState, text?: string) {
    this.activeState = state;
    this.listeners.forEach((cb) => cb(state, text));
  }

  public getVoiceEnabled(): boolean {
    return this.isEnabled;
  }

  public setVoiceEnabled(val: boolean): boolean {
    this.isEnabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni_voice_enabled', String(val));
    }
    if (!val) {
      this.stop();
    }
    return this.isEnabled;
  }

  public toggleVoice(): boolean {
    return this.setVoiceEnabled(!this.isEnabled);
  }

  private getPreferredVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer stoic, deep, clear English voices
    const preferredNames = [
      'Daniel',
      'Aaron',
      'Alex',
      'Google UK English Male',
      'Microsoft David',
      'Arthur',
      'Fred',
      'en-GB',
      'en-US'
    ];

    for (const name of preferredNames) {
      const match = voices.find(
        (v) => v.name.toLowerCase().includes(name.toLowerCase()) || v.lang.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    return voices.find((v) => v.lang.startsWith('en')) || voices[0];
  }

  // Play subtle mechanical / cybernetic tone using Web Audio API as audio cue
  private playSonicPulse(frequency: number = 380, duration: number = 0.08) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext muted or blocked
    }
  }

  /**
   * Speak with OmniAI Nocturnal Cool persona
   */
  public speak(
    text: string,
    options?: {
      pitch?: number;
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): void {
    if (!this.isEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/⚡|🔥|✨|💀|🖤|💡|🎯|🚀/g, '')
      .trim();

    if (!cleanText) return;

    this.playSonicPulse(520, 0.06);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = this.getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Nocturnal Cool calibration: slightly deeper pitch, stoic calm cadence
    utterance.pitch = options?.pitch ?? 0.86;
    utterance.rate = options?.rate ?? 0.98;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.notify('speaking', cleanText);
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.notify('idle');
      options?.onEnd?.();
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.notify('idle');
      options?.onEnd?.();
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.isListening) {
      this.stopListening();
    }
    this.currentUtterance = null;
    this.notify('idle');
  }

  /**
   * Voice Input (Speech-to-Text)
   */
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: string) => void
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError?.('Speech recognition not supported in this browser.');
      return false;
    }

    try {
      this.stop(); // Stop any playback

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        this.isListening = true;
        this.notify('listening');
        this.playSonicPulse(880, 0.07);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, Boolean(finalTranscript));
      };

      rec.onerror = (e: any) => {
        this.isListening = false;
        this.notify('idle');
        onError?.(e.error || 'Voice input error');
      };

      rec.onend = () => {
        this.isListening = false;
        this.notify('idle');
      };

      this.recognition = rec;
      rec.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      this.notify('idle');
      onError?.(err?.message || 'Failed to start voice recognition');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // no-op
      }
      this.recognition = null;
    }
    this.isListening = false;
    this.notify('idle');
  }
}

export const omniVoice = new OmniVoiceEngine();
