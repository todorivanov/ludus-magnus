import { getClassSkills, canUseSkill, useSkill, tickCooldowns } from '@/game/SkillSystem';
import { describe, it, expect } from 'vitest';

describe('SkillSystem', () => {
  const mockSkill = {
    id: 's1',
    name: 'Power Strike',
    description: 'A strong attack',
    type: 'offensive',
    manaCost: 10,
    cooldown: 2,
    currentCooldown: 0,
    effect: { damageMultiplier: 2 },
  };
  const mockFighter = {
    name: 'Hero',
    strength: 100,
    defense: 20,
    mana: 50,
    maxMana: 50,
    hp: 100,
    maxHp: 100,
    statusEffects: [],
  };
  const mockTarget = {
    name: 'Enemy',
    strength: 80,
    defense: 10,
    mana: 30,
    maxMana: 30,
    hp: 80,
    maxHp: 80,
    statusEffects: [],
  };

  it('getClassSkills returns array', () => {
    const skills = getClassSkills('warrior');
    expect(Array.isArray(skills)).toBe(true);
  });

  it('canUseSkill returns true if enough mana and not on cooldown', () => {
    const result = canUseSkill({ ...mockFighter }, { ...mockSkill });
    expect(result.can).toBe(true);
  });

  it('canUseSkill returns false if not enough mana', () => {
    const result = canUseSkill({ ...mockFighter, mana: 5 }, { ...mockSkill });
    expect(result.can).toBe(false);
  });

  it('canUseSkill returns false if on cooldown', () => {
    const result = canUseSkill({ ...mockFighter }, { ...mockSkill, currentCooldown: 1 });
    expect(result.can).toBe(false);
  });

  it('useSkill applies damage to target', () => {
    const fighter = { ...mockFighter };
    const target = { ...mockTarget };
    const skill = { ...mockSkill };
    const result = useSkill(fighter, skill, target);
    expect(result.success).toBe(true);
    expect(result.damage).toBeGreaterThan(0);
    expect(target.hp).toBeLessThan(mockTarget.hp);
    expect(skill.currentCooldown).toBe(skill.cooldown);
    expect(fighter.mana).toBe(40);
  });

  it('useSkill returns failure if cannot use', () => {
    const fighter = { ...mockFighter, mana: 0 };
    const skill = { ...mockSkill };
    const result = useSkill(fighter, skill);
    expect(result.success).toBe(false);
  });

  it('useSkill applies healing', () => {
    const fighter = { ...mockFighter, hp: 50 };
    const skill = { ...mockSkill, effect: { healAmount: 0.5 }, manaCost: 10 };
    const result = useSkill(fighter, skill);
    expect(result.success).toBe(true);
    expect(result.healing).toBe(50);
    expect(fighter.hp).toBe(100);
  });

  it('tickCooldowns reduces cooldowns', () => {
    const skills = [
      { ...mockSkill, currentCooldown: 2 },
      { ...mockSkill, currentCooldown: 0 },
    ];
    tickCooldowns(skills);
    expect(skills[0].currentCooldown).toBe(1);
    expect(skills[1].currentCooldown).toBe(0);
  });
});
