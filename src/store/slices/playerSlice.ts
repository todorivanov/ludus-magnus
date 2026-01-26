import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, StoryPath } from '@/types/state.types';
import { CharacterClass } from '@/types/game.types';

const initialState: PlayerState = {
  characterCreated: false,
  name: '',
  class: '',
  level: 1,
  xp: 0,
  gold: 500,
  storyPath: null,
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
