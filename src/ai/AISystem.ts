/**
 * AI System
 * 
 * Opponent AI for combat decisions
 */

import { Fighter } from '@entities/Fighter';
import { Skill } from '@game/SkillSystem';
import { logger, LogCategory } from '@utils/Logger';
import { randomInt } from '@utils/helpers';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

export type AIAction = {
  type: 'attack' | 'skill' | 'defend' | 'wait';
  skillIndex?: number;
  skillId?: string;
};

export interface AIPersonality {
  aggression: number; // 0-1: how often to attack vs defend
  skillUsage: number; // 0-1: how often to use skills
  preservation: number; // 0-1: how cautious when low HP
  intelligence: number; // 0-1: how optimal decisions are
}

/**
 * Get AI personality based on difficulty
 */
export const getAIPersonality = (difficulty: Difficulty): AIPersonality => {
  const personalities: Record<Difficulty, AIPersonality> = {
    easy: {
      aggression: 0.6,
      skillUsage: 0.2,
      preservation: 0.7,
      intelligence: 0.3,
    },
    normal: {
      aggression: 0.7,
      skillUsage: 0.4,
      preservation: 0.5,
      intelligence: 0.6,
    },
    hard: {
      aggression: 0.8,
      skillUsage: 0.6,
      preservation: 0.3,
      intelligence: 0.8,
    },
    nightmare: {
      aggression: 0.9,
      skillUsage: 0.8,
      preservation: 0.2,
      intelligence: 1.0,
    },
  };

  return personalities[difficulty];
};

/**
 * Evaluate fighter's health status
 */
const evaluateHealth = (fighter: Fighter): 'critical' | 'low' | 'medium' | 'high' => {
  const hpPercent = (fighter.hp / fighter.maxHp) * 100;

  if (hpPercent < 20) return 'critical';
  if (hpPercent < 40) return 'low';
  if (hpPercent < 70) return 'medium';
  return 'high';
};

/**
 * Check if any offensive skill is available
 */
const hasOffensiveSkill = (skills: Skill[], fighter: Fighter): Skill | null => {
  for (const skill of skills) {
    if (
      skill.type === 'offensive' &&
      skill.currentCooldown === 0 &&
      fighter.mana >= skill.manaCost
    ) {
      return skill;
    }
  }
  return null;
};

/**
 * Check if healing skill is available
 */
const hasHealingSkill = (skills: Skill[], fighter: Fighter): Skill | null => {
  for (const skill of skills) {
    if (
      skill.type === 'utility' &&
      skill.effect.healAmount &&
      skill.currentCooldown === 0 &&
      fighter.mana >= skill.manaCost
    ) {
      return skill;
    }
  }
  return null;
};

/**
 * Calculate threat level of enemy
 */
const evaluateThreat = (enemy: Fighter, self: Fighter): number => {
  let threat = 0;

  // Higher enemy HP = higher threat
  const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
  threat += enemyHpPercent * 0.3;

  // Higher enemy strength = higher threat
  const strengthRatio = enemy.strength / self.strength;
  threat += strengthRatio * 30;

  // Lower own HP = higher threat
  const selfHpPercent = (self.hp / self.maxHp) * 100;
  threat += (100 - selfHpPercent) * 0.4;

  return Math.min(100, threat);
};

/**
 * AI Decision Making
 */
export const makeAIDecision = (
  fighter: Fighter,
  enemy: Fighter,
  skills: Skill[],
  difficulty: Difficulty
): AIAction => {
  const personality = getAIPersonality(difficulty);
  const health = evaluateHealth(fighter);
  const threat = evaluateThreat(enemy, fighter);

  logger.debug(LogCategory.AI, `AI Decision for ${fighter.name}`, {
    health,
    threat: threat.toFixed(1),
    mana: fighter.mana,
    difficulty,
  });

  // Critical HP - try to heal or defend
  if (health === 'critical') {
    const healSkill = hasHealingSkill(skills, fighter);
    if (healSkill && Math.random() < personality.preservation) {
      const skillIndex = skills.indexOf(healSkill);
      logger.info(LogCategory.AI, `${fighter.name} decides to heal (critical HP)`);
      return { type: 'skill', skillIndex, skillId: healSkill.id };
    }

    // No heal available, defend if preservation is high
    if (Math.random() < personality.preservation * 0.8) {
      logger.info(LogCategory.AI, `${fighter.name} decides to defend (critical HP)`);
      return { type: 'defend' };
    }
  }

  // Low HP - consider healing
  if (health === 'low') {
    const healSkill = hasHealingSkill(skills, fighter);
    if (healSkill && Math.random() < personality.preservation * 0.6) {
      const skillIndex = skills.indexOf(healSkill);
      logger.info(LogCategory.AI, `${fighter.name} decides to heal (low HP)`);
      return { type: 'skill', skillIndex, skillId: healSkill.id };
    }
  }

  // Check for offensive skill usage
  const offensiveSkill = hasOffensiveSkill(skills, fighter);
  if (offensiveSkill) {
    // High intelligence - use skills strategically
    const shouldUseSkill = personality.intelligence > 0.7
      ? threat > 50 || Math.random() < personality.skillUsage
      : Math.random() < personality.skillUsage;

    if (shouldUseSkill) {
      const skillIndex = skills.indexOf(offensiveSkill);
      logger.info(LogCategory.AI, `${fighter.name} decides to use ${offensiveSkill.name}`);
      return { type: 'skill', skillIndex, skillId: offensiveSkill.id };
    }
  }

  // Decide between attack and defend
  const roll = Math.random();

  if (roll < personality.aggression) {
    logger.info(LogCategory.AI, `${fighter.name} decides to attack`);
    return { type: 'attack' };
  }

  if (roll < personality.aggression + 0.2) {
    logger.info(LogCategory.AI, `${fighter.name} decides to defend`);
    return { type: 'defend' };
  }

  logger.info(LogCategory.AI, `${fighter.name} decides to wait`);
  return { type: 'wait' };
};

/**
 * Random AI (for easy mode or testing)
 */
export const makeRandomDecision = (fighter: Fighter, skills: Skill[]): AIAction => {
  const actions: AIAction['type'][] = ['attack', 'attack', 'attack', 'defend', 'wait'];
  const actionType = actions[randomInt(0, actions.length - 1)] as AIAction['type'];

  // Try to use skill 20% of the time
  if (Math.random() < 0.2 && skills.length > 0) {
    const availableSkills = skills.filter(
      (skill) => skill.currentCooldown === 0 && fighter.mana >= skill.manaCost
    );

    if (availableSkills.length > 0) {
      const randomSkill = availableSkills[randomInt(0, availableSkills.length - 1)];
      if (randomSkill) {
        const skillIndex = skills.indexOf(randomSkill);
        logger.info(LogCategory.AI, `${fighter.name} randomly uses ${randomSkill.name}`);
        return { type: 'skill', skillIndex };
      }
    }
  }

  logger.info(LogCategory.AI, `${fighter.name} randomly chooses to ${actionType}`);
  return { type: actionType };
};

/**
 * Aggressive AI (always attacks)
 */
export const makeAggressiveDecision = (fighter: Fighter, skills: Skill[]): AIAction => {
  // Try to use offensive skill if available
  const offensiveSkill = hasOffensiveSkill(skills, fighter);
  if (offensiveSkill && Math.random() < 0.5) {
    const skillIndex = skills.indexOf(offensiveSkill);
    logger.info(LogCategory.AI, `${fighter.name} aggressively uses ${offensiveSkill.name}`);
    return { type: 'skill', skillIndex };
  }

  logger.info(LogCategory.AI, `${fighter.name} attacks aggressively`);
  return { type: 'attack' };
};

/**
 * Defensive AI (prioritizes survival)
 */
export const makeDefensiveDecision = (fighter: Fighter, skills: Skill[]): AIAction => {
  const health = evaluateHealth(fighter);

  // Try to heal if low HP
  if (health === 'critical' || health === 'low') {
    const healSkill = hasHealingSkill(skills, fighter);
    if (healSkill) {
      const skillIndex = skills.indexOf(healSkill);
      logger.info(LogCategory.AI, `${fighter.name} defensively heals`);
      return { type: 'skill', skillIndex };
    }
  }

  // Defend most of the time
  if (Math.random() < 0.7) {
    logger.info(LogCategory.AI, `${fighter.name} defends`);
    return { type: 'defend' };
  }

  logger.info(LogCategory.AI, `${fighter.name} cautiously attacks`);
  return { type: 'attack' };
};
