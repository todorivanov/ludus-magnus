import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FactionId = 'optimates' | 'populares' | 'military' | 'merchants';

interface SabotageHistoryEntry {
  id: string;
  eventId: string;
  day: number;
  prevented: boolean;
  effects: string[];
}

interface FactionsState {
  // Favor with each faction (-100 to 100)
  factionFavors: Record<FactionId, number>;
  
  // Cooldowns for political actions (days remaining)
  actionCooldowns: Record<string, number>;
  
  // Alliance (can only ally with one faction at a time)
  alliedWith: FactionId | null;
  allianceDay: number | null;
  
  // Sabotage history
  sabotageHistory: SabotageHistoryEntry[];
  
  // Protection level (from guards, faction benefits, etc.)
  protectionLevel: number;
  
  // Pending sabotage (player can choose to prevent)
  pendingSabotage: {
    eventId: string;
    perpetrator: string;
    preventionCost: number;
  } | null;
}

const initialState: FactionsState = {
  factionFavors: {
    optimates: 0,
    populares: 0,
    military: 0,
    merchants: 0,
  },
  actionCooldowns: {},
  alliedWith: null,
  allianceDay: null,
  sabotageHistory: [],
  protectionLevel: 0,
  pendingSabotage: null,
};

const factionsSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    // Favor management
    adjustFavor: (state, action: PayloadAction<{ faction: FactionId; amount: number }>) => {
      const currentFavor = state.factionFavors[action.payload.faction] || 0;
      state.factionFavors[action.payload.faction] = Math.max(-100, Math.min(100, currentFavor + action.payload.amount));
    },
    setFavor: (state, action: PayloadAction<{ faction: FactionId; favor: number }>) => {
      state.factionFavors[action.payload.faction] = Math.max(-100, Math.min(100, action.payload.favor));
    },
    
    // Alliance
    formAlliance: (state, action: PayloadAction<{ faction: FactionId; day: number }>) => {
      state.alliedWith = action.payload.faction;
      state.allianceDay = action.payload.day;
    },
    breakAlliance: (state) => {
      if (state.alliedWith) {
        // Breaking alliance costs favor
        const currentFavor = state.factionFavors[state.alliedWith] || 0;
        state.factionFavors[state.alliedWith] = Math.max(-100, currentFavor - 30);
        state.alliedWith = null;
        state.allianceDay = null;
      }
    },
    
    // Cooldowns
    setCooldown: (state, action: PayloadAction<{ actionId: string; days: number }>) => {
      state.actionCooldowns[action.payload.actionId] = action.payload.days;
    },
    tickCooldowns: (state) => {
      Object.keys(state.actionCooldowns).forEach(actionId => {
        if (state.actionCooldowns[actionId] > 0) {
          state.actionCooldowns[actionId]--;
        }
      });
    },
    
    // Protection
    setProtectionLevel: (state, action: PayloadAction<number>) => {
      state.protectionLevel = Math.max(0, Math.min(100, action.payload));
    },
    adjustProtection: (state, action: PayloadAction<number>) => {
      state.protectionLevel = Math.max(0, Math.min(100, state.protectionLevel + action.payload));
    },
    
    // Sabotage
    setPendingSabotage: (state, action: PayloadAction<{
      eventId: string;
      perpetrator: string;
      preventionCost: number;
    } | null>) => {
      state.pendingSabotage = action.payload;
    },
    recordSabotage: (state, action: PayloadAction<SabotageHistoryEntry>) => {
      state.sabotageHistory.push(action.payload);
      // Keep only last 20 entries
      if (state.sabotageHistory.length > 20) {
        state.sabotageHistory = state.sabotageHistory.slice(-20);
      }
      state.pendingSabotage = null;
    },
    clearPendingSabotage: (state) => {
      state.pendingSabotage = null;
    },
    
    // Reset
    resetFactions: () => initialState,
  },
});

export const {
  adjustFavor,
  setFavor,
  formAlliance,
  breakAlliance,
  setCooldown,
  tickCooldowns,
  setProtectionLevel,
  adjustProtection,
  setPendingSabotage,
  recordSabotage,
  clearPendingSabotage,
  resetFactions,
} = factionsSlice.actions;

// Selectors
export const selectFactionFavors = (state: { factions: FactionsState }) => state.factions.factionFavors;
export const selectFactionFavor = (state: { factions: FactionsState }, faction: FactionId) => 
  state.factions.factionFavors[faction] || 0;
export const selectActionCooldowns = (state: { factions: FactionsState }) => state.factions.actionCooldowns;
export const selectAlliedWith = (state: { factions: FactionsState }) => state.factions.alliedWith;
export const selectAllianceDay = (state: { factions: FactionsState }) => state.factions.allianceDay;
export const selectProtectionLevel = (state: { factions: FactionsState }) => state.factions.protectionLevel;
export const selectPendingSabotage = (state: { factions: FactionsState }) => state.factions.pendingSabotage;
export const selectSabotageHistory = (state: { factions: FactionsState }) => state.factions.sabotageHistory;

export default factionsSlice.reducer;
