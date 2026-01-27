import playerReducer, {
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
} from '@/store/slices/playerSlice';
import { PlayerState, CharacterOrigin, StoryPath } from '@/types/state.types';
import { CharacterClass } from '@/types/game.types';
import { describe, it, expect } from 'vitest';

describe('playerSlice', () => {
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
    talents: { tree1: [], tree2: [], tree3: [] },
    talentPoints: 0,
  };

  it('should handle createCharacter', () => {
    const nextState = playerReducer(initialState, createCharacter({ name: 'Maximus', class: 'warrior' as CharacterClass }));
    expect(nextState.characterCreated).toBe(true);
    expect(nextState.name).toBe('Maximus');
    expect(nextState.class).toBe('warrior');
    expect(nextState.createdAt).toBeTruthy();
    expect(nextState.lastPlayedAt).toBeTruthy();
  });

  it('should handle createCharacterWithPath for gladiator', () => {
    const nextState = playerReducer(initialState, createCharacterWithPath({
      name: 'Spartacus',
      class: 'warrior' as CharacterClass,
      path: 'gladiator' as StoryPath,
      origin: 'thracian_veteran' as CharacterOrigin,
    }));
    expect(nextState.characterCreated).toBe(true);
    expect(nextState.name).toBe('Spartacus');
    expect(nextState.class).toBe('warrior');
    expect(nextState.storyPath).toBe('gladiator');
    expect(nextState.origin).toBe('thracian_veteran');
    expect(nextState.gold).toBe(0);
    expect(nextState.pathSelected).toBe(true);
  });

  it('should handle selectStoryPath', () => {
    const state = { ...initialState, pathSelected: false };
    const nextState = playerReducer(state, selectStoryPath('lanista' as StoryPath));
    expect(nextState.storyPath).toBe('lanista');
    expect(nextState.pathSelected).toBe(true);
  });

  it('should handle addGold and spendGold', () => {
    let state = playerReducer(initialState, addGold(100));
    expect(state.gold).toBe(600);
    state = playerReducer(state, spendGold(200));
    expect(state.gold).toBe(400);
    state = playerReducer(state, spendGold(1000));
    expect(state.gold).toBe(0);
  });

  it('should handle addXP and levelUp', () => {
    let state = playerReducer(initialState, addXP(50));
    expect(state.xp).toBe(50);
    state = playerReducer(state, levelUp());
    expect(state.level).toBe(2);
    expect(state.talentPoints).toBe(1);
  });

  it('should handle learnTalent and unlearnTalent', () => {
    let state = { ...initialState, talentPoints: 2 };
    state = playerReducer(state, learnTalent({ tree: 'tree1', talentId: 't1' }));
    expect(state.talents.tree1).toContain('t1');
    expect(state.talentPoints).toBe(1);
    state = playerReducer(state, unlearnTalent({ tree: 'tree1', talentId: 't1' }));
    expect(state.talents.tree1).not.toContain('t1');
    expect(state.talentPoints).toBe(2);
  });

  it('should handle resetTalents', () => {
    let state = { ...initialState, talents: { tree1: ['a'], tree2: ['b'], tree3: ['c'] }, talentPoints: 0 };
    state = playerReducer(state, resetTalents());
    expect(state.talents.tree1).toHaveLength(0);
    expect(state.talents.tree2).toHaveLength(0);
    expect(state.talents.tree3).toHaveLength(0);
    expect(state.talentPoints).toBe(3);
  });

  it('should handle updateLastPlayed', () => {
    const state = playerReducer(initialState, updateLastPlayed());
    expect(state.lastPlayedAt).toBeTruthy();
  });
});
