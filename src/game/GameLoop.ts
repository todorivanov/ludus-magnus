/**
 * Game Loop System
 * Handles daily processing, time advancement, and game state updates
 */

import type { Gladiator, Staff } from '@/types';

// Time phases in a day
export type TimePhase = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface DayReport {
  day: number;
  
  // Financial
  income: { source: string; amount: number }[];
  expenses: { source: string; amount: number }[];
  netGold: number;
  
  // Gladiators
  gladiatorUpdates: {
    id: string;
    name: string;
    events: string[];
  }[];
  
  // Staff
  staffUpdates: {
    id: string;
    name: string;
    events: string[];
  }[];
  
  // Events
  randomEvents: {
    type: string;
    description: string;
    effect: string;
  }[];
  
  // Alerts
  alerts: {
    severity: 'info' | 'warning' | 'danger';
    message: string;
  }[];
}

// Calculate time phase based on hour (0-23)
export const getTimePhase = (hour: number): TimePhase => {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Daily resource consumption rates
export interface DailyConsumption {
  foodPerGladiator: number;
  waterPerGladiator: number;
  goldPerStaff: number;
}

export const BASE_CONSUMPTION: DailyConsumption = {
  foodPerGladiator: 2,
  waterPerGladiator: 1,
  goldPerStaff: 5,
};

// Calculate daily gladiator maintenance
export const calculateGladiatorMaintenance = (
  _gladiator: Gladiator, // Reserved for future gladiator-specific modifiers
  nutritionQuality: string
): { food: number; gold: number } => {
  const baseFood = BASE_CONSUMPTION.foodPerGladiator;
  
  // Nutrition quality modifiers
  const nutritionMod: Record<string, number> = {
    poor: 0.5,
    basic: 1.0,
    good: 1.5,
    excellent: 2.0,
  };
  
  const foodCost = Math.ceil(baseFood * (nutritionMod[nutritionQuality] || 1));
  const goldCost = Math.ceil(foodCost * 2); // 2 gold per unit of food
  
  return { food: foodCost, gold: goldCost };
};

// Calculate staff wages
export const calculateStaffWages = (
  staff: Staff[],
  staffWageRates: Record<string, number>
): number => {
  return staff.reduce((total, s) => {
    const baseWage = staffWageRates[s.role] || 10;
    const skillBonus = s.level * 2;
    return total + baseWage + skillBonus;
  }, 0);
};

// Calculate passive income from fame and merchandise
export const calculatePassiveIncome = (
  ludusFame: number,
  gladiatorFames: number[],
  ownedMerchandise: string[],
  merchandiseData: Record<string, { baseIncome: number; fameBonusMultiplier: number }>
): { total: number; breakdown: { source: string; amount: number }[] } => {
  const breakdown: { source: string; amount: number }[] = [];
  let total = 0;
  
  // Fame tier income
  const fameTierIncome = Math.floor(ludusFame / 100) * 10;
  if (fameTierIncome > 0) {
    breakdown.push({ source: 'Ludus Fame', amount: fameTierIncome });
    total += fameTierIncome;
  }
  
  // Gladiator fan gifts
  const totalGladFame = gladiatorFames.reduce((sum, f) => sum + f, 0);
  const gladiatorGifts = Math.floor(totalGladFame / 50) * 5;
  if (gladiatorGifts > 0) {
    breakdown.push({ source: 'Fan Gifts', amount: gladiatorGifts });
    total += gladiatorGifts;
  }
  
  // Merchandise income
  ownedMerchandise.forEach(merchId => {
    const merch = merchandiseData[merchId];
    if (merch) {
      const income = Math.ceil(merch.baseIncome + (totalGladFame * merch.fameBonusMultiplier));
      breakdown.push({ source: `Merchandise: ${merchId}`, amount: income });
      total += income;
    }
  });
  
  return { total, breakdown };
};

// Process gladiator daily updates
export const processGladiatorDay = (
  gladiator: Gladiator,
  isTraining: boolean,
  isResting: boolean
): {
  updates: Partial<Gladiator>;
  events: string[];
} => {
  const events: string[] = [];
  const updates: Partial<Gladiator> = {};
  
  // Natural HP recovery
  if (gladiator.currentHP < gladiator.maxHP) {
    const baseRecovery = 5;
    const restBonus = isResting ? 10 : 0;
    const recovery = Math.min(baseRecovery + restBonus, gladiator.maxHP - gladiator.currentHP);
    updates.currentHP = gladiator.currentHP + recovery;
    events.push(`Recovered ${recovery} HP`);
  }
  
  // Stamina recovery
  if (gladiator.currentStamina < gladiator.maxStamina) {
    const staminaRecovery = isResting ? 30 : 15;
    updates.currentStamina = Math.min(
      gladiator.currentStamina + staminaRecovery,
      gladiator.maxStamina
    );
    events.push(`Recovered ${staminaRecovery} stamina`);
  }
  
  // Training effects
  if (isTraining && !isResting) {
    // Fatigue increases
    const newFatigue = Math.min(1, (gladiator.fatigue || 0) + 0.1);
    updates.fatigue = newFatigue;
    
    // Morale decreases slightly from hard training
    const newMorale = Math.max(0.5, (gladiator.morale || 1) - 0.02);
    updates.morale = newMorale;
    
    events.push('Training increased fatigue');
  }
  
  // Resting effects
  if (isResting) {
    // Fatigue decreases
    const newFatigue = Math.max(0, (gladiator.fatigue || 0) - 0.2);
    updates.fatigue = newFatigue;
    
    // Morale increases
    const newMorale = Math.min(1.5, (gladiator.morale || 1) + 0.05);
    updates.morale = newMorale;
    
    events.push('Rest reduced fatigue and improved morale');
  }
  
  // Injury recovery countdown
  if (gladiator.injuries && gladiator.injuries.length > 0) {
    const updatedInjuries = gladiator.injuries
      .map(injury => ({
        ...injury,
        daysRemaining: injury.daysRemaining - 1,
      }))
      .filter(injury => injury.daysRemaining > 0);
    
    const healed = gladiator.injuries.length - updatedInjuries.length;
    if (healed > 0) {
      events.push(`${healed} injury(ies) healed`);
    }
    
    updates.injuries = updatedInjuries;
    updates.isInjured = updatedInjuries.length > 0;
  }
  
  return { updates, events };
};

// Rebellion/Unrest System
export interface UnrestStatus {
  level: number; // 0-100
  causes: string[];
  riskOfRebellion: boolean;
}

export const calculateUnrest = (
  _gladiators: Gladiator[], // Reserved for future per-gladiator unrest modifiers
  conditions: {
    averageMorale: number;
    daysUnpaidWages: number;
    recentDeaths: number;
    hasGuards: boolean;
    ludusLevel: number;
  }
): UnrestStatus => {
  const causes: string[] = [];
  let level = 0;
  
  // Low morale
  if (conditions.averageMorale < 0.5) {
    level += 30;
    causes.push('Low morale among gladiators');
  } else if (conditions.averageMorale < 0.7) {
    level += 15;
    causes.push('Moderate dissatisfaction');
  }
  
  // Unpaid wages (for staff affecting gladiator treatment)
  if (conditions.daysUnpaidWages > 0) {
    level += conditions.daysUnpaidWages * 5;
    causes.push('Staff wages unpaid');
  }
  
  // Recent deaths
  if (conditions.recentDeaths > 0) {
    level += conditions.recentDeaths * 20;
    causes.push('Recent gladiator deaths affecting morale');
  }
  
  // Guards reduce unrest
  if (conditions.hasGuards) {
    level -= 20;
  }
  
  // Ludus level provides stability
  level -= conditions.ludusLevel * 5;
  
  // Clamp level
  level = Math.max(0, Math.min(100, level));
  
  return {
    level,
    causes,
    riskOfRebellion: level >= 75,
  };
};

// Random daily events
export type RandomEventType = 
  | 'visitor'
  | 'illness'
  | 'gift'
  | 'merchant'
  | 'festival'
  | 'weather'
  | 'rumor';

export interface RandomEvent {
  id: string;
  type: RandomEventType;
  title: string;
  description: string;
  effects: {
    type: 'gold' | 'fame' | 'morale' | 'health' | 'favor';
    target?: string;
    value: number;
  }[];
  choices?: {
    id: string;
    text: string;
    effects: RandomEvent['effects'];
  }[];
}

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'wealthy_visitor',
    type: 'visitor',
    title: 'Wealthy Visitor',
    description: 'A wealthy merchant wishes to tour your ludus.',
    effects: [{ type: 'gold', value: 50 }],
  },
  {
    id: 'minor_illness',
    type: 'illness',
    title: 'Minor Illness',
    description: 'A minor illness spreads through your barracks.',
    effects: [{ type: 'health', value: -10 }],
  },
  {
    id: 'fan_gift',
    type: 'gift',
    title: 'Admirer\'s Gift',
    description: 'An admirer sends gifts to your champion gladiator.',
    effects: [{ type: 'gold', value: 30 }, { type: 'morale', value: 5 }],
  },
  {
    id: 'traveling_merchant',
    type: 'merchant',
    title: 'Traveling Merchant',
    description: 'A merchant offers rare goods at a discount.',
    effects: [],
    choices: [
      {
        id: 'buy',
        text: 'Purchase rare equipment (100g)',
        effects: [{ type: 'gold', value: -100 }],
      },
      {
        id: 'decline',
        text: 'Politely decline',
        effects: [],
      },
    ],
  },
  {
    id: 'local_festival',
    type: 'festival',
    title: 'Local Festival',
    description: 'The city celebrates a local festival. Arena attendance increases.',
    effects: [{ type: 'fame', value: 10 }],
  },
  {
    id: 'bad_weather',
    type: 'weather',
    title: 'Severe Weather',
    description: 'Bad weather disrupts training for the day.',
    effects: [],
  },
  {
    id: 'good_rumor',
    type: 'rumor',
    title: 'Favorable Rumors',
    description: 'Positive rumors about your ludus spread through the city.',
    effects: [{ type: 'fame', value: 15 }],
  },
];

// Roll for random event
export const rollRandomEvent = (
  _currentDay: number, // Reserved for day-specific events
  ludusFame: number
): RandomEvent | null => {
  // Base 20% chance per day
  let chance = 0.2;
  
  // Higher fame = more events
  chance += ludusFame / 2000;
  
  if (Math.random() < chance) {
    return RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  }
  
  return null;
};

// Generate day report
export const generateDayReport = (
  day: number,
  income: { source: string; amount: number }[],
  expenses: { source: string; amount: number }[],
  gladiatorUpdates: DayReport['gladiatorUpdates'],
  staffUpdates: DayReport['staffUpdates'],
  randomEvents: DayReport['randomEvents'],
  alerts: DayReport['alerts']
): DayReport => {
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  return {
    day,
    income,
    expenses,
    netGold: totalIncome - totalExpenses,
    gladiatorUpdates,
    staffUpdates,
    randomEvents,
    alerts,
  };
};
