export class AudioManager {
  private ctx: AudioContext | null = null;

  private ensureCtx() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playPick() {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  playWrongPick() {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  playLevelComplete() {
    const ctx = this.ensureCtx();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  }

  playGameOver() {
    const ctx = this.ensureCtx();
    const notes = [400, 350, 300, 200];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);

      osc.start(ctx.currentTime + i * 0.2);
      osc.stop(ctx.currentTime + i * 0.2 + 0.4);
    });
  }

  playVictory() {
    const ctx = this.ensureCtx();
    const t = ctx.currentTime;

    // Triumphant brass-like fanfare (two layered oscillators per note)
    const fanfare = [
      { freq: 392, time: 0,    dur: 0.25 }, // G4
      { freq: 523, time: 0.2,  dur: 0.25 }, // C5
      { freq: 659, time: 0.4,  dur: 0.25 }, // E5
      { freq: 784, time: 0.6,  dur: 0.5  }, // G5 (held)
      { freq: 659, time: 1.0,  dur: 0.15 }, // E5
      { freq: 784, time: 1.15, dur: 0.15 }, // G5
      { freq: 1047, time: 1.3, dur: 0.8  }, // C6 (big finish, held)
    ];

    fanfare.forEach(({ freq, time, dur }) => {
      // Main tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, t + time);
      gain1.gain.setValueAtTime(0.18, t + time);
      gain1.gain.setValueAtTime(0.18, t + time + dur * 0.7);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      osc1.start(t + time);
      osc1.stop(t + time + dur + 0.05);

      // Harmonic overtone for richness
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, t + time);
      gain2.gain.setValueAtTime(0.06, t + time);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      osc2.start(t + time);
      osc2.stop(t + time + dur + 0.05);
    });

    // Shimmering high sparkle at the end
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const sparkleFreq = 2000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(sparkleFreq, t + 1.5 + i * 0.08);
      gain.gain.setValueAtTime(0.04, t + 1.5 + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5 + i * 0.08 + 0.3);
      osc.start(t + 1.5 + i * 0.08);
      osc.stop(t + 1.5 + i * 0.08 + 0.35);
    }
  }

  playReveal() {
    const ctx = this.ensureCtx();
    // Soft "whoosh" — neutral sound distinct from pick and wrong-pick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  playTick() {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }
}
