import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CombatMatch, CombatLogEntry, Gladiator, GladiatorClass } from '@/types';

interface OpponentData {
  name: string;
  class: GladiatorClass;
  level: number;
  stats: { strength: number; agility: number; dexterity: number; endurance: number; constitution: number };
  hp: number;
  stamina: number;
}

interface CombatState {
  currentMatch: CombatMatch | null;
  isInCombat: boolean;
  currentTurn: number;
  isPlayerTurn: boolean;
  matchHistory: CombatMatch[];
  // New fields for combat screen
  gladiator: Gladiator | null;
  opponent: OpponentData | null;
  matchType: string;
  rules: 'submission' | 'death' | 'first_blood';
  maxRounds: number;
  // Tournament context
  tournamentMatchId?: string;
}

const initialState: CombatState = {
  currentMatch: null,
  isInCombat: false,
  currentTurn: 0,
  isPlayerTurn: true,
  matchHistory: [],
  gladiator: null,
  opponent: null,
  matchType: '',
  rules: 'submission',
  maxRounds: 10,
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
    
    // New combat system
    startCombat: (state, action: PayloadAction<{
      gladiator: Gladiator;
      opponent: OpponentData;
      matchType: string;
      rules: 'submission' | 'death' | 'first_blood';
      maxRounds: number;
      tournamentMatchId?: string;
    }>) => {
      state.gladiator = action.payload.gladiator;
      state.opponent = action.payload.opponent;
      state.matchType = action.payload.matchType;
      state.rules = action.payload.rules;
      state.maxRounds = action.payload.maxRounds;
      state.tournamentMatchId = action.payload.tournamentMatchId;
      state.isInCombat = true;
      state.currentTurn = 1;
    },
    endCombat: (state) => {
      state.gladiator = null;
      state.opponent = null;
      state.matchType = '';
      state.isInCombat = false;
      state.currentTurn = 0;
      state.tournamentMatchId = undefined;
    },
    executeAction: (state, _action: PayloadAction<{ action: string }>) => {
      // Action execution is handled by the CombatEngine
      // This is just for logging purposes
      state.currentTurn += 1;
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
  startCombat,
  endCombat,
  executeAction,
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
