import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoryState } from '@/types/state.types';

const initialState: StoryState = {
  currentMission: null,
  currentMissionState: null,
  unlockedRegions: [],
  unlockedMissions: [],
  completedMissions: {},
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentMission: (state, action: PayloadAction<string>) => {
      state.currentMission = action.payload;
    },
    
    completeMission: (
      state,
      action: PayloadAction<{ missionId: string; stars: number }>
    ) => {
      const { missionId, stars } = action.payload;
      state.completedMissions[missionId] = {
        stars,
        completedAt: Date.now(),
      };
      state.currentMission = null;
      state.currentMissionState = null;
    },
    
    unlockRegion: (state, action: PayloadAction<string>) => {
      if (!state.unlockedRegions.includes(action.payload)) {
        state.unlockedRegions.push(action.payload);
      }
    },
    
    unlockMission: (state, action: PayloadAction<string>) => {
      if (!state.unlockedMissions.includes(action.payload)) {
        state.unlockedMissions.push(action.payload);
      }
    },
  },
});

export const { setCurrentMission, completeMission, unlockRegion, unlockMission } =
  storySlice.actions;

export default storySlice.reducer;
