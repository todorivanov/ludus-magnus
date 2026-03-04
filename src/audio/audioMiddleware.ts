import type { Middleware } from '@reduxjs/toolkit';
import audioManager from './AudioManager';
import type { SoundEffect } from './sounds';

const ACTION_SOUND_MAP: Record<string, SoundEffect> = {
  'player/addGold': 'goldGain',
  'player/spendGold': 'goldSpend',
  'quests/completeQuest': 'questComplete',
  'quests/startQuest': 'notification',
  'gladiators/levelUpGladiator': 'levelUp',
  'ludus/completeConstruction': 'build',
  'ludus/completeUpgrade': 'upgrade',
  'gladiatorMode/addLibertas': 'milestone',
  'gladiatorMode/setFreedomAchieved': 'freedom',
  'gladiatorMode/soldToNewLudus': 'sold',
  'gladiatorMode/completeStoryChapter': 'questComplete',
  'marketplace/purchaseItem': 'purchase',
  'fame/addLudusFame': 'crowdCheer',
};

export const audioMiddleware: Middleware = (_store) => (next) => (action) => {
  const result = next(action);

  const act = action as { type: string };

  if (act.type === 'game/toggleSound') {
    const state = _store.getState() as { game: { settings: { soundEnabled: boolean } } };
    audioManager.setSFXEnabled(state.game.settings.soundEnabled);
  }

  if (act.type === 'game/toggleMusic') {
    const state = _store.getState() as { game: { settings: { musicEnabled: boolean } } };
    audioManager.setMusicEnabled(state.game.settings.musicEnabled);
  }

  if (act.type === 'game/updateSettings') {
    const state = _store.getState() as { game: { settings: Record<string, unknown> } };
    const settings = state.game.settings;
    audioManager.setSFXEnabled(settings.soundEnabled as boolean);
    audioManager.setMusicEnabled(settings.musicEnabled as boolean);
    if (typeof settings.sfxVolume === 'number') {
      audioManager.setSFXVolume(settings.sfxVolume);
    }
    if (typeof settings.musicVolume === 'number') {
      audioManager.setMusicVolume(settings.musicVolume);
    }
  }

  const soundName = ACTION_SOUND_MAP[act.type];
  if (soundName) {
    audioManager.playSFX(soundName);
  }

  return result;
};
