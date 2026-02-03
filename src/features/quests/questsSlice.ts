import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Quest } from '@/types';

interface QuestsState {
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  storyProgress: number;  // 0-100 story completion percentage
  isEndlessMode: boolean;
}

const initialState: QuestsState = {
  availableQuests: [],
  activeQuests: [],
  completedQuests: [],
  storyProgress: 0,
  isEndlessMode: false,
};

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    // Quest management
    addAvailableQuest: (state, action: PayloadAction<Quest>) => {
      state.availableQuests.push(action.payload);
    },
    setAvailableQuests: (state, action: PayloadAction<Quest[]>) => {
      state.availableQuests = action.payload;
    },
    acceptQuest: (state, action: PayloadAction<string>) => {
      const quest = state.availableQuests.find(q => q.id === action.payload);
      if (quest) {
        quest.status = 'active';
        state.activeQuests.push(quest);
        state.availableQuests = state.availableQuests.filter(q => q.id !== action.payload);
      }
    },
    
    // Quest progress
    completeObjective: (state, action: PayloadAction<{ questId: string; objectiveId: string }>) => {
      const quest = state.activeQuests.find(q => q.id === action.payload.questId);
      if (quest && !quest.completedObjectives.includes(action.payload.objectiveId)) {
        quest.completedObjectives.push(action.payload.objectiveId);
      }
    },
    
    // Quest completion
    completeQuest: (state, action: PayloadAction<{ questId: string; choiceId?: string }>) => {
      const quest = state.activeQuests.find(q => q.id === action.payload.questId);
      if (quest) {
        quest.status = 'completed';
        if (action.payload.choiceId) {
          quest.selectedChoice = action.payload.choiceId;
        }
        state.completedQuests.push(quest);
        state.activeQuests = state.activeQuests.filter(q => q.id !== action.payload.questId);
      }
    },
    failQuest: (state, action: PayloadAction<string>) => {
      const quest = state.activeQuests.find(q => q.id === action.payload);
      if (quest) {
        quest.status = 'failed';
        state.completedQuests.push(quest);
        state.activeQuests = state.activeQuests.filter(q => q.id !== action.payload);
      }
    },
    
    // Story progress
    advanceStory: (state, action: PayloadAction<number>) => {
      state.storyProgress = Math.min(100, state.storyProgress + action.payload);
      if (state.storyProgress >= 100) {
        state.isEndlessMode = true;
      }
    },
    setStoryProgress: (state, action: PayloadAction<number>) => {
      state.storyProgress = Math.max(0, Math.min(100, action.payload));
    },
    
    // Endless mode
    enableEndlessMode: (state) => {
      state.isEndlessMode = true;
      state.storyProgress = 100;
    },
    
    // Expiration check
    expireQuests: (state, action: PayloadAction<number>) => {
      const currentDay = action.payload;
      state.availableQuests = state.availableQuests.filter(q => {
        if (q.expiresOnDay && q.expiresOnDay < currentDay) {
          return false;
        }
        return true;
      });
      state.activeQuests.forEach(quest => {
        if (quest.expiresOnDay && quest.expiresOnDay < currentDay) {
          quest.status = 'failed';
          state.completedQuests.push(quest);
        }
      });
      state.activeQuests = state.activeQuests.filter(q => q.status === 'active');
    },
    
    // Reset
    resetQuests: () => initialState,
  },
});

export const {
  addAvailableQuest,
  setAvailableQuests,
  acceptQuest,
  completeObjective,
  completeQuest,
  failQuest,
  advanceStory,
  setStoryProgress,
  enableEndlessMode,
  expireQuests,
  resetQuests,
} = questsSlice.actions;

// Selectors
export const selectAvailableQuests = (state: { quests: QuestsState }) => state.quests.availableQuests;
export const selectActiveQuests = (state: { quests: QuestsState }) => state.quests.activeQuests;
export const selectCompletedQuests = (state: { quests: QuestsState }) => state.quests.completedQuests;
export const selectStoryProgress = (state: { quests: QuestsState }) => state.quests.storyProgress;
export const selectIsEndlessMode = (state: { quests: QuestsState }) => state.quests.isEndlessMode;

export default questsSlice.reducer;
