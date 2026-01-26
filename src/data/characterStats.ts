/**
 * Character Class Base Stats
 * 
 * Default stat values for each character class
 */

import { CharacterClass } from '@/types/game.types';

export interface ClassBaseStats {
  hp: number;
  hpPerLevel: number;
  mana: number;
  manaPerLevel: number;
  strength: number;
  strengthPerLevel: number;
  defense: number;
  defensePerLevel: number;
  speed: number;
  speedPerLevel: number;
  critChance: number;
  critDamage: number;
}

export const CHARACTER_BASE_STATS: Record<CharacterClass, ClassBaseStats> = {
  WARRIOR: {
    hp: 120,
    hpPerLevel: 12,
    mana: 50,
    manaPerLevel: 2,
    strength: 15,
    strengthPerLevel: 2,
    defense: 12,
    defensePerLevel: 1.5,
    speed: 8,
    speedPerLevel: 0.8,
    critChance: 0.1,
    critDamage: 1.5,
  },
  TANK: {
    hp: 150,
    hpPerLevel: 15,
    mana: 40,
    manaPerLevel: 1,
    strength: 10,
    strengthPerLevel: 1.5,
    defense: 18,
    defensePerLevel: 2,
    speed: 5,
    speedPerLevel: 0.5,
    critChance: 0.05,
    critDamage: 1.3,
  },
  BALANCED: {
    hp: 100,
    hpPerLevel: 10,
    mana: 60,
    manaPerLevel: 3,
    strength: 12,
    strengthPerLevel: 1.8,
    defense: 10,
    defensePerLevel: 1.2,
    speed: 10,
    speedPerLevel: 1,
    critChance: 0.12,
    critDamage: 1.5,
  },
  MAGE: {
    hp: 80,
    hpPerLevel: 8,
    mana: 100,
    manaPerLevel: 5,
    strength: 8,
    strengthPerLevel: 1.2,
    defense: 6,
    defensePerLevel: 0.8,
    speed: 7,
    speedPerLevel: 0.7,
    critChance: 0.15,
    critDamage: 2.0,
  },
  ASSASSIN: {
    hp: 90,
    hpPerLevel: 9,
    mana: 70,
    manaPerLevel: 3,
    strength: 14,
    strengthPerLevel: 2,
    defense: 8,
    defensePerLevel: 1,
    speed: 15,
    speedPerLevel: 1.5,
    critChance: 0.25,
    critDamage: 2.2,
  },
  GLASS_CANNON: {
    hp: 70,
    hpPerLevel: 7,
    mana: 80,
    manaPerLevel: 4,
    strength: 20,
    strengthPerLevel: 3,
    defense: 5,
    defensePerLevel: 0.5,
    speed: 9,
    speedPerLevel: 0.9,
    critChance: 0.2,
    critDamage: 2.5,
  },
  BRUISER: {
    hp: 130,
    hpPerLevel: 13,
    mana: 45,
    manaPerLevel: 2,
    strength: 16,
    strengthPerLevel: 2.2,
    defense: 14,
    defensePerLevel: 1.8,
    speed: 6,
    speedPerLevel: 0.6,
    critChance: 0.08,
    critDamage: 1.4,
  },
  BERSERKER: {
    hp: 110,
    hpPerLevel: 11,
    mana: 30,
    manaPerLevel: 1,
    strength: 18,
    strengthPerLevel: 2.5,
    defense: 9,
    defensePerLevel: 1,
    speed: 11,
    speedPerLevel: 1.1,
    critChance: 0.18,
    critDamage: 2.0,
  },
  PALADIN: {
    hp: 125,
    hpPerLevel: 12,
    mana: 75,
    manaPerLevel: 3,
    strength: 13,
    strengthPerLevel: 1.8,
    defense: 15,
    defensePerLevel: 1.8,
    speed: 7,
    speedPerLevel: 0.7,
    critChance: 0.1,
    critDamage: 1.5,
  },
  NECROMANCER: {
    hp: 75,
    hpPerLevel: 7,
    mana: 110,
    manaPerLevel: 6,
    strength: 7,
    strengthPerLevel: 1,
    defense: 7,
    defensePerLevel: 0.9,
    speed: 6,
    speedPerLevel: 0.6,
    critChance: 0.12,
    critDamage: 1.8,
  },
};
