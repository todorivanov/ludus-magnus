// Quest system types and data

export type QuestType = 'story' | 'side' | 'daily' | 'event';
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

export interface QuestCondition {
  type: 'fame' | 'gold' | 'gladiators' | 'wins' | 'buildings' | 'day' | 'faction_favor' | 'quest_complete';
  target?: string; // Specific gladiator, building, or quest ID
  value: number;
  comparison: 'gte' | 'lte' | 'eq';
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'win_matches' | 'earn_gold' | 'gain_fame' | 'recruit_gladiator' | 'build' | 'train' | 'hire_staff' | 'reach_favor' | 'custom';
  target?: string;
  required: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'gold' | 'fame' | 'gladiator' | 'item' | 'unlock' | 'faction_favor';
  value: number;
  target?: string; // Specific item, gladiator class, or faction
  description: string;
}

export interface QuestChoice {
  id: string;
  text: string;
  consequences: {
    type: 'favor' | 'gold' | 'fame' | 'unlock' | 'quest';
    target?: string;
    value: number;
  }[];
  nextDialogue?: string;
  requiresCondition?: QuestCondition;
}

export interface QuestDialogue {
  id: string;
  speaker: string;
  portrait?: string;
  text: string;
  choices?: QuestChoice[];
  nextDialogue?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  chapter?: number; // For story quests
  
  // Conditions
  unlockConditions: QuestCondition[];
  failConditions?: QuestCondition[];
  
  // Objectives
  objectives: Omit<QuestObjective, 'current' | 'completed'>[];
  
  // Rewards
  rewards: QuestReward[];
  
  // Dialogue/Story
  introDialogue?: QuestDialogue[];
  completionDialogue?: QuestDialogue[];
  
  // Timing
  timeLimit?: number; // Days to complete
  repeatable: boolean;
  cooldownDays?: number;
  
  // Visual
  icon: string;
}

// Main Story Quests (Chapter-based progression)
export const STORY_QUESTS: Quest[] = [
  {
    id: 'story_1_beginnings',
    title: 'Humble Beginnings',
    description: 'Your journey as a lanista begins. Establish your ludus and prove your worth.',
    type: 'story',
    chapter: 1,
    unlockConditions: [],
    objectives: [
      { id: 'recruit_first', description: 'Recruit your first gladiator', type: 'recruit_gladiator', required: 1 },
      { id: 'win_first', description: 'Win your first arena match', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 100, description: '+100 Gold' },
      { type: 'fame', value: 25, description: '+25 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Narrator',
        text: 'Rome, 73 BC. The Republic trembles with political intrigue, but the arena remains eternal. You have purchased a small ludus on the outskirts of Capua, determined to make your mark.',
        nextDialogue: 'intro_2',
      },
      {
        id: 'intro_2',
        speaker: 'Old Lanista',
        portrait: '👴',
        text: 'So, you\'re the new owner? I\'ve seen many try and fail in this business. The arena is unforgiving. First, you\'ll need fighters. Visit the slave market.',
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Old Lanista',
        portrait: '👴',
        text: 'Not bad for a beginner. Your gladiator shows promise. But this is just the beginning - greater challenges await.',
      },
    ],
    icon: '🏛️',
    repeatable: false,
  },
  {
    id: 'story_2_reputation',
    title: 'Building a Reputation',
    description: 'Word spreads of your ludus. Win more matches and expand your facilities.',
    type: 'story',
    chapter: 2,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_1_beginnings', value: 1, comparison: 'gte' },
    ],
    objectives: [
      { id: 'win_five', description: 'Win 5 arena matches', type: 'win_matches', required: 5 },
      { id: 'build_training', description: 'Build a training facility', type: 'build', target: 'palus', required: 1 },
      { id: 'reach_fame', description: 'Reach 100 fame', type: 'gain_fame', required: 100 },
    ],
    rewards: [
      { type: 'gold', value: 250, description: '+250 Gold' },
      { type: 'fame', value: 50, description: '+50 Fame' },
      { type: 'unlock', value: 1, target: 'regional_tournaments', description: 'Unlock Regional Tournaments' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Messenger',
        portrait: '📜',
        text: 'A message from the local magistrate! Your recent victories have caught attention. They wish to see more from your ludus.',
      },
    ],
    icon: '⭐',
    repeatable: false,
  },
  {
    id: 'story_3_rivals',
    title: 'Rival Ludus',
    description: 'A competing lanista challenges your rising fame. Defeat their champion.',
    type: 'story',
    chapter: 3,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_2_reputation', value: 1, comparison: 'gte' },
      { type: 'fame', value: 150, comparison: 'gte' },
    ],
    objectives: [
      { id: 'train_champion', description: 'Train a gladiator to level 5', type: 'train', required: 5 },
      { id: 'defeat_rival', description: 'Defeat the rival champion', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 500, description: '+500 Gold' },
      { type: 'fame', value: 100, description: '+100 Fame' },
      { type: 'faction_favor', value: 15, target: 'populares', description: '+15 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Rival Lanista',
        portrait: '😠',
        text: 'So you\'re the upstart everyone\'s talking about? Your gladiators are nothing compared to mine. I challenge you to a formal duel - my champion against yours!',
        choices: [
          {
            id: 'accept',
            text: 'I accept your challenge. We\'ll meet in the arena.',
            consequences: [{ type: 'fame', value: 10 }],
          },
          {
            id: 'mock',
            text: 'Your champion will fall like all the others.',
            consequences: [{ type: 'fame', value: 15 }, { type: 'favor', target: 'populares', value: 5 }],
          },
        ],
      },
    ],
    icon: '⚔️',
    repeatable: false,
  },
  {
    id: 'story_4_politics',
    title: 'Political Entanglements',
    description: 'A senator offers patronage, but at what cost? Navigate the dangerous waters of Roman politics.',
    type: 'story',
    chapter: 4,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_3_rivals', value: 1, comparison: 'gte' },
      { type: 'fame', value: 300, comparison: 'gte' },
    ],
    objectives: [
      { id: 'gain_favor', description: 'Gain favor with a political faction', type: 'reach_favor', required: 25 },
      { id: 'host_games', description: 'Win 3 matches in Grand Munera', type: 'win_matches', required: 3 },
    ],
    rewards: [
      { type: 'gold', value: 750, description: '+750 Gold' },
      { type: 'fame', value: 150, description: '+150 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Senator Aurelius',
        portrait: '🏛️',
        text: 'Your ludus has impressed me. I could use a man of your... talents. Support my faction, and doors will open for you.',
        choices: [
          {
            id: 'optimates',
            text: 'The Optimates represent tradition and order. I will support you.',
            consequences: [{ type: 'favor', target: 'optimates', value: 20 }, { type: 'favor', target: 'populares', value: -10 }],
          },
          {
            id: 'neutral',
            text: 'I prefer to remain neutral in political matters.',
            consequences: [{ type: 'gold', value: -100 }],
          },
          {
            id: 'populares',
            text: 'I believe the people deserve better representation.',
            consequences: [{ type: 'favor', target: 'populares', value: 20 }, { type: 'favor', target: 'optimates', value: -10 }],
          },
        ],
      },
    ],
    icon: '🏛️',
    repeatable: false,
  },
  {
    id: 'story_5_colosseum',
    title: 'The Road to Rome',
    description: 'Your fame has reached the capital. Prepare for the ultimate challenge - the Colosseum.',
    type: 'story',
    chapter: 5,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_4_politics', value: 1, comparison: 'gte' },
      { type: 'fame', value: 600, comparison: 'gte' },
    ],
    objectives: [
      { id: 'legendary_gladiator', description: 'Train a gladiator to Legendary fame', type: 'gain_fame', required: 600 },
      { id: 'win_colosseum', description: 'Win a Colosseum match', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 2000, description: '+2000 Gold' },
      { type: 'fame', value: 500, description: '+500 Fame' },
      { type: 'unlock', value: 1, target: 'endless_mode', description: 'Unlock Endless Mode' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Imperial Herald',
        portrait: '👑',
        text: 'By decree of the Emperor, your ludus has been granted the honor of competing in the great Colosseum of Rome. Do not disappoint.',
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Narrator',
        text: 'Your gladiators stand victorious on the sands of the Colosseum. The crowd roars your name. You have achieved what few ever dream of - legendary status in Rome.',
      },
    ],
    icon: '👑',
    repeatable: false,
  },
];

// Side Quests (Optional content)
export const SIDE_QUESTS: Quest[] = [
  {
    id: 'side_doctor',
    title: 'The Wandering Medicus',
    description: 'A skilled doctor seeks employment. Hire him to unlock better healing.',
    type: 'side',
    unlockConditions: [
      { type: 'day', value: 10, comparison: 'gte' },
      { type: 'gladiators', value: 2, comparison: 'gte' },
    ],
    objectives: [
      { id: 'hire_medicus', description: 'Hire a Medicus', type: 'hire_staff', target: 'medicus', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 50, description: '+50 Gold' },
      { type: 'unlock', value: 1, target: 'advanced_healing', description: 'Unlock Advanced Healing' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Wandering Medicus',
        portrait: '⚕️',
        text: 'I\'ve treated soldiers across the Empire. Your gladiators deserve proper medical care. Hire me, and I\'ll keep them fighting.',
      },
    ],
    icon: '⚕️',
    repeatable: false,
  },
  {
    id: 'side_exotic',
    title: 'Exotic Fighter',
    description: 'Rumors speak of an exceptional slave from distant lands. Find and recruit them.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 200, comparison: 'gte' },
      { type: 'gold', value: 500, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recruit_exotic', description: 'Recruit a rare gladiator', type: 'recruit_gladiator', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 50, description: '+50 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Slave Trader',
        portrait: '💰',
        text: 'I have something special - a warrior from the eastern provinces. Skilled, fierce, and ready for the arena. Interested?',
      },
    ],
    icon: '🌟',
    repeatable: false,
  },
  {
    id: 'side_patron',
    title: 'Wealthy Patron',
    description: 'A wealthy merchant offers to sponsor your ludus in exchange for victories.',
    type: 'side',
    unlockConditions: [
      { type: 'wins', value: 10, comparison: 'gte' },
    ],
    objectives: [
      { id: 'win_for_patron', description: 'Win 5 matches while sponsored', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'gold', value: 300, description: '+300 Gold' },
      { type: 'faction_favor', value: 10, target: 'merchants', description: '+10 Merchant Favor' },
    ],
    timeLimit: 30,
    icon: '💰',
    repeatable: true,
    cooldownDays: 60,
  },
];

// Daily/Repeatable Quests
export const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily_training',
    title: 'Daily Training',
    description: 'Complete a day of training with your gladiators.',
    type: 'daily',
    unlockConditions: [],
    objectives: [
      { id: 'train_day', description: 'Train any gladiator', type: 'train', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 10, description: '+10 Gold' },
    ],
    icon: '🏋️',
    repeatable: true,
    cooldownDays: 1,
  },
  {
    id: 'daily_victory',
    title: 'Arena Victory',
    description: 'Win a match in the arena today.',
    type: 'daily',
    unlockConditions: [],
    objectives: [
      { id: 'win_today', description: 'Win an arena match', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 25, description: '+25 Gold' },
      { type: 'fame', value: 5, description: '+5 Fame' },
    ],
    icon: '🏆',
    repeatable: true,
    cooldownDays: 1,
  },
  {
    id: 'daily_merchant',
    title: 'Market Day',
    description: 'Make a purchase at the marketplace.',
    type: 'daily',
    unlockConditions: [],
    objectives: [
      { id: 'purchase', description: 'Buy something from the market', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'faction_favor', value: 2, target: 'merchants', description: '+2 Merchant Favor' },
    ],
    icon: '🛒',
    repeatable: true,
    cooldownDays: 1,
  },
];

// Random Events (triggered by game conditions)
export const RANDOM_EVENTS: Quest[] = [
  {
    id: 'event_rebellion',
    title: 'Gladiator Unrest',
    description: 'Your gladiators are growing restless. Address their concerns before it escalates.',
    type: 'event',
    unlockConditions: [
      { type: 'gladiators', value: 5, comparison: 'gte' },
    ],
    objectives: [
      { id: 'address_unrest', description: 'Improve gladiator morale', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 20, description: '+20 Fame' },
    ],
    failConditions: [
      { type: 'day', value: 7, comparison: 'gte' }, // Must complete within 7 days
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Doctore',
        portrait: '⚔️',
        text: 'Dominus, the gladiators are restless. They speak of poor conditions and harsh treatment. We must act before this becomes... problematic.',
        choices: [
          {
            id: 'feast',
            text: 'Provide them with a feast and extra rations.',
            consequences: [{ type: 'gold', value: -100 }],
          },
          {
            id: 'discipline',
            text: 'They need discipline, not coddling. Increase training.',
            consequences: [{ type: 'fame', value: -10 }],
          },
          {
            id: 'promise',
            text: 'Promise them freedom if they fight well.',
            consequences: [{ type: 'fame', value: 10 }],
          },
        ],
      },
    ],
    timeLimit: 7,
    icon: '⚠️',
    repeatable: true,
    cooldownDays: 30,
  },
  {
    id: 'event_visitor',
    title: 'Distinguished Visitor',
    description: 'An important dignitary wishes to visit your ludus.',
    type: 'event',
    unlockConditions: [
      { type: 'fame', value: 300, comparison: 'gte' },
    ],
    objectives: [
      { id: 'host_visitor', description: 'Host the visitor successfully', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 200, description: '+200 Gold' },
      { type: 'faction_favor', value: 15, target: 'optimates', description: '+15 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Servant',
        portrait: '👤',
        text: 'Master! A senator wishes to tour your facilities. This could be a great opportunity!',
      },
    ],
    icon: '🏛️',
    repeatable: true,
    cooldownDays: 45,
  },
];

// Combine all quests
export const ALL_QUESTS: Quest[] = [
  ...STORY_QUESTS,
  ...SIDE_QUESTS,
  ...DAILY_QUESTS,
  ...RANDOM_EVENTS,
];

// Helper functions
export const getQuestById = (id: string): Quest | undefined => {
  return ALL_QUESTS.find(q => q.id === id);
};

export const checkQuestCondition = (
  condition: QuestCondition,
  gameState: {
    fame: number;
    gold: number;
    gladiatorCount: number;
    wins: number;
    buildingCount: number;
    currentDay: number;
    factionFavors: Record<string, number>;
    completedQuests: string[];
  }
): boolean => {
  let value: number;
  
  switch (condition.type) {
    case 'fame':
      value = gameState.fame;
      break;
    case 'gold':
      value = gameState.gold;
      break;
    case 'gladiators':
      value = gameState.gladiatorCount;
      break;
    case 'wins':
      value = gameState.wins;
      break;
    case 'buildings':
      value = gameState.buildingCount;
      break;
    case 'day':
      value = gameState.currentDay;
      break;
    case 'faction_favor':
      value = condition.target ? gameState.factionFavors[condition.target] || 0 : 0;
      break;
    case 'quest_complete':
      value = condition.target && gameState.completedQuests.includes(condition.target) ? 1 : 0;
      break;
    default:
      return false;
  }
  
  switch (condition.comparison) {
    case 'gte':
      return value >= condition.value;
    case 'lte':
      return value <= condition.value;
    case 'eq':
      return value === condition.value;
    default:
      return false;
  }
};

export const getAvailableQuests = (
  gameState: Parameters<typeof checkQuestCondition>[1],
  activeQuestIds: string[],
  completedQuestIds: string[],
  questCooldowns: Record<string, number>
): Quest[] => {
  return ALL_QUESTS.filter(quest => {
    // Skip if already active
    if (activeQuestIds.includes(quest.id)) return false;
    
    // Skip if completed and not repeatable
    if (completedQuestIds.includes(quest.id) && !quest.repeatable) return false;
    
    // Skip if on cooldown
    if (questCooldowns[quest.id] && questCooldowns[quest.id] > 0) return false;
    
    // Check unlock conditions
    return quest.unlockConditions.every(cond => checkQuestCondition(cond, gameState));
  });
};

export const calculateQuestProgress = (
  _quest: Quest, // Reserved for future use (quest-specific completion rules)
  objectives: QuestObjective[]
): { completed: boolean; progress: number } => {
  const completedCount = objectives.filter(o => o.completed).length;
  const totalCount = objectives.length;
  
  return {
    completed: completedCount === totalCount,
    progress: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
  };
};
