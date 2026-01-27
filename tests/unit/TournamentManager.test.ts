import { TournamentManager } from '@/game/TournamentManager';
import { TournamentType, TournamentTier } from '@/types/tournament.types';
import { describe, beforeEach, it, expect } from 'vitest';

describe('TournamentManager', () => {
  let manager: TournamentManager;
  beforeEach(() => {
    manager = new TournamentManager();
  });

  it('should create a new tournament', () => {
    const now = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days in future
    const t = manager.createTournament({
      name: 'Test Cup',
      type: 'single_elimination',
      location: 'rome',
      tier: 'regional' as TournamentTier,
      entryFee: 100,
      minLevel: 1,
      maxParticipants: 8,
      goldPrize: 500,
      reputationReward: 10,
      startDate: now,
      durationDays: 2,
    });
    expect(t.name).toBe('Test Cup');
    expect(t.status).toBe('upcoming');
    expect(t.maxParticipants).toBe(8);
  });

  it('should register a gladiator', () => {
    const now = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const t = manager.createTournament({
      name: 'Test Cup',
      type: 'single_elimination',
      location: 'rome',
      tier: 'regional' as TournamentTier,
      entryFee: 100,
      minLevel: 1,
      maxParticipants: 2,
      goldPrize: 500,
      reputationReward: 10,
      startDate: now,
      durationDays: 2,
    });
    const reg = manager.registerGladiator(t.id, 'g1', 1, 200);
    expect(reg.success).toBe(true);
    expect(t.registeredGladiators).toContain('g1');
  });

  it('should not register if already registered', () => {
    const now = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const t = manager.createTournament({
      name: 'Test Cup',
      type: 'single_elimination',
      location: 'rome',
      tier: 'regional' as TournamentTier,
      entryFee: 100,
      minLevel: 1,
      maxParticipants: 2,
      goldPrize: 500,
      reputationReward: 10,
      startDate: now,
      durationDays: 2,
    });
    manager.registerGladiator(t.id, 'g1', 1, 200);
    const reg2 = manager.registerGladiator(t.id, 'g1', 1, 200);
    expect(reg2.success).toBe(false);
  });

  it('should not register if not enough gold', () => {
    const now = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const t = manager.createTournament({
      name: 'Test Cup',
      type: 'single_elimination',
      location: 'rome',
      tier: 'regional' as TournamentTier,
      entryFee: 100,
      minLevel: 1,
      maxParticipants: 2,
      goldPrize: 500,
      reputationReward: 10,
      startDate: now,
      durationDays: 2,
    });
    const reg = manager.registerGladiator(t.id, 'g2', 1, 1);
    expect(reg.success).toBe(false);
  });

  it('should get tournament by id', () => {
    const now = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const t = manager.createTournament({
      name: 'Test Cup',
      type: 'single_elimination',
      location: 'rome',
      tier: 'regional' as TournamentTier,
      entryFee: 100,
      minLevel: 1,
      maxParticipants: 2,
      goldPrize: 500,
      reputationReward: 10,
      startDate: now,
      durationDays: 2,
    });
    const found = manager.getTournament(t.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(t.id);
  });
});
