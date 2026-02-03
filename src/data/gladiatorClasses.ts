import type { GladiatorClass } from '@/types';

export interface GladiatorClassData {
  id: GladiatorClass;
  name: string;
  description: string;
  primaryWeapon: string;
  secondaryWeapon?: string;
  armor: string;
  defensiveProfile: 'very_light' | 'light' | 'medium' | 'heavy';
  tacticalStrength: string;
  tacticalWeakness: string;
  baseStats: {
    strength: number;
    agility: number;
    dexterity: number;
    endurance: number;
    constitution: number;
  };
  staminaDrainMultiplier: number; // Heavy armor drains faster
  classMultiplier: number; // Price multiplier
  icon: string;
}

export const GLADIATOR_CLASSES: Record<GladiatorClass, GladiatorClassData> = {
  murmillo: {
    id: 'murmillo',
    name: 'Murmillo',
    description: 'Heavy infantry gladiator with fish-crested helmet. Master of defense.',
    primaryWeapon: 'Gladius',
    secondaryWeapon: 'Scutum (Large Shield)',
    armor: 'Heavy (Fish-helmet)',
    defensiveProfile: 'heavy',
    tacticalStrength: 'High Defense',
    tacticalWeakness: 'Limited Vision/Airflow',
    baseStats: {
      strength: 60,
      agility: 35,
      dexterity: 45,
      endurance: 50,
      constitution: 65,
    },
    staminaDrainMultiplier: 1.3,
    classMultiplier: 1.2,
    icon: '🛡️',
  },
  retiarius: {
    id: 'retiarius',
    name: 'Retiarius',
    description: 'Net fighter with trident. Fast and deadly at range.',
    primaryWeapon: 'Trident',
    secondaryWeapon: 'Net',
    armor: 'Very Light (Galerus shoulder guard)',
    defensiveProfile: 'very_light',
    tacticalStrength: 'Agility/Range',
    tacticalWeakness: 'Highly Vulnerable',
    baseStats: {
      strength: 40,
      agility: 70,
      dexterity: 65,
      endurance: 55,
      constitution: 35,
    },
    staminaDrainMultiplier: 0.8,
    classMultiplier: 1.0,
    icon: '🔱',
  },
  thraex: {
    id: 'thraex',
    name: 'Thraex',
    description: 'Thracian fighter with curved sword. Excels at angled attacks.',
    primaryWeapon: 'Sica (Curved Sword)',
    armor: 'Medium (Parma shield)',
    defensiveProfile: 'medium',
    tacticalStrength: 'Angled Attacks',
    tacticalWeakness: 'Exposed Back/Legs',
    baseStats: {
      strength: 50,
      agility: 55,
      dexterity: 60,
      endurance: 50,
      constitution: 50,
    },
    staminaDrainMultiplier: 1.0,
    classMultiplier: 1.1,
    icon: '⚔️',
  },
  secutor: {
    id: 'secutor',
    name: 'Secutor',
    description: 'The "Chaser" - designed to fight the Retiarius. Net-proof helmet.',
    primaryWeapon: 'Gladius',
    secondaryWeapon: 'Dagger',
    armor: 'Heavy (Smooth helmet)',
    defensiveProfile: 'heavy',
    tacticalStrength: 'Anti-net Specialization',
    tacticalWeakness: 'Rapid Stamina Loss',
    baseStats: {
      strength: 55,
      agility: 45,
      dexterity: 50,
      endurance: 40,
      constitution: 60,
    },
    staminaDrainMultiplier: 1.5,
    classMultiplier: 1.15,
    icon: '🗡️',
  },
  hoplomachus: {
    id: 'hoplomachus',
    name: 'Hoplomachus',
    description: 'Greek-style heavy infantry with spear. Excellent reach.',
    primaryWeapon: 'Spear',
    secondaryWeapon: 'Dagger',
    armor: 'Medium (Round shield)',
    defensiveProfile: 'medium',
    tacticalStrength: 'Reach Advantage',
    tacticalWeakness: 'Close-quarters Combat',
    baseStats: {
      strength: 50,
      agility: 50,
      dexterity: 55,
      endurance: 55,
      constitution: 55,
    },
    staminaDrainMultiplier: 1.1,
    classMultiplier: 1.15,
    icon: '🏛️',
  },
  dimachaerus: {
    id: 'dimachaerus',
    name: 'Dimachaerus',
    description: 'Dual-wielding swordsman. High damage but no shield.',
    primaryWeapon: 'Dual Swords',
    armor: 'Light',
    defensiveProfile: 'light',
    tacticalStrength: 'High Damage Output',
    tacticalWeakness: 'No Shield Protection',
    baseStats: {
      strength: 55,
      agility: 60,
      dexterity: 65,
      endurance: 45,
      constitution: 40,
    },
    staminaDrainMultiplier: 0.9,
    classMultiplier: 1.25,
    icon: '⚔️',
  },
  samnite: {
    id: 'samnite',
    name: 'Samnite',
    description: 'Traditional heavy gladiator. Well-rounded fighter.',
    primaryWeapon: 'Short Sword',
    armor: 'Heavy (Large Scutum)',
    defensiveProfile: 'heavy',
    tacticalStrength: 'All-rounder',
    tacticalWeakness: 'Unarmored Abdomen',
    baseStats: {
      strength: 55,
      agility: 45,
      dexterity: 50,
      endurance: 55,
      constitution: 55,
    },
    staminaDrainMultiplier: 1.2,
    classMultiplier: 1.0,
    icon: '🏺',
  },
  velitus: {
    id: 'velitus',
    name: 'Velitus',
    description: 'Light skirmisher with javelin. Hit and run tactics.',
    primaryWeapon: 'Spear/Javelin',
    armor: 'Very Light',
    defensiveProfile: 'very_light',
    tacticalStrength: 'Ranged Skirmishing',
    tacticalWeakness: 'Low Durability',
    baseStats: {
      strength: 35,
      agility: 65,
      dexterity: 70,
      endurance: 50,
      constitution: 30,
    },
    staminaDrainMultiplier: 0.7,
    classMultiplier: 0.9,
    icon: '🎯',
  },
};

// Origin data for pricing and behavior
export interface GladiatorOriginData {
  id: string;
  name: string;
  description: string;
  basePriceMin: number;
  basePriceMax: number;
  priceMultiplier: number;
  baseObedience: number;
  baseMorale: number;
}

export const GLADIATOR_ORIGINS: Record<string, GladiatorOriginData> = {
  pow: {
    id: 'pow',
    name: 'Prisoner of War',
    description: 'Captured enemy soldiers. Skilled but resentful.',
    basePriceMin: 50,
    basePriceMax: 150,
    priceMultiplier: 0.8,
    baseObedience: 40,
    baseMorale: 0.6,
  },
  criminal: {
    id: 'criminal',
    name: 'Condemned Criminal',
    description: 'Noxii - criminals sentenced to the arena. Cheap but unpredictable.',
    basePriceMin: 30,
    basePriceMax: 100,
    priceMultiplier: 0.6,
    baseObedience: 30,
    baseMorale: 0.5,
  },
  volunteer: {
    id: 'volunteer',
    name: 'Auctorati (Volunteer)',
    description: 'Free men who chose the arena for fame or debt relief. Motivated.',
    basePriceMin: 100,
    basePriceMax: 300,
    priceMultiplier: 1.2,
    baseObedience: 70,
    baseMorale: 1.0,
  },
  elite: {
    id: 'elite',
    name: 'Trained Fighter',
    description: 'Pre-trained gladiator from another school. Experienced and skilled.',
    basePriceMin: 200,
    basePriceMax: 500,
    priceMultiplier: 1.5,
    baseObedience: 60,
    baseMorale: 0.9,
  },
};

// Roman names for gladiator generation
export const ROMAN_FIRST_NAMES = [
  'Marcus', 'Gaius', 'Lucius', 'Quintus', 'Titus', 'Publius', 'Gnaeus', 'Sextus',
  'Aulus', 'Decimus', 'Spurius', 'Manius', 'Servius', 'Appius', 'Numerius',
  'Tiberius', 'Vibius', 'Statius', 'Faustus', 'Caeso', 'Octavius', 'Crassus',
  'Drusus', 'Nero', 'Varro', 'Felix', 'Magnus', 'Maximus', 'Rufus', 'Brutus',
];

export const ROMAN_COGNOMENS = [
  'Africanus', 'Germanicus', 'Britannicus', 'Hispanus', 'Gallicus', 'Dacicus',
  'Ferox', 'Invictus', 'Triumphator', 'Victor', 'Pugnax', 'Audax', 'Fortis',
  'Celer', 'Agilis', 'Rapax', 'Cruentus', 'Mortifer', 'Bellator', 'Gladius',
  'Scutum', 'Fulmen', 'Tempestas', 'Ursus', 'Leo', 'Lupus', 'Aquila', 'Draco',
];

// Non-Roman names for POWs and slaves
export const FOREIGN_NAMES = [
  'Spartacus', 'Crixus', 'Oenomaus', 'Gannicus', 'Castus', 'Batiatus',
  'Theokoles', 'Caburus', 'Pericles', 'Agron', 'Duro', 'Vettius', 'Solonius',
  'Barca', 'Auctus', 'Rhaskos', 'Hamilcar', 'Nasir', 'Ashur', 'Doctore',
  'Ixion', 'Segovax', 'Sedullus', 'Nemetes', 'Lugo', 'Saxa', 'Mira', 'Naevia',
];
