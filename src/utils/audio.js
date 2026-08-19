/**
 * Audio System: MusicManager and SfxManager
 * Safe no-op on missing assets + procedural Web Audio synthesis fallback
 */

import { Platform } from 'react-native';

// Web Audio synthesizer for instant responsive audio feedback without assets
class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.initContext();
  }

  initContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        try {
          this.ctx = new AudioContext();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  ensureContext() {
    if (!this.ctx && Platform.OS === 'web') {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.2) {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // safe no-op
    }
  }

  playChord(frequencies, duration = 0.3, gainVal = 0.15) {
    frequencies.forEach((freq) => {
      this.playTone(freq, 'triangle', duration, gainVal / frequencies.length);
    });
  }

  playSweep(startFreq, endFreq, duration = 0.15, gainVal = 0.2) {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // safe no-op
    }
  }
}

const synth = new ProceduralAudioEngine();

export class SfxManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.8;
  }

  setSettings(enabled, volume) {
    this.enabled = enabled;
    this.volume = volume;
  }

  play(soundName, payload = {}) {
    if (!this.enabled || this.volume <= 0) return;

    // Procedural sound mappings
    switch (soundName) {
      case 'move':
        synth.playTone(320, 'sine', 0.04, 0.05 * this.volume);
        break;

      case 'rotate':
        synth.playSweep(440, 660, 0.08, 0.15 * this.volume);
        break;

      case 'failedRotate':
        synth.playTone(180, 'sawtooth', 0.08, 0.1 * this.volume);
        break;

      case 'hold':
        synth.playSweep(520, 390, 0.1, 0.2 * this.volume);
        break;

      case 'hardDrop':
        synth.playTone(120, 'triangle', 0.12, 0.3 * this.volume);
        break;

      case 'lock':
        synth.playTone(200, 'sine', 0.06, 0.15 * this.volume);
        break;

      case 'lineClear':
        const lines = payload.linesCount || 1;
        if (lines === 4) {
          // Quad fanfare
          synth.playChord([523.25, 659.25, 783.99, 1046.5], 0.4, 0.35 * this.volume);
        } else if (lines === 3) {
          synth.playChord([440, 554.37, 659.25], 0.28, 0.28 * this.volume);
        } else if (lines === 2) {
          synth.playChord([392, 493.88], 0.22, 0.25 * this.volume);
        } else {
          synth.playSweep(587.33, 880, 0.18, 0.22 * this.volume);
        }
        break;

      case 'levelUp':
      case 'levelClear':
        synth.playChord([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.6, 0.35 * this.volume);
        break;

      case 'gameOver':
        synth.playSweep(400, 100, 0.5, 0.3 * this.volume);
        break;

      case 'danger':
        synth.playTone(220, 'sawtooth', 0.15, 0.15 * this.volume);
        break;

      case 'uiClick':
        synth.playTone(800, 'sine', 0.04, 0.1 * this.volume);
        break;

      default:
        break;
    }
  }
}

export class MusicManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.6;
    this.currentTrack = null;
    this.isPlaying = false;
    this.ambientInterval = null;
  }

  setSettings(enabled, volume) {
    this.enabled = enabled;
    this.volume = volume;
    if (!this.enabled && this.isPlaying) {
      this.stop();
    }
  }

  playTrack(trackName) {
    if (!this.enabled || this.volume <= 0) return;
    this.currentTrack = trackName;
    this.isPlaying = true;

    // Ambient background synth chords on web when no external asset exists
    if (Platform.OS === 'web' && !this.ambientInterval) {
      this.startAmbientDrone();
    }
  }

  startAmbientDrone() {
    if (this.ambientInterval) return;

    const chords = [
      [220, 277.18, 329.63], // A major
      [174.61, 220, 261.63], // F major
      [196, 246.94, 293.66], // G major
      [164.81, 196, 246.94], // E minor
    ];

    let chordIdx = 0;
    this.ambientInterval = setInterval(() => {
      if (this.isPlaying && this.enabled && this.volume > 0) {
        synth.playChord(chords[chordIdx % chords.length], 1.8, 0.06 * this.volume);
        chordIdx++;
      }
    }, 2800);
  }

  stop() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  pause() {
    this.isPlaying = false;
  }

  resume() {
    if (this.enabled) {
      this.isPlaying = true;
    }
  }
}

export const sfxManager = new SfxManager();
export const musicManager = new MusicManager();
