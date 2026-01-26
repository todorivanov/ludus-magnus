/**
 * Combat Engine
 * 
 * Pure functions for combat damage calculations and combat logic
 */

import { Fighter } from '@entities/Fighter';
import { logger, LogCategory } from '@utils/Logger';

export interface DamageOptions {
  ignoreDefense?: boolean;
  damageMultiplier?: number;
  isCritical?: boolean;
}

export interface DamageResult {
  baseDamage: number;
  finalDamage: number;
  isCritical: boolean;
  damageBlocked: number;
  damageType: 'physical' | 'magical';
}

export interface HealResult {
  amount: number;
  overheal: number;
  finalHP: number;
}

export interface CombatStats {
  attacksLanded: number;
  criticalHits: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  healing: number;
  skillsUsed: number;
}

/**
 * Calculate damage dealt by attacker to defender
 */
export const calculateDamage = (
  attacker: Fighter,
  defender: Fighter,
  options: DamageOptions = {}
): DamageResult => {
  const {
    ignoreDefense = false,
    damageMultiplier = 1.0,
    isCritical: forceCritical,
  } = options;

  // Base damage calculation
  const baseDamage = attacker.strength * 0.4 * damageMultiplier;

  // Critical hit check
  const isCritical = forceCritical !== undefined 
    ? forceCritical 
    : Math.random() < attacker.critChance;

  // Apply critical damage
  let damage = isCritical ? baseDamage * attacker.critDamage : baseDamage;

  // Apply defense (unless ignored)
  let damageBlocked = 0;
  if (!ignoreDefense) {
    damageBlocked = defender.defense * 0.5;
    damage = Math.max(1, damage - damageBlocked);
  }

  logger.debug(LogCategory.COMBAT, 'Damage calculated', {
    attacker: attacker.name,
    defender: defender.name,
    baseDamage,
    isCritical,
    damage,
    damageBlocked,
  });

  return {
    baseDamage,
    finalDamage: Math.floor(damage),
    isCritical,
    damageBlocked,
    damageType: 'physical',
  };
};

/**
 * Apply damage to fighter
 */
export const applyDamage = (fighter: Fighter, damage: number): number => {
  const actualDamage = Math.min(damage, fighter.hp);
  fighter.hp = Math.max(0, fighter.hp - damage);

  logger.debug(LogCategory.COMBAT, 'Damage applied', {
    fighter: fighter.name,
    damage: actualDamage,
    remainingHP: fighter.hp,
  });

  return actualDamage;
};

/**
 * Heal fighter
 */
export const healFighter = (fighter: Fighter, amount: number): HealResult => {
  const missingHP = fighter.maxHp - fighter.hp;
  const actualHeal = Math.min(amount, missingHP);
  const overheal = amount - actualHeal;

  fighter.hp = Math.min(fighter.maxHp, fighter.hp + amount);

  logger.debug(LogCategory.COMBAT, 'Healing applied', {
    fighter: fighter.name,
    amount: actualHeal,
    overheal,
    currentHP: fighter.hp,
  });

  return {
    amount: actualHeal,
    overheal,
    finalHP: fighter.hp,
  };
};

/**
 * Check if fighter can act (not stunned, frozen, etc.)
 */
export const canAct = (fighter: Fighter): boolean => {
  return fighter.statusEffects.every((_effect) => {
    // Check for disabling status effects
    // TODO: Implement status effect checking
    return true;
  });
};

/**
 * Check if fighter is alive
 */
export const isAlive = (fighter: Fighter): boolean => {
  return fighter.hp > 0;
};

/**
 * Check if fighter is defeated
 */
export const isDefeated = (fighter: Fighter): boolean => {
  return fighter.hp <= 0;
};

/**
 * Calculate hit chance
 */
export const calculateHitChance = (
  attacker: Fighter,
  defender: Fighter
): number => {
  // Base hit chance 85%
  const baseHitChance = 0.85;

  // Speed affects hit chance (faster = more likely to hit)
  const speedDifference = attacker.speed - defender.speed;
  const speedBonus = speedDifference * 0.01; // 1% per speed point difference

  return Math.max(0.5, Math.min(0.99, baseHitChance + speedBonus));
};

/**
 * Check if attack hits
 */
export const checkHit = (attacker: Fighter, defender: Fighter): boolean => {
  const hitChance = calculateHitChance(attacker, defender);
  const roll = Math.random();

  logger.debug(LogCategory.COMBAT, 'Hit check', {
    attacker: attacker.name,
    defender: defender.name,
    hitChance: (hitChance * 100).toFixed(1) + '%',
    roll: (roll * 100).toFixed(1) + '%',
    hit: roll < hitChance,
  });

  return roll < hitChance;
};

/**
 * Perform normal attack
 */
export const performAttack = (
  attacker: Fighter,
  defender: Fighter
): { hit: boolean; damage: number; result: DamageResult | null } => {
  // Check if attack hits
  const hit = checkHit(attacker, defender);

  if (!hit) {
    logger.info(LogCategory.COMBAT, `${attacker.name} missed ${defender.name}!`);
    return { hit: false, damage: 0, result: null };
  }

  // Calculate and apply damage
  const result = calculateDamage(attacker, defender);
  const actualDamage = applyDamage(defender, result.finalDamage);

  logger.info(
    LogCategory.COMBAT,
    `${attacker.name} attacks ${defender.name}${result.isCritical ? ' [CRITICAL]' : ''} for ${actualDamage} damage!`
  );

  return {
    hit: true,
    damage: actualDamage,
    result,
  };
};

/**
 * Calculate total stats with equipment and buffs
 */
export const calculateEffectiveStats = (fighter: Fighter): {
  strength: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
} => {
  // Base stats
  const stats = {
    strength: fighter.strength,
    defense: fighter.defense,
    speed: fighter.speed,
    critChance: fighter.critChance,
    critDamage: fighter.critDamage,
  };

  // TODO: Apply equipment bonuses
  // TODO: Apply status effect modifiers
  // TODO: Apply talent bonuses

  return stats;
};

/**
 * Initialize combat stats tracker
 */
export const createCombatStats = (): CombatStats => {
  return {
    attacksLanded: 0,
    criticalHits: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    healing: 0,
    skillsUsed: 0,
  };
};

/**
 * Update combat stats
 */
export const updateCombatStats = (
  stats: CombatStats,
  action: 'attack' | 'critical' | 'damage_dealt' | 'damage_taken' | 'heal' | 'skill',
  value: number = 1
): void => {
  switch (action) {
    case 'attack':
      stats.attacksLanded += value;
      break;
    case 'critical':
      stats.criticalHits += value;
      break;
    case 'damage_dealt':
      stats.totalDamageDealt += value;
      break;
    case 'damage_taken':
      stats.totalDamageTaken += value;
      break;
    case 'heal':
      stats.healing += value;
      break;
    case 'skill':
      stats.skillsUsed += value;
      break;
  }
};
