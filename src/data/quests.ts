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
  type: 'win_matches' | 'earn_gold' | 'gain_fame' | 'recruit_gladiator' | 'build' | 'train' | 'hire_staff' | 'reach_favor' | 'reach_level' | 'custom';
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

// Main Story Quests (Chapter-based progression with branching paths)
export const STORY_QUESTS: Quest[] = [
  // ========== CHAPTER 1: BEGINNINGS ==========
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

  // ========== CHAPTER 2: BUILDING REPUTATION ==========
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

  // ========== CHAPTER 3: RIVAL LUDUS ==========
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
      { id: 'train_champion', description: 'Train a gladiator to level 5', type: 'reach_level', required: 5 },
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
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Narrator',
        text: 'Your rival lies defeated. Word of your victory spreads through Capua, and soon, more powerful figures take notice of your growing ludus.',
      },
    ],
    icon: '⚔️',
    repeatable: false,
  },

  // ========== CHAPTER 4: POLITICAL CROSSROADS ==========
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

  // ========== CHAPTER 5: THE SHADOW OF SPARTACUS ==========
  {
    id: 'story_5_spartacus',
    title: 'The Shadow of Spartacus',
    description: 'Whispers of rebellion echo through Capua. A slave named Spartacus is gathering followers.',
    type: 'story',
    chapter: 5,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_4_politics', value: 1, comparison: 'gte' },
      { type: 'fame', value: 400, comparison: 'gte' },
    ],
    objectives: [
      { id: 'maintain_order', description: 'Keep gladiator morale above 60%', type: 'custom', required: 1 },
      { id: 'win_battles', description: 'Win 5 arena matches', type: 'win_matches', required: 5 },
      { id: 'build_walls', description: 'Build defensive walls', type: 'build', target: 'walls', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 800, description: '+800 Gold' },
      { type: 'fame', value: 150, description: '+150 Fame' },
      { type: 'faction_favor', value: 20, target: 'military', description: '+20 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Roman Soldier',
        portrait: '⚔️',
        text: 'Lanista, I bring grave news. A gladiator named Spartacus has escaped from the ludus of Batiatus. He gathers an army of slaves. Rome demands all ludi strengthen their security.',
        nextDialogue: 'intro_2',
      },
      {
        id: 'intro_2',
        speaker: 'Your Doctore',
        portrait: '🗡️',
        text: 'The men are restless, Dominus. Some speak of Spartacus as a hero. We must keep them focused on the arena, or we risk losing everything.',
        choices: [
          {
            id: 'harsh',
            text: 'Double the guard. Any talk of rebellion will be met with the whip.',
            consequences: [{ type: 'favor', target: 'military', value: 10 }, { type: 'gold', value: -50 }],
          },
          {
            id: 'kind',
            text: 'Treat them well. A gladiator who is loyal is worth ten who are chained.',
            consequences: [{ type: 'favor', target: 'populares', value: 10 }],
          },
          {
            id: 'pragmatic',
            text: 'Promise rewards for loyalty. Gold speaks louder than ideology.',
            consequences: [{ type: 'gold', value: -100 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Narrator',
        text: 'While Spartacus\'s rebellion rages across Italy, your ludus remains secure. Rome takes note of your stability amidst the chaos.',
      },
    ],
    icon: '🔥',
    repeatable: false,
  },

  // ========== CHAPTER 6: CHOOSE YOUR PATH ==========
  {
    id: 'story_6_crossroads',
    title: 'At the Crossroads',
    description: 'Three powerful figures offer you patronage. Your choice will shape your destiny.',
    type: 'story',
    chapter: 6,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_5_spartacus', value: 1, comparison: 'gte' },
      { type: 'fame', value: 500, comparison: 'gte' },
    ],
    objectives: [
      { id: 'choose_path', description: 'Choose your patron', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 100, description: '+100 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Narrator',
        text: 'Your success has attracted the attention of Rome\'s most powerful. Three figures seek your allegiance, each offering a different path to glory.',
        nextDialogue: 'intro_2',
      },
      {
        id: 'intro_2',
        speaker: 'The Choice',
        portrait: '⚖️',
        text: 'General Crassus offers military contracts. Senator Gracchus promises political influence. Marcus the Merchant proposes a trading empire. Who will you serve?',
        choices: [
          {
            id: 'military',
            text: 'General Crassus - The path of the sword.',
            consequences: [{ type: 'favor', target: 'military', value: 30 }, { type: 'quest', target: 'story_7a_military', value: 1 }],
          },
          {
            id: 'political',
            text: 'Senator Gracchus - The path of power.',
            consequences: [{ type: 'favor', target: 'optimates', value: 20 }, { type: 'favor', target: 'populares', value: 10 }, { type: 'quest', target: 'story_7b_political', value: 1 }],
          },
          {
            id: 'merchant',
            text: 'Marcus the Merchant - The path of gold.',
            consequences: [{ type: 'favor', target: 'merchants', value: 30 }, { type: 'gold', value: 500 }, { type: 'quest', target: 'story_7c_merchant', value: 1 }],
          },
        ],
      },
    ],
    icon: '⚖️',
    repeatable: false,
  },

  // ========== CHAPTER 7A: MILITARY PATH ==========
  {
    id: 'story_7a_military',
    title: 'Blood and Steel',
    description: 'General Crassus requires gladiators for his war against Spartacus. Prove your worth on the battlefield.',
    type: 'story',
    chapter: 7,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_6_crossroads', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'military', value: 25, comparison: 'gte' },
    ],
    objectives: [
      { id: 'train_soldiers', description: 'Train gladiators to level 8', type: 'reach_level', required: 8 },
      { id: 'win_death_matches', description: 'Win 5 death matches', type: 'win_matches', required: 5 },
      { id: 'recruit_army', description: 'Have 6 gladiators in your roster', type: 'recruit_gladiator', required: 6 },
    ],
    rewards: [
      { type: 'gold', value: 1500, description: '+1500 Gold' },
      { type: 'fame', value: 300, description: '+300 Fame' },
      { type: 'faction_favor', value: 30, target: 'military', description: '+30 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'General Crassus',
        portrait: '🎖️',
        text: 'The rebel scum must be crushed. I need fighters who know no fear. Your gladiators will join my auxiliaries. Train them well, and glory awaits.',
        choices: [
          {
            id: 'eager',
            text: 'My gladiators are ready to serve Rome!',
            consequences: [{ type: 'favor', target: 'military', value: 10 }],
          },
          {
            id: 'cautious',
            text: 'They will serve, but I expect fair compensation.',
            consequences: [{ type: 'gold', value: 200 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'General Crassus',
        portrait: '🎖️',
        text: 'Your fighters have proven their worth. The rebels flee before them. Rome recognizes your contribution to the war effort.',
      },
    ],
    icon: '⚔️',
    repeatable: false,
  },

  // ========== CHAPTER 7B: POLITICAL PATH ==========
  {
    id: 'story_7b_political',
    title: 'The Senate Games',
    description: 'Senator Gracchus needs your gladiators to entertain his allies and intimidate his enemies.',
    type: 'story',
    chapter: 7,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_6_crossroads', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'optimates', value: 15, comparison: 'gte' },
    ],
    objectives: [
      { id: 'gain_optimates', description: 'Reach 50 Optimates favor', type: 'reach_favor', target: 'optimates', required: 50 },
      { id: 'host_games', description: 'Win 8 arena matches', type: 'win_matches', required: 8 },
      { id: 'build_luxury', description: 'Build a bath house', type: 'build', target: 'baths', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 1200, description: '+1200 Gold' },
      { type: 'fame', value: 350, description: '+350 Fame' },
      { type: 'faction_favor', value: 25, target: 'optimates', description: '+25 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Senator Gracchus',
        portrait: '🏛️',
        text: 'Politics is war by other means. I need your gladiators to put on spectacular games for my allies. Make them memorable, and you will rise with me.',
        choices: [
          {
            id: 'ambitious',
            text: 'Together, we will dominate the Senate.',
            consequences: [{ type: 'favor', target: 'optimates', value: 10 }],
          },
          {
            id: 'mercenary',
            text: 'I serve whoever pays the most.',
            consequences: [{ type: 'gold', value: 300 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Senator Gracchus',
        portrait: '🏛️',
        text: 'Magnificent! Your games have secured me three new votes in the Senate. You have a bright future in Roman politics.',
      },
    ],
    icon: '🏛️',
    repeatable: false,
  },

  // ========== CHAPTER 7C: MERCHANT PATH ==========
  {
    id: 'story_7c_merchant',
    title: 'Empire of Trade',
    description: 'Marcus the Merchant proposes a gladiator trading network spanning the Mediterranean.',
    type: 'story',
    chapter: 7,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_6_crossroads', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'merchants', value: 25, comparison: 'gte' },
    ],
    objectives: [
      { id: 'earn_gold', description: 'Accumulate 3000 gold', type: 'earn_gold', required: 3000 },
      { id: 'recruit_diverse', description: 'Have 5 different gladiator classes', type: 'recruit_gladiator', required: 5 },
      { id: 'build_storage', description: 'Build a granary', type: 'build', target: 'granary', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 2000, description: '+2000 Gold' },
      { type: 'fame', value: 250, description: '+250 Fame' },
      { type: 'faction_favor', value: 30, target: 'merchants', description: '+30 Merchant Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Marcus the Merchant',
        portrait: '💰',
        text: 'Gold makes the world turn, friend. Together, we can build a network of gladiator schools from Hispania to Egypt. Think of the profits!',
        choices: [
          {
            id: 'greedy',
            text: 'I like the sound of that. Let\'s get rich!',
            consequences: [{ type: 'favor', target: 'merchants', value: 15 }],
          },
          {
            id: 'cautious',
            text: 'What\'s your cut?',
            consequences: [{ type: 'gold', value: 100 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Marcus the Merchant',
        portrait: '💰',
        text: 'Our trading network flourishes! Ships carry your gladiators across the sea. The profits flow like wine at a feast.',
      },
    ],
    icon: '💰',
    repeatable: false,
  },

  // ========== CHAPTER 8A: MILITARY - CRUSHING THE REBELLION ==========
  {
    id: 'story_8a_rebellion',
    title: 'Crushing the Rebellion',
    description: 'The final battle against Spartacus approaches. Your gladiators must fight alongside the legions.',
    type: 'story',
    chapter: 8,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_7a_military', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'military', value: 50, comparison: 'gte' },
    ],
    objectives: [
      { id: 'elite_fighters', description: 'Train a gladiator to level 12', type: 'reach_level', required: 12 },
      { id: 'death_matches', description: 'Win 10 death matches', type: 'win_matches', required: 10 },
    ],
    rewards: [
      { type: 'gold', value: 2500, description: '+2500 Gold' },
      { type: 'fame', value: 500, description: '+500 Fame' },
      { type: 'faction_favor', value: 40, target: 'military', description: '+40 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'General Crassus',
        portrait: '🎖️',
        text: 'We have Spartacus cornered at Lucania. This ends now. Your gladiators will be in the vanguard. Show no mercy.',
        choices: [
          {
            id: 'bloodthirsty',
            text: 'They will paint the fields red with rebel blood!',
            consequences: [{ type: 'favor', target: 'military', value: 20 }, { type: 'favor', target: 'populares', value: -15 }],
          },
          {
            id: 'honorable',
            text: 'We fight with honor, even against rebels.',
            consequences: [{ type: 'favor', target: 'populares', value: 10 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Narrator',
        text: 'The rebellion is crushed. Spartacus falls on the battlefield. Along the Appian Way, crosses line the road - a grim reminder of Rome\'s justice. Your gladiators return as heroes.',
      },
    ],
    icon: '🗡️',
    repeatable: false,
  },

  // ========== CHAPTER 8B: POLITICAL - THE POWER PLAY ==========
  {
    id: 'story_8b_powerplay',
    title: 'The Power Play',
    description: 'Senator Gracchus plans to become Consul. Help him secure the position through strategic games.',
    type: 'story',
    chapter: 8,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_7b_political', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'optimates', value: 45, comparison: 'gte' },
    ],
    objectives: [
      { id: 'dominate_arena', description: 'Win 15 arena matches', type: 'win_matches', required: 15 },
      { id: 'max_favor', description: 'Reach 75 Optimates favor', type: 'reach_favor', target: 'optimates', required: 75 },
    ],
    rewards: [
      { type: 'gold', value: 2000, description: '+2000 Gold' },
      { type: 'fame', value: 450, description: '+450 Fame' },
      { type: 'faction_favor', value: 30, target: 'optimates', description: '+30 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Senator Gracchus',
        portrait: '🏛️',
        text: 'The elections approach. My opponents must be... discouraged. Your gladiators will entertain their supporters. Show them our strength.',
        choices: [
          {
            id: 'ruthless',
            text: 'I understand. They will fear us.',
            consequences: [{ type: 'favor', target: 'optimates', value: 15 }, { type: 'favor', target: 'populares', value: -20 }],
          },
          {
            id: 'diplomatic',
            text: 'Perhaps we can win them over instead of intimidating them.',
            consequences: [{ type: 'favor', target: 'populares', value: 10 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Senator Gracchus',
        portrait: '🏛️',
        text: 'I am Consul! Your service has been invaluable. As my ally, you will have the ear of the most powerful man in Rome.',
      },
    ],
    icon: '👑',
    repeatable: false,
  },

  // ========== CHAPTER 8C: MERCHANT - THE MEDITERRANEAN NETWORK ==========
  {
    id: 'story_8c_network',
    title: 'The Mediterranean Network',
    description: 'Expand your trading empire across the sea. Establish connections in every major port.',
    type: 'story',
    chapter: 8,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_7c_merchant', value: 1, comparison: 'gte' },
      { type: 'faction_favor', target: 'merchants', value: 50, comparison: 'gte' },
    ],
    objectives: [
      { id: 'massive_wealth', description: 'Accumulate 5000 gold', type: 'earn_gold', required: 5000 },
      { id: 'large_roster', description: 'Have 8 gladiators', type: 'recruit_gladiator', required: 8 },
      { id: 'merchant_favor', description: 'Reach 80 Merchant favor', type: 'reach_favor', target: 'merchants', required: 80 },
    ],
    rewards: [
      { type: 'gold', value: 3000, description: '+3000 Gold' },
      { type: 'fame', value: 400, description: '+400 Fame' },
      { type: 'faction_favor', value: 35, target: 'merchants', description: '+35 Merchant Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Marcus the Merchant',
        portrait: '💰',
        text: 'Our ships sail to Alexandria, Carthage, and Athens! But we need more gladiators to meet demand. The eastern markets pay triple!',
        choices: [
          {
            id: 'expand',
            text: 'We\'ll buy every promising slave we can find!',
            consequences: [{ type: 'favor', target: 'merchants', value: 15 }],
          },
          {
            id: 'quality',
            text: 'Quality over quantity. Only the best fighters.',
            consequences: [{ type: 'fame', value: 50 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Marcus the Merchant',
        portrait: '💰',
        text: 'We\'ve done it! Our network spans the known world. Kings and governors send messengers begging for our fighters. We are rich beyond measure!',
      },
    ],
    icon: '🚢',
    repeatable: false,
  },

  // ========== CHAPTER 9: THE ROAD TO ROME (ALL PATHS) ==========
  {
    id: 'story_9_rome',
    title: 'The Road to Rome',
    description: 'Your fame has reached the capital. Prepare for the ultimate challenge - the Colosseum.',
    type: 'story',
    chapter: 9,
    unlockConditions: [
      { type: 'fame', value: 800, comparison: 'gte' },
    ],
    objectives: [
      { id: 'legendary_gladiator', description: 'Train a gladiator to level 15', type: 'reach_level', required: 15 },
      { id: 'reach_legendary', description: 'Reach 1000 fame', type: 'gain_fame', required: 1000 },
    ],
    rewards: [
      { type: 'gold', value: 3000, description: '+3000 Gold' },
      { type: 'fame', value: 600, description: '+600 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Imperial Herald',
        portrait: '👑',
        text: 'By decree of the Emperor, your ludus has been granted the honor of competing in the great Colosseum of Rome. This is the culmination of everything you have worked for.',
      },
    ],
    icon: '🏛️',
    repeatable: false,
  },

  // ========== CHAPTER 10: THE COLOSSEUM ==========
  {
    id: 'story_10_colosseum',
    title: 'The Colosseum',
    description: 'The greatest arena in the world awaits. Fight for eternal glory!',
    type: 'story',
    chapter: 10,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_9_rome', value: 1, comparison: 'gte' },
      { type: 'fame', value: 1000, comparison: 'gte' },
    ],
    objectives: [
      { id: 'colosseum_victories', description: 'Win 5 Colosseum matches', type: 'win_matches', required: 5 },
      { id: 'champion_level', description: 'Train a gladiator to level 18', type: 'reach_level', required: 18 },
    ],
    rewards: [
      { type: 'gold', value: 5000, description: '+5000 Gold' },
      { type: 'fame', value: 1000, description: '+1000 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Arena Master',
        portrait: '🏟️',
        text: 'Welcome to the Colosseum, the heart of Rome\'s entertainment. Fifty thousand spectators will watch your gladiators fight. The Emperor himself may attend. Do not disappoint.',
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'Narrator',
        text: 'The Colosseum roars with approval. Your gladiators stand victorious on the greatest stage in the world. But one challenge remains...',
      },
    ],
    icon: '🏟️',
    repeatable: false,
  },

  // ========== CHAPTER 11: THE EMPEROR'S GAMES ==========
  {
    id: 'story_11_emperor',
    title: 'The Emperor\'s Games',
    description: 'The Emperor summons you for a special tournament. Victory means immortality. Defeat means death.',
    type: 'story',
    chapter: 11,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_10_colosseum', value: 1, comparison: 'gte' },
      { type: 'fame', value: 1500, comparison: 'gte' },
    ],
    objectives: [
      { id: 'emperors_tournament', description: 'Win the Emperor\'s Tournament', type: 'win_matches', required: 10 },
      { id: 'max_gladiator', description: 'Train a gladiator to level 20', type: 'reach_level', required: 20 },
    ],
    rewards: [
      { type: 'gold', value: 10000, description: '+10000 Gold' },
      { type: 'fame', value: 2000, description: '+2000 Fame' },
      { type: 'unlock', value: 1, target: 'endless_mode', description: 'Unlock Endless Mode' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'The Emperor',
        portrait: '👑',
        text: 'Lanista, your ludus has entertained Rome well. Now, entertain ME. I have arranged a special tournament - champions from across the Empire. The winner earns freedom for their best gladiator. The loser... well, there are always lions to feed.',
        choices: [
          {
            id: 'confident',
            text: 'My gladiators will bring you victory, Caesar!',
            consequences: [{ type: 'fame', value: 50 }],
          },
          {
            id: 'humble',
            text: 'We are honored beyond words, great Caesar.',
            consequences: [{ type: 'favor', target: 'optimates', value: 20 }],
          },
        ],
      },
    ],
    completionDialogue: [
      {
        id: 'complete_1',
        speaker: 'The Emperor',
        portrait: '👑',
        text: 'Magnificent! Truly magnificent! Your champion has earned their freedom, and you... you have earned a place in history. The name of your ludus will be remembered for a thousand years.',
        nextDialogue: 'complete_2',
      },
      {
        id: 'complete_2',
        speaker: 'Narrator',
        text: 'Your journey from a humble lanista in Capua to the greatest gladiator trainer Rome has ever known is complete. Songs will be sung of your gladiators. Statues will be raised in their honor. You have achieved... Legendary status.',
      },
    ],
    icon: '👑',
    repeatable: false,
  },

  // ========== EPILOGUE: ENDLESS MODE ==========
  {
    id: 'story_12_endless',
    title: 'The Legend Continues',
    description: 'Your story is complete, but the arena never rests. Continue building your legend in Endless Mode.',
    type: 'story',
    chapter: 12,
    unlockConditions: [
      { type: 'quest_complete', target: 'story_11_emperor', value: 1, comparison: 'gte' },
    ],
    objectives: [
      { id: 'endless_wins', description: 'Win 25 more matches', type: 'win_matches', required: 25 },
    ],
    rewards: [
      { type: 'gold', value: 5000, description: '+5000 Gold' },
      { type: 'fame', value: 1000, description: '+1000 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Narrator',
        text: 'The main story may be over, but legends never truly end. Continue to train gladiators, win matches, and build your empire. The arena awaits...',
      },
    ],
    icon: '♾️',
    repeatable: true,
    cooldownDays: 30,
  },
];

// Side Quests (Optional content)
export const SIDE_QUESTS: Quest[] = [
  // ========== STAFF RECRUITMENT ==========
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
    id: 'side_legendary_doctore',
    title: 'The Legendary Doctore',
    description: 'A former champion offers to train your gladiators. His methods are... unconventional.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 300, comparison: 'gte' },
      { type: 'wins', value: 15, comparison: 'gte' },
    ],
    objectives: [
      { id: 'hire_doctore', description: 'Hire a Doctore', type: 'hire_staff', target: 'doctore', required: 1 },
      { id: 'train_fighters', description: 'Train 3 gladiators to level 5', type: 'reach_level', required: 5 },
    ],
    rewards: [
      { type: 'fame', value: 75, description: '+75 Fame' },
      { type: 'gold', value: 200, description: '+200 Gold' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Legendary Doctore',
        portrait: '⚔️',
        text: 'I was Primus Palus for ten years. Undefeated. Now I teach. Your fighters have potential, but they lack discipline. Let me shape them into weapons.',
        choices: [
          {
            id: 'hire',
            text: 'I would be honored to have you.',
            consequences: [{ type: 'fame', value: 20 }],
          },
          {
            id: 'challenge',
            text: 'Prove your worth first. Spar with my best.',
            consequences: [{ type: 'fame', value: 30 }],
          },
        ],
      },
    ],
    icon: '🗡️',
    repeatable: false,
  },

  // ========== GLADIATOR RECRUITMENT ==========
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
    id: 'side_barbarian',
    title: 'The Captured Barbarian',
    description: 'A Gallic chieftain captured in battle is being sold. He could be your greatest fighter.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 400, comparison: 'gte' },
      { type: 'gold', value: 800, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recruit_barbarian', description: 'Recruit a new gladiator', type: 'recruit_gladiator', required: 1 },
      { id: 'win_with_barbarian', description: 'Win 3 matches', type: 'win_matches', required: 3 },
    ],
    rewards: [
      { type: 'fame', value: 100, description: '+100 Fame' },
      { type: 'gold', value: 300, description: '+300 Gold' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Military Officer',
        portrait: '🎖️',
        text: 'This one led a warband against our legions. Killed twenty men before we took him. The arena would love to see him fight. Interested?',
        choices: [
          {
            id: 'buy',
            text: 'Name your price.',
            consequences: [{ type: 'gold', value: -200 }],
          },
          {
            id: 'negotiate',
            text: 'For a savage like that? I\'ll give you half.',
            consequences: [{ type: 'gold', value: -100 }],
          },
        ],
      },
    ],
    icon: '🪓',
    repeatable: false,
  },
  {
    id: 'side_greek_athlete',
    title: 'The Greek Olympian',
    description: 'A disgraced Olympic champion seeks a new life in the arena.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 500, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recruit_athlete', description: 'Recruit a new gladiator', type: 'recruit_gladiator', required: 1 },
      { id: 'prove_worth', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'fame', value: 150, description: '+150 Fame' },
      { type: 'faction_favor', value: 15, target: 'populares', description: '+15 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Greek Athlete',
        portrait: '🏆',
        text: 'In Greece, I was a champion. Then they stripped my titles for... political reasons. I need a fresh start. The Roman arena calls to me.',
        choices: [
          {
            id: 'welcome',
            text: 'Champions are always welcome here.',
            consequences: [{ type: 'fame', value: 25 }],
          },
          {
            id: 'skeptical',
            text: 'The arena is not a game. Can you kill?',
            consequences: [],
          },
        ],
      },
    ],
    icon: '🏛️',
    repeatable: false,
  },

  // ========== PATRON QUESTS ==========
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
  {
    id: 'side_noble_lady',
    title: 'The Noble\'s Request',
    description: 'A wealthy noblewoman takes interest in your ludus. She has... specific requests.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 350, comparison: 'gte' },
      { type: 'wins', value: 20, comparison: 'gte' },
    ],
    objectives: [
      { id: 'impress_noble', description: 'Win 8 arena matches', type: 'win_matches', required: 8 },
      { id: 'train_favorite', description: 'Train a gladiator to level 7', type: 'reach_level', required: 7 },
    ],
    rewards: [
      { type: 'gold', value: 500, description: '+500 Gold' },
      { type: 'faction_favor', value: 15, target: 'optimates', description: '+15 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Noble Lady',
        portrait: '👸',
        text: 'I\'ve been watching your gladiators. One in particular catches my eye. Train him well, win matches in his name, and I will reward you generously.',
        choices: [
          {
            id: 'flatter',
            text: 'My lady, it would be my honor to serve you.',
            consequences: [{ type: 'favor', target: 'optimates', value: 10 }],
          },
          {
            id: 'business',
            text: 'I appreciate the offer. Let\'s discuss terms.',
            consequences: [{ type: 'gold', value: 50 }],
          },
        ],
      },
    ],
    icon: '👸',
    repeatable: false,
  },

  // ========== RIVALRY QUESTS ==========
  {
    id: 'side_rival_sabotage',
    title: 'Sabotage!',
    description: 'Your rival has poisoned one of your gladiators. Seek revenge or take the high road.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 250, comparison: 'gte' },
      { type: 'gladiators', value: 4, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recover', description: 'Win 3 matches to restore reputation', type: 'win_matches', required: 3 },
    ],
    rewards: [
      { type: 'fame', value: 75, description: '+75 Fame' },
      { type: 'gold', value: 200, description: '+200 Gold' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Your Doctore',
        portrait: '⚔️',
        text: 'Dominus! One of our gladiators has been poisoned! The rival ludus - it must be their doing. What are your orders?',
        choices: [
          {
            id: 'revenge',
            text: 'Burn their ludus to the ground!',
            consequences: [{ type: 'favor', target: 'populares', value: 15 }, { type: 'gold', value: -100 }],
          },
          {
            id: 'legal',
            text: 'We will seek justice through proper channels.',
            consequences: [{ type: 'favor', target: 'optimates', value: 15 }],
          },
          {
            id: 'ignore',
            text: 'We will let our victories speak for us.',
            consequences: [{ type: 'fame', value: 25 }],
          },
        ],
      },
    ],
    icon: '☠️',
    repeatable: false,
  },
  {
    id: 'side_grudge_match',
    title: 'The Grudge Match',
    description: 'Your former rival demands a rematch. This time, to the death.',
    type: 'side',
    unlockConditions: [
      { type: 'quest_complete', target: 'story_3_rivals', value: 1, comparison: 'gte' },
      { type: 'fame', value: 400, comparison: 'gte' },
    ],
    objectives: [
      { id: 'prepare_champion', description: 'Train a gladiator to level 10', type: 'reach_level', required: 10 },
      { id: 'death_match', description: 'Win a death match', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 750, description: '+750 Gold' },
      { type: 'fame', value: 200, description: '+200 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Rival Lanista',
        portrait: '😤',
        text: 'You humiliated me once. Never again. I challenge your champion to a death match. Winner takes all. Do you have the courage to accept?',
        choices: [
          {
            id: 'accept',
            text: 'I accept. Prepare to lose everything.',
            consequences: [{ type: 'fame', value: 30 }],
          },
          {
            id: 'terms',
            text: 'I accept, but the stakes must be higher.',
            consequences: [{ type: 'gold', value: 200 }],
          },
        ],
      },
    ],
    icon: '💀',
    repeatable: false,
  },

  // ========== SPECIAL EVENTS ==========
  {
    id: 'side_beast_hunt',
    title: 'The Beast Hunt',
    description: 'A exotic beast has been captured. The crowd wants to see it fight your gladiators.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 450, comparison: 'gte' },
      { type: 'wins', value: 25, comparison: 'gte' },
    ],
    objectives: [
      { id: 'prepare_hunter', description: 'Train a gladiator to level 8', type: 'reach_level', required: 8 },
      { id: 'beast_fights', description: 'Win 3 matches', type: 'win_matches', required: 3 },
    ],
    rewards: [
      { type: 'gold', value: 600, description: '+600 Gold' },
      { type: 'fame', value: 150, description: '+150 Fame' },
      { type: 'faction_favor', value: 20, target: 'populares', description: '+20 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Arena Master',
        portrait: '🏟️',
        text: 'A lion from Africa! A beast of legend! The people demand a venatione - a beast hunt. Your gladiators are the best. Will they face the king of beasts?',
        choices: [
          {
            id: 'eager',
            text: 'My gladiators fear nothing!',
            consequences: [{ type: 'fame', value: 25 }],
          },
          {
            id: 'negotiate',
            text: 'For the right price, they\'ll fight anything.',
            consequences: [{ type: 'gold', value: 100 }],
          },
        ],
      },
    ],
    icon: '🦁',
    repeatable: false,
  },
  {
    id: 'side_naval_battle',
    title: 'The Naumachia',
    description: 'The arena has been flooded for a grand naval battle. Prepare your gladiators for combat on the water!',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 700, comparison: 'gte' },
    ],
    objectives: [
      { id: 'elite_fighters', description: 'Train 2 gladiators to level 10', type: 'reach_level', required: 10 },
      { id: 'naval_victory', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'gold', value: 1000, description: '+1000 Gold' },
      { type: 'fame', value: 250, description: '+250 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Imperial Official',
        portrait: '🏛️',
        text: 'The Emperor commands a naumachia! The arena will become a sea, and your gladiators will fight from ships. This is the greatest spectacle Rome has ever seen.',
      },
    ],
    icon: '⚓',
    repeatable: false,
  },
  {
    id: 'side_gladiatrix',
    title: 'The Gladiatrix',
    description: 'A female warrior demands a place in your ludus. Some say it\'s scandalous. Others say it\'s revolutionary.',
    type: 'side',
    unlockConditions: [
      { type: 'fame', value: 550, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recruit_gladiatrix', description: 'Recruit a new gladiator', type: 'recruit_gladiator', required: 1 },
      { id: 'prove_worth', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'fame', value: 200, description: '+200 Fame' },
      { type: 'faction_favor', value: 15, target: 'populares', description: '+15 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Amazon Warrior',
        portrait: '⚔️',
        text: 'I am no slave. I choose to fight. The crowd loves a spectacle, and what is more spectacular than a woman who kills? Give me a chance, lanista.',
        choices: [
          {
            id: 'accept',
            text: 'Skill is all that matters in my ludus.',
            consequences: [{ type: 'favor', target: 'populares', value: 15 }],
          },
          {
            id: 'test',
            text: 'Prove yourself against my best.',
            consequences: [{ type: 'fame', value: 20 }],
          },
        ],
      },
    ],
    icon: '🗡️',
    repeatable: false,
  },

  // ========== POLITICAL SIDE QUESTS ==========
  {
    id: 'side_senate_games',
    title: 'Games for the Senate',
    description: 'A senator requests private games for fellow politicians. Discretion is required.',
    type: 'side',
    unlockConditions: [
      { type: 'faction_favor', target: 'optimates', value: 30, comparison: 'gte' },
    ],
    objectives: [
      { id: 'private_games', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'gold', value: 400, description: '+400 Gold' },
      { type: 'faction_favor', value: 25, target: 'optimates', description: '+25 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Senator\'s Secretary',
        portrait: '📜',
        text: 'My master requires entertainment for a... private gathering. Your gladiators must be the best. And they must be discreet. What happens at the villa stays at the villa.',
      },
    ],
    icon: '🏛️',
    repeatable: true,
    cooldownDays: 45,
  },
  {
    id: 'side_peoples_champion',
    title: 'Champion of the People',
    description: 'The common folk want a hero. Train a gladiator to represent them in the arena.',
    type: 'side',
    unlockConditions: [
      { type: 'faction_favor', target: 'populares', value: 30, comparison: 'gte' },
    ],
    objectives: [
      { id: 'peoples_champion', description: 'Train a gladiator to level 8', type: 'reach_level', required: 8 },
      { id: 'crowd_favorites', description: 'Win 10 matches', type: 'win_matches', required: 10 },
    ],
    rewards: [
      { type: 'fame', value: 200, description: '+200 Fame' },
      { type: 'faction_favor', value: 25, target: 'populares', description: '+25 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Plebeian Leader',
        portrait: '👥',
        text: 'The people need a champion! Someone who fights for them, not for senators and their gold. Train such a warrior, and the masses will love your ludus.',
      },
    ],
    icon: '👥',
    repeatable: false,
  },

  // ========== MERCHANT SIDE QUESTS ==========
  {
    id: 'side_trade_route',
    title: 'Protecting the Trade Route',
    description: 'Merchants request your gladiators as guards for a dangerous journey.',
    type: 'side',
    unlockConditions: [
      { type: 'faction_favor', target: 'merchants', value: 30, comparison: 'gte' },
      { type: 'gladiators', value: 4, comparison: 'gte' },
    ],
    objectives: [
      { id: 'escort_duty', description: 'Complete the escort (end 10 days)', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 600, description: '+600 Gold' },
      { type: 'faction_favor', value: 20, target: 'merchants', description: '+20 Merchant Favor' },
    ],
    timeLimit: 15,
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Merchant Prince',
        portrait: '💰',
        text: 'Bandits plague the road to Brundisium. My guards are... inadequate. Lend me some of your fighters as escorts, and I\'ll make it worth your while.',
      },
    ],
    icon: '🛡️',
    repeatable: true,
    cooldownDays: 30,
  },
  {
    id: 'side_auction',
    title: 'The Great Auction',
    description: 'A prestigious slave auction is being held. Rare gladiators are on the block.',
    type: 'side',
    unlockConditions: [
      { type: 'gold', value: 1000, comparison: 'gte' },
      { type: 'day', value: 30, comparison: 'gte' },
    ],
    objectives: [
      { id: 'attend_auction', description: 'Recruit a new gladiator', type: 'recruit_gladiator', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 50, description: '+50 Fame' },
      { type: 'faction_favor', value: 10, target: 'merchants', description: '+10 Merchant Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Auctioneer',
        portrait: '📣',
        text: 'The finest slaves in the Empire! Warriors from Germania, athletes from Greece, killers from Thrace! Come, see what coin can buy!',
      },
    ],
    icon: '🛒',
    repeatable: true,
    cooldownDays: 45,
  },

  // ========== MILITARY SIDE QUESTS ==========
  {
    id: 'side_legion_training',
    title: 'Training the Legion',
    description: 'The military requests your gladiators to train their new recruits.',
    type: 'side',
    unlockConditions: [
      { type: 'faction_favor', target: 'military', value: 30, comparison: 'gte' },
      { type: 'wins', value: 20, comparison: 'gte' },
    ],
    objectives: [
      { id: 'train_soldiers', description: 'Have 3 gladiators training', type: 'train', required: 3 },
      { id: 'show_skill', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'gold', value: 400, description: '+400 Gold' },
      { type: 'faction_favor', value: 25, target: 'military', description: '+25 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Centurion',
        portrait: '🎖️',
        text: 'The new recruits are soft. They\'ve never seen real combat. Your gladiators know how to fight. Show them what war really looks like.',
      },
    ],
    icon: '🎖️',
    repeatable: true,
    cooldownDays: 40,
  },
  {
    id: 'side_veteran_gladiator',
    title: 'The Veteran',
    description: 'A retired legionary wants to end his days in glory. The arena calls to him.',
    type: 'side',
    unlockConditions: [
      { type: 'faction_favor', target: 'military', value: 40, comparison: 'gte' },
    ],
    objectives: [
      { id: 'recruit_veteran', description: 'Recruit a new gladiator', type: 'recruit_gladiator', required: 1 },
      { id: 'veteran_victories', description: 'Win 5 matches', type: 'win_matches', required: 5 },
    ],
    rewards: [
      { type: 'fame', value: 100, description: '+100 Fame' },
      { type: 'faction_favor', value: 15, target: 'military', description: '+15 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Veteran Soldier',
        portrait: '🗡️',
        text: 'Twenty years I served Rome. I\'ve killed more men than I can count. Now I\'m old, but I\'d rather die in the arena than in my bed. Take me in, lanista.',
        choices: [
          {
            id: 'honor',
            text: 'Your service to Rome deserves recognition. Welcome.',
            consequences: [{ type: 'favor', target: 'military', value: 10 }],
          },
          {
            id: 'pragmatic',
            text: 'Can you still fight?',
            consequences: [],
          },
        ],
      },
    ],
    icon: '🏛️',
    repeatable: false,
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
  // ========== CRISIS EVENTS ==========
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
      { type: 'day', value: 7, comparison: 'gte' },
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
    id: 'event_plague',
    title: 'The Plague',
    description: 'Sickness spreads through your ludus. Act quickly or lose your gladiators.',
    type: 'event',
    unlockConditions: [
      { type: 'gladiators', value: 3, comparison: 'gte' },
      { type: 'day', value: 20, comparison: 'gte' },
    ],
    objectives: [
      { id: 'cure_plague', description: 'Treat the sick', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 30, description: '+30 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Medicus',
        portrait: '⚕️',
        text: 'Dominus! Several gladiators have fallen ill with fever. If we don\'t act quickly, it could spread to everyone.',
        choices: [
          {
            id: 'quarantine',
            text: 'Quarantine the sick. No training until this passes.',
            consequences: [{ type: 'fame', value: -20 }],
          },
          {
            id: 'medicine',
            text: 'Buy the best medicines money can afford.',
            consequences: [{ type: 'gold', value: -200 }],
          },
          {
            id: 'pray',
            text: 'Make offerings to the gods for their recovery.',
            consequences: [{ type: 'gold', value: -50 }],
          },
        ],
      },
    ],
    timeLimit: 5,
    icon: '🤒',
    repeatable: true,
    cooldownDays: 60,
  },
  {
    id: 'event_fire',
    title: 'Fire!',
    description: 'A fire breaks out in your ludus! Quick decisions are needed.',
    type: 'event',
    unlockConditions: [
      { type: 'buildings', value: 2, comparison: 'gte' },
    ],
    objectives: [
      { id: 'fight_fire', description: 'Deal with the fire', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 25, description: '+25 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Guard',
        portrait: '🔥',
        text: 'FIRE! The training grounds are ablaze! What are your orders, Dominus?!',
        choices: [
          {
            id: 'gladiators',
            text: 'Use the gladiators to fight the fire!',
            consequences: [{ type: 'gold', value: -50 }],
          },
          {
            id: 'water',
            text: 'Form a bucket chain from the well!',
            consequences: [{ type: 'gold', value: -100 }],
          },
          {
            id: 'sacrifice',
            text: 'Let it burn. Save what we can.',
            consequences: [{ type: 'gold', value: -200 }, { type: 'fame', value: -25 }],
          },
        ],
      },
    ],
    timeLimit: 1,
    icon: '🔥',
    repeatable: true,
    cooldownDays: 90,
  },
  {
    id: 'event_escaped',
    title: 'Escaped Gladiator',
    description: 'One of your gladiators has escaped! Hunt them down or face consequences.',
    type: 'event',
    unlockConditions: [
      { type: 'gladiators', value: 4, comparison: 'gte' },
    ],
    objectives: [
      { id: 'handle_escape', description: 'Deal with the escaped gladiator', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 35, description: '+35 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Guard',
        portrait: '🏃',
        text: 'One of the gladiators has escaped during the night! The authorities will not be pleased. What should we do?',
        choices: [
          {
            id: 'hunt',
            text: 'Send hunters after him. Bring him back alive.',
            consequences: [{ type: 'gold', value: -150 }],
          },
          {
            id: 'report',
            text: 'Report to the authorities immediately.',
            consequences: [{ type: 'favor', target: 'military', value: 10 }, { type: 'fame', value: -15 }],
          },
          {
            id: 'cover',
            text: 'Cover it up. He was never here.',
            consequences: [{ type: 'gold', value: -100 }, { type: 'favor', target: 'military', value: -10 }],
          },
        ],
      },
    ],
    timeLimit: 3,
    icon: '🏃',
    repeatable: true,
    cooldownDays: 45,
  },

  // ========== OPPORTUNITY EVENTS ==========
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
  {
    id: 'event_celebrity',
    title: 'The Famous Actor',
    description: 'A famous actor wants to observe your gladiators for an upcoming play.',
    type: 'event',
    unlockConditions: [
      { type: 'fame', value: 200, comparison: 'gte' },
    ],
    objectives: [
      { id: 'entertain_actor', description: 'Impress the actor', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 75, description: '+75 Fame' },
      { type: 'faction_favor', value: 10, target: 'populares', description: '+10 Populares Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Famous Actor',
        portrait: '🎭',
        text: 'I am writing a play about gladiators! May I observe your fighters? I will mention your ludus in the performance.',
        choices: [
          {
            id: 'welcome',
            text: 'Of course! Watch as long as you like.',
            consequences: [{ type: 'fame', value: 25 }],
          },
          {
            id: 'negotiate',
            text: 'For a mention in your play? I expect more.',
            consequences: [{ type: 'gold', value: 50 }],
          },
        ],
      },
    ],
    icon: '🎭',
    repeatable: true,
    cooldownDays: 40,
  },
  {
    id: 'event_gift',
    title: 'A Mysterious Gift',
    description: 'A mysterious benefactor sends a gift to your ludus.',
    type: 'event',
    unlockConditions: [
      { type: 'fame', value: 150, comparison: 'gte' },
    ],
    objectives: [
      { id: 'accept_gift', description: 'Decide what to do with the gift', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 100, description: '+100 Gold' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Servant',
        portrait: '🎁',
        text: 'A cart has arrived bearing gifts! Fine weapons, gold, and food. The sender wishes to remain anonymous. What should we do?',
        choices: [
          {
            id: 'accept',
            text: 'Accept it gratefully. A gift is a gift.',
            consequences: [{ type: 'gold', value: 150 }],
          },
          {
            id: 'investigate',
            text: 'Investigate the source. This could be a trap.',
            consequences: [{ type: 'gold', value: 50 }],
          },
          {
            id: 'refuse',
            text: 'Send it back. I trust no anonymous "friends."',
            consequences: [{ type: 'fame', value: 25 }],
          },
        ],
      },
    ],
    icon: '🎁',
    repeatable: true,
    cooldownDays: 35,
  },
  {
    id: 'event_gambler',
    title: 'The High Roller',
    description: 'A wealthy gambler offers a lucrative bet on your next match.',
    type: 'event',
    unlockConditions: [
      { type: 'wins', value: 10, comparison: 'gte' },
    ],
    objectives: [
      { id: 'win_bet', description: 'Win the next match', type: 'win_matches', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 500, description: '+500 Gold' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Wealthy Gambler',
        portrait: '🎲',
        text: 'I\'ve watched your fighters. They\'re good. I\'ll bet 500 gold that your champion wins their next match. If you match my bet, you could double your money. Or lose it all.',
        choices: [
          {
            id: 'bet_big',
            text: 'I\'ll match your bet. My gladiators never lose.',
            consequences: [{ type: 'gold', value: -500 }],
          },
          {
            id: 'bet_small',
            text: 'I\'ll bet 200. I\'m confident, not foolish.',
            consequences: [{ type: 'gold', value: -200 }],
          },
          {
            id: 'decline',
            text: 'I don\'t gamble with my ludus\'s future.',
            consequences: [],
          },
        ],
      },
    ],
    timeLimit: 7,
    icon: '🎲',
    repeatable: true,
    cooldownDays: 30,
  },

  // ========== SOCIAL EVENTS ==========
  {
    id: 'event_feast',
    title: 'Invitation to a Feast',
    description: 'A wealthy patron invites you to an elaborate dinner party.',
    type: 'event',
    unlockConditions: [
      { type: 'fame', value: 250, comparison: 'gte' },
    ],
    objectives: [
      { id: 'attend_feast', description: 'Attend the feast', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'faction_favor', value: 15, target: 'optimates', description: '+15 Optimates Favor' },
      { type: 'faction_favor', value: 10, target: 'merchants', description: '+10 Merchant Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Messenger',
        portrait: '📜',
        text: 'You are cordially invited to a feast at the villa of Marcus Crassus. Attendance is expected. Gifts are customary.',
        choices: [
          {
            id: 'lavish',
            text: 'Bring an expensive gift. First impressions matter.',
            consequences: [{ type: 'gold', value: -200 }, { type: 'favor', target: 'optimates', value: 15 }],
          },
          {
            id: 'modest',
            text: 'Bring a modest gift. Substance over flash.',
            consequences: [{ type: 'gold', value: -50 }],
          },
          {
            id: 'decline',
            text: 'Decline politely. I have work to do.',
            consequences: [{ type: 'favor', target: 'optimates', value: -10 }],
          },
        ],
      },
    ],
    icon: '🍷',
    repeatable: true,
    cooldownDays: 50,
  },
  {
    id: 'event_marriage',
    title: 'A Political Marriage',
    description: 'A wealthy family proposes a marriage alliance with significant benefits.',
    type: 'event',
    unlockConditions: [
      { type: 'fame', value: 500, comparison: 'gte' },
      { type: 'faction_favor', target: 'optimates', value: 30, comparison: 'gte' },
    ],
    objectives: [
      { id: 'consider_marriage', description: 'Make your decision', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 1000, description: '+1000 Gold' },
      { type: 'faction_favor', value: 30, target: 'optimates', description: '+30 Optimates Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Matchmaker',
        portrait: '💒',
        text: 'The Cornelii family wishes to propose a union. Their daughter is... well-dowered. And the political connections would be invaluable.',
        choices: [
          {
            id: 'accept',
            text: 'A wise match. I accept.',
            consequences: [{ type: 'gold', value: 500 }, { type: 'favor', target: 'optimates', value: 20 }],
          },
          {
            id: 'negotiate',
            text: 'The dowry must be increased.',
            consequences: [{ type: 'gold', value: 750 }],
          },
          {
            id: 'decline',
            text: 'I have no interest in marriage at this time.',
            consequences: [{ type: 'favor', target: 'optimates', value: -15 }],
          },
        ],
      },
    ],
    icon: '💒',
    repeatable: false,
  },

  // ========== MILITARY EVENTS ==========
  {
    id: 'event_legion_request',
    title: 'Legion Recruitment',
    description: 'The military requests to purchase some of your gladiators as soldiers.',
    type: 'event',
    unlockConditions: [
      { type: 'gladiators', value: 5, comparison: 'gte' },
      { type: 'fame', value: 350, comparison: 'gte' },
    ],
    objectives: [
      { id: 'consider_sale', description: 'Make your decision', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'gold', value: 400, description: '+400 Gold' },
      { type: 'faction_favor', value: 20, target: 'military', description: '+20 Military Favor' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Military Tribune',
        portrait: '🎖️',
        text: 'Rome needs soldiers. Your gladiators are trained fighters. Sell me two of them for the legions, and you\'ll be compensated well.',
        choices: [
          {
            id: 'sell',
            text: 'Take your pick. Rome\'s need is great.',
            consequences: [{ type: 'gold', value: 600 }, { type: 'favor', target: 'military', value: 15 }],
          },
          {
            id: 'negotiate',
            text: 'My gladiators are valuable. The price must reflect that.',
            consequences: [{ type: 'gold', value: 800 }],
          },
          {
            id: 'refuse',
            text: 'My gladiators are for the arena, not the battlefield.',
            consequences: [{ type: 'favor', target: 'military', value: -10 }],
          },
        ],
      },
    ],
    icon: '⚔️',
    repeatable: true,
    cooldownDays: 60,
  },
  {
    id: 'event_deserter',
    title: 'The Deserter',
    description: 'A deserter from the legions seeks refuge in your ludus.',
    type: 'event',
    unlockConditions: [
      { type: 'day', value: 40, comparison: 'gte' },
    ],
    objectives: [
      { id: 'handle_deserter', description: 'Decide the deserter\'s fate', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 25, description: '+25 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Deserter',
        portrait: '🏃',
        text: 'Please, lanista! I fled the legions after Carrhae. The commanders are corrupt - they sent us to die! Let me fight in your arena instead.',
        choices: [
          {
            id: 'hide',
            text: 'You can stay. But you\'ll fight for me now.',
            consequences: [{ type: 'favor', target: 'military', value: -15 }],
          },
          {
            id: 'turn_in',
            text: 'I cannot harbor deserters. Guards!',
            consequences: [{ type: 'favor', target: 'military', value: 20 }, { type: 'favor', target: 'populares', value: -10 }],
          },
          {
            id: 'money',
            text: 'Give me your savings and I\'ll look the other way.',
            consequences: [{ type: 'gold', value: 100 }],
          },
        ],
      },
    ],
    icon: '🏃',
    repeatable: true,
    cooldownDays: 75,
  },

  // ========== RELIGIOUS EVENTS ==========
  {
    id: 'event_omen',
    title: 'An Omen from the Gods',
    description: 'A strange omen appears. The augurs say it concerns your ludus.',
    type: 'event',
    unlockConditions: [
      { type: 'day', value: 15, comparison: 'gte' },
    ],
    objectives: [
      { id: 'interpret_omen', description: 'Interpret the omen', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 40, description: '+40 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Augur',
        portrait: '🦅',
        text: 'An eagle flew over your ludus at dawn, carrying a serpent. The gods send a message! But is it blessing or warning?',
        choices: [
          {
            id: 'sacrifice',
            text: 'Make a sacrifice to Jupiter. Better safe than sorry.',
            consequences: [{ type: 'gold', value: -75 }, { type: 'fame', value: 20 }],
          },
          {
            id: 'celebrate',
            text: 'The eagle is victory! This is a good omen.',
            consequences: [{ type: 'fame', value: 30 }],
          },
          {
            id: 'dismiss',
            text: 'Superstitious nonsense. Get back to work.',
            consequences: [{ type: 'fame', value: -10 }],
          },
        ],
      },
    ],
    icon: '🦅',
    repeatable: true,
    cooldownDays: 40,
  },
  {
    id: 'event_temple',
    title: 'Temple Donation Request',
    description: 'The priests of Mars request a donation to bless your gladiators.',
    type: 'event',
    unlockConditions: [
      { type: 'gold', value: 300, comparison: 'gte' },
    ],
    objectives: [
      { id: 'consider_donation', description: 'Decide on the donation', type: 'custom', required: 1 },
    ],
    rewards: [
      { type: 'fame', value: 50, description: '+50 Fame' },
    ],
    introDialogue: [
      {
        id: 'intro_1',
        speaker: 'Priest of Mars',
        portrait: '⚔️',
        text: 'Mars, god of war, watches over all who fight. A generous donation to his temple would ensure his blessing on your gladiators.',
        choices: [
          {
            id: 'generous',
            text: 'I will donate 200 gold. May Mars bless us.',
            consequences: [{ type: 'gold', value: -200 }, { type: 'fame', value: 40 }],
          },
          {
            id: 'modest',
            text: 'I can offer 50 gold. Every bit helps.',
            consequences: [{ type: 'gold', value: -50 }, { type: 'fame', value: 15 }],
          },
          {
            id: 'refuse',
            text: 'My gold stays in my ludus.',
            consequences: [{ type: 'fame', value: -20 }],
          },
        ],
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
