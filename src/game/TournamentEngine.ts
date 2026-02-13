import type { 
  TournamentParticipant, 
  BracketMatch, 
  Gladiator,
  GladiatorStats,
  TournamentSize,
  TournamentRules,
  CombatLogEntry,
} from '@/types';
import { 
  COMBAT_ACTIONS, 
  calculateBaseDamage,
  calculateHitChance,
  calculateCritChance,
  calculateDodgeChance,
  generateOpponent,
  type ActionType,
  type StatusEffect,
} from '@data/combat';
import { v4 as uuidv4 } from 'uuid';

interface SimulationCombatant {
  id: string;
  name: string;
  stats: GladiatorStats;
  level: number;
  currentHP: number;
  maxHP: number;
  currentStamina: number;
  maxStamina: number;
  morale: number;
  statusEffects: { effect: StatusEffect; duration: number; stacks: number }[];
  cooldowns: Record<string, number>;
}

export class TournamentEngine {
  /**
   * Generate initial bracket for tournament
   */
  static generateBracket(
    size: TournamentSize,
    playerGladiators: Gladiator[],
    averageFame: number
  ): { bracket: BracketMatch[]; participants: TournamentParticipant[] } {
    const participants: TournamentParticipant[] = [];
    
    // Add player gladiators
    playerGladiators.forEach(gladiator => {
      participants.push({
        id: uuidv4(),
        name: gladiator.name,
        isPlayerGladiator: true,
        gladiatorId: gladiator.id,
        class: gladiator.class,
        level: gladiator.level,
        stats: { ...gladiator.stats },
        currentHP: gladiator.currentHP,
        maxHP: gladiator.maxHP,
        currentStamina: gladiator.currentStamina,
        maxStamina: gladiator.maxStamina,
        eliminated: false,
        died: false,
      });
    });
    
    // Generate AI opponents to fill bracket
    const aiCount = size - playerGladiators.length;
    for (let i = 0; i < aiCount; i++) {
      const opponent = generateOpponent(averageFame, 'tournament', 'normal');
      participants.push({
        id: uuidv4(),
        name: opponent.name,
        isPlayerGladiator: false,
        class: opponent.class,
        level: opponent.level,
        stats: { ...opponent.stats },
        currentHP: opponent.hp,
        maxHP: opponent.hp,
        currentStamina: opponent.stamina,
        maxStamina: opponent.stamina,
        eliminated: false,
        died: false,
      });
    }
    
    // Shuffle participants for random bracket positions
    this.shuffleArray(participants);
    
    // Create first round matches
    const bracket: BracketMatch[] = [];
    const matchesInFirstRound = size / 2;
    
    for (let i = 0; i < matchesInFirstRound; i++) {
      const p1 = participants[i * 2];
      const p2 = participants[i * 2 + 1];
      
      bracket.push({
        id: uuidv4(),
        round: 0,
        position: i,
        participant1: p1,
        participant2: p2,
        winner: null,
        completed: false,
        needsPlayerAction: p1.isPlayerGladiator || p2.isPlayerGladiator,
      });
    }
    
    return { bracket, participants };
  }
  
  /**
   * Simulate a match between two participants (AI vs AI or for auto-simulation)
   */
  static simulateMatch(
    participant1: TournamentParticipant,
    participant2: TournamentParticipant,
    rules: TournamentRules,
    maxRounds: number = 15
  ): {
    winner: TournamentParticipant;
    loser: TournamentParticipant;
    combatLog: CombatLogEntry[];
  } {
    // Create simulation combatants
    const combatant1: SimulationCombatant = {
      id: participant1.id,
      name: participant1.name,
      stats: { ...participant1.stats },
      level: participant1.level,
      currentHP: participant1.currentHP,
      maxHP: participant1.maxHP,
      currentStamina: participant1.currentStamina,
      maxStamina: participant1.maxStamina,
      morale: 70,
      statusEffects: [],
      cooldowns: {},
    };
    
    const combatant2: SimulationCombatant = {
      id: participant2.id,
      name: participant2.name,
      stats: { ...participant2.stats },
      level: participant2.level,
      currentHP: participant2.currentHP,
      maxHP: participant2.maxHP,
      currentStamina: participant2.currentStamina,
      maxStamina: participant2.maxStamina,
      morale: 70,
      statusEffects: [],
      cooldowns: {},
    };
    
    const combatLog: CombatLogEntry[] = [];
    let turn = 1;
    let winner: SimulationCombatant | null = null;
    
    // Combat loop
    while (turn <= maxRounds && !winner) {
      // Combatant 1 attacks
      const action1 = this.selectAIAction(combatant1);
      this.processAction(combatant1, combatant2, action1, turn, combatLog);
      
      // Check for winner
      if (combatant2.currentHP <= 0) {
        winner = combatant1;
        break;
      }
      
      // Check for submission (if rules allow)
      if (rules === 'submission' && combatant2.currentHP < combatant2.maxHP * 0.2 && Math.random() < 0.3) {
        winner = combatant1;
        combatLog.push({
          turn,
          attacker: combatant2.name,
          action: 'submit',
          result: `${combatant2.name} submits!`,
        });
        break;
      }
      
      // Combatant 2 attacks
      const action2 = this.selectAIAction(combatant2);
      this.processAction(combatant2, combatant1, action2, turn, combatLog);
      
      // Check for winner
      if (combatant1.currentHP <= 0) {
        winner = combatant2;
        break;
      }
      
      // Check for submission
      if (rules === 'submission' && combatant1.currentHP < combatant1.maxHP * 0.2 && Math.random() < 0.3) {
        winner = combatant2;
        combatLog.push({
          turn,
          attacker: combatant1.name,
          action: 'submit',
          result: `${combatant1.name} submits!`,
        });
        break;
      }
      
      // Process status effects
      this.processStatusEffects(combatant1, turn, combatLog);
      this.processStatusEffects(combatant2, turn, combatLog);
      
      // Update cooldowns
      this.updateCooldowns(combatant1);
      this.updateCooldowns(combatant2);
      
      turn++;
    }
    
    // If no winner after max rounds, winner is determined by HP percentage
    if (!winner) {
      const hp1Percent = combatant1.currentHP / combatant1.maxHP;
      const hp2Percent = combatant2.currentHP / combatant2.maxHP;
      winner = hp1Percent >= hp2Percent ? combatant1 : combatant2;
      combatLog.push({
        turn,
        attacker: 'Referee',
        action: 'judge',
        result: `Time limit reached. ${winner.name} wins by decision!`,
      });
    }
    
    // Determine if loser died (only in death rules)
    const loser = winner.id === combatant1.id ? combatant2 : combatant1;
    const died = rules === 'death' && loser.currentHP <= 0;
    
    // Update participants with final HP/stamina
    const winnerParticipant = { ...participant1.id === winner.id ? participant1 : participant2 };
    winnerParticipant.currentHP = winner.currentHP;
    winnerParticipant.currentStamina = winner.currentStamina;
    
    const loserParticipant = { ...participant1.id === loser.id ? participant1 : participant2 };
    loserParticipant.currentHP = loser.currentHP;
    loserParticipant.currentStamina = loser.currentStamina;
    loserParticipant.died = died;
    
    return {
      winner: winnerParticipant,
      loser: loserParticipant,
      combatLog,
    };
  }
  
  /**
   * AI action selection (similar to CombatEngine)
   */
  private static selectAIAction(combatant: SimulationCombatant): ActionType {
    // If stunned, can't act
    if (this.hasStatusEffect(combatant, 'stunned')) {
      return 'rest';
    }
    
    // Low stamina - rest
    if (combatant.currentStamina < 20) {
      return 'rest';
    }
    
    // Low HP - be defensive
    if (combatant.currentHP < combatant.maxHP * 0.3) {
      if (Math.random() < 0.4) return 'defend';
      if (Math.random() < 0.3) return 'dodge';
    }
    
    // Special ability available
    if (combatant.currentStamina >= 30 && !combatant.cooldowns['special'] && Math.random() < 0.3) {
      return 'special';
    }
    
    // Default weighted random
    const roll = Math.random();
    if (roll < 0.5) return 'attack';
    if (roll < 0.7) return 'heavy_attack';
    if (roll < 0.85) return 'defend';
    return 'taunt';
  }
  
  /**
   * Process an action (simplified combat logic)
   */
  private static processAction(
    attacker: SimulationCombatant,
    defender: SimulationCombatant,
    action: ActionType,
    turn: number,
    log: CombatLogEntry[]
  ): void {
    const actionData = COMBAT_ACTIONS[action];
    
    // Consume stamina
    attacker.currentStamina = Math.max(0, attacker.currentStamina - actionData.staminaCost);
    
    // Special actions
    if (action === 'rest') {
      const recovery = Math.abs(actionData.staminaCost);
      attacker.currentStamina = Math.min(attacker.maxStamina, attacker.currentStamina + recovery);
      log.push({
        turn,
        attacker: attacker.name,
        action: 'rest',
        result: `${attacker.name} rests and recovers ${recovery} stamina`,
      });
      return;
    }
    
    if (action === 'defend') {
      this.applyStatusEffect(attacker, 'defended', 1);
      log.push({
        turn,
        attacker: attacker.name,
        action: 'defend',
        result: `${attacker.name} raises their guard`,
      });
      return;
    }
    
    if (action === 'dodge') {
      log.push({
        turn,
        attacker: attacker.name,
        action: 'dodge',
        result: `${attacker.name} prepares to evade`,
      });
      return;
    }
    
    // Attack actions
    if (actionData.damageMultiplier > 0) {
      // Calculate hit chance
      const hitChance = calculateHitChance(
        attacker.stats.dexterity,
        defender.stats.agility,
        actionData.accuracyModifier
      );
      
      // Check if attack hits
      if (Math.random() * 100 > hitChance) {
        log.push({
          turn,
          attacker: attacker.name,
          action,
          damage: 0,
          result: `${attacker.name} attacks but misses!`,
        });
        return;
      }
      
      // Check for dodge
      const dodgeChance = calculateDodgeChance(defender.stats.agility, attacker.stats.dexterity);
      if (Math.random() * 100 < dodgeChance) {
        log.push({
          turn,
          attacker: attacker.name,
          action,
          damage: 0,
          result: `${defender.name} dodges ${attacker.name}'s attack!`,
        });
        return;
      }
      
      // Calculate damage
      let damage = calculateBaseDamage(attacker.stats.strength, attacker.level) * actionData.damageMultiplier;
      
      // Check for crit
      const critChance = calculateCritChance(attacker.stats.dexterity);
      const isCrit = Math.random() * 100 < critChance;
      if (isCrit) {
        damage *= 1.5;
      }
      
      // Apply defense modifier
      if (this.hasStatusEffect(defender, 'defended')) {
        damage *= 0.5;
      }
      
      // Apply damage
      damage = Math.floor(damage);
      defender.currentHP = Math.max(0, defender.currentHP - damage);
      
      log.push({
        turn,
        attacker: attacker.name,
        action,
        damage,
        result: `${attacker.name} ${action === 'heavy_attack' ? 'strikes heavily' : 'attacks'} ${defender.name} for ${damage} damage${isCrit ? ' (Critical!)' : ''}`,
      });
      
      // Apply status effects from action
      if (actionData.effects) {
        actionData.effects.forEach(effect => {
          if (Math.random() * 100 < effect.chance) {
            this.applyStatusEffect(defender, effect.type, effect.duration);
          }
        });
      }
    }
    
    // Set cooldown if applicable
    if (actionData.cooldown) {
      attacker.cooldowns[action] = actionData.cooldown;
    }
  }
  
  /**
   * Helper methods
   */
  private static hasStatusEffect(combatant: SimulationCombatant, effect: StatusEffect): boolean {
    return combatant.statusEffects.some(se => se.effect === effect);
  }
  
  private static applyStatusEffect(
    combatant: SimulationCombatant,
    effect: StatusEffect,
    duration: number
  ): void {
    const existing = combatant.statusEffects.find(se => se.effect === effect);
    if (existing) {
      existing.duration = duration;
    } else {
      combatant.statusEffects.push({ effect, duration, stacks: 1 });
    }
  }
  
  private static processStatusEffects(
    combatant: SimulationCombatant,
    turn: number,
    log: CombatLogEntry[]
  ): void {
    combatant.statusEffects = combatant.statusEffects.filter(se => {
      se.duration--;
      
      // Bleeding damage
      if (se.effect === 'bleeding' && se.duration > 0) {
        const damage = 5 * se.stacks;
        combatant.currentHP = Math.max(0, combatant.currentHP - damage);
        log.push({
          turn,
          attacker: combatant.name,
          action: 'bleed',
          damage,
          result: `${combatant.name} takes ${damage} bleeding damage`,
        });
      }
      
      return se.duration > 0;
    });
  }
  
  private static updateCooldowns(combatant: SimulationCombatant): void {
    Object.keys(combatant.cooldowns).forEach(key => {
      combatant.cooldowns[key] = Math.max(0, combatant.cooldowns[key] - 1);
      if (combatant.cooldowns[key] === 0) {
        delete combatant.cooldowns[key];
      }
    });
  }
  
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
