export type TrainingType = 
  | 'palus_drill'      // Basic weapon training
  | 'sparring'         // Combat practice with partner
  | 'endurance'        // Stamina and constitution training
  | 'agility'          // Speed and evasion training
  | 'strength'         // Raw strength training
  | 'tactics'          // Combat intelligence
  | 'weapon_mastery'   // Class-specific weapon skills
  | 'showmanship';     // Crowd-pleasing techniques

export type NutritionQuality = 'poor' | 'standard' | 'good' | 'excellent';

export interface TrainingRegimen {
  id: TrainingType;
  name: string;
  description: string;
  icon: string;
  primaryStat: string;
  secondaryStat?: string;
  baseXPGain: number;
  statGains: { stat: string; min: number; max: number }[];
  staminaCost: number;
  fatigueGain: number;
  injuryRisk: number; // percentage chance of minor injury
  requiredBuilding?: string;
  moraleEffect: number;
}

export interface NutritionOption {
  id: NutritionQuality;
  name: string;
  description: string;
  icon: string;
  dailyCost: { grain: number; water: number; wine?: number };
  effects: {
    healingModifier: number;
    trainingModifier: number;
    moraleModifier: number;
    fatigueRecovery: number;
    injuryResistance: number;
  };
}

export const TRAINING_REGIMENS: Record<TrainingType, TrainingRegimen> = {
  palus_drill: {
    id: 'palus_drill',
    name: 'Palus Drill',
    description: 'Practice strikes against the wooden training post. Builds muscle memory and technique.',
    icon: '🎯',
    primaryStat: 'dexterity',
    baseXPGain: 15,
    statGains: [
      { stat: 'dexterity', min: 0, max: 2 },
      { stat: 'strength', min: 0, max: 1 },
    ],
    staminaCost: 15,
    fatigueGain: 10,
    injuryRisk: 2,
    requiredBuilding: 'palus',
    moraleEffect: 0,
  },

  sparring: {
    id: 'sparring',
    name: 'Sparring',
    description: 'Practice combat with wooden weapons against another gladiator. Most effective training.',
    icon: '⚔️',
    primaryStat: 'dexterity',
    secondaryStat: 'strength',
    baseXPGain: 30,
    statGains: [
      { stat: 'dexterity', min: 1, max: 3 },
      { stat: 'strength', min: 0, max: 2 },
      { stat: 'agility', min: 0, max: 1 },
    ],
    staminaCost: 30,
    fatigueGain: 25,
    injuryRisk: 8,
    moraleEffect: 5,
  },

  endurance: {
    id: 'endurance',
    name: 'Endurance Training',
    description: 'Long-distance running and weight carrying to build stamina and constitution.',
    icon: '🏃',
    primaryStat: 'endurance',
    secondaryStat: 'constitution',
    baseXPGain: 20,
    statGains: [
      { stat: 'endurance', min: 1, max: 3 },
      { stat: 'constitution', min: 0, max: 2 },
    ],
    staminaCost: 25,
    fatigueGain: 20,
    injuryRisk: 3,
    moraleEffect: -5,
  },

  agility: {
    id: 'agility',
    name: 'Agility Training',
    description: 'Jumping, dodging, and hot coal running to improve speed and reflexes.',
    icon: '🔥',
    primaryStat: 'agility',
    baseXPGain: 20,
    statGains: [
      { stat: 'agility', min: 1, max: 3 },
      { stat: 'dexterity', min: 0, max: 1 },
    ],
    staminaCost: 20,
    fatigueGain: 15,
    injuryRisk: 5,
    requiredBuilding: 'coalPit',
    moraleEffect: 0,
  },

  strength: {
    id: 'strength',
    name: 'Strength Training',
    description: 'Lifting stones and wrestling to build raw power.',
    icon: '💪',
    primaryStat: 'strength',
    baseXPGain: 20,
    statGains: [
      { stat: 'strength', min: 1, max: 3 },
      { stat: 'constitution', min: 0, max: 1 },
    ],
    staminaCost: 25,
    fatigueGain: 20,
    injuryRisk: 6,
    moraleEffect: 0,
  },

  tactics: {
    id: 'tactics',
    name: 'Tactical Training',
    description: 'Study combat theory and watch fights to improve battle intelligence.',
    icon: '🧠',
    primaryStat: 'dexterity',
    baseXPGain: 25,
    statGains: [
      { stat: 'dexterity', min: 0, max: 1 },
    ],
    staminaCost: 5,
    fatigueGain: 5,
    injuryRisk: 0,
    moraleEffect: 5,
  },

  weapon_mastery: {
    id: 'weapon_mastery',
    name: 'Weapon Mastery',
    description: 'Intensive training with class-specific weapons. Requires Armamentarium.',
    icon: '⚒️',
    primaryStat: 'dexterity',
    secondaryStat: 'strength',
    baseXPGain: 35,
    statGains: [
      { stat: 'dexterity', min: 1, max: 2 },
      { stat: 'strength', min: 1, max: 2 },
    ],
    staminaCost: 30,
    fatigueGain: 25,
    injuryRisk: 5,
    requiredBuilding: 'armamentarium',
    moraleEffect: 5,
  },

  showmanship: {
    id: 'showmanship',
    name: 'Showmanship',
    description: 'Learn to play to the crowd with dramatic moves and gestures.',
    icon: '🎭',
    primaryStat: 'agility',
    baseXPGain: 15,
    statGains: [
      { stat: 'agility', min: 0, max: 1 },
    ],
    staminaCost: 10,
    fatigueGain: 5,
    injuryRisk: 1,
    moraleEffect: 10,
  },
};

export const NUTRITION_OPTIONS: Record<NutritionQuality, NutritionOption> = {
  poor: {
    id: 'poor',
    name: 'Minimal Rations',
    description: 'Basic gruel and water. Keeps them alive but weakens performance.',
    icon: '🥣',
    dailyCost: { grain: 1, water: 1 },
    effects: {
      healingModifier: -20,
      trainingModifier: -15,
      moraleModifier: -10,
      fatigueRecovery: 5,
      injuryResistance: -10,
    },
  },

  standard: {
    id: 'standard',
    name: 'Standard Rations',
    description: 'Barley porridge, beans, and water. Adequate for training.',
    icon: '🍲',
    dailyCost: { grain: 2, water: 2 },
    effects: {
      healingModifier: 0,
      trainingModifier: 0,
      moraleModifier: 0,
      fatigueRecovery: 10,
      injuryResistance: 0,
    },
  },

  good: {
    id: 'good',
    name: 'Quality Meals',
    description: 'Meat, cheese, vegetables, and diluted wine. Boosts training and recovery.',
    icon: '🍖',
    dailyCost: { grain: 3, water: 2, wine: 1 },
    effects: {
      healingModifier: 15,
      trainingModifier: 10,
      moraleModifier: 10,
      fatigueRecovery: 15,
      injuryResistance: 10,
    },
  },

  excellent: {
    id: 'excellent',
    name: 'Champion\'s Diet',
    description: 'The best food and drink. Maximum performance for your best fighters.',
    icon: '🏆',
    dailyCost: { grain: 4, water: 3, wine: 2 },
    effects: {
      healingModifier: 30,
      trainingModifier: 20,
      moraleModifier: 20,
      fatigueRecovery: 25,
      injuryResistance: 20,
    },
  },
};

// Calculate daily resource consumption for all gladiators
export const calculateDailyConsumption = (
  gladiatorCount: number,
  nutritionLevel: NutritionQuality
): { grain: number; water: number; wine: number } => {
  const nutrition = NUTRITION_OPTIONS[nutritionLevel];
  return {
    grain: nutrition.dailyCost.grain * gladiatorCount,
    water: nutrition.dailyCost.water * gladiatorCount,
    wine: (nutrition.dailyCost.wine || 0) * gladiatorCount,
  };
};

// Calculate training effectiveness based on various factors
export const calculateTrainingEffectiveness = (
  baseEffectiveness: number,
  nutritionLevel: NutritionQuality,
  morale: number,
  fatigue: number,
  buildingBonus: number = 0
): number => {
  const nutrition = NUTRITION_OPTIONS[nutritionLevel];
  
  // Base calculation
  let effectiveness = baseEffectiveness;
  
  // Nutrition modifier
  effectiveness *= (100 + nutrition.effects.trainingModifier) / 100;
  
  // Morale modifier (50-150 morale = 0.75x to 1.25x)
  effectiveness *= 0.5 + (morale / 200);
  
  // Fatigue penalty (0-100 fatigue = 1x to 0.5x)
  effectiveness *= 1 - (fatigue / 200);
  
  // Building bonus
  effectiveness *= (100 + buildingBonus) / 100;
  
  return Math.round(effectiveness);
};

// Calculate XP gain from training
export const calculateXPGain = (
  trainingType: TrainingType,
  gladiatorLevel: number,
  nutritionLevel: NutritionQuality,
  morale: number,
  fatigue: number,
  buildingBonus: number = 0,
  age?: number
): number => {
  const regimen = TRAINING_REGIMENS[trainingType];
  const baseXP = regimen.baseXPGain;
  
  // Level scaling (diminishing returns at higher levels)
  const levelMultiplier = Math.max(0.5, 1 - (gladiatorLevel * 0.03));
  
  // Age modifier (affects learning speed)
  let ageModifier = 1.0;
  if (age !== undefined) {
    // Import dynamically to avoid circular dependency
    // Youth (15-19): 1.25x, Prime (20-29): 1.0x, Veteran (30-35): 0.9x
    // Aging (36-40): 0.75x, Old (41+): 0.6x
    if (age < 20) ageModifier = 1.25;
    else if (age < 30) ageModifier = 1.0;
    else if (age < 36) ageModifier = 0.9;
    else if (age < 41) ageModifier = 0.75;
    else ageModifier = 0.6;
  }
  
  const effectiveness = calculateTrainingEffectiveness(
    100,
    nutritionLevel,
    morale,
    fatigue,
    buildingBonus
  ) / 100;
  
  return Math.round(baseXP * levelMultiplier * ageModifier * effectiveness);
};

// Calculate stat gains from training
export const calculateStatGains = (
  trainingType: TrainingType,
  nutritionLevel: NutritionQuality,
  morale: number,
  fatigue: number
): { stat: string; value: number }[] => {
  const regimen = TRAINING_REGIMENS[trainingType];
  const effectiveness = calculateTrainingEffectiveness(
    100,
    nutritionLevel,
    morale,
    fatigue
  ) / 100;
  
  return regimen.statGains.map(gain => {
    // Random value between min and max, scaled by effectiveness
    const baseGain = gain.min + Math.random() * (gain.max - gain.min);
    const scaledGain = Math.floor(baseGain * effectiveness);
    return { stat: gain.stat, value: scaledGain };
  }).filter(g => g.value > 0);
};

// Check if training causes injury
export const checkTrainingInjury = (
  trainingType: TrainingType,
  nutritionLevel: NutritionQuality,
  fatigue: number
): { injured: boolean; severity: 'minor' | 'moderate' | 'severe' } => {
  const regimen = TRAINING_REGIMENS[trainingType];
  const nutrition = NUTRITION_OPTIONS[nutritionLevel];
  
  // Base injury risk
  let risk = regimen.injuryRisk;
  
  // Fatigue increases injury risk
  risk += fatigue / 10;
  
  // Nutrition resistance
  risk *= (100 - nutrition.effects.injuryResistance) / 100;
  
  const roll = Math.random() * 100;
  
  if (roll < risk) {
    // Injury occurred, determine severity
    const severityRoll = Math.random() * 100;
    if (severityRoll < 70) return { injured: true, severity: 'minor' };
    if (severityRoll < 95) return { injured: true, severity: 'moderate' };
    return { injured: true, severity: 'severe' };
  }
  
  return { injured: false, severity: 'minor' };
};

// Get available training regimens based on buildings
export const getAvailableTraining = (
  buildings: { type: string; level: number }[]
): TrainingType[] => {
  const buildingTypes = buildings.map(b => b.type);
  
  return Object.values(TRAINING_REGIMENS)
    .filter(regimen => {
      if (!regimen.requiredBuilding) return true;
      return buildingTypes.includes(regimen.requiredBuilding);
    })
    .map(regimen => regimen.id);
};

// Rest and recovery calculation
export const calculateRecovery = (
  currentHP: number,
  maxHP: number,
  _currentStamina: number, // Unused but kept for API consistency
  maxStamina: number,
  fatigue: number,
  nutritionLevel: NutritionQuality,
  hasBalnea: boolean,
  balneaLevel: number = 0
): { hp: number; stamina: number; fatigue: number } => {
  const nutrition = NUTRITION_OPTIONS[nutritionLevel];
  
  // Base recovery rates
  let hpRecovery = maxHP * 0.05; // 5% HP per day base
  let staminaRecovery = maxStamina; // Full stamina recovery
  let fatigueRecovery = nutrition.effects.fatigueRecovery;
  
  // Healing modifier from nutrition
  hpRecovery *= (100 + nutrition.effects.healingModifier) / 100;
  
  // Balnea bonus
  if (hasBalnea) {
    const staminaBonus = 20 + (balneaLevel * 10); // 20/30/40% bonus
    staminaRecovery *= (100 + staminaBonus) / 100;
    fatigueRecovery += 5 * balneaLevel;
    
    // Level 3 Balnea removes all fatigue
    if (balneaLevel >= 3) {
      fatigueRecovery = 100;
    }
  }
  
  return {
    hp: Math.min(maxHP, currentHP + Math.round(hpRecovery)),
    stamina: Math.min(maxStamina, Math.round(staminaRecovery)),
    fatigue: Math.max(0, fatigue - fatigueRecovery),
  };
};
