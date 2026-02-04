import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestObjectiveState {
  id: string;
  current: number;
  completed: boolean;
}

interface ActiveQuest {
  questId: string;
  startDay: number;
  objectives: QuestObjectiveState[];
  dialogueIndex: number;
  selectedChoices: Record<string, string>;
}

interface CompletedQuest {
  questId: string;
  completedDay: number;
  failed: boolean;
  selectedChoices: Record<string, string>;
}

interface QuestsState {
  // Active quest tracking
  activeQuests: ActiveQuest[];
  
  // Completed quest IDs for unlock checks
  completedQuestIds: string[];
  completedQuests: CompletedQuest[];
  
  // Cooldowns for repeatable quests
  questCooldowns: Record<string, number>;
  
  // Story progress
  currentChapter: number;
  storyProgress: number; // 0-100
  isEndlessMode: boolean;
  
  // Current dialogue state
  activeDialogue: {
    questId: string;
    dialogueId: string;
  } | null;
}

const initialState: QuestsState = {
  activeQuests: [],
  completedQuestIds: [],
  completedQuests: [],
  questCooldowns: {},
  currentChapter: 1,
  storyProgress: 0,
  isEndlessMode: false,
  activeDialogue: null,
};

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    // Accept/Start a quest
    startQuest: (state, action: PayloadAction<{
      questId: string;
      startDay: number;
      objectives: { id: string; required: number; initialProgress?: number }[];
    }>) => {
      // Don't add if already active
      if (state.activeQuests.some(q => q.questId === action.payload.questId)) {
        return;
      }
      
      state.activeQuests.push({
        questId: action.payload.questId,
        startDay: action.payload.startDay,
        objectives: action.payload.objectives.map(o => {
          const progress = Math.min(o.initialProgress || 0, o.required);
          return {
            id: o.id,
            current: progress,
            completed: progress >= o.required,
          };
        }),
        dialogueIndex: 0,
        selectedChoices: {},
      });
    },
    
    // Update objective progress
    updateObjective: (state, action: PayloadAction<{
      questId: string;
      objectiveId: string;
      progress: number;
      required: number;
    }>) => {
      const quest = state.activeQuests.find(q => q.questId === action.payload.questId);
      if (quest) {
        const objective = quest.objectives.find(o => o.id === action.payload.objectiveId);
        if (objective) {
          objective.current = Math.min(action.payload.progress, action.payload.required);
          objective.completed = objective.current >= action.payload.required;
        }
      }
    },
    
    // Increment objective
    incrementObjective: (state, action: PayloadAction<{
      questId: string;
      objectiveId: string;
      amount: number;
      required: number;
    }>) => {
      const quest = state.activeQuests.find(q => q.questId === action.payload.questId);
      if (quest) {
        const objective = quest.objectives.find(o => o.id === action.payload.objectiveId);
        if (objective && !objective.completed) {
          objective.current = Math.min(objective.current + action.payload.amount, action.payload.required);
          objective.completed = objective.current >= action.payload.required;
        }
      }
    },
    
    // Complete quest
    completeQuest: (state, action: PayloadAction<{
      questId: string;
      completedDay: number;
      cooldownDays?: number;
    }>) => {
      const quest = state.activeQuests.find(q => q.questId === action.payload.questId);
      if (quest) {
        // Move to completed
        state.completedQuests.push({
          questId: action.payload.questId,
          completedDay: action.payload.completedDay,
          failed: false,
          selectedChoices: quest.selectedChoices,
        });
        
        // Add to completed IDs
        if (!state.completedQuestIds.includes(action.payload.questId)) {
          state.completedQuestIds.push(action.payload.questId);
        }
        
        // Set cooldown if applicable
        if (action.payload.cooldownDays) {
          state.questCooldowns[action.payload.questId] = action.payload.cooldownDays;
        }
        
        // Remove from active
        state.activeQuests = state.activeQuests.filter(q => q.questId !== action.payload.questId);
      }
    },
    
    // Fail quest
    failQuest: (state, action: PayloadAction<{
      questId: string;
      completedDay: number;
    }>) => {
      const quest = state.activeQuests.find(q => q.questId === action.payload.questId);
      if (quest) {
        state.completedQuests.push({
          questId: action.payload.questId,
          completedDay: action.payload.completedDay,
          failed: true,
          selectedChoices: quest.selectedChoices,
        });
        state.activeQuests = state.activeQuests.filter(q => q.questId !== action.payload.questId);
      }
    },
    
    // Abandon quest
    abandonQuest: (state, action: PayloadAction<string>) => {
      state.activeQuests = state.activeQuests.filter(q => q.questId !== action.payload);
    },
    
    // Record dialogue choice
    recordChoice: (state, action: PayloadAction<{
      questId: string;
      dialogueId: string;
      choiceId: string;
    }>) => {
      const quest = state.activeQuests.find(q => q.questId === action.payload.questId);
      if (quest) {
        quest.selectedChoices[action.payload.dialogueId] = action.payload.choiceId;
      }
    },
    
    // Set active dialogue
    setActiveDialogue: (state, action: PayloadAction<{ questId: string; dialogueId: string } | null>) => {
      state.activeDialogue = action.payload;
    },
    
    // Tick cooldowns (called daily)
    tickCooldowns: (state) => {
      // Ensure questCooldowns exists (for backward compatibility with persisted state)
      if (!state.questCooldowns) {
        state.questCooldowns = {};
        return;
      }
      Object.keys(state.questCooldowns).forEach(questId => {
        if (state.questCooldowns[questId] > 0) {
          state.questCooldowns[questId]--;
        }
      });
    },
    
    // Story progress
    advanceChapter: (state) => {
      state.currentChapter++;
      state.storyProgress = Math.min(100, (state.currentChapter / 5) * 100);
      if (state.currentChapter >= 5) {
        state.isEndlessMode = true;
      }
    },
    
    setStoryProgress: (state, action: PayloadAction<number>) => {
      state.storyProgress = Math.max(0, Math.min(100, action.payload));
    },
    
    enableEndlessMode: (state) => {
      state.isEndlessMode = true;
      state.storyProgress = 100;
    },
    
    // Reset
    resetQuests: () => initialState,
  },
});

export const {
  startQuest,
  updateObjective,
  incrementObjective,
  completeQuest,
  failQuest,
  abandonQuest,
  recordChoice,
  setActiveDialogue,
  tickCooldowns,
  advanceChapter,
  setStoryProgress,
  enableEndlessMode,
  resetQuests,
} = questsSlice.actions;

// Selectors
export const selectActiveQuests = (state: { quests: QuestsState }) => state.quests.activeQuests;
export const selectCompletedQuestIds = (state: { quests: QuestsState }) => state.quests.completedQuestIds;
export const selectCompletedQuests = (state: { quests: QuestsState }) => state.quests.completedQuests;
export const selectQuestCooldowns = (state: { quests: QuestsState }) => state.quests.questCooldowns;
export const selectCurrentChapter = (state: { quests: QuestsState }) => state.quests.currentChapter;
export const selectStoryProgress = (state: { quests: QuestsState }) => state.quests.storyProgress;
export const selectIsEndlessMode = (state: { quests: QuestsState }) => state.quests.isEndlessMode;
export const selectActiveDialogue = (state: { quests: QuestsState }) => state.quests.activeDialogue;

export default questsSlice.reducer;
