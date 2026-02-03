import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FactionType, FactionStanding } from '@/types';

interface FactionsState {
  standings: FactionStanding[];
  vilifiedBy: FactionType[];
  alliedWith: FactionType | null;
}

const initialState: FactionsState = {
  standings: [
    { faction: 'senate', favor: 0 },
    { faction: 'plebs', favor: 0 },
    { faction: 'legate', favor: 0 },
  ],
  vilifiedBy: [],
  alliedWith: null,
};

const factionsSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    // Favor management
    adjustFavor: (state, action: PayloadAction<{ faction: FactionType; amount: number }>) => {
      const standing = state.standings.find(s => s.faction === action.payload.faction);
      if (standing) {
        standing.favor = Math.max(-100, Math.min(100, standing.favor + action.payload.amount));
        
        // Check for vilification
        if (standing.favor <= -75 && !state.vilifiedBy.includes(action.payload.faction)) {
          state.vilifiedBy.push(action.payload.faction);
        } else if (standing.favor > -75 && state.vilifiedBy.includes(action.payload.faction)) {
          state.vilifiedBy = state.vilifiedBy.filter(f => f !== action.payload.faction);
        }
      }
    },
    setFavor: (state, action: PayloadAction<{ faction: FactionType; favor: number }>) => {
      const standing = state.standings.find(s => s.faction === action.payload.faction);
      if (standing) {
        standing.favor = Math.max(-100, Math.min(100, action.payload.favor));
      }
    },
    
    // Alliance
    setAlliance: (state, action: PayloadAction<FactionType | null>) => {
      state.alliedWith = action.payload;
    },
    breakAlliance: (state) => {
      if (state.alliedWith) {
        // Breaking alliance costs favor
        const standing = state.standings.find(s => s.faction === state.alliedWith);
        if (standing) {
          standing.favor = Math.max(-100, standing.favor - 30);
        }
        state.alliedWith = null;
      }
    },
    
    // Vilification
    addVilification: (state, action: PayloadAction<FactionType>) => {
      if (!state.vilifiedBy.includes(action.payload)) {
        state.vilifiedBy.push(action.payload);
      }
    },
    removeVilification: (state, action: PayloadAction<FactionType>) => {
      state.vilifiedBy = state.vilifiedBy.filter(f => f !== action.payload);
    },
    
    // Reset
    resetFactions: () => initialState,
  },
});

export const {
  adjustFavor,
  setFavor,
  setAlliance,
  breakAlliance,
  addVilification,
  removeVilification,
  resetFactions,
} = factionsSlice.actions;

// Selectors
export const selectFactionStandings = (state: { factions: FactionsState }) => state.factions.standings;
export const selectFactionFavor = (state: { factions: FactionsState }, faction: FactionType) => 
  state.factions.standings.find(s => s.faction === faction)?.favor ?? 0;
export const selectVilifiedBy = (state: { factions: FactionsState }) => state.factions.vilifiedBy;
export const selectAlliedWith = (state: { factions: FactionsState }) => state.factions.alliedWith;
export const selectIsVilified = (state: { factions: FactionsState }, faction: FactionType) => 
  state.factions.vilifiedBy.includes(faction);

export default factionsSlice.reducer;
