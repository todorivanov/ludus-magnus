import type { GladiatorStats } from '@/types';

// Marketplace item types
export type MarketItemCategory = 
  | 'equipment'      // Weapons, armor
  | 'consumables'    // Potions, tonics
  | 'training'       // Training manuals, skill scrolls
  | 'luxury'         // Morale boosters
  | 'beasts'         // Animals for training/entertainment
  | 'services';      // Special services

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: MarketItemCategory;
  price: number;
  stock?: number; // Limited quantity, undefined = unlimited
  minFame?: number; // Ludus fame requirement to unlock
  effect: MarketItemEffect;
}

export interface MarketItemEffect {
  type: 
    | 'stat_boost'           // Permanent stat increase
    | 'heal'                 // HP/Stamina recovery
    | 'morale_boost'         // Morale increase
    | 'injury_heal'          // Reduce injury recovery time
    | 'xp_boost'             // Grant XP
    | 'skill_point'          // Grant skill points
    | 'training_boost'       // Temporary training efficiency
    | 'combat_buff'          // Temporary combat bonus
    | 'fame_boost'           // Instant fame
    | 'equipment';           // Equippable gear

  value?: number;
  stat?: keyof GladiatorStats;
  duration?: number; // For temporary effects (in days)
  quality?: 'common' | 'rare' | 'legendary';
}

// Equipment items
export const EQUIPMENT_ITEMS: Record<string, MarketItem> = {
  gladius_basic: {
    id: 'gladius_basic',
    name: 'Standard Gladius',
    description: 'Basic Roman short sword. Reliable and balanced.',
    icon: '🗡️',
    category: 'equipment',
    price: 50,
    effect: { type: 'equipment', quality: 'common' },
  },
  
  gladius_masterwork: {
    id: 'gladius_masterwork',
    name: 'Masterwork Gladius',
    description: 'Expertly crafted blade with perfect balance. +3 Strength, +2 Dexterity.',
    icon: '⚔️',
    category: 'equipment',
    price: 300,
    minFame: 100,
    effect: { type: 'stat_boost', value: 3, stat: 'strength' },
  },
  
  scutum_reinforced: {
    id: 'scutum_reinforced',
    name: 'Reinforced Scutum',
    description: 'Heavy shield with iron reinforcements. +5 Constitution.',
    icon: '🛡️',
    category: 'equipment',
    price: 200,
    minFame: 50,
    effect: { type: 'stat_boost', value: 5, stat: 'constitution' },
  },
  
  arena_champion_gear: {
    id: 'arena_champion_gear',
    name: 'Champion\'s Panoply',
    description: 'Legendary armor set worn by champions. +4 to all combat stats.',
    icon: '👑',
    category: 'equipment',
    price: 1500,
    stock: 1,
    minFame: 500,
    effect: { type: 'equipment', quality: 'legendary' },
  },
  
  training_weights: {
    id: 'training_weights',
    name: 'Training Weights',
    description: 'Iron weights for strength conditioning. +2 Strength, +1 Endurance.',
    icon: '🏋️',
    category: 'equipment',
    price: 100,
    effect: { type: 'stat_boost', value: 2, stat: 'strength' },
  },
  
  agility_sandals: {
    id: 'agility_sandals',
    name: 'Mercury\'s Sandals',
    description: 'Lightweight sandals for agility training. +3 Agility.',
    icon: '👟',
    category: 'equipment',
    price: 150,
    minFame: 75,
    effect: { type: 'stat_boost', value: 3, stat: 'agility' },
  },
};

// Consumables
export const CONSUMABLE_ITEMS: Record<string, MarketItem> = {
  healing_potion: {
    id: 'healing_potion',
    name: 'Healing Potion',
    description: 'Greek physician\'s remedy. Restores 30 HP immediately.',
    icon: '🧪',
    category: 'consumables',
    price: 40,
    effect: { type: 'heal', value: 30 },
  },
  
  stamina_tonic: {
    id: 'stamina_tonic',
    name: 'Stamina Tonic',
    description: 'Herbal mixture that restores 40 stamina.',
    icon: '🍵',
    category: 'consumables',
    price: 30,
    effect: { type: 'heal', value: 40 },
  },
  
  gladiator_brew: {
    id: 'gladiator_brew',
    name: 'Gladiator\'s Brew',
    description: 'Powerful tonic. Fully restores HP and stamina.',
    icon: '⚗️',
    category: 'consumables',
    price: 150,
    stock: 2,
    minFame: 200,
    effect: { type: 'heal', value: 100 },
  },
  
  pain_salve: {
    id: 'pain_salve',
    name: 'Pain Relief Salve',
    description: 'Reduces injury recovery time by 5 days.',
    icon: '💊',
    category: 'consumables',
    price: 80,
    effect: { type: 'injury_heal', value: 5 },
  },
  
  miracle_cure: {
    id: 'miracle_cure',
    name: 'Miracle Cure',
    description: 'Rare Egyptian remedy. Instantly heals one injury.',
    icon: '✨',
    category: 'consumables',
    price: 300,
    stock: 1,
    minFame: 300,
    effect: { type: 'injury_heal', value: 100 },
  },
  
  berserker_mushroom: {
    id: 'berserker_mushroom',
    name: 'Berserker Mushroom',
    description: 'Dangerous fungus. +30% damage for next fight, but -10% accuracy.',
    icon: '🍄',
    category: 'consumables',
    price: 60,
    effect: { type: 'combat_buff', value: 30, duration: 1 },
  },
  
  focus_elixir: {
    id: 'focus_elixir',
    name: 'Focus Elixir',
    description: 'Alchemical mixture. +20% accuracy for next fight.',
    icon: '🔮',
    category: 'consumables',
    price: 50,
    effect: { type: 'combat_buff', value: 20, duration: 1 },
  },
};

// Training items
export const TRAINING_ITEMS: Record<string, MarketItem> = {
  combat_manual: {
    id: 'combat_manual',
    name: 'Combat Manual',
    description: 'Military tactics scroll. Grants 100 XP to one gladiator.',
    icon: '📜',
    category: 'training',
    price: 80,
    effect: { type: 'xp_boost', value: 100 },
  },
  
  master_techniques: {
    id: 'master_techniques',
    name: 'Master\'s Techniques',
    description: 'Advanced combat knowledge. Grants 1 skill point.',
    icon: '📖',
    category: 'training',
    price: 200,
    minFame: 150,
    effect: { type: 'skill_point', value: 1 },
  },
  
  legendary_scroll: {
    id: 'legendary_scroll',
    name: 'Legendary Combat Scroll',
    description: 'Ancient techniques of legendary warriors. Grants 3 skill points.',
    icon: '📯',
    category: 'training',
    price: 600,
    stock: 1,
    minFame: 400,
    effect: { type: 'skill_point', value: 3 },
  },
  
  training_regimen: {
    id: 'training_regimen',
    name: 'Elite Training Regimen',
    description: 'Specialized training plan. +50% training speed for 7 days.',
    icon: '📋',
    category: 'training',
    price: 150,
    effect: { type: 'training_boost', value: 50, duration: 7 },
  },
};

// Luxury items
export const LUXURY_ITEMS: Record<string, MarketItem> = {
  fine_wine: {
    id: 'fine_wine',
    name: 'Falernian Wine',
    description: 'Premium Roman wine. +15 morale to one gladiator.',
    icon: '🍾',
    category: 'luxury',
    price: 30,
    effect: { type: 'morale_boost', value: 15 },
  },
  
  silk_bedding: {
    id: 'silk_bedding',
    name: 'Silk Bedding',
    description: 'Luxurious Eastern silk. +25 morale to one gladiator.',
    icon: '🛏️',
    category: 'luxury',
    price: 80,
    minFame: 100,
    effect: { type: 'morale_boost', value: 25 },
  },
  
  victory_laurel: {
    id: 'victory_laurel',
    name: 'Golden Laurel Crown',
    description: 'Symbol of excellence. +50 fame to one gladiator.',
    icon: '🏅',
    category: 'luxury',
    price: 200,
    minFame: 200,
    effect: { type: 'fame_boost', value: 50 },
  },
  
  perfume_oil: {
    id: 'perfume_oil',
    name: 'Arabian Perfume',
    description: 'Exotic scented oil. +20 morale to entire roster.',
    icon: '🫙',
    category: 'luxury',
    price: 150,
    minFame: 150,
    effect: { type: 'morale_boost', value: 20 },
  },
  
  marble_statue: {
    id: 'marble_statue',
    name: 'Marble Statue',
    description: 'Commission a statue of your champion. +100 ludus fame.',
    icon: '🗿',
    category: 'luxury',
    price: 500,
    minFame: 300,
    effect: { type: 'fame_boost', value: 100 },
  },
};

// Beast items
export const BEAST_ITEMS: Record<string, MarketItem> = {
  training_wolf: {
    id: 'training_wolf',
    name: 'Training Wolf',
    description: 'Wolf for combat training. Grants beast fighting experience.',
    icon: '🐺',
    category: 'beasts',
    price: 120,
    effect: { type: 'xp_boost', value: 50 },
  },
  
  wild_boar: {
    id: 'wild_boar',
    name: 'Wild Boar',
    description: 'Aggressive boar for advanced training. +1 Agility, 75 XP.',
    icon: '🐗',
    category: 'beasts',
    price: 180,
    minFame: 100,
    effect: { type: 'xp_boost', value: 75 },
  },
  
  arena_lion: {
    id: 'arena_lion',
    name: 'Arena Lion',
    description: 'Majestic lion for spectacular exhibitions. Grants 150 fame.',
    icon: '🦁',
    category: 'beasts',
    price: 400,
    stock: 1,
    minFame: 250,
    effect: { type: 'fame_boost', value: 150 },
  },
  
  war_bear: {
    id: 'war_bear',
    name: 'Caledonian Bear',
    description: 'Massive bear from the north. Defeating it grants 200 XP and +2 Strength.',
    icon: '🐻',
    category: 'beasts',
    price: 600,
    stock: 1,
    minFame: 400,
    effect: { type: 'xp_boost', value: 200 },
  },
};

// Service items
export const SERVICE_ITEMS: Record<string, MarketItem> = {
  physician_service: {
    id: 'physician_service',
    name: 'Greek Physician',
    description: 'Hire a traveling physician for one treatment. Heals any injury.',
    icon: '⚕️',
    category: 'services',
    price: 150,
    effect: { type: 'injury_heal', value: 100 },
  },
  
  master_trainer: {
    id: 'master_trainer',
    name: 'Master Trainer Visit',
    description: 'Legendary trainer provides one-on-one session. +200 XP and 1 skill point.',
    icon: '🥋',
    category: 'services',
    price: 250,
    minFame: 200,
    effect: { type: 'xp_boost', value: 200 },
  },
  
  oracle_blessing: {
    id: 'oracle_blessing',
    name: 'Oracle\'s Blessing',
    description: 'Divine favor from Delphi. +40 morale to all gladiators for 7 days.',
    icon: '🔮',
    category: 'services',
    price: 300,
    minFame: 250,
    effect: { type: 'morale_boost', value: 40, duration: 7 },
  },
  
  imperial_sponsor: {
    id: 'imperial_sponsor',
    name: 'Imperial Introduction',
    description: 'Introduction to imperial court. +200 ludus fame instantly.',
    icon: '👑',
    category: 'services',
    price: 800,
    stock: 1,
    minFame: 500,
    effect: { type: 'fame_boost', value: 200 },
  },
};

// All marketplace items combined
export const ALL_MARKET_ITEMS = {
  ...EQUIPMENT_ITEMS,
  ...CONSUMABLE_ITEMS,
  ...TRAINING_ITEMS,
  ...LUXURY_ITEMS,
  ...BEAST_ITEMS,
  ...SERVICE_ITEMS,
};

// Get items by category
export const getItemsByCategory = (category: MarketItemCategory): MarketItem[] => {
  return Object.values(ALL_MARKET_ITEMS).filter(item => item.category === category);
};

// Get available items based on fame
export const getAvailableItems = (ludusFame: number): MarketItem[] => {
  return Object.values(ALL_MARKET_ITEMS).filter(
    item => !item.minFame || ludusFame >= item.minFame
  );
};

// Category display info
export const CATEGORY_INFO: Record<MarketItemCategory, { name: string; icon: string; description: string }> = {
  equipment: {
    name: 'Equipment',
    icon: '⚔️',
    description: 'Weapons and armor to enhance your gladiators',
  },
  consumables: {
    name: 'Consumables',
    icon: '🧪',
    description: 'Potions and tonics for immediate effects',
  },
  training: {
    name: 'Training',
    icon: '📚',
    description: 'Manuals and scrolls to improve skills',
  },
  luxury: {
    name: 'Luxury Items',
    icon: '💎',
    description: 'Fine goods to boost morale and fame',
  },
  beasts: {
    name: 'Beasts',
    icon: '🦁',
    description: 'Animals for training and spectacle',
  },
  services: {
    name: 'Services',
    icon: '⚕️',
    description: 'Special services from experts and merchants',
  },
};
