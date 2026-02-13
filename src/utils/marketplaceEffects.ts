import { v4 as uuidv4 } from 'uuid';
import type { Gladiator, MarketItem, ActiveEffect } from '@/types';

/**
 * Apply marketplace item effects to a gladiator
 */
export const applyItemToGladiator = (
  gladiator: Gladiator,
  item: MarketItem,
  currentDay: number
): {
  updatedGladiator: Gladiator;
  effect?: ActiveEffect;
  message: string;
} => {
  const updatedGladiator = { ...gladiator };
  let effect: ActiveEffect | undefined;
  let message = '';

  switch (item.effect.type) {
    case 'stat_boost':
      if (item.effect.stat) {
        updatedGladiator.stats = {
          ...updatedGladiator.stats,
          [item.effect.stat]: Math.min(
            100,
            updatedGladiator.stats[item.effect.stat] + (item.effect.value || 0)
          ),
        };
        message = `${item.name} increased ${gladiator.name}'s ${item.effect.stat} by ${item.effect.value}!`;
      }
      break;

    case 'heal':
      const healAmount = item.effect.value || 0;
      const hpRestored = Math.min(updatedGladiator.maxHP - updatedGladiator.currentHP, healAmount);
      const staminaRestored = Math.min(
        updatedGladiator.maxStamina - updatedGladiator.currentStamina,
        healAmount
      );

      updatedGladiator.currentHP = Math.min(
        updatedGladiator.maxHP,
        updatedGladiator.currentHP + healAmount
      );
      updatedGladiator.currentStamina = Math.min(
        updatedGladiator.maxStamina,
        updatedGladiator.currentStamina + healAmount
      );

      message = `${item.name} restored ${hpRestored} HP and ${staminaRestored} stamina to ${gladiator.name}!`;
      break;

    case 'morale_boost':
      const moraleBoost = (item.effect.value || 0) / 100;
      updatedGladiator.morale = Math.min(1.5, updatedGladiator.morale + moraleBoost);
      message = `${item.name} boosted ${gladiator.name}'s morale by ${item.effect.value}%!`;
      break;

    case 'injury_heal':
      if (updatedGladiator.injuries.length > 0) {
        // Heal the most severe injury
        const healValue = item.effect.value || 0;
        if (healValue >= 100) {
          // Instant heal - remove the injury
          updatedGladiator.injuries = updatedGladiator.injuries.slice(1);
          message = `${item.name} completely healed ${gladiator.name}'s injury!`;
        } else {
          // Reduce recovery time
          updatedGladiator.injuries = updatedGladiator.injuries.map((injury, index) => {
            if (index === 0) {
              return {
                ...injury,
                daysRemaining: Math.max(0, injury.daysRemaining - healValue),
              };
            }
            return injury;
          });
          message = `${item.name} reduced ${gladiator.name}'s injury recovery time by ${healValue} days!`;
        }
        updatedGladiator.isInjured = updatedGladiator.injuries.length > 0;
      } else {
        message = `${gladiator.name} has no injuries to heal.`;
      }
      break;

    case 'xp_boost':
      const xpGain = item.effect.value || 0;
      updatedGladiator.experience += xpGain;
      message = `${item.name} granted ${gladiator.name} ${xpGain} experience points!`;
      break;

    case 'skill_point':
      const skillPoints = item.effect.value || 1;
      updatedGladiator.skillPoints += skillPoints;
      message = `${item.name} granted ${gladiator.name} ${skillPoints} skill point${skillPoints > 1 ? 's' : ''}!`;
      break;

    case 'training_boost':
      if (item.effect.duration) {
        effect = {
          id: uuidv4(),
          itemId: item.id,
          gladiatorId: gladiator.id,
          type: 'training_boost',
          value: item.effect.value || 0,
          expiresOnDay: currentDay + item.effect.duration,
        };
        message = `${item.name} will boost ${gladiator.name}'s training by ${item.effect.value}% for ${item.effect.duration} days!`;
      }
      break;

    case 'combat_buff':
      if (item.effect.duration) {
        effect = {
          id: uuidv4(),
          itemId: item.id,
          gladiatorId: gladiator.id,
          type: 'combat_buff',
          value: item.effect.value || 0,
          expiresOnDay: currentDay + item.effect.duration,
        };
        message = `${item.name} will boost ${gladiator.name}'s combat effectiveness by ${item.effect.value}% for ${item.effect.duration} days!`;
      }
      break;

    case 'fame_boost':
      updatedGladiator.fame = Math.min(1000, updatedGladiator.fame + (item.effect.value || 0));
      message = `${item.name} increased ${gladiator.name}'s fame by ${item.effect.value}!`;
      break;

    case 'equipment':
      message = `${item.name} equipped to ${gladiator.name}!`;
      // Equipment effects are handled by stat boosts in the item definition
      break;

    default:
      message = `${item.name} applied to ${gladiator.name}.`;
  }

  return {
    updatedGladiator,
    effect,
    message,
  };
};

/**
 * Apply marketplace item effects to entire roster (for items that affect all gladiators)
 */
export const applyItemToRoster = (
  roster: Gladiator[],
  item: MarketItem,
  currentDay: number
): {
  updatedRoster: Gladiator[];
  effects: ActiveEffect[];
  message: string;
} => {
  const updatedRoster: Gladiator[] = [];
  const effects: ActiveEffect[] = [];
  let affectedCount = 0;

  roster.forEach(gladiator => {
    const result = applyItemToGladiator(gladiator, item, currentDay);
    updatedRoster.push(result.updatedGladiator);
    if (result.effect) {
      effects.push(result.effect);
    }
    affectedCount++;
  });

  const message = `${item.name} applied to ${affectedCount} gladiator${affectedCount !== 1 ? 's' : ''}!`;

  return {
    updatedRoster,
    effects,
    message,
  };
};

/**
 * Get active combat buffs for a gladiator
 */
export const getGladiatorCombatBuffs = (
  gladiatorId: string,
  activeEffects: ActiveEffect[]
): number => {
  return activeEffects
    .filter(effect => effect.gladiatorId === gladiatorId && effect.type === 'combat_buff')
    .reduce((total, effect) => total + effect.value, 0);
};

/**
 * Get active training boosts for a gladiator
 */
export const getGladiatorTrainingBoost = (
  gladiatorId: string,
  activeEffects: ActiveEffect[]
): number => {
  return activeEffects
    .filter(effect => effect.gladiatorId === gladiatorId && effect.type === 'training_boost')
    .reduce((total, effect) => total + effect.value, 0);
};
