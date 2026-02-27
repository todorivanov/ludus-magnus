/**
 * Game Loop System
 * Handles daily processing, time advancement, and game state updates
 */

import type { Gladiator, Staff } from '@/types';
import { 
  TRAINING_REGIMENS, 
  NUTRITION_OPTIONS, 
  calculateXPGain, 
  calculateStatGains,
  checkTrainingInjury,
  type TrainingType,
  type NutritionQuality,
} from '@data/training';
import {
  calculateAge,
  calculateStatDecline,
  checkForDeath,
} from '@/utils/ageSystem';

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

// Staff bonuses interface
export interface StaffBonuses {
  trainingXP?: number;         // Percentage bonus from doctore
  healingSpeed?: number;       // Percentage bonus from medicus
  nutritionValue?: number;     // Percentage bonus from coquus
  staminaRecovery?: number;    // Percentage bonus from coquus
  morale?: number;             // Flat bonus from coquus
  obedience?: number;          // Percentage bonus from lorarius
  [key: string]: number | undefined;
}

// Process gladiator daily updates
export const processGladiatorDay = (
  gladiator: Gladiator,
  isTraining: boolean,
  isResting: boolean,
  staffBonuses: StaffBonuses = {},
  currentYear: number = 73,
  currentMonth: number = 1
): {
  updates: Partial<Gladiator>;
  events: string[];
  died?: boolean; // Flag if gladiator died from old age
} => {
  const events: string[] = [];
  const updates: Partial<Gladiator> = {};
  
  // === AGE & CAREER PROCESSING ===
  // Update months of service
  if (gladiator.monthsOfService !== undefined) {
    updates.monthsOfService = gladiator.monthsOfService + 1;
  }
  
  // Calculate current age and check for birthday
  if (gladiator.birthYear !== undefined && gladiator.birthMonth !== undefined) {
    const newAge = calculateAge(
      gladiator.birthYear,
      gladiator.birthMonth,
      currentYear,
      currentMonth
    );
    
    // If age changed (birthday happened), log it
    if (newAge !== gladiator.age) {
      updates.age = newAge;
      events.push(`🎂 Turned ${newAge} years old!`);
    }
    
    // Apply monthly stat decline for aging gladiators (30+)
    const currentAge = newAge;
    if (currentAge >= 30) {
      const statDecline = calculateStatDecline(currentAge);
      
      // Apply decline to current stats (can't go below 10)
      const newStats = { ...gladiator.stats };
      let hasDecline = false;
      
      (Object.keys(statDecline) as Array<keyof typeof statDecline>).forEach(stat => {
        const decline = statDecline[stat];
        if (decline < 0) {
          newStats[stat] = Math.max(10, newStats[stat] + decline);
          hasDecline = true;
        }
      });
      
      if (hasDecline) {
        updates.stats = newStats;
        
        // Update derived stats
        const constitutionChanged = statDecline.constitution < 0;
        const enduranceChanged = statDecline.endurance < 0;
        
        if (constitutionChanged) {
          const newMaxHP = 50 + Math.floor(newStats.constitution * 1.5);
          updates.maxHP = newMaxHP;
          updates.currentHP = Math.min(gladiator.currentHP, newMaxHP);
        }
        
        if (enduranceChanged) {
          const newMaxStamina = 30 + Math.floor(newStats.endurance * 1.2);
          updates.maxStamina = newMaxStamina;
          updates.currentStamina = Math.min(gladiator.currentStamina, newMaxStamina);
        }
        
        events.push(`⏳ Age is taking its toll... physical abilities declining`);
      }
    }
    
    // Check for death from old age
    if (checkForDeath(currentAge)) {
      return {
        updates,
        events: [...events, `💀 ${gladiator.name} has died from old age at ${currentAge} years old.`],
        died: true
      };
    }
  }
  
  // Get nutrition level (default to standard)
  const nutritionLevel = (gladiator.nutrition || 'standard') as NutritionQuality;
  const nutrition = NUTRITION_OPTIONS[nutritionLevel];
  
  // Calculate healing bonus from staff (medicus)
  const healingSpeedBonus = (staffBonuses.healingSpeed || 0) / 100;
  // Calculate nutrition bonus from staff (coquus)
  const nutritionValueBonus = (staffBonuses.nutritionValue || 0) / 100;
  
  // Natural HP recovery with nutrition and staff modifiers
  if (gladiator.currentHP < gladiator.maxHP) {
    const baseRecovery = 20;
    const restBonus = isResting ? 30 : 0;
    // Nutrition bonus from food + coquus skill bonus
    const nutritionBonus = (nutrition.effects.healingModifier / 100) * (1 + nutritionValueBonus);
    // Apply medicus healing bonus
    const totalHealingBonus = 1 + nutritionBonus + healingSpeedBonus;
    const recovery = Math.min(
      Math.round((baseRecovery + restBonus) * totalHealingBonus), 
      gladiator.maxHP - gladiator.currentHP
    );
    if (recovery > 0) {
      updates.currentHP = gladiator.currentHP + recovery;
      const bonusText = [];
      if (healingSpeedBonus > 0) bonusText.push(`Medicus +${Math.round(healingSpeedBonus * 100)}%`);
      if (nutritionValueBonus > 0) bonusText.push(`Coquus +${Math.round(nutritionValueBonus * 100)}%`);
      if (bonusText.length > 0) {
        events.push(`Recovered ${recovery} HP (${bonusText.join(', ')})`);
      } else {
        events.push(`Recovered ${recovery} HP`);
      }
    }
  }
  
  // Stamina recovery - full recovery when resting, partial otherwise
  // Apply coquus stamina recovery bonus
  const staminaRecoveryBonus = (staffBonuses.staminaRecovery || 0) / 100;
  if (gladiator.currentStamina < gladiator.maxStamina) {
    // Resting = full stamina recovery, otherwise recover 50% + coquus bonus
    const baseRecoveryRate = isResting ? 1.0 : 0.5 + staminaRecoveryBonus;
    const staminaRecovery = Math.min(
      Math.round(gladiator.maxStamina * baseRecoveryRate), 
      gladiator.maxStamina - gladiator.currentStamina
    );
    if (staminaRecovery > 0) {
      updates.currentStamina = gladiator.currentStamina + staminaRecovery;
      events.push(`Recovered ${staminaRecovery} stamina`);
    }
  }
  
  // Training effects - use actual training regimen
  if (isTraining && !isResting && gladiator.trainingRegimen) {
    const trainingType = gladiator.trainingRegimen as TrainingType;
    const regimen = TRAINING_REGIMENS[trainingType];
    
    if (regimen) {
      // Convert morale from 0.1-1.5 range to 0-100 range for calculations
      const moraleForCalc = Math.round(((gladiator.morale || 1) - 0.1) / 1.4 * 100);
      const fatiguePercent = (gladiator.fatigue || 0) * 100;
      
      // Get doctore training XP bonus
      const trainingXPBonus = (staffBonuses.trainingXP || 0) / 100;
      
      // Calculate and apply XP gain with doctore bonus and age modifier
      let xpGain = calculateXPGain(
        trainingType,
        gladiator.level,
        nutritionLevel,
        moraleForCalc,
        fatiguePercent,
        0, // buildingBonus
        gladiator.age
      );
      
      // Apply doctore bonus
      if (trainingXPBonus > 0) {
        xpGain = Math.round(xpGain * (1 + trainingXPBonus));
      }
      
      if (xpGain > 0) {
        let newXP = (gladiator.experience || 0) + xpGain;
        let newLevel = gladiator.level;
        let newSkillPoints = gladiator.skillPoints || 0;
        const xpToLevel = gladiator.level * 100;
        
        // Check for level up (can level up multiple times if enough XP)
        while (newXP >= xpToLevel && newLevel < 20) {
          newXP -= xpToLevel;
          newLevel += 1;
          newSkillPoints += 5;
          events.push(`🎉 LEVEL UP! Now level ${newLevel}! +5 skill points`);
        }
        
        updates.experience = newXP;
        if (newLevel > gladiator.level) {
          updates.level = newLevel;
          updates.skillPoints = newSkillPoints;
          // Update derived stats on level up
          updates.maxHP = 50 + newLevel * 10 + Math.round(gladiator.stats.constitution * 2);
          updates.maxStamina = 50 + newLevel * 5 + Math.round(gladiator.stats.endurance * 1.5);
        }
        events.push(`+${xpGain} XP from ${regimen.name}`);
      }
      
      // Calculate stat gains
      const statGains = calculateStatGains(
        trainingType,
        nutritionLevel,
        moraleForCalc,
        fatiguePercent
      );
      
      statGains.forEach(gain => {
        if (gain.value > 0) {
          const statKey = gain.stat as keyof Gladiator;
          const currentValue = (gladiator[statKey] as number) || 0;
          (updates as Record<string, number>)[statKey] = currentValue + gain.value;
          events.push(`+${gain.value} ${gain.stat}`);
        }
      });
      
      // Apply fatigue from training
      const newFatigue = Math.min(1, (gladiator.fatigue || 0) + regimen.fatigueGain / 100);
      updates.fatigue = newFatigue;
      
      // Apply morale effect from training
      const moraleChange = regimen.moraleEffect / 100;
      const nutritionMoraleBonus = nutrition.effects.moraleModifier / 100;
      const newMorale = Math.max(0.5, Math.min(1.5, (gladiator.morale || 1) + moraleChange + nutritionMoraleBonus));
      updates.morale = newMorale;
      
      // Check for training injury
      const injuryCheck = checkTrainingInjury(
        trainingType,
        nutritionLevel,
        (gladiator.fatigue || 0) * 100
      );
      
      if (injuryCheck.injured) {
        // Map severity to match our type (minor, major, permanent)
        const severityMap: Record<string, 'minor' | 'major' | 'permanent'> = {
          'minor': 'minor',
          'moderate': 'major',
          'severe': 'permanent',
        };
        const mappedSeverity = severityMap[injuryCheck.severity] || 'minor';
        const injuryDays = mappedSeverity === 'minor' ? 3 : mappedSeverity === 'major' ? 7 : 14;
        
        const newInjury = {
          id: `injury_${Date.now()}`,
          type: `Training ${mappedSeverity} injury`,
          severity: mappedSeverity,
          statPenalty: {},
          recoveryDays: injuryDays,
          daysRemaining: injuryDays,
        };
        updates.injuries = [...(gladiator.injuries || []), newInjury];
        updates.isInjured = true;
        events.push(`Suffered ${mappedSeverity} injury during training!`);
      }
      
      events.push(`Completed ${regimen.name} training`);
    }
  } else if (isTraining && !isResting) {
    // Generic training without specific regimen
    const newFatigue = Math.min(1, (gladiator.fatigue || 0) + 0.1);
    updates.fatigue = newFatigue;
    
    const newMorale = Math.max(0.5, (gladiator.morale || 1) - 0.02);
    updates.morale = newMorale;
    
    events.push('Basic training completed');
  }
  
  // Resting effects with nutrition bonus
  if (isResting) {
    // Fatigue decreases significantly - better nutrition = faster recovery
    const baseFatigueRecovery = 0.5; // Increased from 0.2 (clears fatigue in ~2 days)
    const nutritionFatigueBonus = nutrition.effects.fatigueRecovery / 100;
    const newFatigue = Math.max(0, (gladiator.fatigue || 0) - baseFatigueRecovery - nutritionFatigueBonus);
    updates.fatigue = newFatigue;
    
    // Morale increases with nutrition bonus
    const baseMoraleGain = 0.15; // Increased from 0.05
    const nutritionMoraleBonus = nutrition.effects.moraleModifier / 200;
    const newMorale = Math.min(1.5, (gladiator.morale || 1) + baseMoraleGain + nutritionMoraleBonus);
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
