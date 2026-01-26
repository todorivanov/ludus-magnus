import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnlocksState } from '@/types/state.types';

const initialState: UnlocksState = {
  achievements: [],
};

const unlocksSlice = createSlice({
  name: 'unlocks',
  initialState,
  reducers: {
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    },
  },
});

export const { unlockAchievement } = unlocksSlice.actions;

export default unlocksSlice.reducer;
