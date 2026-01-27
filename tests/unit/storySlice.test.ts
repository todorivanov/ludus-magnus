import storyReducer, { setCurrentMission, completeMission, unlockRegion, unlockMission } from '@/store/slices/storySlice';
import { StoryState } from '@/types/state.types';
import { describe, it, expect } from 'vitest';

describe('storySlice', () => {
  const initialState: StoryState = {
    currentMission: null,
    currentMissionState: null,
    unlockedRegions: [],
    unlockedMissions: [],
    completedMissions: {},
  };

  it('should handle setCurrentMission', () => {
    const nextState = storyReducer(initialState, setCurrentMission('mission_1'));
    expect(nextState.currentMission).toBe('mission_1');
  });

  it('should handle completeMission', () => {
    const state = { ...initialState, currentMission: 'mission_1' };
    const nextState = storyReducer(state, completeMission({ missionId: 'mission_1', stars: 3 }));
    expect(nextState.completedMissions['mission_1']).toBeDefined();
    expect(nextState.completedMissions['mission_1']!.stars).toBe(3);
    expect(nextState.currentMission).toBeNull();
    expect(nextState.currentMissionState).toBeNull();
  });

  it('should handle unlockRegion', () => {
    let state = storyReducer(initialState, unlockRegion('region_1'));
    expect(state.unlockedRegions).toContain('region_1');
    // Should not add duplicate
    state = storyReducer(state, unlockRegion('region_1'));
    expect(state.unlockedRegions).toEqual(['region_1']);
  });

  it('should handle unlockMission', () => {
    let state = storyReducer(initialState, unlockMission('mission_1'));
    expect(state.unlockedMissions).toContain('mission_1');
    // Should not add duplicate
    state = storyReducer(state, unlockMission('mission_1'));
    expect(state.unlockedMissions).toEqual(['mission_1']);
  });
});
