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
    minFame: 50,
    title: 'Known Lanista',
    description: 'Your ludus has gained some recognition in the local area.',
    benefits: [
      { type: 'income', value: 5, description: '+5 gold daily from visitors' },
    ],
    icon: '🏠',
  },
  {
    id: 'neighborhood',
    name: 'Neighborhood',
    minFame: 100,
    title: 'Neighborhood Lanista',
    description: 'People in your district know your ludus by name.',
    benefits: [
      { type: 'income', value: 10, description: '+10 gold daily from visitors' },
      { type: 'discount', value: 3, description: '3% discount on supplies' },
    ],
    icon: '🏘️',
  },
  {
    id: 'district',
    name: 'District',
    minFame: 175,
    title: 'District Lanista',
    description: 'Your ludus is known across several neighborhoods.',
    benefits: [
      { type: 'income', value: 18, description: '+18 gold daily from visitors' },
      { type: 'discount', value: 5, description: '5% discount on supplies' },
    ],
    icon: '🏢',
  },
  {
    id: 'city',
    name: 'City',
    minFame: 250,
    title: 'City Lanista',
    description: 'Citizens throughout the city know of your fighters.',
    benefits: [
      { type: 'income', value: 28, description: '+28 gold daily from visitors' },
      { type: 'discount', value: 8, description: '8% discount on supplies' },
      { type: 'access', value: 1, description: 'Access to city tournaments' },
    ],
    icon: '🌆',
  },
  {
    id: 'regional',
    name: 'Regional',
    minFame: 400,
    title: 'Respected Lanista',
    description: 'Your ludus is known throughout the region. Crowds gather to see your fighters.',
    benefits: [
      { type: 'income', value: 45, description: '+45 gold daily from visitors' },
      { type: 'discount', value: 10, description: '10% discount on supplies' },
      { type: 'access', value: 1, description: 'Access to regional tournaments' },
      { type: 'bonus', value: 5, description: '+5% gladiator sale prices' },
    ],
    icon: '🏛️',
  },
  {
    id: 'provincial',
    name: 'Provincial',
    minFame: 600,
    title: 'Provincial Lanista',
    description: 'Your fame has spread to neighboring provinces.',
    benefits: [
      { type: 'income', value: 70, description: '+70 gold daily from visitors' },
      { type: 'discount', value: 12, description: '12% discount on all purchases' },
      { type: 'access', value: 2, description: 'Access to provincial games' },
      { type: 'bonus', value: 10, description: '+10% gladiator sale prices' },
    ],
    icon: '🏰',
  },
  {
    id: 'renowned',
    name: 'Renowned',
    minFame: 850,
    title: 'Renowned Lanista',
    description: 'Your ludus is famous across multiple provinces. Nobles seek your gladiators.',
    benefits: [
      { type: 'income', value: 100, description: '+100 gold daily from visitors' },
      { type: 'discount', value: 15, description: '15% discount on all purchases' },
      { type: 'access', value: 2, description: 'Access to grand tournaments' },
      { type: 'bonus', value: 15, description: '+15% gladiator sale prices' },
      { type: 'bonus', value: 5, description: '+5% training effectiveness' },
    ],
    icon: '⭐',
  },
  {
    id: 'famous',
    name: 'Famous',
    minFame: 1200,
    title: 'Famous Lanista',
    description: 'Your name is spoken in taverns across the Empire.',
    benefits: [
      { type: 'income', value: 140, description: '+140 gold daily from visitors' },
      { type: 'discount', value: 18, description: '18% discount on all purchases' },
      { type: 'access', value: 3, description: 'Access to major games' },
      { type: 'bonus', value: 20, description: '+20% gladiator sale prices' },
      { type: 'bonus', value: 8, description: '+8% training effectiveness' },
    ],
    icon: '🌟',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    minFame: 1600,
    title: 'Legendary Lanista',
    description: 'Your ludus is known throughout the Empire. The Emperor himself watches your games.',
    benefits: [
      { type: 'income', value: 200, description: '+200 gold daily from visitors' },
      { type: 'discount', value: 22, description: '22% discount on all purchases' },
      { type: 'access', value: 3, description: 'Access to Colosseum games' },
      { type: 'bonus', value: 30, description: '+30% gladiator sale prices' },
      { type: 'bonus', value: 12, description: '+12% training effectiveness' },
    ],
    icon: '👑',
  },
  {
    id: 'immortal',
    name: 'Immortal',
    minFame: 2500,
    title: 'Immortal Lanista',
    description: 'Your legacy will echo through the ages. Songs are sung of your gladiators.',
    benefits: [
      { type: 'income', value: 300, description: '+300 gold daily from visitors' },
      { type: 'discount', value: 25, description: '25% discount on all purchases' },
      { type: 'access', value: 4, description: 'Imperial games invitation' },
      { type: 'bonus', value: 40, description: '+40% gladiator sale prices' },
      { type: 'bonus', value: 15, description: '+15% training effectiveness' },
      { type: 'bonus', value: 10, description: '+10% all combat stats' },
    ],
    icon: '🏆',
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
    id: 'initiate',
    name: 'Initiate',
    minFame: 25,
    title: 'Novicius',
    description: 'A fresh recruit showing potential.',
    benefits: [
      { type: 'income', value: 2, description: '+2 gold daily from fan gifts' },
    ],
    icon: '🔰',
  },
  {
    id: 'fighter',
    name: 'Fighter',
    minFame: 50,
    title: 'Gladiator',
    description: 'A proven warrior who has survived the arena.',
    benefits: [
      { type: 'income', value: 5, description: '+5 gold daily from fan gifts' },
      { type: 'bonus', value: 3, description: '+3% morale recovery' },
    ],
    icon: '🗡️',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    minFame: 100,
    title: 'Bellator',
    description: 'A skilled warrior with several victories.',
    benefits: [
      { type: 'income', value: 10, description: '+10 gold daily from fan gifts' },
      { type: 'bonus', value: 5, description: '+5% morale recovery' },
      { type: 'bonus', value: 3, description: '+3% crowd favor gain' },
    ],
    icon: '⚔️',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    minFame: 175,
    title: 'Veteranus',
    description: 'An experienced gladiator with many victories.',
    benefits: [
      { type: 'income', value: 18, description: '+18 gold daily from fan gifts' },
      { type: 'bonus', value: 8, description: '+8% morale recovery' },
      { type: 'bonus', value: 5, description: '+5% crowd favor gain' },
    ],
    icon: '🏅',
  },
  {
    id: 'elite',
    name: 'Elite',
    minFame: 275,
    title: 'Praestans',
    description: 'An elite fighter known throughout the city.',
    benefits: [
      { type: 'income', value: 28, description: '+28 gold daily from fan gifts' },
      { type: 'bonus', value: 10, description: '+10% morale recovery' },
      { type: 'bonus', value: 8, description: '+8% crowd favor gain' },
      { type: 'bonus', value: 3, description: '+3% critical hit chance' },
    ],
    icon: '💪',
  },
  {
    id: 'champion',
    name: 'Champion',
    minFame: 400,
    title: 'Primus Palus',
    description: 'A champion of the arena, beloved by the crowd.',
    benefits: [
      { type: 'income', value: 45, description: '+45 gold daily from fan gifts' },
      { type: 'bonus', value: 12, description: '+12% morale recovery' },
      { type: 'bonus', value: 10, description: '+10% crowd favor gain' },
      { type: 'bonus', value: 5, description: '+5% critical hit chance' },
    ],
    icon: '🏆',
  },
  {
    id: 'hero',
    name: 'Hero',
    minFame: 550,
    title: 'Heros',
    description: 'A hero of the arena, crowds chant their name.',
    benefits: [
      { type: 'income', value: 65, description: '+65 gold daily from fan gifts' },
      { type: 'bonus', value: 15, description: '+15% morale recovery' },
      { type: 'bonus', value: 12, description: '+12% crowd favor gain' },
      { type: 'bonus', value: 7, description: '+7% critical hit chance' },
      { type: 'bonus', value: 5, description: '+5% intimidation in combat' },
    ],
    icon: '🦁',
  },
  {
    id: 'legend',
    name: 'Legend',
    minFame: 750,
    title: 'Legendarius',
    description: 'A living legend whose name echoes through history.',
    benefits: [
      { type: 'income', value: 100, description: '+100 gold daily from fan gifts' },
      { type: 'bonus', value: 20, description: '+20% morale recovery' },
      { type: 'bonus', value: 15, description: '+15% crowd favor gain' },
      { type: 'bonus', value: 10, description: '+10% critical hit chance' },
      { type: 'bonus', value: 8, description: '+8% intimidation in combat' },
    ],
    icon: '⭐',
  },
  {
    id: 'mythic',
    name: 'Mythic',
    minFame: 1000,
    title: 'Mythicus',
    description: 'A mythic figure, their deeds inspire generations.',
    benefits: [
      { type: 'income', value: 150, description: '+150 gold daily from fan gifts' },
      { type: 'bonus', value: 25, description: '+25% morale recovery' },
      { type: 'bonus', value: 20, description: '+20% crowd favor gain' },
      { type: 'bonus', value: 12, description: '+12% critical hit chance' },
      { type: 'bonus', value: 12, description: '+12% intimidation in combat' },
    ],
    icon: '🌟',
  },
  {
    id: 'immortal',
    name: 'Immortal',
    minFame: 1500,
    title: 'Immortalis',
    description: 'Their name will live forever in the annals of history.',
    benefits: [
      { type: 'income', value: 250, description: '+250 gold daily from fan gifts' },
      { type: 'bonus', value: 30, description: '+30% morale recovery' },
      { type: 'bonus', value: 25, description: '+25% crowd favor gain' },
      { type: 'bonus', value: 15, description: '+15% critical hit chance' },
      { type: 'bonus', value: 15, description: '+15% intimidation in combat' },
      { type: 'bonus', value: 5, description: '+5% all combat stats' },
    ],
    icon: '👑',
  },
];

// Merchandise Items
export const MERCHANDISE_ITEMS: MerchandiseItem[] = [
  // Basic tier (0-100 fame)
  {
    id: 'clay_figurine',
    name: 'Clay Figurine',
    description: 'Simple clay figurines of your gladiators.',
    type: 'figurine',
    baseCost: 30,
    baseIncome: 2,
    fameBonusMultiplier: 0.01,
    requiredLudusFame: 0,
    icon: '🏺',
  },
  {
    id: 'ludus_banner',
    name: 'Ludus Banner',
    description: 'Small cloth banners with your ludus emblem.',
    type: 'clothing',
    baseCost: 40,
    baseIncome: 2,
    fameBonusMultiplier: 0.01,
    requiredLudusFame: 50,
    icon: '🚩',
  },
  // Local tier (100-250 fame)
  {
    id: 'wooden_sword',
    name: 'Wooden Practice Sword',
    description: 'Toy swords for children to emulate their heroes.',
    type: 'weapon_replica',
    baseCost: 60,
    baseIncome: 4,
    fameBonusMultiplier: 0.02,
    requiredLudusFame: 100,
    icon: '🗡️',
  },
  {
    id: 'fighter_mask',
    name: 'Fighter Mask',
    description: 'Decorative masks resembling gladiator helmets.',
    type: 'souvenir',
    baseCost: 75,
    baseIncome: 5,
    fameBonusMultiplier: 0.02,
    requiredLudusFame: 125,
    icon: '🎭',
  },
  {
    id: 'ludus_cup',
    name: 'Commemorative Cup',
    description: 'Drinking cups with your ludus name inscribed.',
    type: 'souvenir',
    baseCost: 50,
    baseIncome: 3,
    fameBonusMultiplier: 0.015,
    requiredLudusFame: 150,
    icon: '🏆',
  },
  // City tier (250-400 fame)
  {
    id: 'gladiator_tunic',
    name: 'Gladiator Tunic',
    description: 'Tunics bearing your ludus colors and emblem.',
    type: 'clothing',
    baseCost: 100,
    baseIncome: 7,
    fameBonusMultiplier: 0.03,
    requiredLudusFame: 200,
    icon: '👕',
  },
  {
    id: 'arena_sand',
    name: 'Arena Sand Vial',
    description: 'Vials of sand from famous battles - a prized souvenir.',
    type: 'souvenir',
    baseCost: 120,
    baseIncome: 8,
    fameBonusMultiplier: 0.03,
    requiredLudusFame: 250,
    icon: '⏳',
  },
  {
    id: 'bronze_figurine',
    name: 'Bronze Figurine',
    description: 'Detailed bronze statues of champion gladiators.',
    type: 'figurine',
    baseCost: 180,
    baseIncome: 12,
    fameBonusMultiplier: 0.04,
    requiredLudusFame: 300,
    icon: '🥉',
  },
  {
    id: 'leather_wristband',
    name: 'Leather Wristband',
    description: 'Leather wristbands stamped with gladiator symbols.',
    type: 'clothing',
    baseCost: 80,
    baseIncome: 6,
    fameBonusMultiplier: 0.025,
    requiredLudusFame: 350,
    icon: '⌚',
  },
  // Regional tier (400-600 fame)
  {
    id: 'painted_portrait',
    name: 'Painted Portrait',
    description: 'Commissioned portraits of your fighters.',
    type: 'portrait',
    baseCost: 250,
    baseIncome: 18,
    fameBonusMultiplier: 0.05,
    requiredLudusFame: 400,
    icon: '🖼️',
  },
  {
    id: 'replica_trident',
    name: 'Replica Trident',
    description: 'Miniature tridents for Retiarius fans.',
    type: 'weapon_replica',
    baseCost: 200,
    baseIncome: 14,
    fameBonusMultiplier: 0.045,
    requiredLudusFame: 450,
    icon: '🔱',
  },
  {
    id: 'gladiator_sandals',
    name: 'Gladiator Sandals',
    description: 'Stylish sandals inspired by arena fighters.',
    type: 'clothing',
    baseCost: 150,
    baseIncome: 10,
    fameBonusMultiplier: 0.035,
    requiredLudusFame: 500,
    icon: '👡',
  },
  {
    id: 'victory_coin',
    name: 'Victory Coin',
    description: 'Commemorative coins minted after great victories.',
    type: 'souvenir',
    baseCost: 180,
    baseIncome: 12,
    fameBonusMultiplier: 0.04,
    requiredLudusFame: 550,
    icon: '🪙',
  },
  // Provincial tier (600-850 fame)
  {
    id: 'replica_armor',
    name: 'Replica Armor Set',
    description: 'Miniature replica armor of famous gladiators.',
    type: 'weapon_replica',
    baseCost: 350,
    baseIncome: 25,
    fameBonusMultiplier: 0.06,
    requiredLudusFame: 600,
    icon: '🛡️',
  },
  {
    id: 'silver_figurine',
    name: 'Silver Figurine',
    description: 'Elegant silver statues of your champions.',
    type: 'figurine',
    baseCost: 400,
    baseIncome: 30,
    fameBonusMultiplier: 0.065,
    requiredLudusFame: 700,
    icon: '🥈',
  },
  {
    id: 'mosaic_tile',
    name: 'Mosaic Tile Art',
    description: 'Small mosaic tiles depicting arena scenes.',
    type: 'portrait',
    baseCost: 300,
    baseIncome: 22,
    fameBonusMultiplier: 0.055,
    requiredLudusFame: 750,
    icon: '🎨',
  },
  {
    id: 'champion_cloak',
    name: 'Champion\'s Cloak',
    description: 'Luxurious cloaks in your ludus colors.',
    type: 'clothing',
    baseCost: 280,
    baseIncome: 20,
    fameBonusMultiplier: 0.05,
    requiredLudusFame: 800,
    icon: '🧥',
  },
  // Renowned tier (850-1200 fame)
  {
    id: 'gold_medallion',
    name: 'Gold Victory Medallion',
    description: 'Gold medallions commemorating great victories.',
    type: 'souvenir',
    baseCost: 500,
    baseIncome: 40,
    fameBonusMultiplier: 0.08,
    requiredLudusFame: 900,
    icon: '🥇',
  },
  {
    id: 'marble_bust',
    name: 'Marble Bust',
    description: 'Carved marble busts of legendary gladiators.',
    type: 'figurine',
    baseCost: 600,
    baseIncome: 50,
    fameBonusMultiplier: 0.09,
    requiredLudusFame: 1000,
    icon: '🗿',
  },
  {
    id: 'silk_banner',
    name: 'Silk Banner',
    description: 'Premium silk banners with intricate embroidery.',
    type: 'clothing',
    baseCost: 450,
    baseIncome: 35,
    fameBonusMultiplier: 0.07,
    requiredLudusFame: 1100,
    icon: '🎌',
  },
  // Legendary tier (1200+ fame)
  {
    id: 'jeweled_sword',
    name: 'Jeweled Replica Sword',
    description: 'Decorative swords with precious gems.',
    type: 'weapon_replica',
    baseCost: 800,
    baseIncome: 65,
    fameBonusMultiplier: 0.1,
    requiredLudusFame: 1300,
    icon: '⚔️',
  },
  {
    id: 'grand_portrait',
    name: 'Grand Portrait',
    description: 'Life-sized paintings by master artists.',
    type: 'portrait',
    baseCost: 750,
    baseIncome: 60,
    fameBonusMultiplier: 0.095,
    requiredLudusFame: 1500,
    icon: '🖼️',
  },
  {
    id: 'golden_statue',
    name: 'Golden Statue',
    description: 'Gold-plated statues of your greatest champions.',
    type: 'figurine',
    baseCost: 1000,
    baseIncome: 85,
    fameBonusMultiplier: 0.12,
    requiredLudusFame: 1800,
    icon: '🏅',
  },
  {
    id: 'imperial_collection',
    name: 'Imperial Collection',
    description: 'A complete set of premium collectibles fit for nobility.',
    type: 'souvenir',
    baseCost: 1500,
    baseIncome: 120,
    fameBonusMultiplier: 0.15,
    requiredLudusFame: 2200,
    icon: '👑',
  },
];

// Sponsorship Deals
export const SPONSORSHIP_DEALS: SponsorshipDeal[] = [
  // Early sponsors (0-200 fame)
  {
    id: 'tavern_keeper',
    name: 'Tavern Partnership',
    sponsor: 'The Gladius Tavern',
    description: 'A local tavern wants to display your ludus banner.',
    requiredFame: 0,
    dailyPayment: 5,
    duration: 20,
    conditions: ['Have at least 1 gladiator'],
    bonuses: [],
    icon: '🍺',
  },
  {
    id: 'local_baker',
    name: 'Baker Sponsorship',
    sponsor: 'Panis Bakery',
    description: 'A baker offers bread in exchange for promoting his shop.',
    requiredFame: 50,
    dailyPayment: 8,
    duration: 25,
    conditions: ['Display their sign at your ludus'],
    bonuses: [{ stat: 'grain_discount', value: 10 }],
    icon: '🥖',
  },
  {
    id: 'local_merchant',
    name: 'Local Merchant Sponsorship',
    sponsor: 'Marcus the Merchant',
    description: 'A local merchant wants to associate his name with your ludus.',
    requiredFame: 100,
    dailyPayment: 12,
    duration: 30,
    conditions: ['Win at least 1 match every 10 days'],
    bonuses: [],
    icon: '🏪',
  },
  {
    id: 'olive_oil_trader',
    name: 'Olive Oil Partnership',
    sponsor: 'Oleum Traders',
    description: 'An olive oil merchant wants gladiators to use their product.',
    requiredFame: 150,
    dailyPayment: 15,
    duration: 30,
    conditions: ['Maintain at least 3 gladiators'],
    bonuses: [{ stat: 'healing', value: 5 }],
    icon: '🫒',
  },
  // Growing sponsors (200-400 fame)
  {
    id: 'wine_maker',
    name: 'Wine Maker Partnership',
    sponsor: 'Vinum Vineyards',
    description: 'A vineyard wants your gladiators to promote their wine.',
    requiredFame: 200,
    dailyPayment: 22,
    duration: 45,
    conditions: ['Maintain at least 4 gladiators'],
    bonuses: [{ stat: 'morale', value: 5 }],
    icon: '🍷',
  },
  {
    id: 'leather_crafter',
    name: 'Leather Crafter Deal',
    sponsor: 'Corium Workshop',
    description: 'Quality leather goods in exchange for endorsement.',
    requiredFame: 250,
    dailyPayment: 28,
    duration: 45,
    conditions: ['Gladiators wear their gear in public'],
    bonuses: [{ stat: 'armor', value: 5 }],
    icon: '🧤',
  },
  {
    id: 'grain_supplier',
    name: 'Grain Supplier Contract',
    sponsor: 'Triticum Farms',
    description: 'Steady grain supply at reduced costs.',
    requiredFame: 300,
    dailyPayment: 18,
    duration: 60,
    conditions: ['Purchase grain exclusively from them'],
    bonuses: [{ stat: 'grain_discount', value: 25 }],
    icon: '🌾',
  },
  {
    id: 'armor_smith',
    name: 'Armor Smith Contract',
    sponsor: 'Ferrum Forge',
    description: 'An armor smith provides equipment in exchange for advertising.',
    requiredFame: 350,
    dailyPayment: 35,
    duration: 60,
    conditions: ['Display their brand on equipment', 'Win 50% of matches'],
    bonuses: [{ stat: 'armor', value: 10 }],
    icon: '⚒️',
  },
  // Established sponsors (400-700 fame)
  {
    id: 'weapon_master',
    name: 'Master Weaponsmith',
    sponsor: 'Gladius Maximus Arms',
    description: 'Premium weapons from the best smiths in the region.',
    requiredFame: 400,
    dailyPayment: 45,
    duration: 75,
    conditions: ['Use only their weapons', 'Win at least 5 matches'],
    bonuses: [{ stat: 'weapon_damage', value: 10 }],
    icon: '⚔️',
  },
  {
    id: 'bathhouse_owner',
    name: 'Bathhouse Partnership',
    sponsor: 'Thermae Luxus',
    description: 'Free access to premium bathhouse facilities.',
    requiredFame: 450,
    dailyPayment: 40,
    duration: 60,
    conditions: ['Gladiators visit weekly'],
    bonuses: [{ stat: 'morale', value: 8 }, { stat: 'healing', value: 10 }],
    icon: '🛁',
  },
  {
    id: 'noble_patron',
    name: 'Noble Patron',
    sponsor: 'Senator Gaius Aurelius',
    description: 'A wealthy senator becomes your patron.',
    requiredFame: 500,
    dailyPayment: 60,
    duration: 90,
    conditions: ['Dedicate victories to the Senator', 'Maintain fame above 400'],
    bonuses: [{ stat: 'fame_gain', value: 10 }],
    icon: '🏛️',
  },
  {
    id: 'horse_breeder',
    name: 'Equestrian Partnership',
    sponsor: 'Equus Nobility Stables',
    description: 'Access to horses for chariot events and transport.',
    requiredFame: 550,
    dailyPayment: 55,
    duration: 75,
    conditions: ['Participate in mounted events'],
    bonuses: [{ stat: 'speed', value: 5 }],
    icon: '🐎',
  },
  {
    id: 'medical_guild',
    name: 'Physicians Guild',
    sponsor: 'Collegium Medicorum',
    description: 'Access to the finest physicians in the city.',
    requiredFame: 600,
    dailyPayment: 50,
    duration: 90,
    conditions: ['Allow guild medics to study your gladiators'],
    bonuses: [{ stat: 'healing', value: 20 }, { stat: 'injury_recovery', value: 15 }],
    icon: '⚕️',
  },
  {
    id: 'textile_magnate',
    name: 'Textile Magnate',
    sponsor: 'Purpura Textiles',
    description: 'Finest fabrics and prestigious colors for your ludus.',
    requiredFame: 650,
    dailyPayment: 65,
    duration: 90,
    conditions: ['Wear their colors exclusively'],
    bonuses: [{ stat: 'fame_gain', value: 8 }, { stat: 'morale', value: 5 }],
    icon: '🧵',
  },
  // Elite sponsors (700-1000 fame)
  {
    id: 'military_general',
    name: 'Military Patronage',
    sponsor: 'General Titus Maximus',
    description: 'A retired general takes interest in your training methods.',
    requiredFame: 750,
    dailyPayment: 80,
    duration: 120,
    conditions: ['Train gladiators in military formations', 'Win 60% of matches'],
    bonuses: [{ stat: 'training_xp', value: 15 }, { stat: 'discipline', value: 10 }],
    icon: '🎖️',
  },
  {
    id: 'shipping_magnate',
    name: 'Maritime Merchant',
    sponsor: 'Navis Trading Company',
    description: 'Exotic goods and supplies from across the Empire.',
    requiredFame: 850,
    dailyPayment: 95,
    duration: 120,
    conditions: ['Promote their trade routes'],
    bonuses: [{ stat: 'all_discounts', value: 15 }],
    icon: '⛵',
  },
  {
    id: 'banking_house',
    name: 'Banking House Investment',
    sponsor: 'Argentum Bank',
    description: 'Financial backing from the wealthiest bankers.',
    requiredFame: 950,
    dailyPayment: 110,
    duration: 150,
    conditions: ['Maintain positive finances', 'No debts'],
    bonuses: [{ stat: 'gold_income', value: 15 }],
    icon: '🏦',
  },
  // Prestigious sponsors (1000+ fame)
  {
    id: 'high_priest',
    name: 'Temple Blessing',
    sponsor: 'Temple of Mars',
    description: 'The priests of Mars bless your gladiators before battle.',
    requiredFame: 1100,
    dailyPayment: 90,
    duration: 90,
    conditions: ['Make offerings to Mars', 'Win grand battles'],
    bonuses: [{ stat: 'combat_bonus', value: 10 }, { stat: 'morale', value: 15 }],
    icon: '⛩️',
  },
  {
    id: 'arena_owner',
    name: 'Arena Partnership',
    sponsor: 'Amphitheatrum Flavium',
    description: 'Exclusive partnership with a major arena.',
    requiredFame: 1300,
    dailyPayment: 130,
    duration: 180,
    conditions: ['Fight exclusively at their arena', 'Provide top gladiators'],
    bonuses: [{ stat: 'fame_gain', value: 20 }, { stat: 'gold_income', value: 10 }],
    icon: '🏟️',
  },
  {
    id: 'consul',
    name: 'Consular Patronage',
    sponsor: 'Consul Marcus Crassus',
    description: 'One of Rome\'s highest officials takes you under his wing.',
    requiredFame: 1500,
    dailyPayment: 160,
    duration: 180,
    conditions: ['Fight for political events', 'Maintain excellent reputation'],
    bonuses: [{ stat: 'fame_gain', value: 25 }, { stat: 'political_favor', value: 15 }],
    icon: '📜',
  },
  {
    id: 'imperial_favor',
    name: 'Imperial Favor',
    sponsor: 'The Imperial House',
    description: 'The Emperor himself shows interest in your gladiators.',
    requiredFame: 1800,
    dailyPayment: 200,
    duration: 180,
    conditions: ['Win in Colosseum events', 'Maintain legendary status'],
    bonuses: [{ stat: 'all', value: 5 }, { stat: 'fame_gain', value: 30 }],
    icon: '👑',
  },
  {
    id: 'imperial_games',
    name: 'Imperial Games Contract',
    sponsor: 'Imperial Entertainment Office',
    description: 'Exclusive contract for the Emperor\'s personal games.',
    requiredFame: 2200,
    dailyPayment: 300,
    duration: 365,
    conditions: ['Provide gladiators for imperial events', 'Never refuse a summons'],
    bonuses: [{ stat: 'all', value: 10 }, { stat: 'fame_gain', value: 50 }, { stat: 'gold_income', value: 25 }],
    icon: '🦅',
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
