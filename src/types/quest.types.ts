/**
 * Quest Types
 * 
 * Quest system and objectives
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  questGiver: string;
  location: string; // Location ID
  
  // Requirements
  minLevel: number;
  requiredPath?: 'gladiator' | 'lanista' | 'explorer';
  
  // Objectives
  objectives: QuestObjective[];
  
  // Rewards
  goldReward: number;
  xpReward: number;
  reputationReward: number;
  itemRewards?: string[]; // Item IDs
  
  // Status
  status: 'available' | 'active' | 'completed' | 'failed';
  progress: Record<string, number>;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'defeat_enemy' | 'win_tournament' | 'collect_item' | 'reach_location' | 'recruit_gladiator';
  target?: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
}
