import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Building, BuildingType } from '@/types';

interface LudusState {
  buildings: Building[];
  constructionQueue: string[];  // Building IDs
  securityRating: number;
  maxBuildings: number;
}

const initialState: LudusState = {
  buildings: [],
  constructionQueue: [],
  securityRating: 0,
  maxBuildings: 12,  // Starting ludus capacity
};

const ludusSlice = createSlice({
  name: 'ludus',
  initialState,
  reducers: {
    // Building management
    addBuilding: (state, action: PayloadAction<Building>) => {
      if (state.buildings.length < state.maxBuildings) {
        state.buildings.push(action.payload);
      }
    },
    removeBuilding: (state, action: PayloadAction<string>) => {
      state.buildings = state.buildings.filter(b => b.id !== action.payload);
      state.constructionQueue = state.constructionQueue.filter(id => id !== action.payload);
    },
    updateBuilding: (state, action: PayloadAction<{ id: string; updates: Partial<Building> }>) => {
      const index = state.buildings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.buildings[index] = { ...state.buildings[index], ...action.payload.updates };
      }
    },
    
    // Construction
    startConstruction: (state, action: PayloadAction<{ building: Building }>) => {
      const building = { ...action.payload.building, isUnderConstruction: true };
      state.buildings.push(building);
      state.constructionQueue.push(building.id);
    },
    completeConstruction: (state, action: PayloadAction<string>) => {
      const building = state.buildings.find(b => b.id === action.payload);
      if (building) {
        building.isUnderConstruction = false;
        building.constructionDaysRemaining = 0;
      }
      state.constructionQueue = state.constructionQueue.filter(id => id !== action.payload);
    },
    updateConstructionProgress: (state, action: PayloadAction<{ id: string; daysRemaining: number }>) => {
      const building = state.buildings.find(b => b.id === action.payload.id);
      if (building) {
        building.constructionDaysRemaining = action.payload.daysRemaining;
      }
    },
    
    // Upgrades
    startUpgrade: (state, action: PayloadAction<{ id: string; upgradeDays: number }>) => {
      const building = state.buildings.find(b => b.id === action.payload.id);
      if (building && building.level < 3) {
        building.isUpgrading = true;
        building.upgradeDaysRemaining = action.payload.upgradeDays;
      }
    },
    completeUpgrade: (state, action: PayloadAction<string>) => {
      const building = state.buildings.find(b => b.id === action.payload);
      if (building && building.level < 3) {
        building.level = (building.level + 1) as 1 | 2 | 3;
        building.isUpgrading = false;
        building.upgradeDaysRemaining = 0;
      }
    },
    updateUpgradeProgress: (state, action: PayloadAction<{ id: string; daysRemaining: number }>) => {
      const building = state.buildings.find(b => b.id === action.payload.id);
      if (building) {
        building.upgradeDaysRemaining = action.payload.daysRemaining;
      }
    },
    
    // Security - accepts guard count and their skills from staff slice
    calculateSecurityRating: (state, action: PayloadAction<{ guardCount: number; guardSkillBonus: number }>) => {
      let security = 0;
      
      // Base security from walls building
      const walls = state.buildings.find(b => b.type === 'walls' && !b.isUnderConstruction);
      if (walls) {
        security += walls.level * 10 + (walls.level === 3 ? 5 : 0);
      }
      
      // Security from guards (+10 per guard)
      security += action.payload.guardCount * 10;
      
      // Additional security from guard skills and level bonuses
      security += action.payload.guardSkillBonus;
      
      state.securityRating = security;
    },
    setSecurityRating: (state, action: PayloadAction<number>) => {
      state.securityRating = action.payload;
    },
    
    // Capacity
    setMaxBuildings: (state, action: PayloadAction<number>) => {
      state.maxBuildings = action.payload;
    },
    
    // Reset
    resetLudus: () => initialState,
  },
});

export const {
  addBuilding,
  removeBuilding,
  updateBuilding,
  startConstruction,
  completeConstruction,
  updateConstructionProgress,
  startUpgrade,
  completeUpgrade,
  updateUpgradeProgress,
  calculateSecurityRating,
  setSecurityRating,
  setMaxBuildings,
  resetLudus,
} = ludusSlice.actions;

// Selectors
export const selectBuildings = (state: { ludus: LudusState }) => state.ludus.buildings;
export const selectBuildingById = (state: { ludus: LudusState }, id: string) => 
  state.ludus.buildings.find(b => b.id === id);
export const selectBuildingByType = (state: { ludus: LudusState }, type: BuildingType) => 
  state.ludus.buildings.find(b => b.type === type);
export const selectConstructionQueue = (state: { ludus: LudusState }) => state.ludus.constructionQueue;
export const selectSecurityRating = (state: { ludus: LudusState }) => state.ludus.securityRating;

export default ludusSlice.reducer;
