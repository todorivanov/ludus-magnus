import settingsReducer, {
  setDifficulty,
  toggleSound,
  toggleAutoBattle,
  toggleAutoScroll,
  togglePerformanceMonitor,
  toggleDarkMode,
} from '@/store/slices/settingsSlice';
import { SettingsState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('settingsSlice', () => {
  const initialState: SettingsState = {
    difficulty: 'normal',
    soundEnabled: true,
    autoBattleEnabled: false,
    autoScrollEnabled: true,
    performanceMonitorEnabled: false,
    darkMode: true,
  };

  it('should handle setDifficulty', () => {
    const nextState = settingsReducer(initialState, setDifficulty('hard'));
    expect(nextState.difficulty).toBe('hard');
  });

  it('should handle toggleSound', () => {
    const nextState = settingsReducer(initialState, toggleSound());
    expect(nextState.soundEnabled).toBe(false);
  });

  it('should handle toggleAutoBattle', () => {
    const nextState = settingsReducer(initialState, toggleAutoBattle());
    expect(nextState.autoBattleEnabled).toBe(true);
  });

  it('should handle toggleAutoScroll', () => {
    const nextState = settingsReducer(initialState, toggleAutoScroll());
    expect(nextState.autoScrollEnabled).toBe(false);
  });

  it('should handle togglePerformanceMonitor', () => {
    const nextState = settingsReducer(initialState, togglePerformanceMonitor());
    expect(nextState.performanceMonitorEnabled).toBe(true);
  });

  it('should handle toggleDarkMode', () => {
    const nextState = settingsReducer(initialState, toggleDarkMode());
    expect(nextState.darkMode).toBe(false);
  });
});
