import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterOrigin, PlayerState, StoryPath } from '@/types/state.types';
import { CharacterClass } from '@/types/game.types';

const initialState: PlayerState = {
  characterCreated: false,
  name: '',
  class: '',
  level: 1,
  xp: 0,
  gold: 500,
  storyPath: null,
  origin: null,
  pathSelected: false,
  createdAt: null,
  lastPlayedAt: null,
  talents: {
    tree1: [],
    tree2: [],
    tree3: [],
  },
  talentPoints: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    createCharacter: (
      state,
      action: PayloadAction<{ name: string; class: CharacterClass }>
    ) => {
      state.characterCreated = true;
      state.name = action.payload.name;
      state.class = action.payload.class;
      state.createdAt = Date.now();
      state.lastPlayedAt = Date.now();
    },
    
    createCharacterWithPath: (
      state,
      action: PayloadAction<{
        name: string;
        class: CharacterClass;
        path: StoryPath;
        origin: CharacterOrigin;
      }>
    ) => {
      state.characterCreated = true;
      state.name = action.payload.name;
      state.class = action.payload.class;
      state.storyPath = action.payload.path;
      state.origin = action.payload.origin;
      state.pathSelected = true;
      state.createdAt = Date.now();
      state.lastPlayedAt = Date.now();
      
      // Apply path-specific starting gold
      if (action.payload.path === 'gladiator') {
        state.gold = 0; // Gladiators start with debt
      } else if (action.payload.path === 'lanista') {
        if (action.payload.origin === 'the_merchant') {
          state.gold = 10000; // Rich merchant
        } else if (action.payload.origin === 'the_veteran') {
          state.gold = 2000; // Retired champion
        } else {
          state.gold = 500; // Heir with debts
        }
      } else if (action.payload.path === 'explorer') {
        if (action.payload.origin === 'the_merchant_prince') {
          state.gold = 5000; // Wealthy trader
        } else {
          state.gold = 1000; // Beast hunter or wanderer
        }
      }
    },
    
    selectStoryPath: (state, action: PayloadAction<StoryPath>) => {
      state.storyPath = action.payload;
      state.pathSelected = true;
    },
    
    addGold: (state, action: PayloadAction<number>) => {
      state.gold += action.payload;
    },
    
    spendGold: (state, action: PayloadAction<number>) => {
      state.gold = Math.max(0, state.gold - action.payload);
    },
    
    addXP: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
    },
    
    levelUp: (state) => {
      state.level += 1;
      state.talentPoints += 1;
    },
    
    learnTalent: (state, action: PayloadAction<{ tree: keyof PlayerState['talents']; talentId: string }>) => {
      const { tree, talentId } = action.payload;
      if (!state.talents[tree].includes(talentId)) {
        state.talents[tree].push(talentId);
        state.talentPoints = Math.max(0, state.talentPoints - 1);
      }
    },
    
    unlearnTalent: (state, action: PayloadAction<{ tree: keyof PlayerState['talents']; talentId: string }>) => {
      const { tree, talentId } = action.payload;
      const index = state.talents[tree].indexOf(talentId);
      if (index !== -1) {
        state.talents[tree].splice(index, 1);
        state.talentPoints += 1;
      }
    },
    
    resetTalents: (state) => {
      const totalTalents = 
        state.talents.tree1.length + 
        state.talents.tree2.length + 
        state.talents.tree3.length;
      state.talents = { tree1: [], tree2: [], tree3: [] };
      state.talentPoints += totalTalents;
    },
    
    updateLastPlayed: (state) => {
      state.lastPlayedAt = Date.now();
    },
  },
});

export const {
  createCharacter,
  createCharacterWithPath,
  selectStoryPath,
  addGold,
  spendGold,
  addXP,
  levelUp,
  learnTalent,
  unlearnTalent,
  resetTalents,
  updateLastPlayed,
} = playerSlice.actions;

export default playerSlice.reducer;
