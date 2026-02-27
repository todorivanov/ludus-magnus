/**
 * Historical Events System
 * Defines scripted and random events that occur at specific times or conditions
 */

export type EventTriggerType = 'fixed_date' | 'annual' | 'random_monthly';
export type EventCategory = 'major' | 'festival' | 'economic' | 'political';

export interface EventEffect {
  type: 
    | 'market_price_change'    // Affects resource prices
    | 'gold_change'            // Direct gold gain/loss
    | 'fame_change'            // Ludus fame modifier
    | 'tournament_unlock'      // Unlock new tournament
    | 'faction_favor'          // Change faction relationships
    | 'resource_change'        // Add/remove resources
    | 'gladiator_morale'       // Affect all gladiators
    | 'tax_payment';           // Automatic tax deduction
  
  value?: number;
  duration?: number;           // Duration in months
  resourceType?: string;
  factionId?: string;
  description: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: EventCategory;
  
  // Trigger conditions
  triggerType: EventTriggerType;
  year?: number;               // For fixed_date events
  month?: number;              // For fixed_date and annual events
  probability?: number;        // For random events (0-1)
  season?: string;             // For season-specific random events
  
  // Effects
  effects: EventEffect[];
  
  // Display
  flavor: string;              // Rich flavor text for notification
  choices?: {                  // Optional player choices
    id: string;
    text: string;
    effects: EventEffect[];
  }[];
}

// ==========================================
// MAJOR HISTORICAL EVENTS (Fixed Dates)
// ==========================================

export const MAJOR_EVENTS: HistoricalEvent[] = [
  {
    id: 'vesuvius_eruption',
    name: 'Mount Vesuvius Erupts',
    description: 'The great volcano erupts, destroying Pompeii and Herculaneum',
    icon: '🌋',
    category: 'major',
    triggerType: 'fixed_date',
    year: 79,
    month: 8, // Augustus (August)
    flavor: 'Dark ash clouds the sky as Mount Vesuvius unleashes its fury. Trade routes are disrupted and grain supplies dwindle. Refugees flood Rome seeking work and shelter.',
    effects: [
      {
        type: 'market_price_change',
        resourceType: 'grain',
        value: 1.5, // 50% increase
        duration: 3,
        description: 'Grain prices increase by 50% for 3 months'
      },
      {
        type: 'market_price_change',
        resourceType: 'gladiator',
        value: 0.8, // 20% decrease
        duration: 3,
        description: 'Gladiator prices decrease by 20% (refugees seeking work)'
      }
    ]
  },
  
  {
    id: 'colosseum_opening',
    name: 'Colosseum Grand Opening',
    description: 'The Flavian Amphitheatre opens with spectacular games',
    icon: '🏛️',
    category: 'major',
    triggerType: 'fixed_date',
    year: 80,
    month: 7, // Julius (July)
    flavor: 'Emperor Titus inaugurates the magnificent Flavian Amphitheatre! The grandest arena in the world opens its gates. New opportunities await those who prove their worth in the sands.',
    effects: [
      {
        type: 'tournament_unlock',
        description: 'Imperial Tournament type unlocked'
      },
      {
        type: 'fame_change',
        value: 50,
        description: '+50 Ludus fame bonus'
      },
      {
        type: 'gold_change',
        value: 200,
        description: '+200 gold imperial gift to all ludus'
      }
    ]
  },
  
  {
    id: 'domitian_paranoia',
    name: 'Domitian\'s Reign of Terror',
    description: 'Emperor Domitian becomes increasingly paranoid and tyrannical',
    icon: '👑',
    category: 'political',
    triggerType: 'fixed_date',
    year: 84,
    month: 1, // Januarius
    flavor: 'The Emperor grows suspicious of all. Factions maneuver in the shadows. Those who navigate these treacherous waters carefully will thrive; others will fall.',
    effects: [
      {
        type: 'faction_favor',
        factionId: 'optimates',
        value: -10,
        description: 'Senate relations become tense (-10 Optimates favor)'
      }
    ]
  },
];

// ==========================================
// ANNUAL RECURRING EVENTS
// ==========================================

export const ANNUAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'saturnalia',
    name: 'Saturnalia Festival',
    description: 'The great winter festival of Saturn brings revelry to Rome',
    icon: '🎉',
    category: 'festival',
    triggerType: 'annual',
    month: 12, // December
    flavor: 'Io Saturnalia! The city erupts in celebration. Social norms are relaxed, gifts are exchanged, and the people revel in merriment. Your gladiators enjoy the festivities!',
    effects: [
      {
        type: 'gladiator_morale',
        value: 0.2, // +20% morale
        description: 'All gladiators gain +20% morale'
      },
      {
        type: 'gold_change',
        value: 100,
        description: '+100 gold from festival merchandise'
      },
      {
        type: 'fame_change',
        value: 20,
        description: '+20 fame from public festivities'
      }
    ]
  },
  
  {
    id: 'ludi_romani',
    name: 'Ludi Romani',
    description: 'The Great Games in honor of Jupiter',
    icon: '⚡',
    category: 'festival',
    triggerType: 'annual',
    month: 9, // September
    flavor: 'The Ludi Romani begin! Rome\'s greatest spectacles honor Jupiter Optimus Maximus. Champions will earn eternal glory in these hallowed games.',
    effects: [
      {
        type: 'fame_change',
        value: 30,
        duration: 1,
        description: 'Fame gains increased by 30% this month'
      },
      {
        type: 'gold_change',
        value: 150,
        description: 'Tournament prize pools doubled'
      }
    ]
  },
  
  {
    id: 'imperial_taxes',
    name: 'Imperial Tax Collection',
    description: 'The tax collectors arrive to claim the Emperor\'s due',
    icon: '💰',
    category: 'economic',
    triggerType: 'annual',
    month: 4, // Aprilis (April)
    flavor: 'The Emperor\'s tax collectors make their rounds. All citizens must contribute to the glory of Rome... whether they wish to or not.',
    effects: [
      {
        type: 'tax_payment',
        value: 0.10, // 10% of current gold
        description: '10% gold deducted as imperial taxes'
      }
    ]
  },
  
  {
    id: 'munera_gladiatoria',
    name: 'Munera Gladiatoria',
    description: 'Traditional gladiatorial games in the Forum',
    icon: '⚔️',
    category: 'festival',
    triggerType: 'annual',
    month: 3, // Martius (March)
    flavor: 'In honor of Mars, the god of war, grand gladiatorial contests fill the Forum. Prove your worth in the traditional games!',
    effects: [
      {
        type: 'fame_change',
        value: 25,
        description: '+25 fame from participation'
      }
    ]
  },
];

// ==========================================
// RANDOM MONTHLY EVENTS
// ==========================================

export const RANDOM_EVENTS: HistoricalEvent[] = [
  {
    id: 'plague_outbreak',
    name: 'Plague Outbreak',
    description: 'Disease spreads through the city',
    icon: '🦠',
    category: 'major',
    triggerType: 'random_monthly',
    probability: 0.02, // 2% chance per month
    flavor: 'A plague strikes Rome! Many fall ill. Your infirmary staff work tirelessly to prevent the spread among your gladiators.',
    effects: [
      {
        type: 'gladiator_morale',
        value: -0.1,
        description: 'All gladiators -10% morale (fear of disease)'
      },
      {
        type: 'gold_change',
        value: -50,
        description: '-50 gold for medicine and quarantine measures'
      }
    ]
  },
  
  {
    id: 'imperial_visit',
    name: 'Imperial Visit',
    description: 'The Emperor visits Rome',
    icon: '👑',
    category: 'political',
    triggerType: 'random_monthly',
    probability: 0.05, // 5% chance per month
    season: 'summer',
    flavor: 'The Emperor graces Rome with his presence! Security is heightened, and all eyes turn to those who might gain his favor through spectacular displays.',
    effects: [
      {
        type: 'fame_change',
        value: 40,
        description: '+40 fame if ludus has high reputation'
      }
    ]
  },
  
  {
    id: 'trade_disruption',
    name: 'Trade Route Disrupted',
    description: 'Pirates or bandits disrupt major trade routes',
    icon: '🏴‍☠️',
    category: 'economic',
    triggerType: 'random_monthly',
    probability: 0.08, // 8% chance per month
    season: 'winter',
    flavor: 'Word arrives that bandits have struck a major trade caravan. Goods become scarce and expensive.',
    effects: [
      {
        type: 'market_price_change',
        resourceType: 'all',
        value: 1.25, // 25% increase
        duration: 1,
        description: 'All market prices increase by 25% this month'
      }
    ]
  },
  
  {
    id: 'wealthy_patron',
    name: 'Wealthy Patron',
    description: 'A rich patrician offers patronage',
    icon: '💎',
    category: 'economic',
    triggerType: 'random_monthly',
    probability: 0.06, // 6% chance per month
    flavor: 'A wealthy patrician, impressed by your ludus\'s reputation, offers generous patronage!',
    effects: [
      {
        type: 'gold_change',
        value: 300,
        description: '+300 gold patronage gift'
      },
      {
        type: 'faction_favor',
        factionId: 'optimates',
        value: 15,
        description: '+15 Optimates favor'
      }
    ]
  },
  
  {
    id: 'rival_challenge',
    name: 'Rival Ludus Challenge',
    description: 'A rival lanista issues a public challenge',
    icon: '🗡️',
    category: 'political',
    triggerType: 'random_monthly',
    probability: 0.10, // 10% chance per month
    flavor: 'A rival lanista publicly challenges your ludus\'s reputation! Accept the challenge or lose face.',
    effects: [], // Effects determined by player choice
    choices: [
      {
        id: 'accept_challenge',
        text: 'Accept the challenge',
        effects: [
          {
            type: 'fame_change',
            value: 30,
            description: '+30 fame if you have strong gladiators'
          }
        ]
      },
      {
        id: 'decline_challenge',
        text: 'Decline politely',
        effects: [
          {
            type: 'fame_change',
            value: -20,
            description: '-20 fame for declining'
          }
        ]
      }
    ]
  },
  
  {
    id: 'bountiful_harvest',
    name: 'Bountiful Harvest',
    description: 'An exceptional harvest floods the markets',
    icon: '🌾',
    category: 'economic',
    triggerType: 'random_monthly',
    probability: 0.07, // 7% chance per month
    season: 'autumn',
    flavor: 'The gods smile upon the land! The harvest is abundant, and grain floods the markets at low prices.',
    effects: [
      {
        type: 'market_price_change',
        resourceType: 'grain',
        value: 0.6, // 40% decrease
        duration: 2,
        description: 'Grain prices reduced by 40% for 2 months'
      }
    ]
  },
];

/**
 * Get all events that should trigger for a given month
 */
export function getEventsForMonth(
  year: number,
  month: number
): HistoricalEvent[] {
  const events: HistoricalEvent[] = [];
  
  // Check major fixed-date events
  MAJOR_EVENTS.forEach(event => {
    if (event.year === year && event.month === month) {
      events.push(event);
    }
  });
  
  // Check annual recurring events
  ANNUAL_EVENTS.forEach(event => {
    if (event.month === month) {
      events.push(event);
    }
  });
  
  // Check random events (probability-based)
  // Note: This should be called once per month and results stored/processed
  const season = getSeason(month);
  RANDOM_EVENTS.forEach(event => {
    // Check if event is season-specific
    if (event.season && event.season !== season) {
      return;
    }
    
    // Roll for random event
    if (event.probability && Math.random() < event.probability) {
      events.push(event);
    }
  });
  
  return events;
}

/**
 * Helper to get season name from month
 */
function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
