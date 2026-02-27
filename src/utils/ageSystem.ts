/**
 * Age System Utilities
 * Handles all age-related calculations and mechanics for gladiators
 */

export type AgeCategory = 
  | 'youth'      // 15-19: Fast learners, weak stats
  | 'prime'      // 20-29: Optimal performance
  | 'veteran'    // 30-35: Experience vs. decline
  | 'aging'      // 36-40: Significant decline
  | 'old';       // 41+: High death risk

/**
 * Calculate gladiator's current age based on birth date and current game date
 */
export function calculateAge(
  birthYear: number,
  birthMonth: number,
  currentYear: number,
  currentMonth: number
): number {
  let age = currentYear - birthYear;
  
  // If birthday hasn't occurred yet this year, subtract 1
  if (currentMonth < birthMonth) {
    age--;
  }
  
  return age;
}

/**
 * Determine age category based on age
 */
export function getAgeCategory(age: number): AgeCategory {
  if (age < 20) return 'youth';
  if (age < 30) return 'prime';
  if (age < 36) return 'veteran';
  if (age < 41) return 'aging';
  return 'old';
}

/**
 * Get XP learning modifier based on age
 * Youth: +25% (1.25x)
 * Prime: +0% (1.0x)
 * Veteran: -10% (0.9x)
 * Aging: -25% (0.75x)
 * Old: -40% (0.6x)
 */
export function getLearningModifier(age: number): number {
  const category = getAgeCategory(age);
  
  switch (category) {
    case 'youth':
      return 1.25;
    case 'prime':
      return 1.0;
    case 'veteran':
      return 0.9;
    case 'aging':
      return 0.75;
    case 'old':
      return 0.6;
    default:
      return 1.0;
  }
}

/**
 * Calculate monthly stat decline for gladiators past their prime (30+)
 * Returns object with stat reductions (negative values)
 */
export function calculateStatDecline(age: number): {
  strength: number;
  agility: number;
  dexterity: number;
  endurance: number;
  constitution: number;
} {
  const category = getAgeCategory(age);
  
  // No decline for youth and prime
  if (category === 'youth' || category === 'prime') {
    return { strength: 0, agility: 0, dexterity: 0, endurance: 0, constitution: 0 };
  }
  
  // Veteran (30-35): Very slow decline
  if (category === 'veteran') {
    return {
      strength: -0.1,
      agility: -0.15,      // Agility declines slightly faster
      dexterity: -0.1,
      endurance: -0.15,    // Endurance declines slightly faster
      constitution: -0.05, // Constitution most resistant
    };
  }
  
  // Aging (36-40): Moderate decline
  if (category === 'aging') {
    return {
      strength: -0.3,
      agility: -0.5,       // Agility significantly affected
      dexterity: -0.3,
      endurance: -0.4,
      constitution: -0.2,
    };
  }
  
  // Old (41+): Severe decline
  return {
    strength: -0.6,
    agility: -1.0,         // Agility heavily affected
    dexterity: -0.6,
    endurance: -0.8,
    constitution: -0.4,
  };
}

/**
 * Calculate death risk percentage based on age
 * Returns probability of death (0-1)
 * Checked monthly in game loop
 */
export function getDeathRisk(age: number): number {
  const category = getAgeCategory(age);
  
  switch (category) {
    case 'youth':
      return 0.0;        // 0% - Young gladiators don't die from old age
    case 'prime':
      return 0.0;        // 0% - Prime gladiators don't die from old age
    case 'veteran':
      return 0.001;      // 0.1% per month (~1.2% per year)
    case 'aging':
      return 0.005;      // 0.5% per month (~6% per year)
    case 'old':
      return 0.02;       // 2% per month (~24% per year)
    default:
      return 0.0;
  }
}

/**
 * Check if gladiator dies from old age this month
 * Returns true if death occurs
 */
export function checkForDeath(age: number): boolean {
  const deathRisk = getDeathRisk(age);
  return Math.random() < deathRisk;
}

/**
 * Get fame bonus/penalty based on age
 * Older gladiators gain more fame per victory (veteran status)
 */
export function getAgeFameModifier(age: number): number {
  const category = getAgeCategory(age);
  
  switch (category) {
    case 'youth':
      return 0.9;        // -10% (unproven)
    case 'prime':
      return 1.0;        // Standard
    case 'veteran':
      return 1.15;       // +15% (respected veteran)
    case 'aging':
      return 1.25;       // +25% (legendary survivor)
    case 'old':
      return 1.35;       // +35% (living legend)
    default:
      return 1.0;
  }
}

/**
 * Get age-based price modifier for marketplace
 * Affects initial purchase price
 */
export function getAgePriceModifier(age: number): number {
  const category = getAgeCategory(age);
  
  switch (category) {
    case 'youth':
      return 0.7;        // -30% (potential but risky)
    case 'prime':
      return 1.0;        // Standard price
    case 'veteran':
      return 0.9;        // -10% (past prime but experienced)
    case 'aging':
      return 0.6;        // -40% (limited career left)
    case 'old':
      return 0.4;        // -60% (very short career left)
    default:
      return 1.0;
  }
}

/**
 * Get age category description for UI
 */
export function getAgeCategoryDescription(age: number): {
  category: AgeCategory;
  label: string;
  color: string;
  description: string;
} {
  const category = getAgeCategory(age);
  
  switch (category) {
    case 'youth':
      return {
        category,
        label: 'Youth',
        color: 'text-blue-400',
        description: 'Young and eager to learn, but physically underdeveloped'
      };
    case 'prime':
      return {
        category,
        label: 'Prime',
        color: 'text-green-400',
        description: 'At peak physical condition and performance'
      };
    case 'veteran':
      return {
        category,
        label: 'Veteran',
        color: 'text-yellow-400',
        description: 'Experienced warrior, beginning to show signs of age'
      };
    case 'aging':
      return {
        category,
        label: 'Aging',
        color: 'text-orange-400',
        description: 'Physical decline is significant, but reputation is strong'
      };
    case 'old':
      return {
        category,
        label: 'Old',
        color: 'text-red-400',
        description: 'A living legend, but time takes its toll on all'
      };
    default:
      return {
        category,
        label: 'Unknown',
        color: 'text-gray-400',
        description: ''
      };
  }
}

/**
 * Generate random age for new gladiator based on origin
 */
export function generateAge(origin: string): number {
  switch (origin) {
    case 'pow':          // Prisoners of War - usually young soldiers
      return 18 + Math.floor(Math.random() * 12); // 18-29
    case 'criminal':     // Criminals - varied ages
      return 20 + Math.floor(Math.random() * 15); // 20-34
    case 'volunteer':    // Volunteers - often desperate, any age
      return 18 + Math.floor(Math.random() * 20); // 18-37
    case 'elite':        // Elite fighters - prime age
      return 22 + Math.floor(Math.random() * 8);  // 22-29
    default:
      return 20 + Math.floor(Math.random() * 10); // 20-29 default
  }
}
