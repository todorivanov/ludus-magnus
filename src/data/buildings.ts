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
  category: 'training' | 'recovery' | 'storage' | 'security' | 'production';
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
