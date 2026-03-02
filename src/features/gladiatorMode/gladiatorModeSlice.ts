import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  Gladiator, GladiatorStats,
  GladiatorModeOrigin, GladiatorModeRegion, GladiatorModeState,
  Dominus, DominusPersonality, DominusOrder,
  Companion,
  FreedomProgress, FreedomPath,
  GladiatorMonthPhase, GladiatorModeEvent,
} from '@/types';

const generateDominus = (personality?: DominusPersonality): Dominus => {
  const names = [
    'Quintus Lentulus Batiatus', 'Gaius Petronius Arbiter', 'Marcus Crassus Frugi',
    'Lucius Tullius Decula', 'Publius Varinius Glaber', 'Titus Calavius Sabinus',
    'Gnaeus Cornelius Scipio', 'Sextus Pompeius Strabo', 'Aulus Gabinius Capito',
    'Decimus Junius Brutus', 'Servius Sulpicius Galba', 'Appius Claudius Pulcher',
  ];
  const ludusNames = [
    'Ludus Magnus', 'Ludus Gallicus', 'Ludus Dacicus', 'Ludus Matutinus',
    'Ludus Maximus', 'Ludus Bestiarius', 'Ludus Julianus', 'Ludus Neronis',
    'Ludus Capuanus', 'Ludus Pompeiianus', 'Ludus Flavianus', 'Ludus Traianus',
  ];
  const personalities: DominusPersonality[] = ['fair', 'harsh', 'cruel', 'indulgent', 'ambitious'];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    personality: personality || personalities[Math.floor(Math.random() * personalities.length)],
    ludusName: ludusNames[Math.floor(Math.random() * ludusNames.length)],
    wealth: 500 + Math.floor(Math.random() * 1500),
    favor: 40,
    politicalConnections: 20 + Math.floor(Math.random() * 40),
  };
};

const initialFreedom: FreedomProgress = {
  totalLibertas: 0,
  gloryPoints: 0,
  coinSaved: 0,
  manumissionPrice: 800,
  patronageFavor: 0,
  dominusMercyEligible: false,
};

const initialState: GladiatorModeState = {
  playerGladiator: null,
  origin: 'pow',
  region: 'thrace',

  dominus: generateDominus('fair'),
  previousDomini: [],
  timesSold: 0,

  companions: [],

  freedom: initialFreedom,

  peculium: 0,
  peculiumHistory: [],

  currentOrder: null,
  monthPhase: 'orders',

  monthsInCurrentLudus: 0,
  totalMonthsServed: 0,

  pendingEvent: null,
  eventHistory: [],

  storyChapter: 1,
  completedStoryChapters: [],

  trainedThisMonth: false,
  interactionsThisMonth: 0,
  foughtThisMonth: false,
};

const gladiatorModeSlice = createSlice({
  name: 'gladiatorMode',
  initialState,
  reducers: {
    // Initialization
    initializeGladiatorMode: (state, action: PayloadAction<{
      gladiator: Gladiator;
      origin: GladiatorModeOrigin;
      region: GladiatorModeRegion;
      difficulty: string;
    }>) => {
      const { gladiator, origin, region, difficulty } = action.payload;
      state.playerGladiator = gladiator;
      state.origin = origin;
      state.region = region;
      state.dominus = generateDominus();
      state.previousDomini = [];
      state.timesSold = 0;
      state.companions = [];
      state.freedom = {
        ...initialFreedom,
        manumissionPrice: calculateManumissionPrice(gladiator, difficulty),
      };
      state.peculium = origin === 'volunteer' ? 20 : 0;
      state.peculiumHistory = [];
      state.currentOrder = null;
      state.monthPhase = 'orders';
      state.monthsInCurrentLudus = 0;
      state.totalMonthsServed = 0;
      state.pendingEvent = null;
      state.eventHistory = [];
      state.storyChapter = 1;
      state.completedStoryChapters = [];
      state.trainedThisMonth = false;
      state.interactionsThisMonth = 0;
      state.foughtThisMonth = false;
    },

    // Player gladiator updates
    updatePlayerGladiator: (state, action: PayloadAction<Partial<Gladiator>>) => {
      if (state.playerGladiator) {
        state.playerGladiator = { ...state.playerGladiator, ...action.payload };
      }
    },
    addExperience: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.experience += action.payload;
      const xpNeeded = state.playerGladiator.level * 100;
      while (state.playerGladiator.experience >= xpNeeded && state.playerGladiator.level < 20) {
        state.playerGladiator.experience -= state.playerGladiator.level * 100;
        state.playerGladiator.level += 1;
        state.playerGladiator.skillPoints += 5;
        state.playerGladiator.maxHP = 50 + Math.floor(state.playerGladiator.stats.constitution * 1.5) + state.playerGladiator.level * 10;
        state.playerGladiator.maxStamina = 30 + Math.floor(state.playerGladiator.stats.endurance * 1.2) + state.playerGladiator.level * 5;
      }
    },
    updatePlayerStats: (state, action: PayloadAction<Partial<GladiatorStats>>) => {
      if (!state.playerGladiator) return;
      const stats = state.playerGladiator.stats;
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== undefined) {
          (stats as any)[key] = Math.max(1, Math.min(100, (stats as any)[key] + value));
        }
      });
    },
    spendSkillPoint: (state, action: PayloadAction<keyof GladiatorStats>) => {
      if (!state.playerGladiator || state.playerGladiator.skillPoints <= 0) return;
      const stat = action.payload;
      if (state.playerGladiator.stats[stat] >= 100) return;
      state.playerGladiator.stats[stat] += 1;
      state.playerGladiator.skillPoints -= 1;
      if (stat === 'constitution') {
        state.playerGladiator.maxHP = 50 + Math.floor(state.playerGladiator.stats.constitution * 1.5) + state.playerGladiator.level * 10;
      }
      if (stat === 'endurance') {
        state.playerGladiator.maxStamina = 30 + Math.floor(state.playerGladiator.stats.endurance * 1.2) + state.playerGladiator.level * 5;
      }
    },
    recordWin: (state) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.wins += 1;
    },
    recordLoss: (state) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.losses += 1;
    },
    recordKill: (state) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.kills += 1;
    },
    healPlayer: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.currentHP = Math.min(
        state.playerGladiator.maxHP,
        state.playerGladiator.currentHP + action.payload
      );
    },
    damagePlayer: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.currentHP = Math.max(0, state.playerGladiator.currentHP - action.payload);
    },
    setPlayerMorale: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.morale = Math.max(0.1, Math.min(1.5, action.payload));
    },
    adjustPlayerMorale: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.morale = Math.max(0.1, Math.min(1.5, state.playerGladiator.morale + action.payload));
    },
    setPlayerFatigue: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.fatigue = Math.max(0, Math.min(100, action.payload));
    },
    adjustPlayerFame: (state, action: PayloadAction<number>) => {
      if (!state.playerGladiator) return;
      state.playerGladiator.fame = Math.max(0, Math.min(1000, state.playerGladiator.fame + action.payload));
    },

    // Dominus
    setDominus: (state, action: PayloadAction<Dominus>) => {
      state.dominus = action.payload;
    },
    adjustDominusFavor: (state, action: PayloadAction<number>) => {
      state.dominus.favor = Math.max(0, Math.min(100, state.dominus.favor + action.payload));
    },
    setDominusFavor: (state, action: PayloadAction<number>) => {
      state.dominus.favor = Math.max(0, Math.min(100, action.payload));
    },

    // Orders
    setCurrentOrder: (state, action: PayloadAction<DominusOrder | null>) => {
      state.currentOrder = action.payload;
    },
    setMonthPhase: (state, action: PayloadAction<GladiatorMonthPhase>) => {
      state.monthPhase = action.payload;
    },

    // Companions
    setCompanions: (state, action: PayloadAction<Companion[]>) => {
      state.companions = action.payload;
    },
    addCompanion: (state, action: PayloadAction<Companion>) => {
      state.companions.push(action.payload);
    },
    removeCompanion: (state, action: PayloadAction<string>) => {
      const comp = state.companions.find(c => c.id === action.payload);
      if (comp) {
        comp.soldAway = true;
        comp.isAlive = true;
      }
    },
    killCompanion: (state, action: PayloadAction<string>) => {
      const comp = state.companions.find(c => c.id === action.payload);
      if (comp) {
        comp.isAlive = false;
      }
    },
    freeCompanion: (state, action: PayloadAction<string>) => {
      const comp = state.companions.find(c => c.id === action.payload);
      if (comp) {
        comp.freed = true;
      }
    },
    adjustCompanionRelationship: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const comp = state.companions.find(c => c.id === action.payload.id);
      if (comp) {
        comp.relationship = Math.max(-100, Math.min(100, comp.relationship + action.payload.amount));
      }
    },
    updateCompanionGladiator: (state, action: PayloadAction<{ id: string; updates: Partial<Gladiator> }>) => {
      const comp = state.companions.find(c => c.id === action.payload.id);
      if (comp) {
        comp.gladiator = { ...comp.gladiator, ...action.payload.updates };
      }
    },

    // Freedom
    addLibertas: (state, action: PayloadAction<{ amount: number; source: FreedomPath }>) => {
      const { amount, source } = action.payload;
      state.freedom.totalLibertas = Math.min(1000, state.freedom.totalLibertas + amount);
      if (source === 'glory') state.freedom.gloryPoints += amount;
    },
    setChosenPath: (state, action: PayloadAction<FreedomPath>) => {
      state.freedom.chosenPath = action.payload;
    },
    updateFreedom: (state, action: PayloadAction<Partial<FreedomProgress>>) => {
      state.freedom = { ...state.freedom, ...action.payload };
    },
    recalculateManumissionPrice: (state) => {
      if (!state.playerGladiator) return;
      const g = state.playerGladiator;
      const base = 500;
      const levelBonus = g.level * 80;
      const fameBonus = g.fame * 0.5;
      const winBonus = g.wins * 10;
      state.freedom.manumissionPrice = Math.round(base + levelBonus + fameBonus + winBonus);
    },

    // Peculium
    addPeculium: (state, action: PayloadAction<{ amount: number; source: string; year: number; month: number }>) => {
      state.peculium += action.payload.amount;
      state.peculiumHistory.push({
        id: `pec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        month: action.payload.month,
        year: action.payload.year,
        amount: action.payload.amount,
        source: action.payload.source,
      });
      state.freedom.coinSaved = state.peculium;
    },
    spendPeculium: (state, action: PayloadAction<{ amount: number; source: string; year: number; month: number }>) => {
      state.peculium = Math.max(0, state.peculium - action.payload.amount);
      state.peculiumHistory.push({
        id: `pec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        month: action.payload.month,
        year: action.payload.year,
        amount: -action.payload.amount,
        source: action.payload.source,
      });
      state.freedom.coinSaved = state.peculium;
    },

    // Being sold
    soldToNewLudus: (state, action: PayloadAction<{ newDominus?: Dominus }>) => {
      state.previousDomini.push(state.dominus.name);
      state.dominus = action.payload.newDominus || generateDominus();
      state.timesSold += 1;
      state.companions = [];
      state.monthsInCurrentLudus = 0;
      state.currentOrder = null;
      state.dominus.favor = 35;
    },

    // Events
    setPendingEvent: (state, action: PayloadAction<GladiatorModeEvent | null>) => {
      state.pendingEvent = action.payload;
    },
    resolveEvent: (state, _action: PayloadAction<string>) => {
      if (state.pendingEvent) {
        state.eventHistory.push(state.pendingEvent.id);
        state.pendingEvent = null;
      }
    },

    // Time
    advanceGladiatorMonth: (state) => {
      state.monthsInCurrentLudus += 1;
      state.totalMonthsServed += 1;
      if (state.playerGladiator) {
        state.playerGladiator.monthsOfService += 1;
      }
      state.monthPhase = 'orders';
      state.trainedThisMonth = false;
      state.interactionsThisMonth = 0;
      state.foughtThisMonth = false;
      
      // Check mercy eligibility
      state.freedom.dominusMercyEligible = 
        state.dominus.favor >= 90 && 
        state.totalMonthsServed >= 36 &&
        (state.playerGladiator?.fame || 0) >= 200;
    },

    // Monthly action tracking
    markTrainedThisMonth: (state) => {
      state.trainedThisMonth = true;
    },
    markFoughtThisMonth: (state) => {
      state.foughtThisMonth = true;
    },
    recordInteraction: (state) => {
      state.interactionsThisMonth = (state.interactionsThisMonth || 0) + 1;
    },

    // Story
    completeStoryChapter: (state, action: PayloadAction<number>) => {
      if (!state.completedStoryChapters.includes(action.payload)) {
        state.completedStoryChapters.push(action.payload);
      }
      state.storyChapter = action.payload + 1;
    },

    // Reset
    resetGladiatorMode: () => initialState,
  },
});

function calculateManumissionPrice(gladiator: Gladiator, difficulty: string): number {
  const base = difficulty === 'easy' ? 600 : difficulty === 'hard' ? 1200 : 800;
  return base + gladiator.level * 50;
}

export const {
  initializeGladiatorMode,
  updatePlayerGladiator,
  addExperience,
  updatePlayerStats,
  spendSkillPoint,
  recordWin,
  recordLoss,
  recordKill,
  healPlayer,
  damagePlayer,
  setPlayerMorale,
  adjustPlayerMorale,
  setPlayerFatigue,
  adjustPlayerFame,
  setDominus,
  adjustDominusFavor,
  setDominusFavor,
  setCurrentOrder,
  setMonthPhase,
  setCompanions,
  addCompanion,
  removeCompanion,
  killCompanion,
  freeCompanion,
  adjustCompanionRelationship,
  updateCompanionGladiator,
  addLibertas,
  setChosenPath,
  updateFreedom,
  recalculateManumissionPrice,
  addPeculium,
  spendPeculium,
  soldToNewLudus,
  setPendingEvent,
  resolveEvent,
  advanceGladiatorMonth,
  markTrainedThisMonth,
  markFoughtThisMonth,
  recordInteraction,
  completeStoryChapter,
  resetGladiatorMode,
} = gladiatorModeSlice.actions;

// Selectors
export const selectPlayerGladiator = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.playerGladiator;
export const selectDominus = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.dominus;
export const selectCompanions = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.companions;
export const selectAliveCompanions = (state: { gladiatorMode: GladiatorModeState }) => 
  state.gladiatorMode.companions.filter(c => c.isAlive && !c.soldAway && !c.freed);
export const selectFreedom = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.freedom;
export const selectPeculium = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.peculium;
export const selectCurrentOrder = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.currentOrder;
export const selectMonthPhase = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.monthPhase;
export const selectPendingEvent = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.pendingEvent;
export const selectStoryChapter = (state: { gladiatorMode: GladiatorModeState }) => state.gladiatorMode.storyChapter;

export const selectDominusFavorTier = (state: { gladiatorMode: GladiatorModeState }) => {
  const favor = state.gladiatorMode.dominus.favor;
  if (favor <= 15) return { tier: 'despised', label: 'Despised', color: 'text-red-500' };
  if (favor <= 35) return { tier: 'tolerated', label: 'Tolerated', color: 'text-roman-marble-400' };
  if (favor <= 55) return { tier: 'valued', label: 'Valued', color: 'text-yellow-500' };
  if (favor <= 75) return { tier: 'prized', label: 'Prized', color: 'text-roman-gold-500' };
  return { tier: 'champion', label: 'Champion', color: 'text-roman-gold-400' };
};

export const selectCompanionRelationshipTier = (_: any, relationship: number) => {
  if (relationship <= -60) return { tier: 'enemy', label: 'Enemy', color: 'text-red-500' };
  if (relationship <= -20) return { tier: 'rival', label: 'Rival', color: 'text-orange-400' };
  if (relationship <= 20) return { tier: 'neutral', label: 'Neutral', color: 'text-roman-marble-400' };
  if (relationship <= 60) return { tier: 'friend', label: 'Friend', color: 'text-green-400' };
  return { tier: 'brother', label: 'Brother', color: 'text-roman-gold-400' };
};

export default gladiatorModeSlice.reducer;
