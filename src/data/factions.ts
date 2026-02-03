// Political factions in Rome
export interface Faction {
  id: string;
  name: string;
  description: string;
  leader: string;
  icon: string;
  color: string;
  ideology: string;
  rivalFaction: string; // Opposing faction ID
  benefits: FactionBenefit[];
  penalties: FactionPenalty[];
}

export interface FactionBenefit {
  favorThreshold: number; // Minimum favor to unlock
  type: 'discount' | 'income' | 'access' | 'bonus' | 'protection';
  value: number;
  description: string;
}

export interface FactionPenalty {
  favorThreshold: number; // Below this favor triggers penalty
  type: 'tax' | 'ban' | 'sabotage_risk' | 'price_increase';
  value: number;
  description: string;
}

export interface PoliticalAction {
  id: string;
  name: string;
  description: string;
  type: 'gift' | 'bribe' | 'service' | 'sabotage' | 'alliance';
  targetFaction?: string; // If specific to a faction
  cost: number;
  favorChange: number;
  rivalFavorChange?: number; // Negative impact on rival
  successChance: number; // Percentage
  riskLevel: 'low' | 'medium' | 'high';
  consequences?: {
    onSuccess: string;
    onFailure: string;
  };
  cooldownDays: number;
  requiredFavor?: number;
  icon: string;
}

export interface SabotageEvent {
  id: string;
  name: string;
  description: string;
  perpetrator: string; // Faction ID or 'rival_ludus'
  severity: 'minor' | 'moderate' | 'severe';
  effects: {
    type: 'gold_loss' | 'gladiator_injury' | 'building_damage' | 'fame_loss' | 'staff_quit';
    value: number;
    target?: string; // Specific gladiator/building ID
  }[];
  preventable: boolean;
  preventionCost: number;
}

// The four main factions
export const FACTIONS: Record<string, Faction> = {
  optimates: {
    id: 'optimates',
    name: 'Optimates',
    description: 'The conservative aristocratic faction, defenders of senatorial privilege and tradition.',
    leader: 'Senator Marcus Cato',
    icon: '🏛️',
    color: '#8B4513',
    ideology: 'Conservative traditionalists who value order, hierarchy, and the old ways of Rome.',
    rivalFaction: 'populares',
    benefits: [
      { favorThreshold: 25, type: 'discount', value: 10, description: '10% discount on equipment' },
      { favorThreshold: 50, type: 'access', value: 1, description: 'Access to noble tournaments' },
      { favorThreshold: 75, type: 'income', value: 50, description: '+50 gold daily patronage' },
      { favorThreshold: 90, type: 'protection', value: 50, description: '50% sabotage protection' },
    ],
    penalties: [
      { favorThreshold: -25, type: 'price_increase', value: 15, description: '15% higher prices' },
      { favorThreshold: -50, type: 'ban', value: 1, description: 'Banned from noble events' },
      { favorThreshold: -75, type: 'sabotage_risk', value: 30, description: '30% sabotage risk' },
    ],
  },
  populares: {
    id: 'populares',
    name: 'Populares',
    description: 'The reform faction championing the common people and challenging aristocratic power.',
    leader: 'Tribune Gaius Gracchus',
    icon: '✊',
    color: '#B22222',
    ideology: 'Reformers who seek to redistribute power and wealth to the common citizens of Rome.',
    rivalFaction: 'optimates',
    benefits: [
      { favorThreshold: 25, type: 'bonus', value: 15, description: '+15% crowd favor in arena' },
      { favorThreshold: 50, type: 'discount', value: 20, description: '20% cheaper gladiator recruitment' },
      { favorThreshold: 75, type: 'income', value: 40, description: '+40 gold from merchandise' },
      { favorThreshold: 90, type: 'bonus', value: 10, description: '+10% fame gain' },
    ],
    penalties: [
      { favorThreshold: -25, type: 'tax', value: 10, description: '10% additional taxes' },
      { favorThreshold: -50, type: 'sabotage_risk', value: 20, description: '20% sabotage risk' },
      { favorThreshold: -75, type: 'ban', value: 1, description: 'Banned from public games' },
    ],
  },
  military: {
    id: 'military',
    name: 'Military Legion',
    description: 'The military establishment, veterans and generals who wield considerable political power.',
    leader: 'General Lucius Sulla',
    icon: '⚔️',
    color: '#4169E1',
    ideology: 'Military pragmatists who believe in strength, discipline, and Roman expansion.',
    rivalFaction: 'merchants',
    benefits: [
      { favorThreshold: 25, type: 'bonus', value: 10, description: '+10% gladiator combat stats' },
      { favorThreshold: 50, type: 'discount', value: 25, description: '25% cheaper weapons & armor' },
      { favorThreshold: 75, type: 'access', value: 1, description: 'Access to veteran gladiators' },
      { favorThreshold: 90, type: 'bonus', value: 20, description: '+20% training effectiveness' },
    ],
    penalties: [
      { favorThreshold: -25, type: 'price_increase', value: 20, description: '20% higher weapon prices' },
      { favorThreshold: -50, type: 'ban', value: 1, description: 'No veteran gladiator access' },
      { favorThreshold: -75, type: 'sabotage_risk', value: 40, description: '40% sabotage risk' },
    ],
  },
  merchants: {
    id: 'merchants',
    name: 'Merchant Guild',
    description: 'The wealthy merchant class controlling trade routes and commerce throughout Rome.',
    leader: 'Guildmaster Publius Crassus',
    icon: '💰',
    color: '#DAA520',
    ideology: 'Pragmatic businessmen focused on profit, trade, and economic influence.',
    rivalFaction: 'military',
    benefits: [
      { favorThreshold: 25, type: 'discount', value: 15, description: '15% discount on all purchases' },
      { favorThreshold: 50, type: 'income', value: 30, description: '+30 gold daily trade income' },
      { favorThreshold: 75, type: 'access', value: 1, description: 'Access to rare goods market' },
      { favorThreshold: 90, type: 'bonus', value: 25, description: '+25% merchandise income' },
    ],
    penalties: [
      { favorThreshold: -25, type: 'price_increase', value: 25, description: '25% higher market prices' },
      { favorThreshold: -50, type: 'ban', value: 1, description: 'Banned from marketplace deals' },
      { favorThreshold: -75, type: 'tax', value: 20, description: '20% trade tax' },
    ],
  },
};

// Political actions available to the player
export const POLITICAL_ACTIONS: PoliticalAction[] = [
  // Generic actions
  {
    id: 'small_gift',
    name: 'Small Gift',
    description: 'Send a modest gift to curry favor with a faction.',
    type: 'gift',
    cost: 50,
    favorChange: 5,
    successChance: 100,
    riskLevel: 'low',
    cooldownDays: 3,
    icon: '🎁',
  },
  {
    id: 'generous_donation',
    name: 'Generous Donation',
    description: 'Make a substantial donation to a faction\'s cause.',
    type: 'gift',
    cost: 200,
    favorChange: 15,
    successChance: 100,
    riskLevel: 'low',
    cooldownDays: 7,
    icon: '💎',
  },
  {
    id: 'lavish_banquet',
    name: 'Lavish Banquet',
    description: 'Host an extravagant feast in honor of faction leaders.',
    type: 'gift',
    cost: 500,
    favorChange: 30,
    rivalFavorChange: -10,
    successChance: 100,
    riskLevel: 'low',
    cooldownDays: 14,
    icon: '🍷',
  },
  {
    id: 'bribe_official',
    name: 'Bribe Official',
    description: 'Secretly bribe a faction official for favorable treatment.',
    type: 'bribe',
    cost: 150,
    favorChange: 10,
    successChance: 80,
    riskLevel: 'medium',
    consequences: {
      onSuccess: 'The official looks the other way on your affairs.',
      onFailure: 'The bribe is discovered! Your reputation suffers.',
    },
    cooldownDays: 5,
    icon: '🤫',
  },
  {
    id: 'dedicate_victory',
    name: 'Dedicate Victory',
    description: 'Publicly dedicate your next arena victory to a faction.',
    type: 'service',
    cost: 0,
    favorChange: 8,
    rivalFavorChange: -5,
    successChance: 100,
    riskLevel: 'low',
    cooldownDays: 1,
    icon: '🏆',
  },
  {
    id: 'political_marriage',
    name: 'Political Marriage',
    description: 'Arrange a marriage alliance with a faction member.',
    type: 'alliance',
    cost: 1000,
    favorChange: 50,
    rivalFavorChange: -25,
    successChance: 90,
    riskLevel: 'medium',
    requiredFavor: 30,
    cooldownDays: 60,
    icon: '💍',
  },
  // Sabotage actions (against rival factions or ludi)
  {
    id: 'spread_rumors',
    name: 'Spread Rumors',
    description: 'Spread damaging rumors about a rival faction.',
    type: 'sabotage',
    cost: 75,
    favorChange: 0,
    rivalFavorChange: -10,
    successChance: 85,
    riskLevel: 'medium',
    consequences: {
      onSuccess: 'The rumors spread like wildfire.',
      onFailure: 'You\'re caught spreading lies. Both factions are angry.',
    },
    cooldownDays: 7,
    icon: '🗣️',
  },
  {
    id: 'sabotage_rival_ludus',
    name: 'Sabotage Rival Ludus',
    description: 'Hire agents to disrupt a competing ludus.',
    type: 'sabotage',
    cost: 300,
    favorChange: 0,
    successChance: 70,
    riskLevel: 'high',
    consequences: {
      onSuccess: 'The rival ludus suffers setbacks.',
      onFailure: 'Your agents are caught! Expect retaliation.',
    },
    cooldownDays: 14,
    icon: '🔥',
  },
  {
    id: 'poison_gladiator',
    name: 'Poison Enemy Gladiator',
    description: 'Attempt to weaken an opponent\'s gladiator before a match.',
    type: 'sabotage',
    cost: 200,
    favorChange: 0,
    successChance: 60,
    riskLevel: 'high',
    consequences: {
      onSuccess: 'The gladiator falls ill before the match.',
      onFailure: 'Your poisoner is caught! Severe consequences follow.',
    },
    cooldownDays: 21,
    icon: '☠️',
  },
  {
    id: 'hire_assassin',
    name: 'Hire Assassin',
    description: 'Attempt to eliminate a troublesome rival permanently.',
    type: 'sabotage',
    cost: 1000,
    favorChange: 0,
    successChance: 40,
    riskLevel: 'high',
    requiredFavor: -50, // Must be hated by target faction
    consequences: {
      onSuccess: 'The target is eliminated. No one suspects you.',
      onFailure: 'The assassination fails! You\'re implicated in the plot.',
    },
    cooldownDays: 60,
    icon: '🗡️',
  },
];

// Possible sabotage events that can happen to the player
export const SABOTAGE_EVENTS: SabotageEvent[] = [
  {
    id: 'stolen_gold',
    name: 'Treasury Theft',
    description: 'Thieves have broken into your treasury and stolen gold.',
    perpetrator: 'rival_ludus',
    severity: 'minor',
    effects: [{ type: 'gold_loss', value: 100 }],
    preventable: true,
    preventionCost: 50,
  },
  {
    id: 'poisoned_water',
    name: 'Poisoned Water Supply',
    description: 'Your water supply has been poisoned, injuring gladiators.',
    perpetrator: 'rival_ludus',
    severity: 'moderate',
    effects: [
      { type: 'gladiator_injury', value: 2 }, // 2 gladiators injured
      { type: 'gold_loss', value: 50 },
    ],
    preventable: true,
    preventionCost: 100,
  },
  {
    id: 'arson_attack',
    name: 'Arson Attack',
    description: 'Your buildings have been set on fire causing significant damage.',
    perpetrator: 'rival_ludus',
    severity: 'severe',
    effects: [
      { type: 'building_damage', value: 1 },
      { type: 'gold_loss', value: 200 },
    ],
    preventable: true,
    preventionCost: 150,
  },
  {
    id: 'slander_campaign',
    name: 'Slander Campaign',
    description: 'Rumors are being spread about your ludus, damaging your reputation.',
    perpetrator: 'optimates',
    severity: 'minor',
    effects: [{ type: 'fame_loss', value: 25 }],
    preventable: true,
    preventionCost: 75,
  },
  {
    id: 'staff_poaching',
    name: 'Staff Poaching',
    description: 'A rival has lured away some of your staff with better offers.',
    perpetrator: 'merchants',
    severity: 'moderate',
    effects: [{ type: 'staff_quit', value: 1 }],
    preventable: true,
    preventionCost: 100,
  },
  {
    id: 'gladiator_assassination',
    name: 'Gladiator Assassination',
    description: 'An assassin has gravely wounded one of your gladiators.',
    perpetrator: 'military',
    severity: 'severe',
    effects: [
      { type: 'gladiator_injury', value: 1 },
      { type: 'fame_loss', value: 50 },
    ],
    preventable: true,
    preventionCost: 200,
  },
];

// Helper functions
export const getFaction = (factionId: string): Faction | undefined => {
  return FACTIONS[factionId];
};

export const getFactionBenefits = (factionId: string, favor: number): FactionBenefit[] => {
  const faction = FACTIONS[factionId];
  if (!faction) return [];
  return faction.benefits.filter(b => favor >= b.favorThreshold);
};

export const getFactionPenalties = (factionId: string, favor: number): FactionPenalty[] => {
  const faction = FACTIONS[factionId];
  if (!faction) return [];
  return faction.penalties.filter(p => favor <= p.favorThreshold);
};

export const calculateFactionModifiers = (
  factionFavors: Record<string, number>
): {
  discounts: { source: string; value: number }[];
  income: { source: string; value: number }[];
  bonuses: { source: string; type: string; value: number }[];
  penalties: { source: string; type: string; value: number }[];
} => {
  const result = {
    discounts: [] as { source: string; value: number }[],
    income: [] as { source: string; value: number }[],
    bonuses: [] as { source: string; type: string; value: number }[],
    penalties: [] as { source: string; type: string; value: number }[],
  };

  Object.entries(factionFavors).forEach(([factionId, favor]) => {
    const faction = FACTIONS[factionId];
    if (!faction) return;

    // Add benefits
    faction.benefits.forEach(benefit => {
      if (favor >= benefit.favorThreshold) {
        if (benefit.type === 'discount') {
          result.discounts.push({ source: faction.name, value: benefit.value });
        } else if (benefit.type === 'income') {
          result.income.push({ source: faction.name, value: benefit.value });
        } else {
          result.bonuses.push({ source: faction.name, type: benefit.type, value: benefit.value });
        }
      }
    });

    // Add penalties
    faction.penalties.forEach(penalty => {
      if (favor <= penalty.favorThreshold) {
        result.penalties.push({ source: faction.name, type: penalty.type, value: penalty.value });
      }
    });
  });

  return result;
};

export const getAvailableActions = (
  factionFavors: Record<string, number>,
  cooldowns: Record<string, number>
): PoliticalAction[] => {
  return POLITICAL_ACTIONS.filter(action => {
    // Check cooldown
    if (cooldowns[action.id] && cooldowns[action.id] > 0) {
      return false;
    }
    // Check required favor if applicable
    if (action.requiredFavor !== undefined) {
      const requiredFavor = action.requiredFavor;
      // For negative requirements (like assassin), check if any faction has low enough favor
      if (requiredFavor < 0) {
        return Object.values(factionFavors).some(f => f <= requiredFavor);
      }
      // For positive requirements, check if target faction has high enough favor
      return Object.values(factionFavors).some(f => f >= requiredFavor);
    }
    return true;
  });
};

export const checkSabotageRisk = (
  factionFavors: Record<string, number>,
  protectionLevel: number
): { willOccur: boolean; event?: SabotageEvent } => {
  // Calculate total sabotage risk from faction penalties
  let totalRisk = 0;
  Object.entries(factionFavors).forEach(([factionId, favor]) => {
    const faction = FACTIONS[factionId];
    if (!faction) return;
    
    faction.penalties.forEach(penalty => {
      if (favor <= penalty.favorThreshold && penalty.type === 'sabotage_risk') {
        totalRisk += penalty.value;
      }
    });
  });

  // Apply protection
  totalRisk = Math.max(0, totalRisk - protectionLevel);

  // Roll for sabotage
  if (Math.random() * 100 < totalRisk) {
    const event = SABOTAGE_EVENTS[Math.floor(Math.random() * SABOTAGE_EVENTS.length)];
    return { willOccur: true, event };
  }

  return { willOccur: false };
};

export const getFavorLevel = (favor: number): {
  level: string;
  color: string;
  description: string;
} => {
  if (favor >= 75) return { level: 'Allied', color: 'text-health-high', description: 'Strong ally' };
  if (favor >= 50) return { level: 'Friendly', color: 'text-roman-gold-400', description: 'Good relations' };
  if (favor >= 25) return { level: 'Favorable', color: 'text-blue-400', description: 'Positive standing' };
  if (favor >= 0) return { level: 'Neutral', color: 'text-roman-marble-400', description: 'No strong feelings' };
  if (favor >= -25) return { level: 'Unfavorable', color: 'text-orange-400', description: 'Some tensions' };
  if (favor >= -50) return { level: 'Hostile', color: 'text-roman-crimson-400', description: 'Active opposition' };
  return { level: 'Enemy', color: 'text-roman-crimson-600', description: 'Sworn enemies' };
};
