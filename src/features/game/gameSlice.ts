import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState, GameScreen, Difficulty, GameSettings } from '@/types';

const initialSettings: GameSettings = {
  difficulty: 'normal',
  autosave: true,
  soundEnabled: true,
  musicEnabled: true,
  tutorialCompleted: false,
};

const initialState: GameState = {
  currentDay: 1,
  currentScreen: 'title',
  isPaused: false,
  isGameOver: false,
  gameOverReason: undefined,
  settings: initialSettings,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Navigation
    setScreen: (state, action: PayloadAction<GameScreen>) => {
      state.currentScreen = action.payload;
    },
    
    // Time management
    advanceDay: (state) => {
      state.currentDay += 1;
    },
    setDay: (state, action: PayloadAction<number>) => {
      state.currentDay = action.payload;
    },
    
    // Game control
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
    
    // Game over
    setGameOver: (state, action: PayloadAction<string>) => {
      state.isGameOver = true;
      state.gameOverReason = action.payload;
    },
    
    // Settings
    setDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.settings.difficulty = action.payload;
    },
    toggleAutosave: (state) => {
      state.settings.autosave = !state.settings.autosave;
    },
    toggleSound: (state) => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
    },
    toggleMusic: (state) => {
      state.settings.musicEnabled = !state.settings.musicEnabled;
    },
    completeTutorial: (state) => {
      state.settings.tutorialCompleted = true;
    },
    updateSettings: (state, action: PayloadAction<Partial<GameSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // New game / Reset
    startNewGame: (state, action: PayloadAction<{ difficulty: Difficulty }>) => {
      state.currentDay = 1;
      state.currentScreen = 'dashboard';
      state.isPaused = false;
      state.isGameOver = false;
      state.gameOverReason = undefined;
      state.settings.difficulty = action.payload.difficulty;
    },
    resetGame: () => initialState,
  },
});

export const {
  setScreen,
  advanceDay,
  setDay,
  pauseGame,
  resumeGame,
  togglePause,
  setGameOver,
  setDifficulty,
  toggleAutosave,
  toggleSound,
  toggleMusic,
  completeTutorial,
  updateSettings,
  startNewGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
