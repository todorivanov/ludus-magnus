import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameScreen, Difficulty, GameSettings } from '@/types';

type TimePhase = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

interface DayReportEntry {
  source: string;
  amount: number;
}

interface DayReport {
  day: number;
  income: DayReportEntry[];
  expenses: DayReportEntry[];
  netGold: number;
  events: string[];
  alerts: { severity: 'info' | 'warning' | 'danger'; message: string }[];
}

interface ExtendedGameState {
  currentDay: number;
  currentPhase: TimePhase;
  currentScreen: GameScreen;
  isPaused: boolean;
  isGameOver: boolean;
  gameOverReason?: string;
  settings: GameSettings;
  
  // Day processing
  lastDayReport: DayReport | null;
  showDayReport: boolean;
  dayProcessing: boolean;
  
  // Unrest
  unrestLevel: number;
  rebellionWarning: boolean;
  
  // Statistics
  totalDaysPlayed: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
}

const initialSettings: GameSettings = {
  difficulty: 'normal',
  autosave: true,
  soundEnabled: true,
  musicEnabled: true,
  tutorialCompleted: false,
};

const initialState: ExtendedGameState = {
  currentDay: 1,
  currentPhase: 'morning',
  currentScreen: 'title',
  isPaused: false,
  isGameOver: false,
  gameOverReason: undefined,
  settings: initialSettings,
  lastDayReport: null,
  showDayReport: false,
  dayProcessing: false,
  unrestLevel: 0,
  rebellionWarning: false,
  totalDaysPlayed: 0,
  totalGoldEarned: 0,
  totalGoldSpent: 0,
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
      state.totalDaysPlayed += 1;
      state.currentPhase = 'morning';
    },
    setDay: (state, action: PayloadAction<number>) => {
      state.currentDay = action.payload;
    },
    setPhase: (state, action: PayloadAction<TimePhase>) => {
      state.currentPhase = action.payload;
    },
    advancePhase: (state) => {
      const phases: TimePhase[] = ['dawn', 'morning', 'afternoon', 'evening', 'night'];
      const currentIndex = phases.indexOf(state.currentPhase);
      if (currentIndex < phases.length - 1) {
        state.currentPhase = phases[currentIndex + 1];
      }
    },
    
    // Day processing
    startDayProcessing: (state) => {
      state.dayProcessing = true;
    },
    endDayProcessing: (state) => {
      state.dayProcessing = false;
    },
    setDayReport: (state, action: PayloadAction<DayReport>) => {
      state.lastDayReport = action.payload;
      state.showDayReport = true;
    },
    hideDayReport: (state) => {
      state.showDayReport = false;
    },
    clearDayReport: (state) => {
      state.lastDayReport = null;
      state.showDayReport = false;
    },
    
    // Unrest
    setUnrestLevel: (state, action: PayloadAction<number>) => {
      state.unrestLevel = Math.max(0, Math.min(100, action.payload));
      state.rebellionWarning = state.unrestLevel >= 75;
    },
    adjustUnrest: (state, action: PayloadAction<number>) => {
      state.unrestLevel = Math.max(0, Math.min(100, state.unrestLevel + action.payload));
      state.rebellionWarning = state.unrestLevel >= 75;
    },
    
    // Statistics
    recordGoldEarned: (state, action: PayloadAction<number>) => {
      state.totalGoldEarned += action.payload;
    },
    recordGoldSpent: (state, action: PayloadAction<number>) => {
      state.totalGoldSpent += action.payload;
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
      state.currentPhase = 'morning';
      state.currentScreen = 'dashboard';
      state.isPaused = false;
      state.isGameOver = false;
      state.gameOverReason = undefined;
      state.settings.difficulty = action.payload.difficulty;
      state.lastDayReport = null;
      state.showDayReport = false;
      state.dayProcessing = false;
      state.unrestLevel = 0;
      state.rebellionWarning = false;
      state.totalDaysPlayed = 0;
      state.totalGoldEarned = 0;
      state.totalGoldSpent = 0;
    },
    resetGame: () => initialState,
  },
});

export const {
  setScreen,
  advanceDay,
  setDay,
  setPhase,
  advancePhase,
  startDayProcessing,
  endDayProcessing,
  setDayReport,
  hideDayReport,
  clearDayReport,
  setUnrestLevel,
  adjustUnrest,
  recordGoldEarned,
  recordGoldSpent,
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

// Selectors
export const selectCurrentDay = (state: { game: ExtendedGameState }) => state.game.currentDay;
export const selectCurrentPhase = (state: { game: ExtendedGameState }) => state.game.currentPhase;
export const selectLastDayReport = (state: { game: ExtendedGameState }) => state.game.lastDayReport;
export const selectShowDayReport = (state: { game: ExtendedGameState }) => state.game.showDayReport;
export const selectUnrestLevel = (state: { game: ExtendedGameState }) => state.game.unrestLevel;
export const selectRebellionWarning = (state: { game: ExtendedGameState }) => state.game.rebellionWarning;

export default gameSlice.reducer;
