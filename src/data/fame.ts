// Fame tiers and their benefits
export interface FameTier {
  id: string;
  name: string;
  minFame: number;
  title: string;
  description: string;
  benefits: {
    type: 'income' | 'discount' | 'access' | 'bonus';
    value: number;
    description: string;
  }[];
  icon: string;
}

export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  type: 'figurine' | 'weapon_replica' | 'clothing' | 'portrait' | 'souvenir';
  baseCost: number;
  baseIncome: number; // Daily passive income
  fameBonusMultiplier: number; // How much gladiator fame affects income
  requiredLudusFame: number;
  icon: string;
}

export interface SponsorshipDeal {
  id: string;
  name: string;
  sponsor: string;
  description: string;
  requiredFame: number;
  dailyPayment: number;
  duration: number; // In days
  conditions: string[];
  bonuses: { stat: string; value: number }[];
  icon: string;
}

// Ludus Fame Tiers
export const LUDUS_FAME_TIERS: FameTier[] = [
  {
    id: 'unknown',
    name: 'Unknown',
    minFame: 0,
    title: 'Lanista',
    description: 'Your ludus is unknown to the public. Work hard to build your reputation.',
    benefits: [],
    icon: '🏚️',
  },
  {
    id: 'local',
    name: 'Local',
    minFame: 100,
    title: 'Known Lanista',
    description: 'Your ludus has gained some recognition in the local area.',
    benefits: [
      { type: 'income', value: 10, description: '+10 gold daily from visitors' },
      { type: 'discount', value: 5, description: '5% discount on supplies' },
    ],
    icon: '🏠',
  },
  {
    id: 'regional',
    name: 'Regional',
    minFame: 300,
    title: 'Respected Lanista',
    description: 'Your ludus is known throughout the region. Crowds gather to see your fighters.',
    benefits: [
      { type: 'income', value: 30, description: '+30 gold daily from visitors' },
      { type: 'discount', value: 10, description: '10% discount on supplies' },
      { type: 'access', value: 1, description: 'Access to regional tournaments' },
    ],
    icon: '🏛️',
  },
  {
    id: 'renowned',
    name: 'Renowned',
    minFame: 600,
    title: 'Renowned Lanista',
    description: 'Your ludus is famous across multiple provinces. Nobles seek your gladiators.',
    benefits: [
      { type: 'income', value: 75, description: '+75 gold daily from visitors' },
      { type: 'discount', value: 15, description: '15% discount on all purchases' },
      { type: 'access', value: 2, description: 'Access to grand tournaments' },
      { type: 'bonus', value: 10, description: '+10% gladiator sale prices' },
    ],
    icon: '🏰',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    minFame: 1000,
    title: 'Legendary Lanista',
    description: 'Your ludus is known throughout the Empire. The Emperor himself watches your games.',
    benefits: [
      { type: 'income', value: 150, description: '+150 gold daily from visitors' },
      { type: 'discount', value: 20, description: '20% discount on all purchases' },
      { type: 'access', value: 3, description: 'Access to Colosseum games' },
      { type: 'bonus', value: 25, description: '+25% gladiator sale prices' },
      { type: 'bonus', value: 10, description: '+10% training effectiveness' },
    ],
    icon: '👑',
  },
];

// Gladiator Fame Tiers
export const GLADIATOR_FAME_TIERS: FameTier[] = [
  {
    id: 'novice',
    name: 'Novice',
    minFame: 0,
    title: 'Tiro',
    description: 'An untested fighter, new to the arena.',
    benefits: [],
    icon: '⚔️',
  },
  {
    id: 'fighter',
    name: 'Fighter',
    minFame: 50,
    title: 'Gladiator',
    description: 'A proven warrior who has survived the arena.',
    benefits: [
      { type: 'income', value: 5, description: '+5 gold daily from fan gifts' },
      { type: 'bonus', value: 5, description: '+5% morale recovery' },
    ],
    icon: '🗡️',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    minFame: 150,
    title: 'Veteranus',
    description: 'An experienced gladiator with many victories.',
    benefits: [
      { type: 'income', value: 15, description: '+15 gold daily from fan gifts' },
      { type: 'bonus', value: 10, description: '+10% morale recovery' },
      { type: 'bonus', value: 5, description: '+5% crowd favor gain' },
    ],
    icon: '⚔️',
  },
  {
    id: 'champion',
    name: 'Champion',
    minFame: 350,
    title: 'Primus Palus',
    description: 'A champion of the arena, beloved by the crowd.',
    benefits: [
      { type: 'income', value: 40, description: '+40 gold daily from fan gifts' },
      { type: 'bonus', value: 15, description: '+15% morale recovery' },
      { type: 'bonus', value: 10, description: '+10% crowd favor gain' },
      { type: 'bonus', value: 5, description: '+5% critical hit chance' },
    ],
    icon: '🏆',
  },
  {
    id: 'legend',
    name: 'Legend',
    minFame: 600,
    title: 'Legendarius',
    description: 'A living legend whose name echoes through history.',
    benefits: [
      { type: 'income', value: 100, description: '+100 gold daily from fan gifts' },
      { type: 'bonus', value: 25, description: '+25% morale recovery' },
      { type: 'bonus', value: 20, description: '+20% crowd favor gain' },
      { type: 'bonus', value: 10, description: '+10% critical hit chance' },
      { type: 'bonus', value: 10, description: '+10% intimidation in combat' },
    ],
    icon: '⭐',
  },
];

// Merchandise Items
export const MERCHANDISE_ITEMS: MerchandiseItem[] = [
  {
    id: 'clay_figurine',
    name: 'Clay Figurine',
    description: 'Simple clay figurines of your famous gladiators.',
    type: 'figurine',
    baseCost: 50,
    baseIncome: 3,
    fameBonusMultiplier: 0.02,
    requiredLudusFame: 100,
    icon: '🏺',
  },
  {
    id: 'wooden_sword',
    name: 'Wooden Practice Sword',
    description: 'Toy swords for children to emulate their heroes.',
    type: 'weapon_replica',
    baseCost: 75,
    baseIncome: 5,
    fameBonusMultiplier: 0.03,
    requiredLudusFame: 150,
    icon: '🗡️',
  },
  {
    id: 'gladiator_tunic',
    name: 'Gladiator Tunic',
    description: 'Tunics bearing your ludus colors and emblem.',
    type: 'clothing',
    baseCost: 100,
    baseIncome: 8,
    fameBonusMultiplier: 0.04,
    requiredLudusFame: 200,
    icon: '👕',
  },
  {
    id: 'bronze_figurine',
    name: 'Bronze Figurine',
    description: 'Detailed bronze statues of champion gladiators.',
    type: 'figurine',
    baseCost: 200,
    baseIncome: 15,
    fameBonusMultiplier: 0.05,
    requiredLudusFame: 300,
    icon: '🏆',
  },
  {
    id: 'painted_portrait',
    name: 'Painted Portrait',
    description: 'Commissioned portraits of legendary fighters.',
    type: 'portrait',
    baseCost: 300,
    baseIncome: 25,
    fameBonusMultiplier: 0.06,
    requiredLudusFame: 400,
    icon: '🖼️',
  },
  {
    id: 'arena_sand',
    name: 'Arena Sand Vial',
    description: 'Vials of sand from famous battles - a prized souvenir.',
    type: 'souvenir',
    baseCost: 150,
    baseIncome: 12,
    fameBonusMultiplier: 0.04,
    requiredLudusFame: 250,
    icon: '⏳',
  },
  {
    id: 'replica_armor',
    name: 'Replica Armor Set',
    description: 'Miniature replica armor of famous gladiators.',
    type: 'weapon_replica',
    baseCost: 400,
    baseIncome: 35,
    fameBonusMultiplier: 0.07,
    requiredLudusFame: 500,
    icon: '🛡️',
  },
  {
    id: 'gold_medallion',
    name: 'Gold Victory Medallion',
    description: 'Gold medallions commemorating great victories.',
    type: 'souvenir',
    baseCost: 500,
    baseIncome: 50,
    fameBonusMultiplier: 0.08,
    requiredLudusFame: 600,
    icon: '🥇',
  },
];

// Sponsorship Deals
export const SPONSORSHIP_DEALS: SponsorshipDeal[] = [
  {
    id: 'local_merchant',
    name: 'Local Merchant Sponsorship',
    sponsor: 'Marcus the Merchant',
    description: 'A local merchant wants to associate his name with your ludus.',
    requiredFame: 100,
    dailyPayment: 15,
    duration: 30,
    conditions: ['Win at least 1 match every 10 days'],
    bonuses: [],
    icon: '🏪',
  },
  {
    id: 'wine_maker',
    name: 'Wine Maker Partnership',
    sponsor: 'Vinum Vineyards',
    description: 'A vineyard wants your gladiators to promote their wine.',
    requiredFame: 200,
    dailyPayment: 25,
    duration: 60,
    conditions: ['Maintain at least 5 gladiators'],
    bonuses: [{ stat: 'morale', value: 5 }],
    icon: '🍷',
  },
  {
    id: 'armor_smith',
    name: 'Armor Smith Contract',
    sponsor: 'Ferrum Forge',
    description: 'An armor smith provides equipment in exchange for advertising.',
    requiredFame: 350,
    dailyPayment: 40,
    duration: 90,
    conditions: ['Use only their equipment in matches', 'Win 60% of matches'],
    bonuses: [{ stat: 'armor', value: 10 }],
    icon: '⚒️',
  },
  {
    id: 'noble_patron',
    name: 'Noble Patron',
    sponsor: 'Senator Gaius Aurelius',
    description: 'A wealthy senator becomes your patron, funding your ludus.',
    requiredFame: 500,
    dailyPayment: 75,
    duration: 120,
    conditions: ['Dedicate victories to the Senator', 'Maintain fame above 400'],
    bonuses: [{ stat: 'fame_gain', value: 10 }],
    icon: '🏛️',
  },
  {
    id: 'imperial_favor',
    name: 'Imperial Favor',
    sponsor: 'The Imperial House',
    description: 'The Emperor himself shows interest in your gladiators.',
    requiredFame: 800,
    dailyPayment: 150,
    duration: 180,
    conditions: ['Win in Colosseum events', 'Maintain legendary status'],
    bonuses: [{ stat: 'all', value: 5 }, { stat: 'fame_gain', value: 25 }],
    icon: '👑',
  },
];

// Helper functions
export const getLudusFameTier = (fame: number): FameTier => {
  for (let i = LUDUS_FAME_TIERS.length - 1; i >= 0; i--) {
    if (fame >= LUDUS_FAME_TIERS[i].minFame) {
      return LUDUS_FAME_TIERS[i];
    }
  }
  return LUDUS_FAME_TIERS[0];
};

export const getGladiatorFameTier = (fame: number): FameTier => {
  for (let i = GLADIATOR_FAME_TIERS.length - 1; i >= 0; i--) {
    if (fame >= GLADIATOR_FAME_TIERS[i].minFame) {
      return GLADIATOR_FAME_TIERS[i];
    }
  }
  return GLADIATOR_FAME_TIERS[0];
};

export const getNextFameTier = (currentFame: number, isLudus: boolean): FameTier | null => {
  const tiers = isLudus ? LUDUS_FAME_TIERS : GLADIATOR_FAME_TIERS;
  for (const tier of tiers) {
    if (tier.minFame > currentFame) {
      return tier;
    }
  }
  return null;
};

export const calculateMerchandiseIncome = (
  item: MerchandiseItem,
  ludusFame: number,
  totalGladiatorFame: number
): number => {
  const fameBonus = totalGladiatorFame * item.fameBonusMultiplier;
  const ludusTier = getLudusFameTier(ludusFame);
  const tierMultiplier = 1 + (LUDUS_FAME_TIERS.indexOf(ludusTier) * 0.1);
  return Math.round(item.baseIncome * tierMultiplier + fameBonus);
};

export const calculateDailyFameIncome = (
  ludusFame: number,
  gladiators: { fame: number }[],
  ownedMerchandise: string[]
): { total: number; breakdown: { source: string; amount: number }[] } => {
  const breakdown: { source: string; amount: number }[] = [];
  let total = 0;

  // Ludus tier income
  const ludusTier = getLudusFameTier(ludusFame);
  const tierIncome = ludusTier.benefits
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + b.value, 0);
  if (tierIncome > 0) {
    breakdown.push({ source: `${ludusTier.name} Ludus`, amount: tierIncome });
    total += tierIncome;
  }

  // Gladiator fame income
  const totalGladiatorFame = gladiators.reduce((sum, g) => sum + g.fame, 0);
  for (const gladiator of gladiators) {
    const gladTier = getGladiatorFameTier(gladiator.fame);
    const gladIncome = gladTier.benefits
      .filter(b => b.type === 'income')
      .reduce((sum, b) => sum + b.value, 0);
    if (gladIncome > 0) {
      total += gladIncome;
    }
  }
  if (gladiators.length > 0) {
    const avgGladIncome = Math.round(total - tierIncome);
    if (avgGladIncome > 0) {
      breakdown.push({ source: 'Gladiator Gifts', amount: avgGladIncome });
    }
  }

  // Merchandise income
  for (const merchId of ownedMerchandise) {
    const item = MERCHANDISE_ITEMS.find(m => m.id === merchId);
    if (item) {
      const income = calculateMerchandiseIncome(item, ludusFame, totalGladiatorFame);
      breakdown.push({ source: item.name, amount: income });
      total += income;
    }
  }

  return { total, breakdown };
};

export const getAvailableMerchandise = (ludusFame: number): MerchandiseItem[] => {
  return MERCHANDISE_ITEMS.filter(item => ludusFame >= item.requiredLudusFame);
};

export const getAvailableSponsorships = (ludusFame: number): SponsorshipDeal[] => {
  return SPONSORSHIP_DEALS.filter(deal => ludusFame >= deal.requiredFame);
};
