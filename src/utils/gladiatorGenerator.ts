import { v4 as uuidv4 } from 'uuid';
import type { Gladiator, GladiatorClass, GladiatorOrigin, GladiatorStats } from '@/types';
import {
  GLADIATOR_CLASSES,
  GLADIATOR_ORIGINS,
  ROMAN_FIRST_NAMES,
  ROMAN_COGNOMENS,
  FOREIGN_NAMES,
} from '@data/gladiatorClasses';

// Random number between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random element from array
const randomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Generate a random name based on origin
const generateName = (origin: GladiatorOrigin): string => {
  if (origin === 'volunteer' || origin === 'elite') {
    // Roman-style name
    const firstName = randomElement(ROMAN_FIRST_NAMES);
    const cognomen = randomElement(ROMAN_COGNOMENS);
    return `${firstName} ${cognomen}`;
  } else {
    // Foreign or single name
    return randomElement(FOREIGN_NAMES);
  }
};

// Generate random stats with variance around class base
const generateStats = (
  classData: typeof GLADIATOR_CLASSES[GladiatorClass],
  origin: GladiatorOrigin
): GladiatorStats => {
  const variance = 15; // +/- variance from base
  
  // Elite fighters get a stat boost
  const eliteBonus = origin === 'elite' ? 10 : 0;
  
  const generateStat = (base: number): number => {
    const value = base + randomInt(-variance, variance) + eliteBonus;
    return Math.max(10, Math.min(100, value));
  };

  return {
    strength: generateStat(classData.baseStats.strength),
    agility: generateStat(classData.baseStats.agility),
    dexterity: generateStat(classData.baseStats.dexterity),
    endurance: generateStat(classData.baseStats.endurance),
    constitution: generateStat(classData.baseStats.constitution),
  };
};

// Calculate purchase price based on stats, class, and origin
const calculatePrice = (
  stats: GladiatorStats,
  gladiatorClass: GladiatorClass,
  origin: GladiatorOrigin
): number => {
  const classData = GLADIATOR_CLASSES[gladiatorClass];
  const originData = GLADIATOR_ORIGINS[origin];
  
  // Base price from origin
  const basePrice = randomInt(originData.basePriceMin, originData.basePriceMax);
  
  // Stat bonus (total stats / 5 gives average, compare to 50 baseline)
  const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
  const avgStat = totalStats / 5;
  const statMultiplier = 1 + ((avgStat - 50) / 100);
  
  // Apply multipliers
  const price = basePrice * statMultiplier * classData.classMultiplier * originData.priceMultiplier;
  
  // Round to nearest 5
  return Math.round(price / 5) * 5;
};

// Calculate max HP from constitution
const calculateMaxHP = (constitution: number): number => {
  return 50 + Math.floor(constitution * 1.5);
};

// Calculate max stamina from endurance
const calculateMaxStamina = (endurance: number): number => {
  return 30 + Math.floor(endurance * 1.2);
};

// Generate a complete gladiator
export const generateGladiator = (
  options: {
    gladiatorClass?: GladiatorClass;
    origin?: GladiatorOrigin;
    level?: number;
  } = {}
): Gladiator => {
  // Random class if not specified
  const gladiatorClass = options.gladiatorClass || 
    randomElement(Object.keys(GLADIATOR_CLASSES) as GladiatorClass[]);
  
  // Random origin if not specified
  const origin = options.origin || 
    randomElement(Object.keys(GLADIATOR_ORIGINS) as GladiatorOrigin[]);
  
  const classData = GLADIATOR_CLASSES[gladiatorClass];
  const originData = GLADIATOR_ORIGINS[origin];
  
  // Generate stats
  const stats = generateStats(classData, origin);
  
  // Calculate derived values
  const maxHP = calculateMaxHP(stats.constitution);
  const maxStamina = calculateMaxStamina(stats.endurance);
  const price = calculatePrice(stats, gladiatorClass, origin);
  
  // Level (elite fighters start higher)
  const level = options.level || (origin === 'elite' ? randomInt(3, 6) : 1);
  
  // Extra stat points for higher levels
  const bonusStats = (level - 1) * 5;
  
  return {
    id: uuidv4(),
    name: generateName(origin),
    class: gladiatorClass,
    origin,
    
    stats: {
      strength: Math.min(100, stats.strength + Math.floor(bonusStats * 0.2)),
      agility: Math.min(100, stats.agility + Math.floor(bonusStats * 0.2)),
      dexterity: Math.min(100, stats.dexterity + Math.floor(bonusStats * 0.2)),
      endurance: Math.min(100, stats.endurance + Math.floor(bonusStats * 0.2)),
      constitution: Math.min(100, stats.constitution + Math.floor(bonusStats * 0.2)),
    },
    
    morale: originData.baseMorale,
    fatigue: 0,
    obedience: originData.baseObedience + randomInt(-10, 10),
    
    currentHP: maxHP,
    maxHP,
    currentStamina: maxStamina,
    maxStamina,
    
    level,
    experience: 0,
    skillPoints: 0,
    skills: [],
    
    injuries: [],
    
    fame: origin === 'elite' ? randomInt(20, 50) : 0,
    purchasePrice: price,
    
    wins: origin === 'elite' ? randomInt(3, 10) : 0,
    losses: origin === 'elite' ? randomInt(0, 3) : 0,
    kills: origin === 'elite' ? randomInt(0, 5) : 0,
    
    isTraining: false,
    isResting: false,
    isInjured: false,
  };
};

// Generate multiple gladiators for the marketplace
export const generateMarketPool = (count: number = 6): Gladiator[] => {
  const pool: Gladiator[] = [];
  
  for (let i = 0; i < count; i++) {
    // Weight origins - more common types appear more often
    let origin: GladiatorOrigin;
    const roll = Math.random();
    if (roll < 0.3) origin = 'criminal';
    else if (roll < 0.6) origin = 'pow';
    else if (roll < 0.85) origin = 'volunteer';
    else origin = 'elite';
    
    pool.push(generateGladiator({ origin }));
  }
  
  // Sort by price
  return pool.sort((a, b) => a.purchasePrice - b.purchasePrice);
};

// Calculate sell value (70-80% of current market value)
export const calculateSellValue = (gladiator: Gladiator): number => {
  const baseValue = gladiator.purchasePrice;
  
  // Level bonus - significant increase per level (compound value)
  const levelBonus = (gladiator.level - 1) * 50 * gladiator.level;
  
  // Experience bonus - partial credit for progress toward next level
  const xpTowardNext = gladiator.experience % (gladiator.level * 100);
  const xpBonus = Math.floor(xpTowardNext / 10);
  
  // Stats bonus - reward for trained stats (total stats above base)
  const totalStats = Object.values(gladiator.stats).reduce((sum, stat) => sum + stat, 0);
  const statsBonus = Math.max(0, (totalStats - 250) * 2); // Assuming ~50 average base stat
  
  // Skills bonus - unlocked skills are valuable
  const skillsBonus = gladiator.skillPoints * 30;
  
  // Fame bonus - reputation increases value
  const fameBonus = gladiator.fame * 1.0;
  
  // Combat record bonus
  const winBonus = gladiator.wins * 10;
  const killBonus = gladiator.kills * 15;
  const lossRatio = gladiator.wins + gladiator.losses > 0 
    ? gladiator.wins / (gladiator.wins + gladiator.losses) 
    : 0;
  const recordBonus = Math.floor(lossRatio * 100);
  
  // Morale bonus/penalty
  const moraleModifier = (gladiator.morale - 1.0) * 50;
  
  // Injury penalty - injured gladiators worth less
  const injuryPenalty = gladiator.injuries.reduce((total, injury) => {
    const severityPenalty = injury.severity === 'permanent' ? 100 : 
                           injury.severity === 'major' ? 50 : 25;
    return total + severityPenalty;
  }, 0);
  
  // Fatigue penalty
  const fatiguePenalty = gladiator.fatigue > 50 ? (gladiator.fatigue - 50) : 0;
  
  const currentValue = baseValue 
    + levelBonus 
    + xpBonus
    + statsBonus
    + skillsBonus
    + fameBonus 
    + winBonus 
    + killBonus
    + recordBonus
    + moraleModifier
    - injuryPenalty
    - fatiguePenalty;
  
  // Sell at 70-80% of value (buyers want profit margin)
  const sellPercentage = 0.70 + (Math.random() * 0.10);
  
  return Math.max(10, Math.round((currentValue * sellPercentage) / 5) * 5);
};
