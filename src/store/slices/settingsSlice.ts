import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from '@/types/state.types';

const initialState: SettingsState = {
  difficulty: 'normal',
  soundEnabled: true,
  autoBattleEnabled: false,
  autoScrollEnabled: true,
  performanceMonitorEnabled: false,
  darkMode: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDifficulty: (
      state,
      action: PayloadAction<SettingsState['difficulty']>
    ) => {
      state.difficulty = action.payload;
    },
    
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    toggleAutoBattle: (state) => {
      state.autoBattleEnabled = !state.autoBattleEnabled;
    },
    
    toggleAutoScroll: (state) => {
      state.autoScrollEnabled = !state.autoScrollEnabled;
    },
    
    togglePerformanceMonitor: (state) => {
      state.performanceMonitorEnabled = !state.performanceMonitorEnabled;
    },
    
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  setDifficulty,
  toggleSound,
  toggleAutoBattle,
  toggleAutoScroll,
  togglePerformanceMonitor,
  toggleDarkMode,
} = settingsSlice.actions;

export default settingsSlice.reducer;
