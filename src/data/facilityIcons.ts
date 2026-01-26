/**
 * Facility Icons
 * 
 * Visual icons for all 12 facility types in the ludus management system
 */

import type { FacilityType } from '@/types/facility.types';

export const FACILITY_ICONS: Record<FacilityType, string> = {
  barracks: '🏚️',
  training_ground: '⚔️',
  armory: '🛡️',
  tavern: '🍺',
  library: '📚',
  forge: '🔨',
  stable: '🐴',
  market: '🏪',
  arena: '🏛️',
  medical_wing: '🏥',
  temple: '⛪',
  treasury: '💰',
};
