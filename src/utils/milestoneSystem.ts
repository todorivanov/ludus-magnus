/**
 * Gladiator Career Milestone System
 * Tracks and rewards gladiator achievements and longevity
 */

import type { Gladiator } from '@/types';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'time' | 'achievement' | 'survival';
  
  // Requirements
  checkFunction: (gladiator: Gladiator, currentYear: number, currentMonth: number) => boolean;
  
  // Rewards
  rewards: {
    fame?: number;
    morale?: number;
    gold?: number;
    statBonus?: { stat: string; value: number }[];
    title?: string;
  };
}

// ==========================================
// TIME-BASED MILESTONES
// ==========================================

export const TIME_MILESTONES: Milestone[] = [
  {
    id: 'service_6_months',
    name: 'Tiro',
    description: 'Completed 6 months of service',
    icon: '🔰',
    type: 'time',
    checkFunction: (gladiator) => {
      return gladiator.monthsOfService >= 6 && 
             !gladiator.milestones.some(m => m.id === 'service_6_months');
    },
    rewards: {
      morale: 0.1, // +10% morale
      title: 'Tiro'
    }
  },
  
  {
    id: 'service_12_months',
    name: 'Veteran',
    description: 'Completed 1 year of service',
    icon: '⚔️',
    type: 'time',
    checkFunction: (gladiator) => {
      return gladiator.monthsOfService >= 12 && 
             !gladiator.milestones.some(m => m.id === 'service_12_months');
    },
    rewards: {
      fame: 25,
      title: 'Veteran'
    }
  },
  
  {
    id: 'service_24_months',
    name: 'Champion',
    description: 'Completed 2 years of service',
    icon: '🏆',
    type: 'time',
    checkFunction: (gladiator) => {
      return gladiator.monthsOfService >= 24 && 
             !gladiator.milestones.some(m => m.id === 'service_24_months');
    },
    rewards: {
      fame: 50,
      statBonus: [
        { stat: 'strength', value: 2 },
        { stat: 'agility', value: 2 },
        { stat: 'dexterity', value: 2 },
        { stat: 'endurance', value: 2 },
        { stat: 'constitution', value: 2 },
      ],
      title: 'Champion'
    }
  },
  
  {
    id: 'service_36_months',
    name: 'Legend',
    description: 'Completed 3 years of service',
    icon: '👑',
    type: 'time',
    checkFunction: (gladiator) => {
      return gladiator.monthsOfService >= 36 && 
             !gladiator.milestones.some(m => m.id === 'service_36_months');
    },
    rewards: {
      fame: 100,
      gold: 500,
      title: 'Legend'
    }
  },
  
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    description: 'Another year older',
    icon: '🎂',
    type: 'time',
    checkFunction: (gladiator, currentYear, currentMonth) => {
      // Check if it's their birthday this month
      return currentMonth === gladiator.birthMonth && 
             !gladiator.milestones.some(m => 
               m.id === `birthday_${currentYear}` && 
               m.achievedYear === currentYear
             );
    },
    rewards: {
      morale: 0.05, // +5% morale
      gold: 20 // Small gift from fans
    }
  },
];

// ==========================================
// ACHIEVEMENT-BASED MILESTONES
// ==========================================

export const ACHIEVEMENT_MILESTONES: Milestone[] = [
  {
    id: 'first_victory',
    name: 'First Blood',
    description: 'Won first combat',
    icon: '⚔️',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.wins >= 1 && 
             !gladiator.milestones.some(m => m.id === 'first_victory');
    },
    rewards: {
      fame: 10
    }
  },
  
  {
    id: 'victor_10',
    name: 'Victor',
    description: 'Won 10 combats',
    icon: '🥇',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.wins >= 10 && 
             !gladiator.milestones.some(m => m.id === 'victor_10');
    },
    rewards: {
      fame: 25,
      title: 'Victor'
    }
  },
  
  {
    id: 'conqueror_25',
    name: 'Conqueror',
    description: 'Won 25 combats',
    icon: '🏆',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.wins >= 25 && 
             !gladiator.milestones.some(m => m.id === 'conqueror_25');
    },
    rewards: {
      fame: 50,
      gold: 200,
      title: 'Conqueror'
    }
  },
  
  {
    id: 'immortal_50',
    name: 'Immortal',
    description: 'Won 50 combats - A living legend',
    icon: '👑',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.wins >= 50 && 
             !gladiator.milestones.some(m => m.id === 'immortal_50');
    },
    rewards: {
      fame: 100,
      gold: 500,
      statBonus: [
        { stat: 'strength', value: 5 },
        { stat: 'agility', value: 5 },
        { stat: 'dexterity', value: 5 },
        { stat: 'endurance', value: 5 },
        { stat: 'constitution', value: 5 },
      ],
      title: 'The Immortal'
    }
  },
  
  {
    id: 'first_kill',
    name: 'Executioner\'s Debut',
    description: 'First kill in combat',
    icon: '⚰️',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.kills >= 1 && 
             !gladiator.milestones.some(m => m.id === 'first_kill');
    },
    rewards: {
      fame: 15,
      morale: -0.05 // Mixed feelings (-5%)
    }
  },
  
  {
    id: 'undefeated_5',
    name: 'Undefeated Streak',
    description: '5 consecutive victories',
    icon: '🔥',
    type: 'achievement',
    checkFunction: (gladiator) => {
      // Check if they have 5+ wins and 0 losses, or achieved milestone already
      return gladiator.wins >= 5 && 
             gladiator.losses === 0 && 
             !gladiator.milestones.some(m => m.id === 'undefeated_5');
    },
    rewards: {
      fame: 30
    }
  },
  
  {
    id: 'undefeated_10',
    name: 'Perfect Warrior',
    description: '10 consecutive victories',
    icon: '💫',
    type: 'achievement',
    checkFunction: (gladiator) => {
      return gladiator.wins >= 10 && 
             gladiator.losses === 0 && 
             !gladiator.milestones.some(m => m.id === 'undefeated_10');
    },
    rewards: {
      fame: 60,
      gold: 300
    }
  },
];

// ==========================================
// SURVIVAL MILESTONES
// ==========================================

export const SURVIVAL_MILESTONES: Milestone[] = [
  {
    id: 'survived_35',
    name: 'Survivor',
    description: 'Survived to age 35',
    icon: '🛡️',
    type: 'survival',
    checkFunction: (gladiator) => {
      return gladiator.age >= 35 && 
             !gladiator.milestones.some(m => m.id === 'survived_35');
    },
    rewards: {
      fame: 50,
      title: 'Survivor'
    }
  },
  
  {
    id: 'survived_40',
    name: 'Living Legend',
    description: 'Survived to age 40 - Defying the odds',
    icon: '⭐',
    type: 'survival',
    checkFunction: (gladiator) => {
      return gladiator.age >= 40 && 
             !gladiator.milestones.some(m => m.id === 'survived_40');
    },
    rewards: {
      fame: 100,
      gold: 400,
      title: 'Living Legend'
    }
  },
];

// All milestones combined
export const ALL_MILESTONES = [
  ...TIME_MILESTONES,
  ...ACHIEVEMENT_MILESTONES,
  ...SURVIVAL_MILESTONES,
];

/**
 * Check all milestones for a gladiator and return newly achieved ones
 */
export function checkMilestones(
  gladiator: Gladiator,
  currentYear: number,
  currentMonth: number
): Milestone[] {
  const newMilestones: Milestone[] = [];
  
  ALL_MILESTONES.forEach(milestone => {
    if (milestone.checkFunction(gladiator, currentYear, currentMonth)) {
      newMilestones.push(milestone);
    }
  });
  
  return newMilestones;
}

/**
 * Apply milestone rewards to a gladiator
 * Returns updated gladiator and notification message
 */
export function awardMilestone(
  gladiator: Gladiator,
  milestone: Milestone,
  currentYear: number,
  currentMonth: number
): {
  updates: Partial<Gladiator>;
  notification: string;
  goldReward?: number;
} {
  const updates: Partial<Gladiator> = {};
  let notification = `🏆 ${gladiator.name} achieved: ${milestone.name}!`;
  
  // Track milestone achievement
  const newMilestones = [...(gladiator.milestones || []), {
    id: milestone.id === 'birthday' ? `birthday_${currentYear}` : milestone.id,
    achievedYear: currentYear,
    achievedMonth: currentMonth
  }];
  updates.milestones = newMilestones;
  
  // Apply rewards
  if (milestone.rewards.fame) {
    updates.fame = (gladiator.fame || 0) + milestone.rewards.fame;
    notification += ` +${milestone.rewards.fame} fame`;
  }
  
  if (milestone.rewards.morale) {
    updates.morale = (gladiator.morale || 1) + milestone.rewards.morale;
    notification += ` +${Math.round(milestone.rewards.morale * 100)}% morale`;
  }
  
  if (milestone.rewards.statBonus) {
    const newStats = { ...gladiator.stats };
    milestone.rewards.statBonus.forEach(bonus => {
      const statKey = bonus.stat as keyof typeof newStats;
      newStats[statKey] = Math.min(100, newStats[statKey] + bonus.value);
    });
    updates.stats = newStats;
    notification += ` +stats`;
  }
  
  if (milestone.rewards.title) {
    const newTitles = [...(gladiator.titles || []), milestone.rewards.title];
    updates.titles = newTitles;
    notification += ` | Title: "${milestone.rewards.title}"`;
  }
  
  return {
    updates,
    notification,
    goldReward: milestone.rewards.gold
  };
}

/**
 * Get milestone progress display (e.g., "8/10 victories to Conqueror")
 */
export function getMilestoneProgress(gladiator: Gladiator): string[] {
  const progress: string[] = [];
  
  // Check progress towards unachieved milestones
  if (gladiator.wins < 10 && !gladiator.milestones.some(m => m.id === 'victor_10')) {
    progress.push(`${gladiator.wins}/10 victories to Victor`);
  } else if (gladiator.wins < 25 && !gladiator.milestones.some(m => m.id === 'conqueror_25')) {
    progress.push(`${gladiator.wins}/25 victories to Conqueror`);
  } else if (gladiator.wins < 50 && !gladiator.milestones.some(m => m.id === 'immortal_50')) {
    progress.push(`${gladiator.wins}/50 victories to Immortal`);
  }
  
  if (gladiator.monthsOfService < 12 && !gladiator.milestones.some(m => m.id === 'service_12_months')) {
    progress.push(`${gladiator.monthsOfService}/12 months to Veteran`);
  } else if (gladiator.monthsOfService < 24 && !gladiator.milestones.some(m => m.id === 'service_24_months')) {
    progress.push(`${gladiator.monthsOfService}/24 months to Champion`);
  } else if (gladiator.monthsOfService < 36 && !gladiator.milestones.some(m => m.id === 'service_36_months')) {
    progress.push(`${gladiator.monthsOfService}/36 months to Legend`);
  }
  
  return progress;
}
