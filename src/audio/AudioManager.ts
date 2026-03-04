import { Howl, Howler } from 'howler';
import { SFX_FILES, MUSIC_FILES, type SoundEffect, type MusicTrack } from './sounds';

class AudioManager {
  private static instance: AudioManager;

  private sfxCache: Map<SoundEffect, Howl> = new Map();
  private currentMusic: Howl | null = null;
  private currentMusicTrack: MusicTrack | null = null;

  private sfxEnabled = true;
  private musicEnabled = true;
  private sfxVolume = 0.7;
  private musicVolume = 0.4;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private getSfx(name: SoundEffect): Howl {
    let howl = this.sfxCache.get(name);
    if (!howl) {
      howl = new Howl({
        src: [SFX_FILES[name]],
        volume: this.sfxVolume,
        preload: false,
      });
      this.sfxCache.set(name, howl);
    }
    return howl;
  }

  playSFX(name: SoundEffect): void {
    if (!this.sfxEnabled) return;
    try {
      const howl = this.getSfx(name);
      howl.volume(this.sfxVolume);
      howl.play();
    } catch {
      // Silently fail if audio file is missing or browser blocks playback
    }
  }

  playMusic(track: MusicTrack): void {
    if (this.currentMusicTrack === track && this.currentMusic?.playing()) {
      return;
    }

    this.stopMusic();

    if (!this.musicEnabled) {
      this.currentMusicTrack = track;
      return;
    }

    try {
      this.currentMusic = new Howl({
        src: [MUSIC_FILES[track]],
        volume: this.musicVolume,
        loop: true,
        preload: true,
      });
      this.currentMusicTrack = track;
      this.currentMusic.play();
    } catch {
      // Silently fail if audio file is missing
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
      const music = this.currentMusic;
      setTimeout(() => {
        music.stop();
        music.unload();
      }, 500);
      this.currentMusic = null;
      this.currentMusicTrack = null;
    }
  }

  setSFXEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      if (this.currentMusic?.playing()) {
        this.currentMusic.fade(this.currentMusic.volume(), 0, 300);
        const music = this.currentMusic;
        setTimeout(() => music.pause(), 300);
      }
    } else if (this.currentMusicTrack && this.currentMusic) {
      this.currentMusic.volume(this.musicVolume);
      this.currentMusic.play();
    } else if (this.currentMusicTrack) {
      this.playMusic(this.currentMusicTrack);
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume(this.musicVolume);
    }
  }

  getSFXEnabled(): boolean {
    return this.sfxEnabled;
  }

  getMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getCurrentTrack(): MusicTrack | null {
    return this.currentMusicTrack;
  }

  setGlobalMute(muted: boolean): void {
    Howler.mute(muted);
  }

  dispose(): void {
    this.stopMusic();
    this.sfxCache.forEach(howl => howl.unload());
    this.sfxCache.clear();
  }
}

export const audioManager = AudioManager.getInstance();
export default audioManager;
