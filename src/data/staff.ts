import type { StaffRole } from '@/types';

export interface StaffSkill {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  prerequisite?: string;
  effects: { stat: string; value: number; isPercentage: boolean }[];
}

export interface StaffRoleData {
  id: StaffRole;
  name: string;
  description: string;
  icon: string;
  hireCost: number;
  dailyWage: number;
  monthlyWage: number; // dailyWage * 30
  primaryBonus: string;
  synergyBuilding?: string;
  skills: StaffSkill[];
  maxCount: number; // How many of this role can be hired
}

export const STAFF_ROLES: Record<StaffRole, StaffRoleData> = {
  doctore: {
    id: 'doctore',
    name: 'Doctore',
    description: 'Chief trainer who oversees all gladiator training. Essential for effective combat preparation.',
    icon: '🎓',
    hireCost: 200,
    dailyWage: 5,
    monthlyWage: 150,
    primaryBonus: '+25% Training XP',
    synergyBuilding: 'palus',
    maxCount: 1,
    skills: [
      {
        id: 'doctore_drill_master',
        name: 'Drill Master',
        description: 'Intensive training routines',
        tier: 1,
        effects: [{ stat: 'trainingXP', value: 15, isPercentage: true }],
      },
      {
        id: 'doctore_weapon_expert',
        name: 'Weapon Expert',
        description: 'Specialized weapon training',
        tier: 2,
        prerequisite: 'doctore_drill_master',
        effects: [
          { stat: 'weaponSkillGain', value: 20, isPercentage: true },
          { stat: 'trainingXP', value: 10, isPercentage: true },
        ],
      },
      {
        id: 'doctore_legendary_trainer',
        name: 'Legendary Trainer',
        description: 'Train champions',
        tier: 3,
        prerequisite: 'doctore_weapon_expert',
        effects: [
          { stat: 'trainingXP', value: 25, isPercentage: true },
          { stat: 'skillPointGain', value: 1, isPercentage: false },
        ],
      },
    ],
  },

  medicus: {
    id: 'medicus',
    name: 'Medicus',
    description: 'Physician who treats injuries and maintains gladiator health. Required for the Valetudinarium.',
    icon: '⚕️',
    hireCost: 150,
    dailyWage: 4,
    monthlyWage: 120,
    primaryBonus: '+30% Healing Speed',
    synergyBuilding: 'valetudinarium',
    maxCount: 2,
    skills: [
      {
        id: 'medicus_field_medicine',
        name: 'Field Medicine',
        description: 'Quick treatment techniques',
        tier: 1,
        effects: [{ stat: 'healingSpeed', value: 20, isPercentage: true }],
      },
      {
        id: 'medicus_surgeon',
        name: 'Surgeon',
        description: 'Can perform complex surgeries',
        tier: 2,
        prerequisite: 'medicus_field_medicine',
        effects: [
          { stat: 'healingSpeed', value: 15, isPercentage: true },
          { stat: 'permanentInjuryChance', value: -25, isPercentage: true },
        ],
      },
      {
        id: 'medicus_master_healer',
        name: 'Master Healer',
        description: 'Legendary healing abilities',
        tier: 3,
        prerequisite: 'medicus_surgeon',
        effects: [
          { stat: 'healingSpeed', value: 25, isPercentage: true },
          { stat: 'deathChance', value: -20, isPercentage: true },
        ],
      },
    ],
  },

  lanista: {
    id: 'lanista',
    name: 'Lanista',
    description: 'Manager who handles contracts, negotiations, and business dealings. Improves income and reputation.',
    icon: '📜',
    hireCost: 300,
    dailyWage: 6,
    monthlyWage: 180,
    primaryBonus: '+20% Gold from Fights',
    maxCount: 1,
    skills: [
      {
        id: 'lanista_negotiator',
        name: 'Negotiator',
        description: 'Better fight contracts',
        tier: 1,
        effects: [{ stat: 'fightGold', value: 15, isPercentage: true }],
      },
      {
        id: 'lanista_promoter',
        name: 'Promoter',
        description: 'Increased fame from victories',
        tier: 2,
        prerequisite: 'lanista_negotiator',
        effects: [
          { stat: 'fameGain', value: 20, isPercentage: true },
          { stat: 'fightGold', value: 10, isPercentage: true },
        ],
      },
      {
        id: 'lanista_master_dealer',
        name: 'Master Dealer',
        description: 'Exceptional business acumen',
        tier: 3,
        prerequisite: 'lanista_promoter',
        effects: [
          { stat: 'fightGold', value: 25, isPercentage: true },
          { stat: 'marketPrices', value: -10, isPercentage: true },
        ],
      },
    ],
  },

  faber: {
    id: 'faber',
    name: 'Faber',
    description: 'Blacksmith and craftsman who maintains equipment and can forge new weapons. Required for the Armamentarium.',
    icon: '🔨',
    hireCost: 175,
    dailyWage: 4,
    monthlyWage: 120,
    primaryBonus: '-25% Equipment Repair Cost',
    synergyBuilding: 'armamentarium',
    maxCount: 2,
    skills: [
      {
        id: 'faber_maintenance',
        name: 'Equipment Maintenance',
        description: 'Keep equipment in top shape',
        tier: 1,
        effects: [{ stat: 'equipmentDurability', value: 20, isPercentage: true }],
      },
      {
        id: 'faber_weaponsmith',
        name: 'Weaponsmith',
        description: 'Craft better weapons',
        tier: 2,
        prerequisite: 'faber_maintenance',
        effects: [
          { stat: 'weaponDamage', value: 10, isPercentage: true },
          { stat: 'craftingCost', value: -15, isPercentage: true },
        ],
      },
      {
        id: 'faber_master_smith',
        name: 'Master Smith',
        description: 'Create legendary equipment',
        tier: 3,
        prerequisite: 'faber_weaponsmith',
        effects: [
          { stat: 'weaponDamage', value: 15, isPercentage: true },
          { stat: 'armorValue', value: 15, isPercentage: true },
          { stat: 'legendaryChance', value: 10, isPercentage: true },
        ],
      },
    ],
  },

  coquus: {
    id: 'coquus',
    name: 'Coquus',
    description: 'Cook who prepares meals for gladiators. Better food improves morale and recovery.',
    icon: '👨‍🍳',
    hireCost: 100,
    dailyWage: 3,
    monthlyWage: 90,
    primaryBonus: '+15% Nutrition Effectiveness',
    synergyBuilding: 'taberna',
    maxCount: 2,
    skills: [
      {
        id: 'coquus_hearty_meals',
        name: 'Hearty Meals',
        description: 'Filling and nutritious food',
        tier: 1,
        effects: [{ stat: 'nutritionValue', value: 15, isPercentage: true }],
      },
      {
        id: 'coquus_special_diet',
        name: 'Special Diet',
        description: 'Optimized gladiator nutrition',
        tier: 2,
        prerequisite: 'coquus_hearty_meals',
        effects: [
          { stat: 'staminaRecovery', value: 20, isPercentage: true },
          { stat: 'nutritionValue', value: 10, isPercentage: true },
        ],
      },
      {
        id: 'coquus_master_chef',
        name: 'Master Chef',
        description: 'Legendary culinary skills',
        tier: 3,
        prerequisite: 'coquus_special_diet',
        effects: [
          { stat: 'morale', value: 15, isPercentage: false },
          { stat: 'healingSpeed', value: 10, isPercentage: true },
          { stat: 'nutritionValue', value: 15, isPercentage: true },
        ],
      },
    ],
  },

  guard: {
    id: 'guard',
    name: 'Guard',
    description: 'Security personnel who prevent escapes and maintain order. Essential for rebellious gladiators.',
    icon: '💂',
    hireCost: 75,
    dailyWage: 2,
    monthlyWage: 60,
    primaryBonus: '+10 Security Rating',
    synergyBuilding: 'walls',
    maxCount: 5,
    skills: [
      {
        id: 'guard_vigilant',
        name: 'Vigilant',
        description: 'Always alert',
        tier: 1,
        effects: [{ stat: 'securityRating', value: 5, isPercentage: false }],
      },
      {
        id: 'guard_intimidating',
        name: 'Intimidating',
        description: 'Deter troublemakers',
        tier: 2,
        prerequisite: 'guard_vigilant',
        effects: [
          { stat: 'rebellionChance', value: -15, isPercentage: true },
          { stat: 'securityRating', value: 5, isPercentage: false },
        ],
      },
      {
        id: 'guard_elite',
        name: 'Elite Guard',
        description: 'Unbreakable security',
        tier: 3,
        prerequisite: 'guard_intimidating',
        effects: [
          { stat: 'escapeChance', value: -50, isPercentage: true },
          { stat: 'securityRating', value: 10, isPercentage: false },
        ],
      },
    ],
  },

  lorarius: {
    id: 'lorarius',
    name: 'Lorarius',
    description: 'Disciplinarian who maintains obedience through punishment. Harsh but effective.',
    icon: '⛓️',
    hireCost: 100,
    dailyWage: 3,
    monthlyWage: 90,
    primaryBonus: '+20% Obedience',
    maxCount: 1,
    skills: [
      {
        id: 'lorarius_strict',
        name: 'Strict Discipline',
        description: 'Enforce rules firmly',
        tier: 1,
        effects: [{ stat: 'obedience', value: 15, isPercentage: true }],
      },
      {
        id: 'lorarius_fear',
        name: 'Instill Fear',
        description: 'Gladiators fear disobedience',
        tier: 2,
        prerequisite: 'lorarius_strict',
        effects: [
          { stat: 'obedience', value: 20, isPercentage: true },
          { stat: 'morale', value: -10, isPercentage: false },
        ],
      },
      {
        id: 'lorarius_iron_will',
        name: 'Iron Will',
        description: 'Absolute control',
        tier: 3,
        prerequisite: 'lorarius_fear',
        effects: [
          { stat: 'rebellionChance', value: -40, isPercentage: true },
          { stat: 'escapeChance', value: -30, isPercentage: true },
        ],
      },
    ],
  },
};

// Staff satisfaction factors
export interface SatisfactionFactors {
  wagePaid: boolean;
  wageBonus: number; // percentage above base
  workload: 'light' | 'normal' | 'heavy';
  livingConditions: 'poor' | 'standard' | 'good';
  daysUnpaid: number;
}

// Calculate staff satisfaction (0-100)
export const calculateSatisfaction = (factors: SatisfactionFactors): number => {
  let satisfaction = 70; // Base satisfaction
  
  // Wage factors
  if (!factors.wagePaid) {
    satisfaction -= 20;
  }
  satisfaction += factors.wageBonus * 0.5; // Bonus wages increase satisfaction
  
  // Unpaid days penalty
  satisfaction -= factors.daysUnpaid * 5;
  
  // Workload
  if (factors.workload === 'heavy') {
    satisfaction -= 15;
  } else if (factors.workload === 'light') {
    satisfaction += 10;
  }
  
  // Living conditions
  if (factors.livingConditions === 'poor') {
    satisfaction -= 15;
  } else if (factors.livingConditions === 'good') {
    satisfaction += 15;
  }
  
  return Math.max(0, Math.min(100, satisfaction));
};

// Check if staff member quits due to low satisfaction
export const checkStaffQuit = (satisfaction: number, daysUnpaid: number): boolean => {
  // 5% base chance to quit at 50 satisfaction
  // Increases as satisfaction drops
  // Also increases with unpaid days
  if (satisfaction > 80) return false;
  
  const baseChance = (80 - satisfaction) / 100;
  const unpaidBonus = daysUnpaid * 0.05;
  const totalChance = baseChance + unpaidBonus;
  
  return Math.random() < totalChance;
};

// Calculate total staff bonuses
export const calculateStaffBonuses = (
  employees: { role: StaffRole; level: number; skills: string[] }[],
  buildings: { type: string; level: number }[]
): Record<string, number> => {
  const bonuses: Record<string, number> = {};
  
  employees.forEach(employee => {
    const roleData = STAFF_ROLES[employee.role];
    
    // Base bonus from role
    // (simplified - actual bonus depends on role)
    
    // Synergy bonus with building
    let synergyMultiplier = 1;
    if (roleData.synergyBuilding) {
      const building = buildings.find(b => b.type === roleData.synergyBuilding);
      if (building) {
        synergyMultiplier = 1 + (building.level * 0.15); // 15/30/45% bonus
      }
    }
    
    // Add skill bonuses
    employee.skills.forEach(skillId => {
      const skill = roleData.skills.find(s => s.id === skillId);
      if (skill) {
        skill.effects.forEach(effect => {
          const currentValue = bonuses[effect.stat] || 0;
          bonuses[effect.stat] = currentValue + (effect.value * synergyMultiplier);
        });
      }
    });
  });
  
  return bonuses;
};

// Calculate total daily wage cost
export const calculateDailyWageCost = (
  employees: { role: StaffRole }[]
): number => {
  return employees.reduce((total, emp) => {
    return total + STAFF_ROLES[emp.role].dailyWage;
  }, 0);
};

// Generate staff member for hiring
export const generateStaffForHire = (role: StaffRole): {
  name: string;
  role: StaffRole;
  hireCost: number;
  dailyWage: number;
  quality: 'poor' | 'average' | 'good' | 'excellent';
} => {
  const roleData = STAFF_ROLES[role];
  
  // Random quality affects cost and effectiveness
  const qualityRoll = Math.random();
  let quality: 'poor' | 'average' | 'good' | 'excellent';
  let costMultiplier: number;
  
  if (qualityRoll < 0.2) {
    quality = 'poor';
    costMultiplier = 0.7;
  } else if (qualityRoll < 0.6) {
    quality = 'average';
    costMultiplier = 1.0;
  } else if (qualityRoll < 0.9) {
    quality = 'good';
    costMultiplier = 1.3;
  } else {
    quality = 'excellent';
    costMultiplier = 1.6;
  }
  
  // Generate Roman-style name
  const firstNames = ['Marcus', 'Gaius', 'Lucius', 'Titus', 'Quintus', 'Publius', 'Gnaeus', 'Aulus'];
  const familyNames = ['Aurelius', 'Claudius', 'Cornelius', 'Flavius', 'Julius', 'Valerius', 'Cassius', 'Brutus'];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${familyNames[Math.floor(Math.random() * familyNames.length)]}`;
  
  return {
    name,
    role,
    hireCost: Math.round(roleData.hireCost * costMultiplier),
    dailyWage: Math.round(roleData.dailyWage * costMultiplier),
    quality,
  };
};

// Get available staff for hire (randomized pool)
export const generateStaffMarket = (): ReturnType<typeof generateStaffForHire>[] => {
  const roles = Object.keys(STAFF_ROLES) as StaffRole[];
  const market: ReturnType<typeof generateStaffForHire>[] = [];
  
  // Generate 3-5 random staff members
  const count = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    market.push(generateStaffForHire(role));
  }
  
  return market;
};
