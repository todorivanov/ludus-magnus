import { render, screen } from '@testing-library/react';
import { FighterCard } from '@/components/combat/FighterCard';
import { describe, it, expect, beforeEach } from 'vitest';
import { Fighter } from '@/entities/Fighter';
import { CharacterClass } from '@/types/game.types';

describe('FighterCard', () => {
  let baseFighter: Fighter;
  beforeEach(() => {
    // WARRIOR: hp 120, hpPerLevel 12, mana 50, manaPerLevel 2, strength 15, strengthPerLevel 2, defense 12, defensePerLevel 1.5, speed 8, speedPerLevel 0.8, critChance 0.1, critDamage 1.5
    baseFighter = new Fighter({
      id: '11',
      name: 'Maximus',
      class: 'WARRIOR',
      level: 5,
      xp: 100,
      equipped: { weapon: null, armor: null, accessory: null },
      talents: {},
    });
  });

  it('renders fighter name and level', () => {
    render(<FighterCard fighter={baseFighter} />);
    expect(screen.getByText('Maximus')).toBeInTheDocument();
    expect(screen.getByText(/Level 5/)).toBeInTheDocument();
  });

  it('shows health and mana bars with correct values', () => {
    render(<FighterCard fighter={baseFighter} />);
    // WARRIOR level 5: maxHp = 120 + 12*4 = 168, maxMana = 50 + 2*4 = 58
    expect(screen.getByText('168/168')).toBeInTheDocument();
    expect(screen.getByText('58/58')).toBeInTheDocument();
  });

  it('shows detailed stats if showDetailedStats is true', () => {
    render(<FighterCard fighter={baseFighter} showDetailedStats />);
    expect(screen.getByText('XP: 100')).toBeInTheDocument();
    expect(screen.getByText('⚔️ STR:')).toBeInTheDocument();
    expect(screen.getByText('🛡️ DEF:')).toBeInTheDocument();
    expect(screen.getByText('⚡ SPD:')).toBeInTheDocument();
    expect(screen.getByText('🎯 CRT:')).toBeInTheDocument();
  });

  it('shows status effects if present', () => {
    // Use Fighter instance to ensure correct prototype
    const fighter = new Fighter({
      id: '12',
      name: 'Testus',
      class: 'WARRIOR',
      level: 5,
      xp: 0,
      equipped: { weapon: null, armor: null, accessory: null },
      talents: {},
    });
    fighter.statusEffects = [
      { id: '1', name: 'Stunned', duration: 2 },
      { id: '2', name: 'Poisoned', duration: 3 },
    ];
    render(<FighterCard fighter={fighter} />);
    expect(screen.getByText('Status Effects:')).toBeInTheDocument();
    expect(screen.getByText('Stunned')).toBeInTheDocument();
    expect(screen.getByText('Poisoned')).toBeInTheDocument();
  });

  it('shows defeated state if hp <= 0', () => {
    const fighter = new Fighter({
      id: '13',
      name: 'Defeatus',
      class: 'WARRIOR',
      level: 5,
      xp: 0,
      equipped: { weapon: null, armor: null, accessory: null },
      talents: {},
    });
    fighter.hp = 0;
    render(<FighterCard fighter={fighter} />);
    expect(screen.getByText('💀 DEFEATED')).toBeInTheDocument();
  });
});
