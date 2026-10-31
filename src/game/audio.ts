import { GameSettings } from './rules';

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getGain(settings: GameSettings, channel: 'sfx' | 'music'): number {
    if (settings.muted) return 0;
    const master = settings.masterVolume / 100;
    const sub = (channel === 'sfx' ? settings.sfxVolume : settings.musicVolume) / 100;
    return Math.max(0, Math.min(1, master * sub));
  }

  public playStrike(settings: GameSettings, heavy = false): void {
    const vol = this.getGain(settings, 'sfx');
    if (vol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pitchVar = 0.92 + Math.random() * 0.16;
    osc.type = heavy ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime((heavy ? 130 : 210) * pitchVar, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + (heavy ? 0.22 : 0.12));

    gain.gain.setValueAtTime(vol * (heavy ? 0.42 : 0.26), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.24 : 0.13));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (heavy ? 0.25 : 0.14));
  }

  public playHitGore(settings: GameSettings, isKill = false): void {
    const vol = this.getGain(settings, 'sfx');
    if (vol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isKill ? 95 : 140, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + (isKill ? 0.32 : 0.16));

    gain.gain.setValueAtTime(vol * (isKill ? 0.55 : 0.34), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isKill ? 0.34 : 0.18));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isKill ? 0.35 : 0.19));
  }

  public playSkill(settings: GameSettings, skill: 'lasso' | 'fire' | 'dodge'): void {
    const vol = this.getGain(settings, 'sfx');
    if (vol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (skill === 'lasso') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
    } else if (skill === 'fire') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.32);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
    }

    gain.gain.setValueAtTime(vol * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  public playWarHorn(settings: GameSettings, victory = true): void {
    const vol = this.getGain(settings, 'music');
    if (vol <= 0.01) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = victory ? [146.83, 220.0, 293.66] : [146.83, 138.59, 110.0];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const start = now + idx * 0.16;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * 0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.56);
    });
  }
}

export const soundEngine = new ProceduralAudioEngine();
