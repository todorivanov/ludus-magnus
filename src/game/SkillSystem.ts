/**
 * Skill System
 * 
 * Character skills and abilities system
 */

import { Fighter } from '@entities/Fighter';
import { CharacterClass } from '@/types/game.types';
import { logger, LogCategory } from '@utils/Logger';
import { CLASS_SKILLS } from '@data/classSkills';

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'offensive' | 'defensive' | 'utility' | 'movement';
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  effect: SkillEffect;
}

export interface SkillEffect {
  damageMultiplier?: number;
  healAmount?: number;
  buffType?: 'strength' | 'defense' | 'speed';
  buffAmount?: number;
  buffDuration?: number;
  statusEffect?: string;
  movementRange?: number;
}

export interface SkillResult {
  success: boolean;
  message: string;
  damage?: number;
  healing?: number;
  buffApplied?: boolean;
}

/**
 * Get skills for character class
 */
export const getClassSkills = (characterClass: CharacterClass): Skill[] => {
  return CLASS_SKILLS[characterClass] || [];
};

/**
 * Check if fighter can use skill
 */
export const canUseSkill = (fighter: Fighter, skill: Skill): { can: boolean; reason?: string } => {
  // Check mana
  if (fighter.mana < skill.manaCost) {
    return { can: false, reason: 'Not enough mana' };
  }

  // Check cooldown
  if (skill.currentCooldown > 0) {
    return { can: false, reason: `On cooldown (${skill.currentCooldown} turns)` };
  }

  return { can: true };
};

/**
 * Use skill
 */
export const useSkill = (fighter: Fighter, skill: Skill, target?: Fighter): SkillResult => {
  // Check if can use
  const canUse = canUseSkill(fighter, skill);
  if (!canUse.can) {
    return {
      success: false,
      message: canUse.reason || 'Cannot use skill',
    };
  }

  // Consume mana
  fighter.mana = Math.max(0, fighter.mana - skill.manaCost);

  // Set cooldown
  skill.currentCooldown = skill.cooldown;

  logger.info(
    LogCategory.COMBAT,
    `${fighter.name} uses ${skill.name}! (Mana: ${fighter.mana}/${fighter.maxMana})`
  );

  // Apply skill effect
  let message = `${fighter.name} used ${skill.name}!`;
  let damage = 0;
  let healing = 0;

  if (skill.effect.damageMultiplier && target) {
    // Offensive skill
    const baseDamage = fighter.strength * 0.4 * skill.effect.damageMultiplier;
    damage = Math.floor(Math.max(1, baseDamage - target.defense * 0.5));
    target.hp = Math.max(0, target.hp - damage);
    message += ` Dealt ${damage} damage to ${target.name}!`;
  }

  if (skill.effect.healAmount) {
    // Healing skill
    const healAmount = Math.floor(fighter.maxHp * skill.effect.healAmount);
    const actualHeal = Math.min(healAmount, fighter.maxHp - fighter.hp);
    fighter.hp = Math.min(fighter.maxHp, fighter.hp + healAmount);
    healing = actualHeal;
    message += ` Restored ${actualHeal} HP!`;
  }

  return {
    success: true,
    message,
    damage,
    healing,
  };
};

/**
 * Reduce all skill cooldowns
 */
export const tickCooldowns = (skills: Skill[]): void => {
  skills.forEach((skill) => {
    if (skill.currentCooldown > 0) {
      skill.currentCooldown--;
    }
  });
};
