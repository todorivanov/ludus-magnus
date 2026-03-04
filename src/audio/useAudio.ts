import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@app/hooks';
import audioManager from './AudioManager';
import { SCREEN_MUSIC_MAP } from './sounds';
import type { SoundEffect, MusicTrack } from './sounds';

export function useAudio() {
  const soundEnabled = useAppSelector(state => state.game?.settings?.soundEnabled ?? true);
  const musicEnabled = useAppSelector(state => state.game?.settings?.musicEnabled ?? true);
  const sfxVolume = useAppSelector(state => state.game?.settings?.sfxVolume ?? 0.7);
  const musicVolume = useAppSelector(state => state.game?.settings?.musicVolume ?? 0.4);

  useEffect(() => {
    audioManager.setSFXEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioManager.setMusicEnabled(musicEnabled);
  }, [musicEnabled]);

  useEffect(() => {
    audioManager.setSFXVolume(sfxVolume);
  }, [sfxVolume]);

  useEffect(() => {
    audioManager.setMusicVolume(musicVolume);
  }, [musicVolume]);

  const playSFX = useCallback((name: SoundEffect) => {
    audioManager.playSFX(name);
  }, []);

  const playMusic = useCallback((track: MusicTrack) => {
    audioManager.playMusic(track);
  }, []);

  const stopMusic = useCallback(() => {
    audioManager.stopMusic();
  }, []);

  return { playSFX, playMusic, stopMusic };
}

export function useScreenMusic() {
  const currentScreen = useAppSelector(state => state.game?.currentScreen || 'title');
  const musicEnabled = useAppSelector(state => state.game?.settings?.musicEnabled ?? true);
  const prevScreenRef = useRef(currentScreen);

  useEffect(() => {
    if (prevScreenRef.current === currentScreen) return;
    prevScreenRef.current = currentScreen;

    const track = SCREEN_MUSIC_MAP[currentScreen] ?? null;
    if (track) {
      audioManager.playMusic(track);
    } else if (!track && audioManager.getCurrentTrack()) {
      // null in map means keep current music (settings, codex)
    }
  }, [currentScreen, musicEnabled]);
}
