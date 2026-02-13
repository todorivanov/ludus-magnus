import type { GladiatorClass } from '@/types';

// Combat action types
export type ActionType = 
  | 'attack'
  | 'heavy_attack'
  | 'defend'
  | 'dodge'
  | 'special'
  | 'rest'
  | 'taunt';

// Status effects
export type StatusEffect = 
  | 'bleeding'
  | 'stunned'
  | 'exhausted'
  | 'enraged'
  | 'defended'
  | 'netted'
  | 'slowed';

export interface CombatAction {
  id: ActionType;
  name: string;
  description: string;
  icon: string;
  staminaCost: number;
  damageMultiplier: number;
  accuracyModifier: number;
  effects?: { type: StatusEffect; chance: number; duration: number }[];
  cooldown?: number;
  requirements?: { stat: string; minValue: number }[];
}

export interface StatusEffectData {
  id: StatusEffect;
  name: string;
  description: string;
  icon: string;
  damagePerTurn?: number;
  statModifiers?: { stat: string; value: number; isPercentage: boolean }[];
  preventsAction?: boolean;
  stackable: boolean;
  maxStacks?: number;
}

export interface MatchTypeData {
  id: string;
  name: string;
  description: string;
  rules: 'submission' | 'death' | 'first_blood';
  rounds: number;
  rewardMultiplier: number;
  fameMultiplier: number;
  minFame: number;
  entryFee: number;
}

// Combat actions available to all gladiators
export const COMBAT_ACTIONS: Record<ActionType, CombatAction> = {
  attack: {
    id: 'attack',
    name: 'Attack',
    description: 'A standard strike with your weapon',
    icon: '⚔️',
    staminaCost: 10,
    damageMultiplier: 1.0,
    accuracyModifier: 0,
  },
  heavy_attack: {
    id: 'heavy_attack',
    name: 'Heavy Attack',
    description: 'A powerful but slower attack that deals extra damage',
    icon: '💥',
    staminaCost: 20,
    damageMultiplier: 1.5,
    accuracyModifier: -15,
    effects: [{ type: 'stunned', chance: 20, duration: 1 }],
  },
  defend: {
    id: 'defend',
    name: 'Defend',
    description: 'Raise your guard to reduce incoming damage',
    icon: '🛡️',
    staminaCost: 5,
    damageMultiplier: 0,
    accuracyModifier: 0,
    effects: [{ type: 'defended', chance: 100, duration: 1 }],
  },
  dodge: {
    id: 'dodge',
    name: 'Dodge',
    description: 'Attempt to evade the next attack',
    icon: '💨',
    staminaCost: 15,
    damageMultiplier: 0,
    accuracyModifier: 0,
  },
  special: {
    id: 'special',
    name: 'Special',
    description: 'Class-specific special ability',
    icon: '✨',
    staminaCost: 30,
    damageMultiplier: 2.0,
    accuracyModifier: 0,
    cooldown: 3,
  },
  rest: {
    id: 'rest',
    name: 'Rest',
    description: 'Recover stamina but leave yourself open',
    icon: '😮‍💨',
    staminaCost: -25, // Negative = recovery
    damageMultiplier: 0,
    accuracyModifier: 0,
  },
  taunt: {
    id: 'taunt',
    name: 'Taunt',
    description: 'Enrage your opponent, lowering their accuracy but increasing damage',
    icon: '😤',
    staminaCost: 5,
    damageMultiplier: 0,
    accuracyModifier: 0,
    effects: [{ type: 'enraged', chance: 70, duration: 2 }],
  },
};

// Status effect definitions
export const STATUS_EFFECTS: Record<StatusEffect, StatusEffectData> = {
  bleeding: {
    id: 'bleeding',
    name: 'Bleeding',
    description: 'Losing blood, takes damage each turn',
    icon: '🩸',
    damagePerTurn: 5,
    stackable: true,
    maxStacks: 3,
  },
  stunned: {
    id: 'stunned',
    name: 'Stunned',
    description: 'Cannot act this turn',
    icon: '💫',
    preventsAction: true,
    stackable: false,
  },
  exhausted: {
    id: 'exhausted',
    name: 'Exhausted',
    description: 'Reduced damage and accuracy',
    icon: '😓',
    statModifiers: [
      { stat: 'damage', value: -20, isPercentage: true },
      { stat: 'accuracy', value: -15, isPercentage: true },
    ],
    stackable: false,
  },
  enraged: {
    id: 'enraged',
    name: 'Enraged',
    description: 'Increased damage but reduced accuracy',
    icon: '😡',
    statModifiers: [
      { stat: 'damage', value: 25, isPercentage: true },
      { stat: 'accuracy', value: -20, isPercentage: true },
    ],
    stackable: false,
  },
  defended: {
    id: 'defended',
    name: 'Defending',
    description: 'Reduced incoming damage',
    icon: '🛡️',
    statModifiers: [
      { stat: 'damageReduction', value: 50, isPercentage: true },
    ],
    stackable: false,
  },
  netted: {
    id: 'netted',
    name: 'Netted',
    description: 'Trapped in a net, severely reduced mobility',
    icon: '🕸️',
    statModifiers: [
      { stat: 'evasion', value: -50, isPercentage: true },
      { stat: 'accuracy', value: -25, isPercentage: true },
    ],
    stackable: false,
  },
  slowed: {
    id: 'slowed',
    name: 'Slowed',
    description: 'Reduced speed and evasion',
    icon: '🐢',
    statModifiers: [
      { stat: 'evasion', value: -30, isPercentage: true },
    ],
    stackable: false,
  },
};

// Match types
export const MATCH_TYPES: Record<string, MatchTypeData> = {
  pitFight: {
    id: 'pitFight',
    name: 'Pit Fight',
    description: 'Informal underground fight. Low risk, low reward.',
    rules: 'submission',
    rounds: 5,
    rewardMultiplier: 0.5,
    fameMultiplier: 0.5,
    minFame: 0,
    entryFee: 10,
  },
  localMunera: {
    id: 'localMunera',
    name: 'Local Munera',
    description: 'Small public games sponsored by local officials.',
    rules: 'submission',
    rounds: 7,
    rewardMultiplier: 1.0,
    fameMultiplier: 1.0,
    minFame: 50,
    entryFee: 25,
  },
  grandMunera: {
    id: 'grandMunera',
    name: 'Grand Munera',
    description: 'Major public games with significant prizes.',
    rules: 'death',
    rounds: 10,
    rewardMultiplier: 2.0,
    fameMultiplier: 2.0,
    minFame: 200,
    entryFee: 100,
  },
  championship: {
    id: 'championship',
    name: 'Championship',
    description: 'Elite tournament for the most famous gladiators.',
    rules: 'death',
    rounds: 12,
    rewardMultiplier: 5.0,
    fameMultiplier: 5.0,
    minFame: 500,
    entryFee: 500,
  },
  colosseum: {
    id: 'colosseum',
    name: 'Colosseum Games',
    description: 'The ultimate arena. Glory or death before the Emperor.',
    rules: 'death',
    rounds: 15,
    rewardMultiplier: 10.0,
    fameMultiplier: 10.0,
    minFame: 800,
    entryFee: 1000,
  },
};

// Class-specific special abilities
export const CLASS_SPECIALS: Record<GladiatorClass, {
  name: string;
  description: string;
  damageMultiplier: number;
  effects?: { type: StatusEffect; chance: number; duration: number }[];
}> = {
  murmillo: {
    name: 'Shield Bash',
    description: 'Slam your scutum into the enemy, stunning them',
    damageMultiplier: 1.2,
    effects: [{ type: 'stunned', chance: 60, duration: 1 }],
  },
  retiarius: {
    name: 'Net Throw',
    description: 'Entangle your opponent in your net',
    damageMultiplier: 0.5,
    effects: [{ type: 'netted', chance: 80, duration: 2 }],
  },
  thraex: {
    name: 'Sica Strike',
    description: 'Hook around shields with your curved blade',
    damageMultiplier: 1.8,
    effects: [{ type: 'bleeding', chance: 50, duration: 3 }],
  },
  secutor: {
    name: 'Relentless Charge',
    description: 'Charge at your opponent with unstoppable force',
    damageMultiplier: 1.5,
    effects: [{ type: 'stunned', chance: 40, duration: 1 }],
  },
  hoplomachus: {
    name: 'Spear Thrust',
    description: 'A precise thrust with your spear',
    damageMultiplier: 2.0,
    effects: [{ type: 'bleeding', chance: 70, duration: 2 }],
  },
  dimachaerus: {
    name: 'Twin Fury',
    description: 'Attack twice with both swords',
    damageMultiplier: 1.3, // Applied twice
    effects: [],
  },
  samnite: {
    name: 'Ancestral Strike',
    description: 'A powerful overhead blow',
    damageMultiplier: 2.2,
    effects: [{ type: 'stunned', chance: 30, duration: 1 }],
  },
  velitus: {
    name: 'Javelin Volley',
    description: 'Throw multiple javelins at your target',
    damageMultiplier: 1.4,
    effects: [{ type: 'slowed', chance: 60, duration: 2 }],
  },
};

// Calculate base damage
export const calculateBaseDamage = (
  strength: number,
  weaponDamage: number = 10,
  level: number = 1
): number => {
  return Math.round((strength * 0.5 + weaponDamage) * (1 + level * 0.05));
};

// Calculate hit chance
export const calculateHitChance = (
  attackerDexterity: number,
  defenderAgility: number,
  accuracyModifier: number = 0
): number => {
  const baseChance = 70;
  const dexBonus = attackerDexterity * 0.3;
  const agiPenalty = defenderAgility * 0.2;
  return Math.min(95, Math.max(20, baseChance + dexBonus - agiPenalty + accuracyModifier));
};

// Calculate critical chance
export const calculateCritChance = (dexterity: number, luck: number = 0): number => {
  return Math.min(50, 5 + dexterity * 0.1 + luck * 0.2);
};

// Calculate dodge chance
export const calculateDodgeChance = (agility: number, fatiguePercent: number): number => {
  const baseDodge = agility * 0.3;
  const fatiguePenalty = fatiguePercent * 0.5;
  return Math.min(60, Math.max(5, baseDodge - fatiguePenalty));
};

// Generate opponent for a match
export const generateOpponent = (
  playerFame: number,
  _matchType: string, // Used for potential future match-specific opponent scaling
  difficulty: 'easy' | 'normal' | 'hard' = 'normal'
): {
  name: string;
  class: GladiatorClass;
  level: number;
  stats: { strength: number; agility: number; dexterity: number; endurance: number; constitution: number };
  hp: number;
  stamina: number;
} => {
  const classes: GladiatorClass[] = ['murmillo', 'retiarius', 'thraex', 'secutor', 'hoplomachus', 'dimachaerus', 'samnite', 'velitus'];
  const gladiatorClass = classes[Math.floor(Math.random() * classes.length)];
  
  // Calculate level based on fame and difficulty
  const baseLevel = Math.max(1, Math.floor(playerFame / 100));
  const difficultyMod = difficulty === 'easy' ? -2 : difficulty === 'hard' ? 2 : 0;
  const level = Math.max(1, Math.min(20, baseLevel + difficultyMod + Math.floor(Math.random() * 3) - 1));
  
  // Generate stats based on level
  const baseStat = 30 + level * 3;
  const variance = () => Math.floor(Math.random() * 20) - 10;
  
  const stats = {
    strength: baseStat + variance(),
    agility: baseStat + variance(),
    dexterity: baseStat + variance(),
    endurance: baseStat + variance(),
    constitution: baseStat + variance(),
  };
  
  // Generate name
  const firstNames = [
    'Maximus', 'Spartacus', 'Crixus', 'Gannicus', 'Oenomaus', 'Agron', 'Duro', 'Varro', 'Barca', 'Doctore',
    'Titus', 'Marcus', 'Cassius', 'Brutus', 'Flavius', 'Antonius', 'Gaius', 'Lucius', 'Quintus', 'Decimus',
    'Scipio', 'Gracchus', 'Marius', 'Sulla', 'Pompey', 'Aurelius', 'Severus', 'Commodus', 'Hadrian', 'Trajan',
    'Valerius', 'Claudius', 'Nero', 'Caligula', 'Tiberius', 'Augustus', 'Julius', 'Octavius', 'Vespasian', 'Domitian',
    'Regulus', 'Fabius', 'Horatius', 'Cincinnatus', 'Corvus', 'Cursor', 'Camillus', 'Flaminius', 'Paullus', 'Scaurus'
  ];
  const titles = [
    'the Fierce', 'the Undefeated', 'Bloodfist', 'Ironhide', 'the Quick', 'Deathbringer', 'the Savage',
    'the Mighty', 'Lionheart', 'the Merciless', 'Stormbreaker', 'the Colossus', 'the Reaper', 'the Gladiator',
    'the Champion', 'Warbringer', 'the Invincible', 'the Conqueror', 'Skullcrusher', 'the Butcher',
    'the Shadow', 'the Thunder', 'the Blade', 'the Beast', 'the Hammer', 'the Titan', 'the Scourge',
    'the Executioner', 'the Terror', 'the Destroyer', 'the Ravager', 'the Slayer', 'the Fury', 'the Wrath',
    ''
  ];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${titles[Math.floor(Math.random() * titles.length)]}`.trim();
  
  return {
    name,
    class: gladiatorClass,
    level,
    stats,
    hp: 100 + stats.constitution * 2 + level * 10,
    stamina: 100 + stats.endurance * 1.5 + level * 5,
  };
};
