import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Gladiator } from '@/types';

export interface DeadGladiator extends Gladiator {
  deathDay: number;
  causeOfDeath: string;
  killedBy?: string; // Name of opponent who killed them
}

interface GladiatorsState {
  roster: Gladiator[];
  marketPool: Gladiator[];
  deadGladiators: DeadGladiator[];
  selectedGladiatorId: string | null;
  lastMarketRefresh: number; // Day when market was last refreshed
}

const initialState: GladiatorsState = {
  roster: [],
  marketPool: [],
  deadGladiators: [],
  selectedGladiatorId: null,
  lastMarketRefresh: 0,
};

const gladiatorsSlice = createSlice({
  name: 'gladiators',
  initialState,
  reducers: {
    // Roster management
    addGladiator: (state, action: PayloadAction<Gladiator>) => {
      state.roster.push(action.payload);
    },
    removeGladiator: (state, action: PayloadAction<string>) => {
      state.roster = state.roster.filter(g => g.id !== action.payload);
    },
    killGladiator: (state, action: PayloadAction<{ 
      id: string; 
      deathDay: number; 
      causeOfDeath: string; 
      killedBy?: string;
    }>) => {
      const index = state.roster.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        const gladiator = state.roster[index];
        // Add to dead gladiators with death info
        state.deadGladiators.push({
          ...gladiator,
          deathDay: action.payload.deathDay,
          causeOfDeath: action.payload.causeOfDeath,
          killedBy: action.payload.killedBy,
        });
        // Remove from roster
        state.roster.splice(index, 1);
        // Clear selection if this gladiator was selected
        if (state.selectedGladiatorId === action.payload.id) {
          state.selectedGladiatorId = null;
        }
      }
    },
    updateGladiator: (state, action: PayloadAction<{ id: string; updates: Partial<Gladiator> }>) => {
      const index = state.roster.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.roster[index] = { ...state.roster[index], ...action.payload.updates };
      }
    },
    
    // Selection
    selectGladiator: (state, action: PayloadAction<string | null>) => {
      state.selectedGladiatorId = action.payload;
    },
    
    // Market
    setMarketPool: (state, action: PayloadAction<Gladiator[]>) => {
      state.marketPool = action.payload;
    },
    refreshMarket: (state, action: PayloadAction<{ pool: Gladiator[]; day: number }>) => {
      state.marketPool = action.payload.pool;
      state.lastMarketRefresh = action.payload.day;
    },
    addToMarket: (state, action: PayloadAction<Gladiator>) => {
      state.marketPool.push(action.payload);
    },
    removeFromMarket: (state, action: PayloadAction<string>) => {
      state.marketPool = state.marketPool.filter(g => g.id !== action.payload);
    },
    
    // Purchase gladiator (move from market to roster)
    purchaseGladiator: (state, action: PayloadAction<string>) => {
      const gladiator = state.marketPool.find(g => g.id === action.payload);
      if (gladiator) {
        state.roster.push(gladiator);
        state.marketPool = state.marketPool.filter(g => g.id !== action.payload);
      }
    },
    
    // Sell gladiator (remove from roster)
    sellGladiator: (state, action: PayloadAction<string>) => {
      state.roster = state.roster.filter(g => g.id !== action.payload);
    },
    
    // Stats and progression
    addExperience: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.experience += action.payload.amount;
        
        // Auto level-up check
        const xpToLevel = gladiator.level * 100;
        while (gladiator.experience >= xpToLevel && gladiator.level < 20) {
          gladiator.experience -= xpToLevel;
          gladiator.level += 1;
          gladiator.skillPoints = (gladiator.skillPoints || 0) + 5;
          // Update derived stats on level up
          gladiator.maxHP = 50 + gladiator.level * 10 + Math.round(gladiator.stats.constitution * 2);
          gladiator.maxStamina = 50 + gladiator.level * 5 + Math.round(gladiator.stats.endurance * 1.5);
        }
      }
    },
    levelUp: (state, action: PayloadAction<{ id: string }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator && gladiator.level < 20) {
        const xpToLevel = gladiator.level * 100;
        if (gladiator.experience >= xpToLevel) {
          gladiator.experience -= xpToLevel;
        }
        gladiator.level += 1;
        gladiator.skillPoints = (gladiator.skillPoints || 0) + 5;
        // Update derived stats on level up
        gladiator.maxHP = 50 + gladiator.level * 10 + Math.round(gladiator.stats.constitution * 2);
        gladiator.maxStamina = 50 + gladiator.level * 5 + Math.round(gladiator.stats.endurance * 1.5);
      }
    },
    distributeStatPoints: (state, action: PayloadAction<{ id: string; stat: keyof Gladiator['stats']; points: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator && gladiator.skillPoints >= action.payload.points) {
        gladiator.stats[action.payload.stat] += action.payload.points;
        gladiator.skillPoints -= action.payload.points;
      }
    },
    
    // Combat stats
    updateHP: (state, action: PayloadAction<{ id: string; hp: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.currentHP = Math.max(0, Math.min(gladiator.maxHP, action.payload.hp));
      }
    },
    updateStamina: (state, action: PayloadAction<{ id: string; stamina: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.currentStamina = Math.max(0, Math.min(gladiator.maxStamina, action.payload.stamina));
      }
    },
    
    // Morale and fatigue
    updateMorale: (state, action: PayloadAction<{ id: string; morale: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.morale = Math.max(0.1, Math.min(1.5, action.payload.morale));
      }
    },
    updateFatigue: (state, action: PayloadAction<{ id: string; fatigue: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.fatigue = Math.max(0, Math.min(100, action.payload.fatigue));
      }
    },
    
    // Fame
    addFame: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.fame = Math.min(1000, Math.max(0, gladiator.fame + action.payload.amount));
      }
    },
    
    // Combat record
    recordWin: (state, action: PayloadAction<{ id: string; wasKill: boolean }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.wins += 1;
        if (action.payload.wasKill) {
          gladiator.kills += 1;
        }
        
        // Add XP for victory (50 base, 25 extra for kills)
        const xpGained = action.payload.wasKill ? 75 : 50;
        gladiator.experience = (gladiator.experience || 0) + xpGained;
        
        // Check for level up
        const xpToLevel = gladiator.level * 100;
        while (gladiator.experience >= xpToLevel && gladiator.level < 20) {
          gladiator.experience -= xpToLevel;
          gladiator.level += 1;
          gladiator.skillPoints = (gladiator.skillPoints || 0) + 5;
          // Update derived stats on level up
          gladiator.maxHP = 50 + gladiator.level * 10 + Math.round(gladiator.stats.constitution * 2);
          gladiator.maxStamina = 50 + gladiator.level * 5 + Math.round(gladiator.stats.endurance * 1.5);
        }
      }
    },
    recordLoss: (state, action: PayloadAction<{ id: string }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.losses += 1;
      }
    },
    
    // Training state
    setTraining: (state, action: PayloadAction<{ id: string; isTraining: boolean }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.isTraining = action.payload.isTraining;
        gladiator.isResting = false;
        gladiator.status = action.payload.isTraining ? 'training' : 'idle';
      }
    },
    setResting: (state, action: PayloadAction<{ id: string; isResting: boolean }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.isResting = action.payload.isResting;
        gladiator.isTraining = false;
        gladiator.status = action.payload.isResting ? 'resting' : 'idle';
      }
    },
    
    // Training regimen selection
    setTrainingRegimen: (state, action: PayloadAction<{ gladiatorId: string; trainingType: string | null }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.gladiatorId);
      if (gladiator) {
        gladiator.trainingRegimen = action.payload.trainingType;
        gladiator.isTraining = action.payload.trainingType !== null;
        gladiator.isResting = false;
        gladiator.status = action.payload.trainingType ? 'training' : 'idle';
      }
    },
    
    // Nutrition level
    setNutrition: (state, action: PayloadAction<{ gladiatorId: string; nutrition: string }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.gladiatorId);
      if (gladiator) {
        gladiator.nutrition = action.payload.nutrition as 'poor' | 'standard' | 'good' | 'excellent';
      }
    },
    
    // Update base stats
    updateStats: (state, action: PayloadAction<{ 
      id: string; 
      stats: Partial<{ strength: number; agility: number; dexterity: number; endurance: number; constitution: number }>
    }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        Object.entries(action.payload.stats).forEach(([key, value]) => {
          if (value !== undefined && key in gladiator.stats) {
            (gladiator.stats as any)[key] = Math.max(1, Math.min(100, value));
          }
        });
      }
    },
    
    // Update derived stats (morale, fatigue, obedience)
    updateDerivedStats: (state, action: PayloadAction<{
      id: string;
      stats: Partial<{ morale: number; fatigue: number; obedience: number }>
    }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        if (action.payload.stats.morale !== undefined) {
          gladiator.morale = Math.max(0.1, Math.min(1.5, action.payload.stats.morale));
        }
        if (action.payload.stats.fatigue !== undefined) {
          gladiator.fatigue = Math.max(0, Math.min(100, action.payload.stats.fatigue));
        }
        if (action.payload.stats.obedience !== undefined) {
          gladiator.obedience = Math.max(0, Math.min(100, action.payload.stats.obedience));
        }
      }
    },
    
    // Learn skill
    learnSkill: (state, action: PayloadAction<{ gladiatorId: string; skillId: string }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.gladiatorId);
      if (gladiator && gladiator.skillPoints > 0) {
        const alreadyLearned = gladiator.skills.some(s => s.id === action.payload.skillId);
        if (!alreadyLearned) {
          gladiator.skills.push({
            id: action.payload.skillId,
            name: action.payload.skillId,
            branch: 'offense', // Will be determined by skill tree
            levelRequired: 1,
            unlocked: true,
          });
          gladiator.skillPoints -= 1;
        }
      }
    },
    
    // Injuries
    addInjury: (state, action: PayloadAction<{ id: string; injury: Gladiator['injuries'][0] }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.id);
      if (gladiator) {
        gladiator.injuries.push(action.payload.injury);
        gladiator.isInjured = true;
      }
    },
    healInjury: (state, action: PayloadAction<{ gladiatorId: string; injuryId: string }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.gladiatorId);
      if (gladiator) {
        gladiator.injuries = gladiator.injuries.filter(i => i.id !== action.payload.injuryId);
        gladiator.isInjured = gladiator.injuries.length > 0;
      }
    },
    updateInjuryRecovery: (state, action: PayloadAction<{ gladiatorId: string; injuryId: string; daysRemaining: number }>) => {
      const gladiator = state.roster.find(g => g.id === action.payload.gladiatorId);
      if (gladiator) {
        const injury = gladiator.injuries.find(i => i.id === action.payload.injuryId);
        if (injury) {
          injury.daysRemaining = action.payload.daysRemaining;
        }
      }
    },
    
    // Reset
    resetGladiators: () => initialState,
  },
});

export const {
  addGladiator,
  removeGladiator,
  killGladiator,
  updateGladiator,
  selectGladiator,
  setMarketPool,
  refreshMarket,
  addToMarket,
  removeFromMarket,
  purchaseGladiator,
  sellGladiator,
  addExperience,
  levelUp,
  distributeStatPoints,
  updateHP,
  updateStamina,
  updateMorale,
  updateFatigue,
  addFame,
  recordWin,
  recordLoss,
  setTraining,
  setResting,
  setTrainingRegimen,
  setNutrition,
  updateStats,
  updateDerivedStats,
  learnSkill,
  addInjury,
  healInjury,
  updateInjuryRecovery,
  resetGladiators,
} = gladiatorsSlice.actions;

// Selectors
export const selectRoster = (state: { gladiators: GladiatorsState }) => state.gladiators.roster;
export const selectMarketPool = (state: { gladiators: GladiatorsState }) => state.gladiators.marketPool;
export const selectLastMarketRefresh = (state: { gladiators: GladiatorsState }) => state.gladiators.lastMarketRefresh;
export const selectGladiatorById = (state: { gladiators: GladiatorsState }, id: string) => 
  state.gladiators.roster.find(g => g.id === id);
export const selectSelectedGladiator = (state: { gladiators: GladiatorsState }) => 
  state.gladiators.roster.find(g => g.id === state.gladiators.selectedGladiatorId);

export default gladiatorsSlice.reducer;
