/**
 * Facility Icons
 * 
 * Visual icons for all 12 facility types in the ludus management system
 */

import type { FacilityType } from '@/types/facility.types';

export const FACILITY_ICONS: Record<FacilityType, string> = {
  BARRACKS: '🏚️',
  TRAINING_GROUND: '⚔️',
  ARMORY: '🛡️',
  INFIRMARY: '🏥',
  TAVERN: '🍺',
  SHRINE: '⛪',
  LIBRARY: '📚',
  FORGE: '🔨',
  STABLE: '🐴',
  MARKET: '🏪',
  ARENA: '🏛️',
  TREASURY: '💰',
};
