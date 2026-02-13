import type { BuildingType, BuildingBonus } from '@/types';

export interface BuildingLevelData {
  level: 1 | 2 | 3;
  bonuses: BuildingBonus[];
  special?: string;
  constructionDays: number;
  goldCost: number;
  resourceCost?: { resource: string; amount: number }[];
}

export interface BuildingData {
  id: BuildingType;
  name: string;
  description: string;
  icon: string;
  category: 'training' | 'recovery' | 'storage' | 'security' | 'production' | 'commerce' | 'entertainment';
  levels: BuildingLevelData[];
  prerequisite?: { building: BuildingType; level: number } | { staff: string };
}

export const BUILDINGS: Record<BuildingType, BuildingData> = {
  valetudinarium: {
    id: 'valetudinarium',
    name: 'Valetudinarium',
    description: 'Medical facility for treating wounded gladiators. Essential for recovery.',
    icon: '🏥',
    category: 'recovery',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'healingSpeed', value: 30, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 100,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'healingSpeed', value: 45, isPercentage: true },
          { stat: 'infectionRisk', value: -15, isPercentage: true },
        ],
        constructionDays: 45,
        goldCost: 200,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'healingSpeed', value: 60, isPercentage: true },
          { stat: 'infectionRisk', value: -30, isPercentage: true },
        ],
        special: 'Unlocks Surgery - can heal permanent injuries',
        constructionDays: 60,
        goldCost: 400,
        resourceCost: [{ resource: 'travertine', amount: 10 }],
      },
    ],
    prerequisite: { staff: 'medicus' },
  },

  palus: {
    id: 'palus',
    name: 'Palus',
    description: 'Wooden training post for weapon drills. Foundation of gladiator training.',
    icon: '🎯',
    category: 'training',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'weaponTrainingSpeed', value: 10, isPercentage: true },
        ],
        constructionDays: 3,
        goldCost: 5,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'weaponTrainingSpeed', value: 15, isPercentage: true },
        ],
        constructionDays: 5,
        goldCost: 10,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'weaponTrainingSpeed', value: 20, isPercentage: true },
        ],
        special: 'Unlocks Advanced Techniques training',
        constructionDays: 7,
        goldCost: 20,
      },
    ],
  },

  balnea: {
    id: 'balnea',
    name: 'Balnea',
    description: 'Roman baths for hygiene and relaxation. Boosts morale and recovery.',
    icon: '🛁',
    category: 'recovery',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'morale', value: 15, isPercentage: false },
          { stat: 'staminaRegen', value: 20, isPercentage: true },
        ],
        constructionDays: 15,
        goldCost: 50,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'morale', value: 25, isPercentage: false },
          { stat: 'staminaRegen', value: 30, isPercentage: true },
        ],
        constructionDays: 22,
        goldCost: 100,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'morale', value: 35, isPercentage: false },
          { stat: 'staminaRegen', value: 40, isPercentage: true },
        ],
        special: 'Removes all Fatigue when resting',
        constructionDays: 30,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 5 }],
      },
    ],
  },

  coalPit: {
    id: 'coalPit',
    name: 'Coal Pit',
    description: 'Hot coals for agility training. Improves footwork and evasion.',
    icon: '🔥',
    category: 'training',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'evasionGrowth', value: 10, isPercentage: true },
        ],
        constructionDays: 3,
        goldCost: 5,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'evasionGrowth', value: 15, isPercentage: true },
        ],
        constructionDays: 5,
        goldCost: 10,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'evasionGrowth', value: 20, isPercentage: true },
          { stat: 'agility', value: 5, isPercentage: true },
        ],
        special: '+5% Agility bonus to all gladiators',
        constructionDays: 7,
        goldCost: 20,
      },
    ],
  },

  sacellum: {
    id: 'sacellum',
    name: 'Sacellum',
    description: 'Shrine to Mars, god of war. Provides spiritual strength.',
    icon: '⛩️',
    category: 'recovery',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'critChance', value: 5, isPercentage: true },
          { stat: 'morale', value: 10, isPercentage: false },
        ],
        constructionDays: 10,
        goldCost: 20,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'critChance', value: 8, isPercentage: true },
          { stat: 'morale', value: 15, isPercentage: false },
        ],
        constructionDays: 15,
        goldCost: 40,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'critChance', value: 12, isPercentage: true },
          { stat: 'morale', value: 20, isPercentage: false },
        ],
        special: 'Divine Blessing: +10% damage in first combat round',
        constructionDays: 20,
        goldCost: 80,
      },
    ],
  },

  armamentarium: {
    id: 'armamentarium',
    name: 'Armamentarium',
    description: 'Armory and workshop for equipment maintenance and crafting.',
    icon: '⚒️',
    category: 'production',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'repairCost', value: -20, isPercentage: true },
        ],
        constructionDays: 20,
        goldCost: 40,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'repairCost', value: -30, isPercentage: true },
          { stat: 'weaponDamage', value: 5, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 80,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'repairCost', value: -40, isPercentage: true },
          { stat: 'weaponDamage', value: 10, isPercentage: true },
        ],
        special: 'Can craft Legendary gear',
        constructionDays: 40,
        goldCost: 160,
        resourceCost: [{ resource: 'travertine', amount: 8 }],
      },
    ],
    prerequisite: { staff: 'faber' },
  },

  taberna: {
    id: 'taberna',
    name: 'Taberna',
    description: 'Kitchen and food preparation area. Improves nutrition quality.',
    icon: '🍖',
    category: 'production',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'nutritionValue', value: 15, isPercentage: true },
        ],
        constructionDays: 10,
        goldCost: 30,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'nutritionValue', value: 25, isPercentage: true },
        ],
        constructionDays: 15,
        goldCost: 60,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'nutritionValue', value: 35, isPercentage: true },
        ],
        special: 'Can brew Ash Tonic (+50% bone injury recovery, +10% HP)',
        constructionDays: 20,
        goldCost: 120,
      },
    ],
  },

  waterWell: {
    id: 'waterWell',
    name: 'Water Well',
    description: 'On-site water supply. Provides daily water resources.',
    icon: '💧',
    category: 'production',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'dailyWater', value: 15, isPercentage: false },
        ],
        constructionDays: 30,
        goldCost: 30,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'dailyWater', value: 25, isPercentage: false },
        ],
        constructionDays: 45,
        goldCost: 60,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'dailyWater', value: 40, isPercentage: false },
          { stat: 'healingSpeed', value: 5, isPercentage: true },
        ],
        special: '+5% healing speed from pure water',
        constructionDays: 60,
        goldCost: 120,
      },
    ],
  },

  walls: {
    id: 'walls',
    name: 'Wall Reinforcements',
    description: 'Defensive walls and gates. Prevents escapes and protects the ludus.',
    icon: '🏰',
    category: 'security',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'security', value: 10, isPercentage: false },
        ],
        constructionDays: 20,
        goldCost: 50,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'security', value: 20, isPercentage: false },
        ],
        constructionDays: 30,
        goldCost: 100,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'security', value: 35, isPercentage: false },
        ],
        special: 'Prevents all escape attempts',
        constructionDays: 45,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 15 }],
      },
    ],
  },

  grainShelter: {
    id: 'grainShelter',
    name: 'Grain Shelter',
    description: 'Storage facility for grain. Protects against spoilage.',
    icon: '🌾',
    category: 'storage',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'grainStorage', value: 100, isPercentage: false },
        ],
        constructionDays: 10,
        goldCost: 25,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'grainStorage', value: 200, isPercentage: false },
          { stat: 'spoilage', value: -10, isPercentage: true },
        ],
        constructionDays: 15,
        goldCost: 50,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'grainStorage', value: 400, isPercentage: false },
          { stat: 'spoilage', value: -100, isPercentage: true },
        ],
        special: 'No grain spoilage',
        constructionDays: 20,
        goldCost: 100,
      },
    ],
  },

  wineCellar: {
    id: 'wineCellar',
    name: 'Wine Cellar',
    description: 'Underground storage for wine. Keeps staff happy.',
    icon: '🍷',
    category: 'storage',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'wineStorage', value: 50, isPercentage: false },
        ],
        constructionDays: 15,
        goldCost: 35,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'wineStorage', value: 100, isPercentage: false },
          { stat: 'staffSatisfaction', value: 5, isPercentage: true },
        ],
        constructionDays: 22,
        goldCost: 70,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'wineStorage', value: 200, isPercentage: false },
          { stat: 'staffSatisfaction', value: 10, isPercentage: true },
        ],
        special: '+10% staff satisfaction from quality wine',
        constructionDays: 30,
        goldCost: 140,
      },
    ],
  },

  // Advanced Training Buildings
  gymnasium: {
    id: 'gymnasium',
    name: 'Gymnasium',
    description: 'Advanced training facility with multiple practice areas. Increases all training efficiency.',
    icon: '🏛️',
    category: 'training',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'trainingSpeed', value: 20, isPercentage: true },
          { stat: 'xpGain', value: 10, isPercentage: true },
        ],
        constructionDays: 40,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 10 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'trainingSpeed', value: 30, isPercentage: true },
          { stat: 'xpGain', value: 15, isPercentage: true },
        ],
        constructionDays: 60,
        goldCost: 400,
        resourceCost: [{ resource: 'travertine', amount: 20 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'trainingSpeed', value: 50, isPercentage: true },
          { stat: 'xpGain', value: 25, isPercentage: true },
        ],
        special: 'Can train two gladiators simultaneously',
        constructionDays: 90,
        goldCost: 800,
        resourceCost: [
          { resource: 'travertine', amount: 30 },
          { resource: 'glass', amount: 10 },
        ],
      },
    ],
    prerequisite: { building: 'palus', level: 2 },
  },

  arenaReplica: {
    id: 'arenaReplica',
    name: 'Arena Replica',
    description: 'Small practice arena for mock battles. Prepares gladiators for real combat.',
    icon: '🏟️',
    category: 'training',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'combatPreparation', value: 15, isPercentage: true },
          { stat: 'firstRoundAccuracy', value: 10, isPercentage: true },
        ],
        constructionDays: 50,
        goldCost: 300,
        resourceCost: [{ resource: 'travertine', amount: 15 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'combatPreparation', value: 25, isPercentage: true },
          { stat: 'firstRoundAccuracy', value: 15, isPercentage: true },
          { stat: 'crowdFavor', value: 5, isPercentage: true },
        ],
        constructionDays: 75,
        goldCost: 600,
        resourceCost: [{ resource: 'travertine', amount: 25 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'combatPreparation', value: 40, isPercentage: true },
          { stat: 'firstRoundAccuracy', value: 20, isPercentage: true },
          { stat: 'crowdFavor', value: 10, isPercentage: true },
        ],
        special: 'Can host practice tournaments for XP',
        constructionDays: 100,
        goldCost: 1200,
        resourceCost: [
          { resource: 'travertine', amount: 40 },
          { resource: 'clay', amount: 20 },
        ],
      },
    ],
    prerequisite: { building: 'gymnasium', level: 1 },
  },

  library: {
    id: 'library',
    name: 'Library',
    description: 'Collection of scrolls on combat tactics and military strategy.',
    icon: '📚',
    category: 'training',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'tacticalKnowledge', value: 10, isPercentage: true },
          { stat: 'skillPointGain', value: 1, isPercentage: false },
        ],
        constructionDays: 35,
        goldCost: 150,
        resourceCost: [{ resource: 'clay', amount: 10 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'tacticalKnowledge', value: 20, isPercentage: true },
          { stat: 'skillPointGain', value: 2, isPercentage: false },
        ],
        constructionDays: 50,
        goldCost: 300,
        resourceCost: [{ resource: 'clay', amount: 20 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'tacticalKnowledge', value: 35, isPercentage: true },
          { stat: 'skillPointGain', value: 3, isPercentage: false },
        ],
        special: 'Unlocks legendary combat techniques',
        constructionDays: 70,
        goldCost: 600,
        resourceCost: [
          { resource: 'clay', amount: 30 },
          { resource: 'glass', amount: 15 },
        ],
      },
    ],
  },

  // Production Buildings
  forge: {
    id: 'forge',
    name: 'Forge',
    description: 'Blacksmith workshop for crafting superior weapons and armor.',
    icon: '⚒️',
    category: 'production',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'weaponQuality', value: 10, isPercentage: true },
          { stat: 'armorQuality', value: 10, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 120,
        resourceCost: [{ resource: 'clay', amount: 15 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'weaponQuality', value: 20, isPercentage: true },
          { stat: 'armorQuality', value: 20, isPercentage: true },
          { stat: 'weaponDamage', value: 5, isPercentage: true },
        ],
        constructionDays: 45,
        goldCost: 250,
        resourceCost: [{ resource: 'clay', amount: 25 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'weaponQuality', value: 35, isPercentage: true },
          { stat: 'armorQuality', value: 35, isPercentage: true },
          { stat: 'weaponDamage', value: 10, isPercentage: true },
        ],
        special: 'Can forge masterwork weapons (+15% damage)',
        constructionDays: 60,
        goldCost: 500,
        resourceCost: [
          { resource: 'clay', amount: 40 },
          { resource: 'travertine', amount: 10 },
        ],
      },
    ],
    prerequisite: { staff: 'faber' },
  },

  oilPress: {
    id: 'oilPress',
    name: 'Oil Press',
    description: 'Produces olive oil for cooking, massage, and sale. Generates daily income.',
    icon: '🫒',
    category: 'production',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'dailyGold', value: 5, isPercentage: false },
          { stat: 'massageEfficiency', value: 10, isPercentage: true },
        ],
        constructionDays: 20,
        goldCost: 80,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'dailyGold', value: 10, isPercentage: false },
          { stat: 'massageEfficiency', value: 20, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 160,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'dailyGold', value: 20, isPercentage: false },
          { stat: 'massageEfficiency', value: 30, isPercentage: true },
          { stat: 'staminaRegen', value: 10, isPercentage: true },
        ],
        special: 'Premium oil: +10% stamina regeneration',
        constructionDays: 40,
        goldCost: 320,
      },
    ],
  },

  triclinium: {
    id: 'triclinium',
    name: 'Triclinium',
    description: 'Formal dining hall for gladiators. Improves morale and nutrition absorption.',
    icon: '🍽️',
    category: 'recovery',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'morale', value: 10, isPercentage: false },
          { stat: 'nutritionEfficiency', value: 15, isPercentage: true },
        ],
        constructionDays: 25,
        goldCost: 100,
        resourceCost: [{ resource: 'travertine', amount: 5 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'morale', value: 20, isPercentage: false },
          { stat: 'nutritionEfficiency', value: 25, isPercentage: true },
        ],
        constructionDays: 35,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 10 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'morale', value: 30, isPercentage: false },
          { stat: 'nutritionEfficiency', value: 40, isPercentage: true },
          { stat: 'obedience', value: 10, isPercentage: true },
        ],
        special: 'Lavish feasts: +10% obedience',
        constructionDays: 50,
        goldCost: 400,
        resourceCost: [
          { resource: 'travertine', amount: 15 },
          { resource: 'glass', amount: 5 },
        ],
      },
    ],
    prerequisite: { building: 'taberna', level: 2 },
  },

  // Security Buildings
  guardTower: {
    id: 'guardTower',
    name: 'Guard Tower',
    description: 'Watchtower for guards. Increases security and prevents escapes.',
    icon: '🗼',
    category: 'security',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'security', value: 15, isPercentage: false },
          { stat: 'escapeDetection', value: 30, isPercentage: true },
        ],
        constructionDays: 25,
        goldCost: 75,
        resourceCost: [{ resource: 'travertine', amount: 10 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'security', value: 30, isPercentage: false },
          { stat: 'escapeDetection', value: 50, isPercentage: true },
        ],
        constructionDays: 35,
        goldCost: 150,
        resourceCost: [{ resource: 'travertine', amount: 20 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'security', value: 50, isPercentage: false },
          { stat: 'escapeDetection', value: 75, isPercentage: true },
        ],
        special: 'Early warning system: detect sabotage attempts',
        constructionDays: 50,
        goldCost: 300,
        resourceCost: [{ resource: 'travertine', amount: 30 }],
      },
    ],
    prerequisite: { building: 'walls', level: 1 },
  },

  barracks: {
    id: 'barracks',
    name: 'Barracks',
    description: 'Housing for guards and staff. Reduces wages and increases efficiency.',
    icon: '🏚️',
    category: 'security',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'staffWages', value: -10, isPercentage: true },
          { stat: 'security', value: 5, isPercentage: false },
        ],
        constructionDays: 30,
        goldCost: 100,
        resourceCost: [{ resource: 'travertine', amount: 8 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'staffWages', value: -15, isPercentage: true },
          { stat: 'security', value: 10, isPercentage: false },
          { stat: 'staffSatisfaction', value: 5, isPercentage: true },
        ],
        constructionDays: 45,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 15 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'staffWages', value: -25, isPercentage: true },
          { stat: 'security', value: 15, isPercentage: false },
          { stat: 'staffSatisfaction', value: 10, isPercentage: true },
        ],
        special: 'Staff housing: -25% wages, +10% satisfaction',
        constructionDays: 60,
        goldCost: 400,
        resourceCost: [
          { resource: 'travertine', amount: 25 },
          { resource: 'clay', amount: 15 },
        ],
      },
    ],
  },

  // Commerce Buildings
  marketplace: {
    id: 'marketplace',
    name: 'Ludus Marketplace',
    description: 'Small market stall selling gladiator merchandise. Generates passive income.',
    icon: '🏪',
    category: 'commerce',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'dailyGold', value: 10, isPercentage: false },
          { stat: 'merchandiseIncome', value: 15, isPercentage: true },
        ],
        constructionDays: 20,
        goldCost: 100,
      },
      {
        level: 2,
        bonuses: [
          { stat: 'dailyGold', value: 20, isPercentage: false },
          { stat: 'merchandiseIncome', value: 30, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 200,
      },
      {
        level: 3,
        bonuses: [
          { stat: 'dailyGold', value: 40, isPercentage: false },
          { stat: 'merchandiseIncome', value: 50, isPercentage: true },
        ],
        special: 'Exclusive merchandise: double income from famous gladiators',
        constructionDays: 40,
        goldCost: 400,
      },
    ],
    prerequisite: { building: 'taberna', level: 1 },
  },

  spectatorSeats: {
    id: 'spectatorSeats',
    name: 'Spectator Seating',
    description: 'Viewing area for training sessions. Increases fame and attracts sponsors.',
    icon: '🪑',
    category: 'entertainment',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'fameGain', value: 10, isPercentage: true },
          { stat: 'sponsorChance', value: 5, isPercentage: true },
        ],
        constructionDays: 30,
        goldCost: 150,
        resourceCost: [{ resource: 'travertine', amount: 10 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'fameGain', value: 20, isPercentage: true },
          { stat: 'sponsorChance', value: 10, isPercentage: true },
        ],
        constructionDays: 45,
        goldCost: 300,
        resourceCost: [{ resource: 'travertine', amount: 20 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'fameGain', value: 35, isPercentage: true },
          { stat: 'sponsorChance', value: 20, isPercentage: true },
          { stat: 'dailyGold', value: 15, isPercentage: false },
        ],
        special: 'Premium seating: ticket sales generate 15 gold/day',
        constructionDays: 60,
        goldCost: 600,
        resourceCost: [
          { resource: 'travertine', amount: 30 },
          { resource: 'glass', amount: 10 },
        ],
      },
    ],
    prerequisite: { building: 'arenaReplica', level: 1 },
  },

  beastPens: {
    id: 'beastPens',
    name: 'Beast Pens',
    description: 'Pens for wild animals. Train gladiators to fight beasts and add spectacle.',
    icon: '🦁',
    category: 'entertainment',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'beastFightingSkill', value: 20, isPercentage: true },
          { stat: 'crowdFavor', value: 10, isPercentage: true },
        ],
        constructionDays: 40,
        goldCost: 200,
        resourceCost: [{ resource: 'travertine', amount: 15 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'beastFightingSkill', value: 35, isPercentage: true },
          { stat: 'crowdFavor', value: 20, isPercentage: true },
          { stat: 'fameGain', value: 15, isPercentage: true },
        ],
        constructionDays: 60,
        goldCost: 400,
        resourceCost: [{ resource: 'travertine', amount: 25 }],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'beastFightingSkill', value: 50, isPercentage: true },
          { stat: 'crowdFavor', value: 30, isPercentage: true },
          { stat: 'fameGain', value: 25, isPercentage: true },
        ],
        special: 'Exotic beasts: can hunt lions, bears, and tigers for massive fame',
        constructionDays: 80,
        goldCost: 800,
        resourceCost: [
          { resource: 'travertine', amount: 40 },
          { resource: 'clay', amount: 20 },
        ],
      },
    ],
  },

  hypocaust: {
    id: 'hypocaust',
    name: 'Hypocaust',
    description: 'Roman underfloor heating system. Provides comfort and faster recovery.',
    icon: '🔥',
    category: 'recovery',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'recoverySpeed', value: 15, isPercentage: true },
          { stat: 'morale', value: 5, isPercentage: false },
        ],
        constructionDays: 35,
        goldCost: 180,
        resourceCost: [
          { resource: 'clay', amount: 20 },
          { resource: 'travertine', amount: 10 },
        ],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'recoverySpeed', value: 25, isPercentage: true },
          { stat: 'morale', value: 10, isPercentage: false },
          { stat: 'healingSpeed', value: 10, isPercentage: true },
        ],
        constructionDays: 50,
        goldCost: 360,
        resourceCost: [
          { resource: 'clay', amount: 30 },
          { resource: 'travertine', amount: 20 },
        ],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'recoverySpeed', value: 40, isPercentage: true },
          { stat: 'morale', value: 15, isPercentage: false },
          { stat: 'healingSpeed', value: 20, isPercentage: true },
        ],
        special: 'Luxurious warmth: prevents cold-related injuries',
        constructionDays: 70,
        goldCost: 720,
        resourceCost: [
          { resource: 'clay', amount: 50 },
          { resource: 'travertine', amount: 30 },
        ],
      },
    ],
    prerequisite: { building: 'balnea', level: 2 },
  },

  ludusOffice: {
    id: 'ludusOffice',
    name: 'Ludus Office',
    description: 'Administrative office for the lanista. Improves management efficiency.',
    icon: '📋',
    category: 'commerce',
    levels: [
      {
        level: 1,
        bonuses: [
          { stat: 'contractNegotiation', value: 10, isPercentage: true },
          { stat: 'matchRewards', value: 5, isPercentage: true },
        ],
        constructionDays: 15,
        goldCost: 80,
        resourceCost: [{ resource: 'clay', amount: 10 }],
      },
      {
        level: 2,
        bonuses: [
          { stat: 'contractNegotiation', value: 20, isPercentage: true },
          { stat: 'matchRewards', value: 10, isPercentage: true },
          { stat: 'staffWages', value: -5, isPercentage: true },
        ],
        constructionDays: 25,
        goldCost: 160,
        resourceCost: [
          { resource: 'clay', amount: 15 },
          { resource: 'glass', amount: 5 },
        ],
      },
      {
        level: 3,
        bonuses: [
          { stat: 'contractNegotiation', value: 35, isPercentage: true },
          { stat: 'matchRewards', value: 20, isPercentage: true },
          { stat: 'staffWages', value: -10, isPercentage: true },
        ],
        special: 'Expert negotiation: +20% fight rewards, -10% staff costs',
        constructionDays: 35,
        goldCost: 320,
        resourceCost: [
          { resource: 'clay', amount: 25 },
          { resource: 'glass', amount: 10 },
        ],
      },
    ],
    prerequisite: { staff: 'lanista' },
  },
};

// Helper function to get building data for a specific level
export const getBuildingLevelData = (
  buildingType: BuildingType,
  level: 1 | 2 | 3
): BuildingLevelData => {
  const building = BUILDINGS[buildingType];
  return building.levels[level - 1];
};

// Helper function to get total bonuses for a building at a level
export const getBuildingBonuses = (
  buildingType: BuildingType,
  level: 1 | 2 | 3
): BuildingBonus[] => {
  return getBuildingLevelData(buildingType, level).bonuses;
};

// Helper function to calculate upgrade cost
export const getUpgradeCost = (
  buildingType: BuildingType,
  currentLevel: 1 | 2
): { gold: number; days: number; resources?: { resource: string; amount: number }[] } => {
  const nextLevel = (currentLevel + 1) as 2 | 3;
  const levelData = getBuildingLevelData(buildingType, nextLevel);
  return {
    gold: levelData.goldCost,
    days: levelData.constructionDays,
    resources: levelData.resourceCost,
  };
};

// Get buildings by category
export const getBuildingsByCategory = (category: BuildingData['category']): BuildingData[] => {
  return Object.values(BUILDINGS).filter(b => b.category === category);
};

// Get all available buildings (that can be built)
export const getAvailableBuildings = (): BuildingData[] => {
  return Object.values(BUILDINGS);
};
