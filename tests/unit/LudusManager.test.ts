import { LudusManager } from '@/game/LudusManager';
import { Ludus, PrestigeLevel } from '@/types/ludus.core.types';
import { FacilityType } from '@/types/facility.types';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LudusManager', () => {
  let manager: LudusManager;
  beforeEach(() => {
    manager = new LudusManager();
  });

  it('should create a new ludus', () => {
    const ludus = manager.createLudus({ name: 'Test Ludus', location: 'rome', owner: 'Player', startingGold: 1000 });
    expect(ludus.name).toBe('Test Ludus');
    expect(ludus.gold).toBe(1000);
    expect(ludus.facilities.length).toBeGreaterThan(0);
    expect(manager.hasLudus()).toBe(true);
  });

  it('should build and upgrade a facility', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 5000 });
    const build = manager.buildFacility('armory');
    expect(build.success).toBe(true);
    const upgrade = manager.upgradeFacility('armory');
    expect(upgrade.success).toBe(true);
  });

  it('should not build duplicate facility', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 5000 });
    manager.buildFacility('armory');
    const result = manager.buildFacility('armory');
    expect(result.success).toBe(false);
  });

  it('should add and remove gladiators', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    const add = manager.addGladiator('g1');
    expect(add.success).toBe(true);
    const remove = manager.removeGladiator('g1');
    expect(remove.success).toBe(true);
  });

  it('should not add gladiator if roster full', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    for (let i = 0; i < 5; i++) manager.addGladiator('g' + i);
    const result = manager.addGladiator('g6');
    expect(result.success).toBe(false);
  });

  it('should add and spend gold', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 100 });
    manager.addGold(50);
    expect(manager.getLudus()?.gold).toBe(150);
    const spent = manager.spendGold(100);
    expect(spent).toBe(true);
    expect(manager.getLudus()?.gold).toBe(50);
  });

  it('should calculate daily expenses and process finances', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    const expenses = manager.calculateDailyExpenses();
    expect(typeof expenses).toBe('number');
    const finances = manager.processDailyFinances();
    expect(finances).toHaveProperty('income');
    expect(finances).toHaveProperty('expenses');
    expect(finances).toHaveProperty('net');
  });

  it('should add reputation and update prestige', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    manager.addReputation(50);
    expect(manager.getLudus()?.reputation).toBe(50);
    expect(manager.getLudus()?.prestigeLevel).toBe('national');
  });

  it('should record tournament win/loss', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    manager.recordTournamentWin();
    expect(manager.getLudus()?.totalWins).toBe(1);
    manager.recordTournamentLoss();
    expect(manager.getLudus()?.totalLosses).toBe(1);
  });

  it('should level up ludus if enough wins', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    const ludus = manager.getLudus();
    if (ludus) ludus.totalWins = 10;
    const canLevel = manager.canLevelUp();
    expect(canLevel).toBe(true);
    const result = manager.levelUp();
    expect(result.success).toBe(true);
    expect(result.newLevel).toBe(2);
  });

  it('should get stats summary', () => {
    manager.createLudus({ name: 'L', location: 'rome', owner: 'P', startingGold: 1000 });
    const summary = manager.getStatsSummary();
    expect(summary).not.toBeNull();
    expect(summary).toHaveProperty('level');
    expect(summary).toHaveProperty('reputation');
    expect(summary).toHaveProperty('prestige');
    expect(summary).toHaveProperty('gold');
    expect(summary).toHaveProperty('gladiatorCount');
    expect(summary).toHaveProperty('maxGladiators');
    expect(summary).toHaveProperty('winRate');
    expect(summary).toHaveProperty('facilities');
  });
});
