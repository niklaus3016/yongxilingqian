// 纯前端 Web Audio API 声音合成引擎（全离线·零资源依赖·极低延迟）

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private vibrationEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setConfig(sound: boolean, vibration: boolean) {
    this.enabled = sound;
    this.vibrationEnabled = vibration;
  }

  public vibrate(pattern: number | number[] = 25) {
    if (!this.vibrationEnabled || typeof window === 'undefined') return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore on unsupportive browser frames
      }
    }
  }

  // 1. 摇签筒：竹签密集摩擦碰撞声
  public playBambooRattle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([15, 30, 15]);

    const now = this.ctx.currentTime;
    const count = 4;

    for (let i = 0; i < count; i++) {
      const time = now + i * 0.04 + Math.random() * 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 900, time);
      filter.Q.setValueAtTime(4, time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 260, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.06);
    }
  }

  // 2. 电子木鱼：清脆木质敲击声与共鸣
  public playWoodenFish() {
    this.vibrate(40);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 主音（木腔基频）
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);

    // 敲击清脆泛音
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1250, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain2.gain.setValueAtTime(0.4, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc2.start(now);
    osc2.stop(now + 0.07);
  }

  // 3. 寺庙古磬/大钟：悠远沉厚回音
  public playTempleBell() {
    this.vibrate([30, 40, 50]);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 261.63; // C4

    // 基础谐波群
    const harmonics = [1, 2.02, 3.01, 4.15, 5.43];
    const amplitudes = [0.5, 0.35, 0.2, 0.12, 0.06];
    const decays = [2.8, 2.2, 1.6, 1.1, 0.8];

    harmonics.forEach((h, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      const amp = amplitudes[idx] || 0.1;
      const decay = decays[idx] || 1.5;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  // 4. 灵签出鞘 / 翻转金光之音
  public playLotReveal() {
    this.vibrate([20, 30, 60]);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 升音五度滑音 (G4 -> C6)
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  // 5. 按键点击/微交互水滴音
  public playClick(pitch: number = 440) {
    this.vibrate(10);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.05);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 6. 掷茭（圣杯碰撞落地声）
  public playJiaoThrow() {
    this.vibrate([20, 40, 20]);
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.05, 0.1].forEach((delay, idx) => {
      if (!this.ctx) return;
      const t = now + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 - idx * 60 + Math.random() * 40, t);
      gain.gain.setValueAtTime(0.35 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }
}

export const sound = new SoundEngine();

// 离线语音朗读（使用浏览器自带原生 Web Speech Synthesis 引擎）
export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85; // 沉稳平和的朗读语速
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
