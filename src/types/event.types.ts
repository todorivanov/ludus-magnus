/**
 * Game Event Types
 * 
 * Dynamic events and player choices
 */

import { FacilityType } from './facility.types';

export interface GameEvent {
  id: string;
  type: GameEventType;
  title: string;
  description: string;
  timestamp: number;
  
  // Effects
  effects?: EventEffect[];
  
  // Choices
  choices?: EventChoice[];
  resolved: boolean;
}

export type GameEventType = 
  | 'injury'
  | 'rebellion'
  | 'sponsor_offer'
  | 'rival_challenge'
  | 'natural_disaster'
  | 'plague'
  | 'political_upheaval'
  | 'special_tournament'
  | 'equipment_broken'
  | 'gladiator_death';

export interface EventEffect {
  type: 'stat_change' | 'gold_change' | 'reputation_change' | 'facility_damage';
  target: string;
  value: number;
}

export interface EventChoice {
  id: string;
  text: string;
  cost?: number;
  effects: EventEffect[];
  requirements?: {
    minGold?: number;
    minReputation?: number;
    hasFacility?: FacilityType;
  };
}
