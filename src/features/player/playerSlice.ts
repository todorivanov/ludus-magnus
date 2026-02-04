import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlayerState, Resources, Difficulty } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Starting gold based on difficulty
const getStartingGold = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 1500;
    case 'normal': return 1250;
    case 'hard': return 1000;
    default: return 1000;
  }
};

const initialResources: Resources = {
  grain: 50,
  water: 30,
  wine: 10,
  travertine: 0,
  glass: 0,
  clay: 0,
};

const initialState: PlayerState = {
  name: '',
  ludusName: '',
  gold: 500,
  ludusFame: 0,
  resources: initialResources,
  transactions: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Setup
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLudusName: (state, action: PayloadAction<string>) => {
      state.ludusName = action.payload;
    },
    initializePlayer: (state, action: PayloadAction<{ name: string; ludusName: string; difficulty: Difficulty }>) => {
      state.name = action.payload.name;
      state.ludusName = action.payload.ludusName;
      state.gold = getStartingGold(action.payload.difficulty);
      state.ludusFame = 0;
      state.resources = { ...initialResources };
      state.transactions = [];
    },
    
    // Gold management
    addGold: (state, action: PayloadAction<{ amount: number; description: string; category: string; day: number }>) => {
      const { amount, description, category, day } = action.payload;
      state.gold += amount;
      state.transactions.push({
        id: uuidv4(),
        day,
        type: 'income',
        category,
        amount,
        description,
      });
    },
    spendGold: (state, action: PayloadAction<{ amount: number; description: string; category: string; day: number }>) => {
      const { amount, description, category, day } = action.payload;
      if (state.gold >= amount) {
        state.gold -= amount;
        state.transactions.push({
          id: uuidv4(),
          day,
          type: 'expense',
          category,
          amount,
          description,
        });
      }
    },
    setGold: (state, action: PayloadAction<number>) => {
      state.gold = Math.max(0, action.payload);
    },
    
    // Resource management
    addResource: (state, action: PayloadAction<{ resource: keyof Resources; amount: number }>) => {
      const { resource, amount } = action.payload;
      state.resources[resource] += amount;
    },
    consumeResource: (state, action: PayloadAction<{ resource: keyof Resources; amount: number }>) => {
      const { resource, amount } = action.payload;
      state.resources[resource] = Math.max(0, state.resources[resource] - amount);
    },
    setResource: (state, action: PayloadAction<{ resource: keyof Resources; amount: number }>) => {
      const { resource, amount } = action.payload;
      state.resources[resource] = Math.max(0, amount);
    },
    
    // Fame management
    addLudusFame: (state, action: PayloadAction<number>) => {
      state.ludusFame = Math.min(1000, Math.max(0, state.ludusFame + action.payload));
    },
    setLudusFame: (state, action: PayloadAction<number>) => {
      state.ludusFame = Math.min(1000, Math.max(0, action.payload));
    },
    
    // Transaction history
    clearOldTransactions: (state, action: PayloadAction<number>) => {
      const keepFromDay = action.payload;
      state.transactions = state.transactions.filter(t => t.day >= keepFromDay);
    },
    
    // Reset
    resetPlayer: () => initialState,
  },
});

export const {
  setPlayerName,
  setLudusName,
  initializePlayer,
  addGold,
  spendGold,
  setGold,
  addResource,
  consumeResource,
  setResource,
  addLudusFame,
  setLudusFame,
  clearOldTransactions,
  resetPlayer,
} = playerSlice.actions;

// Selectors
export const selectCanAfford = (state: { player: PlayerState }, amount: number) => 
  state.player.gold >= amount;

export const selectHasResource = (state: { player: PlayerState }, resource: keyof Resources, amount: number) =>
  state.player.resources[resource] >= amount;

export default playerSlice.reducer;
