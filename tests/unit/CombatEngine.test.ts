import {
  calculateDamage,
  applyDamage,
  healFighter,
  canAct,
  isAlive,
  isDefeated,
  calculateHitChance,
  checkHit,
  performAttack,
  calculateEffectiveStats,
  createCombatStats,
  updateCombatStats,
} from '@/game/CombatEngine';
import { describe, beforeEach, it, expect } from 'vitest';

// Mock Fighter class for testing
class MockFighter {
  constructor(init: { name: string; strength: number; defense: number; speed: number; critChance: number; critDamage: number; hp: number; maxHp: number; statusEffects: never[]; }) {
    Object.assign(this, init);
  }
}

describe('CombatEngine', () => {
  let attacker: MockFighter, defender: MockFighter;
  beforeEach(() => {
    attacker = new MockFighter({
      name: 'Attacker',
      strength: 100,
      defense: 20,
      speed: 10,
      critChance: 1, // always crit for test
      critDamage: 2,
      hp: 100,
      maxHp: 100,
      statusEffects: [],
    });
    defender = new MockFighter({
      name: 'Defender',
      strength: 80,
      defense: 30,
      speed: 8,
      critChance: 0,
      critDamage: 1.5,
      hp: 120,
      maxHp: 120,
      statusEffects: [],
    });
  });

  it('calculateDamage returns correct values', () => {
    const result = calculateDamage(attacker, defender, { isCritical: true });
    expect(result.baseDamage).toBeCloseTo(100 * 0.4);
    expect(result.isCritical).toBe(true);
    expect(result.finalDamage).toBeGreaterThan(0);
    expect(result.damageType).toBe('physical');
  });

  it('applyDamage reduces hp and returns actual damage', () => {
    const dmg = 30;
    const actual = applyDamage(defender, dmg);
    expect(actual).toBe(dmg);
    expect(defender.hp).toBe(90);
  });

  it('healFighter restores hp and tracks overheal', () => {
    defender.hp = 100;
    const result = healFighter(defender, 30);
    expect(result.amount).toBe(20);
    expect(result.overheal).toBe(10);
    expect(defender.hp).toBe(120);
  });

  it('canAct returns true (stub)', () => {
    expect(canAct(attacker)).toBe(true);
  });

  it('isAlive/isDefeated work as expected', () => {
    expect(isAlive(defender)).toBe(true);
    defender.hp = 0;
    expect(isAlive(defender)).toBe(false);
    expect(isDefeated(defender)).toBe(true);
  });

  it('calculateHitChance returns a number between 0.5 and 0.99', () => {
    const hitChance = calculateHitChance(attacker, defender);
    expect(hitChance).toBeGreaterThanOrEqual(0.5);
    expect(hitChance).toBeLessThanOrEqual(0.99);
  });

  it('checkHit returns boolean', () => {
    const result = checkHit(attacker, defender);
    expect(typeof result).toBe('boolean');
  });

  it('performAttack returns correct structure', () => {
    const result = performAttack(attacker, defender);
    expect(result).toHaveProperty('hit');
    expect(result).toHaveProperty('damage');
    expect(result).toHaveProperty('result');
  });

  it('calculateEffectiveStats returns base stats', () => {
    const stats = calculateEffectiveStats(attacker);
    expect(stats.strength).toBe(attacker.strength);
    expect(stats.defense).toBe(attacker.defense);
    expect(stats.speed).toBe(attacker.speed);
    expect(stats.critChance).toBe(attacker.critChance);
    expect(stats.critDamage).toBe(attacker.critDamage);
  });

  it('createCombatStats returns zeroed stats', () => {
    const stats = createCombatStats();
    expect(stats.attacksLanded).toBe(0);
    expect(stats.criticalHits).toBe(0);
    expect(stats.totalDamageDealt).toBe(0);
    expect(stats.totalDamageTaken).toBe(0);
    expect(stats.healing).toBe(0);
    expect(stats.skillsUsed).toBe(0);
  });

  it('updateCombatStats increments stats', () => {
    const stats = createCombatStats();
    updateCombatStats(stats, 'attack', 2);
    updateCombatStats(stats, 'critical', 1);
    updateCombatStats(stats, 'damage_dealt', 10);
    updateCombatStats(stats, 'damage_taken', 5);
    updateCombatStats(stats, 'heal', 3);
    updateCombatStats(stats, 'skill', 4);
    expect(stats.attacksLanded).toBe(2);
    expect(stats.criticalHits).toBe(1);
    expect(stats.totalDamageDealt).toBe(10);
    expect(stats.totalDamageTaken).toBe(5);
    expect(stats.healing).toBe(3);
    expect(stats.skillsUsed).toBe(4);
  });
});
