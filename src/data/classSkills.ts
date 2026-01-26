/**
 * Class Skills Data
 * 
 * Skill definitions for all 10 character classes
 */

import { CharacterClass } from '@/types/game.types';
import type { Skill } from '@game/SkillSystem';

export const CLASS_SKILLS: Record<CharacterClass, Skill[]> = {
  WARRIOR: [
    {
      id: 'warrior_slash',
      name: 'Power Slash',
      description: 'A powerful slash that deals 150% damage',
      type: 'offensive',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.5,
      },
    },
    {
      id: 'warrior_defense',
      name: 'Shield Block',
      description: 'Increase defense by 50% for 2 turns',
      type: 'defensive',
      manaCost: 10,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        buffType: 'defense',
        buffAmount: 0.5,
        buffDuration: 2,
      },
    },
    {
      id: 'warrior_movement',
      name: 'Tactical Reposition',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  TANK: [
    {
      id: 'tank_taunt',
      name: 'Taunt',
      description: 'Force enemy to attack you, gain 30% defense',
      type: 'defensive',
      manaCost: 20,
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        buffType: 'defense',
        buffAmount: 0.3,
        buffDuration: 2,
      },
    },
    {
      id: 'tank_slam',
      name: 'Ground Slam',
      description: 'Deal 120% damage and slow enemy',
      type: 'offensive',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.2,
        statusEffect: 'slow',
      },
    },
    {
      id: 'tank_movement',
      name: 'Tactical Reposition',
      description: 'Move up to 1 space',
      type: 'movement',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        movementRange: 1,
      },
    },
  ],
  MAGE: [
    {
      id: 'mage_fireball',
      name: 'Fireball',
      description: 'Hurl a fireball dealing 180% damage',
      type: 'offensive',
      manaCost: 25,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.8,
      },
    },
    {
      id: 'mage_heal',
      name: 'Healing Light',
      description: 'Restore 40% of max HP',
      type: 'utility',
      manaCost: 20,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        healAmount: 0.4,
      },
    },
    {
      id: 'mage_movement',
      name: 'Arcane Step',
      description: 'Teleport up to 3 spaces',
      type: 'movement',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        movementRange: 3,
      },
    },
  ],
  ASSASSIN: [
    {
      id: 'assassin_backstab',
      name: 'Backstab',
      description: 'Deal 200% damage if behind enemy',
      type: 'offensive',
      manaCost: 20,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 2.0,
      },
    },
    {
      id: 'assassin_vanish',
      name: 'Vanish',
      description: 'Increase speed by 50% for 2 turns',
      type: 'utility',
      manaCost: 15,
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        buffType: 'speed',
        buffAmount: 0.5,
        buffDuration: 2,
      },
    },
    {
      id: 'assassin_movement',
      name: 'Shadow Step',
      description: 'Move up to 3 spaces silently',
      type: 'movement',
      manaCost: 10,
      cooldown: 0,
      currentCooldown: 0,
      effect: {
        movementRange: 3,
      },
    },
  ],
  BALANCED: [
    {
      id: 'balanced_strike',
      name: 'Balanced Strike',
      description: 'Deal 130% damage with high accuracy',
      type: 'offensive',
      manaCost: 12,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.3,
      },
    },
    {
      id: 'balanced_recover',
      name: 'Quick Recovery',
      description: 'Restore 25% HP and 20 mana',
      type: 'utility',
      manaCost: 15,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        healAmount: 0.25,
      },
    },
    {
      id: 'balanced_movement',
      name: 'Reposition',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 10,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  GLASS_CANNON: [
    {
      id: 'glass_cannon_nuke',
      name: 'Glass Cannon',
      description: 'Deal massive 250% damage but take 20% recoil',
      type: 'offensive',
      manaCost: 30,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 2.5,
      },
    },
    {
      id: 'glass_cannon_focus',
      name: 'Focus Fire',
      description: 'Increase critical chance by 30% for 2 turns',
      type: 'utility',
      manaCost: 20,
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        buffType: 'strength',
        buffAmount: 0.3,
        buffDuration: 2,
      },
    },
    {
      id: 'glass_cannon_movement',
      name: 'Quick Step',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 10,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  BRUISER: [
    {
      id: 'bruiser_smash',
      name: 'Heavy Smash',
      description: 'Deal 160% damage and reduce enemy defense',
      type: 'offensive',
      manaCost: 18,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.6,
        statusEffect: 'armor_break',
      },
    },
    {
      id: 'bruiser_rage',
      name: 'Enrage',
      description: 'Gain 40% strength for 2 turns',
      type: 'utility',
      manaCost: 15,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        buffType: 'strength',
        buffAmount: 0.4,
        buffDuration: 2,
      },
    },
    {
      id: 'bruiser_movement',
      name: 'Advance',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 10,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  BERSERKER: [
    {
      id: 'berserker_frenzy',
      name: 'Berserker Frenzy',
      description: 'Deal 220% damage, higher at low HP',
      type: 'offensive',
      manaCost: 25,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 2.2,
      },
    },
    {
      id: 'berserker_bloodlust',
      name: 'Bloodlust',
      description: 'Convert 10% HP to strength bonus',
      type: 'utility',
      manaCost: 15,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        buffType: 'strength',
        buffAmount: 0.5,
        buffDuration: 2,
      },
    },
    {
      id: 'berserker_movement',
      name: 'Wild Charge',
      description: 'Move up to 2 spaces aggressively',
      type: 'movement',
      manaCost: 10,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  PALADIN: [
    {
      id: 'paladin_smite',
      name: 'Divine Smite',
      description: 'Deal 170% holy damage',
      type: 'offensive',
      manaCost: 20,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.7,
      },
    },
    {
      id: 'paladin_heal',
      name: 'Lay on Hands',
      description: 'Restore 50% HP',
      type: 'utility',
      manaCost: 25,
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        healAmount: 0.5,
      },
    },
    {
      id: 'paladin_movement',
      name: 'Tactical Movement',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 10,
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
  NECROMANCER: [
    {
      id: 'necro_drain',
      name: 'Life Drain',
      description: 'Deal 140% damage and heal for 50% of damage',
      type: 'offensive',
      manaCost: 22,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        damageMultiplier: 1.4,
        healAmount: 0.5,
      },
    },
    {
      id: 'necro_curse',
      name: 'Curse of Weakness',
      description: 'Reduce enemy strength by 30% for 3 turns',
      type: 'utility',
      manaCost: 18,
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        statusEffect: 'weakened',
      },
    },
    {
      id: 'necro_movement',
      name: 'Shadow Walk',
      description: 'Move up to 2 spaces',
      type: 'movement',
      manaCost: 15,
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        movementRange: 2,
      },
    },
  ],
};
