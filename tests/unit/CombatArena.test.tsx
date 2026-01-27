import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CombatArena } from '@/components/combat/CombatArena';
import { beforeAll, describe, it, vi, expect } from 'vitest';
import { skipToken } from '@reduxjs/toolkit/query';

// Mock scrollIntoView for jsdom
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

describe('CombatArena', () => {
  const playerFighter = {
    id: 'player-1',
    name: 'Maximus',
    class: 'warrior',
    level: 5,
    xp: 100,
    hp: 100,
    maxHp: 100,
    mana: 30,
    maxMana: 50,
    strength: 20,
    defense: 10,
    speed: 8,
    critChance: 15,
    critDamage: 2,
    equipped: {
      weapon: null,
      head: null,
      torso: null,
      arms: null,
      trousers: null,
      shoes: null,
      coat: null,
      accessory: null,
    },
    talents: {},
    statusEffects: [],
    isPlayer: true,
    portrait: '',
    gold: 0,
    inventory: [],
    skills: [],
    alive: true,
    ai: undefined,
    storyPath: 'gladiator',
    origin: 'Thracian Veteran',
    lastAction: null,
    buffs: [],
    debuffs: [],
    position: { x: 0, y: 0 },
    team: 'player',
    defeated: false,
  };
  const enemyFighter = {
    id: 'enemy-1',
    name: 'Brutus',
    class: 'warrior',
    level: 5,
    xp: 100,
    hp: 100,
    maxHp: 100,
    mana: 30,
    maxMana: 50,
    strength: 18,
    defense: 9,
    speed: 7,
    critChance: 10,
    critDamage: 2,
    equipped: {
      weapon: null,
      head: null,
      torso: null,
      arms: null,
      trousers: null,
      shoes: null,
      coat: null,
      accessory: null,
    },
    talents: {},
    statusEffects: [],
    isPlayer: false,
    portrait: '',
    gold: 0,
    inventory: [],
    skills: [],
    alive: true,
    ai: undefined,
    storyPath: 'gladiator',
    origin: 'Thracian Veteran',
    lastAction: null,
    buffs: [],
    debuffs: [],
    position: { x: 0, y: 0 },
    team: 'enemy',
    defeated: false,
  };

  it('shows battle end screen on victory', () => {
    // Simulate player victory by setting enemy hp to 0
    const onBattleEnd = vi.fn();
    render(
      <CombatArena
        playerFighter={playerFighter}
        enemyFighter={{ ...enemyFighter, hp: 0 }}
        onBattleEnd={onBattleEnd}
      />
    );
    // Wait for effect
    setTimeout(() => {
      expect(screen.getByText('🏆 VICTORY! 🏆')).toBeInTheDocument();
      expect(onBattleEnd).toHaveBeenCalledWith('player');
    }, 1200);
  });

  it('shows battle end screen on defeat', () => {
    // Simulate player defeat by setting player hp to 0
    const onBattleEnd = vi.fn();
    render(
      <CombatArena
        playerFighter={{ ...playerFighter, hp: 0 }}
        enemyFighter={enemyFighter}
        onBattleEnd={onBattleEnd}
      />
    );
    setTimeout(() => {
      expect(screen.getByText('💀 DEFEAT 💀')).toBeInTheDocument();
      expect(onBattleEnd).toHaveBeenCalledWith('enemy');
    }, 1200);
  });
});
