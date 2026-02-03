import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CombatMatch, CombatLogEntry } from '@/types';

interface CombatState {
  currentMatch: CombatMatch | null;
  isInCombat: boolean;
  currentTurn: number;
  isPlayerTurn: boolean;
  matchHistory: CombatMatch[];
}

const initialState: CombatState = {
  currentMatch: null,
  isInCombat: false,
  currentTurn: 0,
  isPlayerTurn: true,
  matchHistory: [],
};

const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    // Match setup
    startMatch: (state, action: PayloadAction<CombatMatch>) => {
      state.currentMatch = action.payload;
      state.isInCombat = true;
      state.currentTurn = 1;
      state.isPlayerTurn = true;
    },
    endMatch: (state, action: PayloadAction<{ winnerId: string }>) => {
      if (state.currentMatch) {
        state.currentMatch.isComplete = true;
        state.currentMatch.winnerId = action.payload.winnerId;
        state.matchHistory.push(state.currentMatch);
      }
      state.isInCombat = false;
    },
    cancelMatch: (state) => {
      state.currentMatch = null;
      state.isInCombat = false;
      state.currentTurn = 0;
    },
    
    // Turn management
    nextTurn: (state) => {
      state.currentTurn += 1;
      state.isPlayerTurn = !state.isPlayerTurn;
    },
    setPlayerTurn: (state, action: PayloadAction<boolean>) => {
      state.isPlayerTurn = action.payload;
    },
    
    // Combat log
    addLogEntry: (state, action: PayloadAction<CombatLogEntry>) => {
      if (state.currentMatch) {
        state.currentMatch.combatLog.push(action.payload);
      }
    },
    clearLog: (state) => {
      if (state.currentMatch) {
        state.currentMatch.combatLog = [];
      }
    },
    
    // Crowd favor
    updateCrowdFavor: (state, action: PayloadAction<number>) => {
      if (state.currentMatch) {
        state.currentMatch.crowdFavor = Math.max(-100, Math.min(100, action.payload));
      }
    },
    adjustCrowdFavor: (state, action: PayloadAction<number>) => {
      if (state.currentMatch) {
        state.currentMatch.crowdFavor = Math.max(
          -100,
          Math.min(100, state.currentMatch.crowdFavor + action.payload)
        );
      }
    },
    
    // Match history
    clearHistory: (state) => {
      state.matchHistory = [];
    },
    
    // Reset
    resetCombat: () => initialState,
  },
});

export const {
  startMatch,
  endMatch,
  cancelMatch,
  nextTurn,
  setPlayerTurn,
  addLogEntry,
  clearLog,
  updateCrowdFavor,
  adjustCrowdFavor,
  clearHistory,
  resetCombat,
} = combatSlice.actions;

// Selectors
export const selectCurrentMatch = (state: { combat: CombatState }) => state.combat.currentMatch;
export const selectIsInCombat = (state: { combat: CombatState }) => state.combat.isInCombat;
export const selectCurrentTurn = (state: { combat: CombatState }) => state.combat.currentTurn;
export const selectIsPlayerTurn = (state: { combat: CombatState }) => state.combat.isPlayerTurn;
export const selectCombatLog = (state: { combat: CombatState }) => 
  state.combat.currentMatch?.combatLog ?? [];
export const selectMatchHistory = (state: { combat: CombatState }) => state.combat.matchHistory;

export default combatSlice.reducer;
