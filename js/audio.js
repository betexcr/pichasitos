class AudioSystem {
  constructor() {
    this.ctx = null;
    this.musicInterval = null;
    this.musicType = null;
    this._initOnInteraction();
  }

  _initOnInteraction() {
    const handler = () => {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      document.removeEventListener('keydown', handler);
    };
    document.addEventListener('keydown', handler);
  }

  _ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  _playTone(freq, dur, type = 'square', vol = 0.3) {
    this._ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  _noise(dur, vol = 0.15) {
    this._ensure();
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    src.buffer = buf;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(t);
  }

  // --- 16-BIT SPEECH SYSTEM ---
  // Each character has a base pitch and waveform that gives them a distinct "voice"
  // Rapid short tones cycle through pitches to simulate retro speech

  speak(text, voiceProfile) {
    if (!text) return;
    const profile = voiceProfile || {};
    const basePitch = profile.pitch || 200;
    const speed = profile.speed || 40;
    const wave = profile.wave || 'square';
    const vol = profile.vol || 0.12;
    const variance = profile.variance || 60;

    const chars = text.replace(/[^A-Za-z0-9 ]/g, '').split('');
    let delay = 0;
    chars.forEach((ch, i) => {
      if (ch === ' ') { delay += speed * 1.5; return; }
      const pitchOff = ((ch.charCodeAt(0) * 7) % variance) - variance / 2;
      const freq = basePitch + pitchOff;
      setTimeout(() => {
        this._playTone(freq, 0.04, wave, vol);
      }, delay);
      delay += speed;
    });
  }

  speakOpponent(text, opponentName) {
    const voices = {
      'DON CARLOS':    { pitch: 140, speed: 50, wave: 'sawtooth', vol: 0.10, variance: 40 },
      'GRINGO':        { pitch: 220, speed: 35, wave: 'square',   vol: 0.10, variance: 80 },
      'CLARISA':       { pitch: 340, speed: 30, wave: 'square',   vol: 0.10, variance: 50 },
      'PANZAEPERRA':   { pitch: 120, speed: 38, wave: 'sawtooth', vol: 0.12, variance: 30 },
      'MICHIQUITO':    { pitch: 280, speed: 32, wave: 'square',   vol: 0.09, variance: 60 },
      'HITMENA':       { pitch: 240, speed: 34, wave: 'triangle', vol: 0.11, variance: 55 },
      'KAREN':         { pitch: 180, speed: 28, wave: 'sawtooth', vol: 0.13, variance: 45 },
      'CARRETASTAR':   { pitch: 150, speed: 45, wave: 'sawtooth', vol: 0.11, variance: 35 },
      'PERSEFONE':     { pitch: 300, speed: 26, wave: 'sine',     vol: 0.10, variance: 70 },
      'DON ALVARO':    { pitch: 100, speed: 55, wave: 'sawtooth', vol: 0.14, variance: 25 },
      'ANAI':          { pitch: 130, speed: 48, wave: 'triangle', vol: 0.10, variance: 40 },
      'SKIN':          { pitch: 90,  speed: 60, wave: 'sawtooth', vol: 0.14, variance: 20 },
      'EL INDIO':      { pitch: 110, speed: 50, wave: 'triangle', vol: 0.12, variance: 30 },
      'EL TORO':       { pitch: 60,  speed: 80, wave: 'sawtooth', vol: 0.16, variance: 15 },
    };
    this.speak(text, voices[opponentName] || { pitch: 180, speed: 40, wave: 'square', vol: 0.10, variance: 50 });
  }

  speakNarrator(text) {
    this.speak(text, { pitch: 200, speed: 30, wave: 'square', vol: 0.08, variance: 40 });
  }

  // --- SOUND EFFECTS ---

  coinInsert() {
    this._playTone(880, 0.08, 'square', 0.3);
    setTimeout(() => this._playTone(1320, 0.12, 'square', 0.3), 80);
  }

  menuConfirm() {
    this._playTone(523, 0.06, 'square', 0.25);
    setTimeout(() => this._playTone(784, 0.1, 'square', 0.25), 60);
  }

  menuSelect() {
    this._playTone(440, 0.04, 'square', 0.2);
  }

  roundStart() {
    const notes = [262, 330, 392, 523];
    notes.forEach((n, i) => {
      setTimeout(() => this._playTone(n, 0.15, 'square', 0.2), i * 120);
    });
  }

  punchHit() {
    this._noise(0.08, 0.25);
    this._playTone(150, 0.06, 'square', 0.2);
  }

  hitImpact(strength) {
    const s = Math.min(1, Math.max(0, strength || 0.5));
    this._noise(0.06 + s * 0.1, 0.15 + s * 0.25);
    this._playTone(100 + (1 - s) * 100, 0.04 + s * 0.08, 'square', 0.15 + s * 0.2);
    if (s > 0.7) this._playTone(60, 0.12, 'sawtooth', s * 0.15);
  }

  block() {
    this._playTone(200, 0.04, 'square', 0.15);
    this._noise(0.03, 0.1);
  }

  dodge() {
    this._playTone(400, 0.05, 'sine', 0.1);
    setTimeout(() => this._playTone(600, 0.04, 'sine', 0.08), 30);
  }

  hurt() {
    this._playTone(120, 0.1, 'sawtooth', 0.2);
    this._noise(0.06, 0.15);
  }

  ko() {
    this._noise(0.15, 0.3);
    const notes = [400, 350, 300, 200, 120];
    notes.forEach((n, i) => {
      setTimeout(() => this._playTone(n, 0.2, 'sawtooth', 0.25), i * 60);
    });
  }

  specialAttack() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => {
        this._playTone(n, 0.1, 'square', 0.3);
        this._playTone(n / 2, 0.12, 'sawtooth', 0.15);
      }, i * 50);
    });
  }

  countdown() {
    this._playTone(440, 0.1, 'square', 0.2);
  }

  crowdCheer() {
    this._noise(0.3, 0.15);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this._playTone(300 + Math.random() * 400, 0.08, 'square', 0.08);
      }, i * 50);
    }
  }

  crowdReaction(type) {
    switch (type) {
      case 'cheer':
        this.crowdCheer();
        break;
      case 'gasp':
        this._noise(0.15, 0.1);
        this._playTone(600, 0.08, 'sine', 0.06);
        setTimeout(() => this._playTone(500, 0.1, 'sine', 0.04), 80);
        break;
      case 'boo':
        this._noise(0.4, 0.12);
        for (let i = 0; i < 4; i++) {
          setTimeout(() => this._playTone(150 + Math.random() * 100, 0.12, 'sawtooth', 0.06), i * 80);
        }
        break;
    }
  }

  transitionSwoosh() {
    this._ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
    this._noise(0.1, 0.08);
  }

  startAmbience() {
    if (this._ambienceInterval) return;
    this._ambienceInterval = setInterval(() => {
      this._noise(0.5, 0.02);
      if (Math.random() > 0.6) {
        this._playTone(200 + Math.random() * 200, 0.15, 'sine', 0.015);
      }
    }, 2000);
  }

  stopAmbience() {
    if (this._ambienceInterval) {
      clearInterval(this._ambienceInterval);
      this._ambienceInterval = null;
    }
  }

  roundWin() {
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => this._playTone(n, 0.15, 'square', 0.2), i * 100);
    });
  }

  roundLose() {
    const notes = [400, 350, 300, 250, 200];
    notes.forEach((n, i) => {
      setTimeout(() => this._playTone(n, 0.2, 'sawtooth', 0.2), i * 150);
    });
  }

  victoryFanfare() {
    const melody = [523, 523, 523, 659, 784, 659, 784, 1047];
    const durs =   [0.1, 0.1, 0.15,0.1, 0.15,0.1, 0.15,0.4];
    let t = 0;
    melody.forEach((n, i) => {
      setTimeout(() => {
        this._playTone(n, durs[i], 'square', 0.25);
        this._playTone(n/2, durs[i]+0.05, 'triangle', 0.1);
      }, t);
      t += durs[i] * 700;
    });
  }

  // --- RAMPAGE ---

  rampageStart() {
    const notes = [262, 330, 392, 494, 587, 659, 784, 880, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => {
        this._playTone(n, 0.08, 'square', 0.35);
        this._playTone(n / 2, 0.1, 'sawtooth', 0.2);
      }, i * 40);
    });
    setTimeout(() => {
      this._noise(0.3, 0.4);
      this._playTone(1047, 0.4, 'square', 0.4);
      this._playTone(523, 0.4, 'sawtooth', 0.25);
    }, notes.length * 40);
  }

  rampageEnd() {
    const notes = [784, 523, 392, 262];
    notes.forEach((n, i) => {
      setTimeout(() => this._playTone(n, 0.15, 'sawtooth', 0.2), i * 80);
    });
  }

  rampageHit() {
    this._noise(0.06, 0.3);
    this._playTone(200 + Math.random() * 200, 0.05, 'square', 0.3);
    this._playTone(100, 0.08, 'sawtooth', 0.2);
  }

  // --- SIGNATURE ATTACK SOUND ---

  signatureAttack(effectName) {
    switch (effectName) {
      case 'mic_trail':
        [523,659,784].forEach((n,i) => setTimeout(() => this._playTone(n, 0.1, 'triangle', 0.2), i*60));
        break;
      case 'flash':
        this._noise(0.15, 0.35);
        this._playTone(1200, 0.08, 'square', 0.3);
        break;
      case 'nail_slash':
        for(let i=0;i<4;i++) setTimeout(() => { this._noise(0.03, 0.2); this._playTone(800+i*100, 0.03, 'sawtooth', 0.2); }, i*40);
        break;
      case 'dust_cloud':
        this._noise(0.2, 0.2);
        this._playTone(100, 0.15, 'sawtooth', 0.1);
        break;
      case 'money_rain':
        for(let i=0;i<6;i++) setTimeout(() => this._playTone(800+Math.random()*400, 0.04, 'square', 0.1), i*50);
        break;
      case 'club_spin':
        [300,400,500,400].forEach((n,i) => setTimeout(() => this._playTone(n, 0.06, 'square', 0.15), i*40));
        break;
      case 'lasso_loop':
        this._playTone(200, 0.3, 'sine', 0.15);
        setTimeout(() => this._playTone(250, 0.2, 'sine', 0.12), 150);
        break;
      case 'shockwave':
        this._playTone(100, 0.3, 'sawtooth', 0.3);
        this._noise(0.15, 0.25);
        break;
      case 'chain_whip':
        this._noise(0.08, 0.25);
        [300,200,150].forEach((n,i) => setTimeout(() => this._playTone(n, 0.06, 'sawtooth', 0.2), i*30));
        break;
      case 'war_paint_glow':
        this._playTone(150, 0.2, 'triangle', 0.2);
        setTimeout(() => this._playTone(200, 0.3, 'triangle', 0.25), 100);
        break;
      case 'horn_gore':
        this._noise(0.2, 0.35);
        this._playTone(80, 0.3, 'sawtooth', 0.3);
        this._playTone(120, 0.2, 'square', 0.2);
        break;
      default:
        this._noise(0.1, 0.2);
    }
  }

  // --- MUSIC ---

  startMusic(type) {
    this.stopMusic();
    this.musicType = type;
    const bpm = type === 'boss' ? 160 : type === 'fight' ? 140 : 120;
    const interval = 60000 / bpm / 2;
    let step = 0;
    const patterns = {
      fiesta:  [262,330,392,330, 349,392,440,392, 262,330,392,523, 440,392,349,330],
      fight:   [196,196,262,196, 233,233,262,294, 196,196,262,349, 330,294,262,233],
      boss:    [131,131,165,131, 131,165,196,165, 175,175,196,233, 262,233,196,165],
      victory: [523,523,659,784, 659,784,1047,784, 523,659,784,1047, 1175,1047,784,659],
    };
    const bassPatterns = {
      fiesta:  [131,0,165,0, 175,0,196,0, 131,0,165,0, 220,0,175,0],
      fight:   [98,0,98,131, 117,0,117,147, 98,0,98,175, 165,0,131,0],
      boss:    [65,0,65,0, 65,82,98,82, 87,0,87,117, 131,117,98,0],
      victory: [262,0,330,0, 330,0,392,0, 262,0,330,0, 392,0,262,0],
    };
    const melody = patterns[type] || patterns.fight;
    const bass = bassPatterns[type] || bassPatterns.fight;

    this.musicInterval = setInterval(() => {
      const i = step % melody.length;
      if (melody[i]) this._playTone(melody[i], interval/1200, 'square', 0.08);
      if (bass[i]) this._playTone(bass[i], interval/800, 'triangle', 0.06);
      if (step % 4 === 0) this._noise(0.02, 0.04);
      if (step % 2 === 0) this._playTone(0, 0.01, 'square', 0);
      step++;
    }, interval);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicType = null;
  }
}
