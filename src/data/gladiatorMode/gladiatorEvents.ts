import type { GladiatorModeEvent, Gladiator, Companion, Dominus } from '@/types';

export function generateRandomEvent(
  gladiator: Gladiator,
  companions: Companion[],
  dominus: Dominus,
  totalMonths: number,
): GladiatorModeEvent | null {
  const roll = Math.random();
  if (roll > 0.35) return null; // ~35% chance of an event each month

  const aliveCompanions = companions.filter(c => c.isAlive && !c.soldAway && !c.freed);
  const events = buildEventPool(gladiator, aliveCompanions, dominus, totalMonths);
  
  if (events.length === 0) return null;
  return events[Math.floor(Math.random() * events.length)];
}

function buildEventPool(
  gladiator: Gladiator,
  companions: Companion[],
  dominus: Dominus,
  totalMonths: number,
): GladiatorModeEvent[] {
  const events: GladiatorModeEvent[] = [];

  // Gift from a fan
  events.push({
    id: `evt_gift_${Date.now()}`,
    title: 'Gift from an Admirer',
    description: 'A woman in the crowd tosses a small token through the bars of your cell. A ribbon, scented with perfume, and a few coins wrapped inside.',
    type: 'gift',
    choices: [
      {
        id: 'accept',
        text: 'Accept the gift with a nod',
        effects: { morale: 0.05, peculium: 5 + Math.floor(Math.random() * 10) },
      },
      {
        id: 'share',
        text: 'Share the coins with a companion',
        effects: { morale: 0.03, peculium: 2, companionRelationship: companions[0] ? { companionId: companions[0].id, amount: 8 } : undefined },
      },
    ],
  });

  // Feast day
  events.push({
    id: `evt_feast_${Date.now()}`,
    title: 'Feast Day',
    description: 'The dominus has declared a feast! Wine flows, meat is plentiful, and for one night the ludus feels almost like home.',
    type: 'feast',
    choices: [
      {
        id: 'enjoy',
        text: 'Enjoy the feast fully',
        effects: { morale: 0.1 },
      },
      {
        id: 'moderate',
        text: 'Eat well but stay sharp',
        effects: { morale: 0.05, dominusFavor: 2 },
      },
    ],
  });

  // Illness
  events.push({
    id: `evt_illness_${Date.now()}`,
    title: 'Fever in the Night',
    description: 'You wake drenched in sweat, body aching. A fever has taken hold. The medicus offers a bitter remedy.',
    type: 'illness',
    choices: [
      {
        id: 'rest',
        text: 'Rest and take the medicine',
        effects: { health: -10, morale: -0.03 },
      },
      {
        id: 'push',
        text: 'Push through it — show no weakness',
        effects: { health: -20, dominusFavor: 2, morale: -0.05 },
      },
    ],
  });

  // Rumor
  events.push({
    id: `evt_rumor_${Date.now()}`,
    title: 'Whispers in the Barracks',
    description: 'Late at night, you overhear the guards talking. They mention your name and the word "sale."',
    type: 'rumor',
    choices: [
      {
        id: 'ignore',
        text: 'Ignore it — rumors are cheap',
        effects: { morale: -0.02 },
      },
      {
        id: 'investigate',
        text: 'Try to learn more',
        effects: { morale: -0.05, obedience: -5 },
      },
    ],
  });

  // Visitor
  if (gladiator.fame >= 50) {
    events.push({
      id: `evt_visitor_${Date.now()}`,
      title: 'A Distinguished Visitor',
      description: 'A wealthy Roman has come to inspect the gladiators. His eyes linger on you. He asks your dominus about your record.',
      type: 'visitor',
      choices: [
        {
          id: 'impress',
          text: 'Stand tall and show your scars',
          effects: { dominusFavor: 3, libertas: 5 },
        },
        {
          id: 'humble',
          text: 'Keep your eyes down',
          effects: { dominusFavor: 1, obedience: 5 },
        },
      ],
    });
  }

  // Dream of freedom
  events.push({
    id: `evt_dream_${Date.now()}`,
    title: 'A Dream of Open Skies',
    description: 'You dream of your homeland — open fields, a warm hearth, faces you can barely remember. You wake with tears on your cheeks.',
    type: 'dream',
    choices: [
      {
        id: 'resolve',
        text: 'Let it strengthen your resolve',
        effects: { morale: 0.05, libertas: 3 },
      },
      {
        id: 'despair',
        text: 'The weight of it crushes you',
        effects: { morale: -0.08 },
      },
    ],
  });

  // Gambling
  events.push({
    id: `evt_gambling_${Date.now()}`,
    title: 'Dice in the Dark',
    description: 'The gladiators are gambling with knucklebones again. Someone gestures for you to join.',
    type: 'gambling',
    choices: [
      {
        id: 'play_safe',
        text: 'Bet a small amount (5 gold)',
        effects: { peculium: Math.random() < 0.5 ? 8 : -5 },
      },
      {
        id: 'play_big',
        text: 'Bet big (15 gold)',
        effects: { peculium: Math.random() < 0.4 ? 25 : -15 },
      },
      {
        id: 'decline',
        text: 'Decline — too risky',
        effects: {},
      },
    ],
  });

  // Escape attempt by another
  if (companions.length > 0 && totalMonths >= 6) {
    const escapee = companions[Math.floor(Math.random() * companions.length)];
    events.push({
      id: `evt_escape_${Date.now()}`,
      title: 'Escape in the Night',
      description: `You are woken by commotion. ${escapee.gladiator.name} is trying to escape! Guards are scrambling. In the chaos, ${escapee.gladiator.name} locks eyes with you, silently pleading.`,
      type: 'escape_attempt',
      choices: [
        {
          id: 'help',
          text: 'Create a distraction to help',
          effects: { 
            dominusFavor: -15, obedience: -20, morale: 0.05,
            companionRelationship: { companionId: escapee.id, amount: 25 }
          },
        },
        {
          id: 'report',
          text: 'Alert the guards',
          effects: { 
            dominusFavor: 10, obedience: 10, morale: -0.05,
            companionRelationship: { companionId: escapee.id, amount: -30 }
          },
        },
        {
          id: 'nothing',
          text: 'Pretend to sleep',
          effects: { morale: -0.02 },
        },
      ],
    });
  }

  // Sparring accident
  events.push({
    id: `evt_spar_accident_${Date.now()}`,
    title: 'Training Mishap',
    description: 'During a routine drill, a training sword splinters and a shard catches your arm. Blood wells up, but the doctore barely glances your way.',
    type: 'sparring_accident',
    choices: [
      {
        id: 'shrug',
        text: 'Shrug it off and continue',
        effects: { health: -5, dominusFavor: 1 },
      },
      {
        id: 'medicus',
        text: 'See the medicus',
        effects: { health: -2 },
      },
    ],
  });

  // Punishment (from cruel/harsh dominus)
  if (dominus.personality === 'cruel' || (dominus.personality === 'harsh' && dominus.favor < 30)) {
    events.push({
      id: `evt_punishment_${Date.now()}`,
      title: 'The Whip',
      description: 'Your dominus is in a dark mood. He orders you brought before the other gladiators and lashed. Your offense? Existing.',
      type: 'punishment',
      choices: [
        {
          id: 'endure',
          text: 'Endure in silence',
          effects: { health: -15, morale: -0.1, dominusFavor: 3 },
        },
        {
          id: 'resist',
          text: 'Struggle and curse',
          effects: { health: -20, morale: -0.05, dominusFavor: -10, obedience: -15 },
        },
      ],
    });
  }

  // New arrival
  if (companions.length < 8) {
    events.push({
      id: `evt_new_arrival_${Date.now()}`,
      title: 'Fresh Meat',
      description: 'A new gladiator arrives at the ludus — chains still on, eyes wild. He is pushed into the cell beside yours.',
      type: 'new_arrival',
      choices: [
        {
          id: 'welcome',
          text: 'Offer him water and advice',
          effects: { morale: 0.03 },
        },
        {
          id: 'ignore',
          text: 'Keep to yourself',
          effects: {},
        },
      ],
    });
  }

  // Companion sold
  if (companions.length > 2 && Math.random() < 0.3) {
    const soldComp = companions.filter(c => c.rank !== 'champion')[0];
    if (soldComp) {
      events.push({
        id: `evt_comp_sold_${Date.now()}`,
        title: 'A Friend Departs',
        description: `${soldComp.gladiator.name} has been sold to another ludus. You watch as he is led away in chains, not knowing if you will ever see him again.`,
        type: 'companion_sold',
        targetCompanionId: soldComp.id,
        choices: [
          {
            id: 'farewell',
            text: 'Clasp his arm in farewell',
            effects: { morale: -0.08 },
          },
          {
            id: 'stone',
            text: 'Watch in silence — this is the life',
            effects: { morale: -0.03 },
          },
        ],
      });
    }
  }

  return events;
}

// Story quest definitions
export interface StoryChapter {
  id: number;
  title: string;
  latin: string;
  description: string;
  introText: string;
  completionText: string;
  objectives: { id: string; description: string; check: (state: any) => boolean }[];
  rewards: { libertas: number; peculium: number; morale: number; fame: number };
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'The Auction Block',
    latin: 'Catasta',
    description: 'You have been sold. A new life begins in chains.',
    introText: 'The auctioneer\'s voice rings across the forum. "Strong limbs! Sound teeth! This one will last!" Hands grab your jaw, turn your head. A price is called. Coin changes hands. You belong to someone now.',
    completionText: 'You have survived your first month in the ludus. The walls are high, the food is poor, but you are alive. That is enough. For now.',
    objectives: [
      { id: 'ch1_survive', description: 'Survive your first month', check: (s: any) => s.gladiatorMode.totalMonthsServed >= 1 },
    ],
    rewards: { libertas: 10, peculium: 5, morale: 0.05, fame: 0 },
  },
  {
    id: 2,
    title: 'Tiro',
    latin: 'Tiro',
    description: 'Learn the ways of the ludus. The doctore\'s whip teaches faster than words.',
    introText: 'The doctore stands over you, arms crossed. "You are nothing. Less than nothing. I will make you into something — or you will die in the attempt."',
    completionText: 'The training has hardened you. Your hands are calloused, your reflexes sharp. The doctore nods — the closest thing to praise you will ever receive from him.',
    objectives: [
      { id: 'ch2_train', description: 'Complete 3 months of training', check: (s: any) => s.gladiatorMode.totalMonthsServed >= 3 },
      { id: 'ch2_companion', description: 'Talk to a companion', check: (s: any) => s.gladiatorMode.eventHistory.length >= 1 },
    ],
    rewards: { libertas: 15, peculium: 0, morale: 0.05, fame: 5 },
  },
  {
    id: 3,
    title: 'Blood and Sand',
    latin: 'Sanguis et Harena',
    description: 'Your first fight. The crowd roars. The gate opens. There is no turning back.',
    introText: 'The tunnel is dark and stinks of old blood. Ahead, sunlight blazes. The roar of the crowd hits you like a wave. This is it. This is what all the training was for.',
    completionText: 'You stand in the arena, blood on your blade, the crowd chanting. You survived. You won. The taste of it — victory — is intoxicating.',
    objectives: [
      { id: 'ch3_fight', description: 'Win your first arena fight', check: (s: any) => (s.gladiatorMode.playerGladiator?.wins || 0) >= 1 },
    ],
    rewards: { libertas: 25, peculium: 10, morale: 0.1, fame: 15 },
  },
  {
    id: 4,
    title: 'Brotherhood of the Damned',
    latin: 'Fraternitas Damnatorum',
    description: 'Bonds form between those who share blood and chains. But the arena spares no one.',
    introText: 'In the quiet hours, when the guards doze and the fires burn low, you find something unexpected in this place of death: friendship. These men are your brothers now.',
    completionText: 'A companion has fallen in the arena. The ludus mourns in its own way — silence, a cup of wine poured on the earth. You carry their memory.',
    objectives: [
      { id: 'ch4_friend', description: 'Reach "Friend" status with a companion', check: (s: any) => s.gladiatorMode.companions.some((c: any) => c.relationship >= 30 && c.isAlive) },
      { id: 'ch4_wins', description: 'Win 5 arena fights', check: (s: any) => (s.gladiatorMode.playerGladiator?.wins || 0) >= 5 },
    ],
    rewards: { libertas: 30, peculium: 15, morale: 0, fame: 20 },
  },
  {
    id: 5,
    title: 'The Champion\'s Shadow',
    latin: 'Umbra Campioni',
    description: 'The ludus champion watches you rise. Will it be rivalry or respect?',
    introText: 'The champion of the ludus, the one they all fear, has taken notice of you. His gaze follows you across the training yard. You feel the weight of it — threat or acknowledgment, it is hard to tell.',
    completionText: 'You have proven yourself against the best. Whether through respect or defeat, the champion knows your name. The ludus hierarchy has shifted.',
    objectives: [
      { id: 'ch5_level', description: 'Reach level 5', check: (s: any) => (s.gladiatorMode.playerGladiator?.level || 0) >= 5 },
      { id: 'ch5_wins', description: 'Win 10 arena fights', check: (s: any) => (s.gladiatorMode.playerGladiator?.wins || 0) >= 10 },
    ],
    rewards: { libertas: 40, peculium: 20, morale: 0.1, fame: 30 },
  },
  {
    id: 6,
    title: 'Sold!',
    latin: 'Venditus',
    description: 'Your dominus has other plans for you. The chains tighten once more.',
    introText: 'The morning begins like any other, until the guards come for you. "Pack your things," they say — as if you own anything. You are being sold. New ludus, new dominus, new rules.',
    completionText: 'You have found your footing in a new ludus. Different walls, different faces, but the same sand, the same blood. You adapt — it is what gladiators do.',
    objectives: [
      { id: 'ch6_months', description: 'Serve 12 total months', check: (s: any) => s.gladiatorMode.totalMonthsServed >= 12 },
      { id: 'ch6_fame', description: 'Reach 100 fame', check: (s: any) => (s.gladiatorMode.playerGladiator?.fame || 0) >= 100 },
    ],
    rewards: { libertas: 50, peculium: 25, morale: 0.05, fame: 25 },
  },
  {
    id: 7,
    title: 'Rise to Fame',
    latin: 'Surgit Fama',
    description: 'The crowd begins to chant your name. The mob loves you. This changes everything.',
    introText: 'It starts as a murmur. Then a chant. Then a roar. Your name — the name your dominus gave you or the one you chose — echoes across the arena. They know you. They love you. Or at least, they love watching you fight.',
    completionText: 'You are famous now. Merchants sell clay figures of you. Children play at being you. Your dominus sees gold in your shadow. But fame is a double-edged blade.',
    objectives: [
      { id: 'ch7_fame', description: 'Reach 300 fame', check: (s: any) => (s.gladiatorMode.playerGladiator?.fame || 0) >= 300 },
      { id: 'ch7_wins', description: 'Win 25 arena fights', check: (s: any) => (s.gladiatorMode.playerGladiator?.wins || 0) >= 25 },
    ],
    rewards: { libertas: 60, peculium: 50, morale: 0.1, fame: 50 },
  },
  {
    id: 8,
    title: 'A Patron\'s Game',
    latin: 'Ludus Patroni',
    description: 'A powerful Roman wants you as his champion. Political intrigue surrounds you.',
    introText: 'A senator sends his man to speak with you through the bars. "My master has noticed you. He would see you fight under his banner. There could be... advantages. For both of you."',
    completionText: 'You have navigated the treacherous waters of Roman politics. Your patron\'s influence opens doors — perhaps even the door to freedom.',
    objectives: [
      { id: 'ch8_fame', description: 'Reach 500 fame', check: (s: any) => (s.gladiatorMode.playerGladiator?.fame || 0) >= 500 },
      { id: 'ch8_level', description: 'Reach level 10', check: (s: any) => (s.gladiatorMode.playerGladiator?.level || 0) >= 10 },
      { id: 'ch8_months', description: 'Serve 24 total months', check: (s: any) => s.gladiatorMode.totalMonthsServed >= 24 },
    ],
    rewards: { libertas: 80, peculium: 75, morale: 0.1, fame: 50 },
  },
  {
    id: 9,
    title: 'The Price of Freedom',
    latin: 'Pretium Libertatis',
    description: 'Choose your path to freedom. Every choice has a cost.',
    introText: 'Freedom is close now. You can taste it like iron on your tongue. But freedom is never free — not for men like you. The question is: what price are you willing to pay?',
    completionText: 'You have chosen your path. There is no turning back now. The rudis — that simple wooden sword that means everything — is within reach.',
    objectives: [
      { id: 'ch9_libertas', description: 'Reach 800 Libertas', check: (s: any) => s.gladiatorMode.freedom.totalLibertas >= 800 },
      { id: 'ch9_wins', description: 'Win 40 arena fights', check: (s: any) => (s.gladiatorMode.playerGladiator?.wins || 0) >= 40 },
    ],
    rewards: { libertas: 100, peculium: 100, morale: 0.15, fame: 75 },
  },
  {
    id: 10,
    title: 'The Rudis',
    latin: 'Rudis',
    description: 'The wooden sword of freedom. You have earned it. The ceremony awaits.',
    introText: 'The editor stands before you in the arena. The crowd is silent — an impossible thing. In his hand, a simple wooden sword. The rudis. Your entire life has led to this moment.',
    completionText: 'The rudis is in your hand. Light as air. Heavy as the world. You are free. The gate of the ludus opens — not to the arena, but to the road beyond. For the first time, you walk through it as a free man.',
    objectives: [
      { id: 'ch10_libertas', description: 'Reach 1000 Libertas', check: (s: any) => s.gladiatorMode.freedom.totalLibertas >= 1000 },
    ],
    rewards: { libertas: 0, peculium: 200, morale: 0.5, fame: 200 },
  },
];

export function getCurrentChapter(chapterNumber: number): StoryChapter | undefined {
  return STORY_CHAPTERS.find(ch => ch.id === chapterNumber);
}

export function checkChapterCompletion(chapter: StoryChapter, state: any): boolean {
  return chapter.objectives.every(obj => obj.check(state));
}
