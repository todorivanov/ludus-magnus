import type { GladiatorClass } from '@/types';
import { 
  COMBAT_ACTIONS, 
  STATUS_EFFECTS, 
  CLASS_SPECIALS,
  calculateBaseDamage,
  calculateHitChance,
  calculateCritChance,
  calculateDodgeChance,
  type ActionType,
  type StatusEffect,
} from '@data/combat';

export interface CombatantState {
  id: string;
  name: string;
  class: GladiatorClass;
  isPlayer: boolean;
  
  // Stats
  stats: {
    strength: number;
    agility: number;
    dexterity: number;
    endurance: number;
    constitution: number;
  };
  level: number;
  
  // Combat state
  currentHP: number;
  maxHP: number;
  currentStamina: number;
  maxStamina: number;
  
  // Status effects
  statusEffects: { effect: StatusEffect; duration: number; stacks: number }[];
  
  // Cooldowns
  cooldowns: Record<string, number>;
  
  // Combat stats
  morale: number; // 0-100, affects damage and accuracy
}

export interface CombatLogEntry {
  turn: number;
  actor: string;
  action: string;
  target?: string;
  damage?: number;
  isCrit?: boolean;
  missed?: boolean;
  dodged?: boolean;
  blocked?: boolean;
  effects?: string[];
  message: string;
}

export interface CombatState {
  turn: number;
  phase: 'selection' | 'resolution' | 'ended';
  winner: string | null;
  
  player: CombatantState;
  opponent: CombatantState;
  
  currentActor: 'player' | 'opponent';
  selectedAction: ActionType | null;
  
  log: CombatLogEntry[];
  
  matchType: string;
  rules: 'submission' | 'death' | 'first_blood';
  maxRounds: number;
}

export class CombatEngine {
  private state: CombatState;
  
  constructor(
    playerData: {
      id: string;
      name: string;
      class: GladiatorClass;
      level: number;
      stats: CombatantState['stats'];
      currentHP: number;
      maxHP: number;
      currentStamina: number;
      maxStamina: number;
      morale: number;
    },
    opponentData: {
      name: string;
      class: GladiatorClass;
      level: number;
      stats: CombatantState['stats'];
      hp: number;
      stamina: number;
    },
    matchType: string,
    rules: 'submission' | 'death' | 'first_blood',
    maxRounds: number
  ) {
    this.state = {
      turn: 1,
      phase: 'selection',
      winner: null,
      
      player: {
        id: playerData.id,
        name: playerData.name,
        class: playerData.class,
        isPlayer: true,
        stats: playerData.stats,
        level: playerData.level,
        currentHP: playerData.currentHP,
        maxHP: playerData.maxHP,
        currentStamina: playerData.currentStamina,
        maxStamina: playerData.maxStamina,
        statusEffects: [],
        cooldowns: {},
        morale: playerData.morale,
      },
      
      opponent: {
        id: 'opponent',
        name: opponentData.name,
        class: opponentData.class,
        isPlayer: false,
        stats: opponentData.stats,
        level: opponentData.level,
        currentHP: opponentData.hp,
        maxHP: opponentData.hp,
        currentStamina: opponentData.stamina,
        maxStamina: opponentData.stamina,
        statusEffects: [],
        cooldowns: {},
        morale: 70,
      },
      
      currentActor: 'player',
      selectedAction: null,
      
      log: [],
      
      matchType,
      rules,
      maxRounds,
    };
  }
  
  getState(): CombatState {
    return { ...this.state };
  }
  
  // Check if action is available
  canPerformAction(actor: CombatantState, action: ActionType): { canPerform: boolean; reason?: string } {
    const actionData = COMBAT_ACTIONS[action];
    
    // Check stamina
    if (actionData.staminaCost > 0 && actor.currentStamina < actionData.staminaCost) {
      return { canPerform: false, reason: 'Not enough stamina' };
    }
    
    // Check cooldown
    if (actionData.cooldown && actor.cooldowns[action] > 0) {
      return { canPerform: false, reason: `On cooldown (${actor.cooldowns[action]} turns)` };
    }
    
    // Check if stunned
    if (this.hasStatusEffect(actor, 'stunned')) {
      return { canPerform: false, reason: 'Stunned' };
    }
    
    return { canPerform: true };
  }
  
  // Execute player action
  executePlayerAction(action: ActionType): CombatLogEntry[] {
    if (this.state.phase !== 'selection' || this.state.currentActor !== 'player') {
      return [];
    }
    
    const entries: CombatLogEntry[] = [];
    
    // Process player action
    const playerEntry = this.processAction(this.state.player, this.state.opponent, action);
    entries.push(playerEntry);
    
    // Check for combat end
    if (this.checkCombatEnd()) {
      this.state.phase = 'ended';
      return entries;
    }
    
    // AI opponent action
    const aiAction = this.selectAIAction(this.state.opponent);
    const aiEntry = this.processAction(this.state.opponent, this.state.player, aiAction);
    entries.push(aiEntry);
    
    // Process status effects at end of turn
    const playerStatusEntries = this.processStatusEffects(this.state.player);
    const opponentStatusEntries = this.processStatusEffects(this.state.opponent);
    entries.push(...playerStatusEntries, ...opponentStatusEntries);
    
    // Reduce cooldowns
    this.reduceCooldowns(this.state.player);
    this.reduceCooldowns(this.state.opponent);
    
    // Check for combat end again
    if (this.checkCombatEnd()) {
      this.state.phase = 'ended';
      return entries;
    }
    
    // Next turn
    this.state.turn++;
    
    // Check max rounds
    if (this.state.turn > this.state.maxRounds) {
      this.determineWinnerByPoints();
      this.state.phase = 'ended';
    }
    
    this.state.log.push(...entries);
    return entries;
  }
  
  // Process a single action
  private processAction(
    actor: CombatantState,
    target: CombatantState,
    action: ActionType
  ): CombatLogEntry {
    const actionData = COMBAT_ACTIONS[action];
    const entry: CombatLogEntry = {
      turn: this.state.turn,
      actor: actor.name,
      action: actionData.name,
      message: '',
    };
    
    // Apply stamina cost/gain
    actor.currentStamina = Math.min(
      actor.maxStamina,
      Math.max(0, actor.currentStamina - actionData.staminaCost)
    );
    
    // Set cooldown if applicable
    if (actionData.cooldown) {
      actor.cooldowns[action] = actionData.cooldown;
    }
    
    // Handle different action types
    switch (action) {
      case 'attack':
      case 'heavy_attack':
      case 'special':
        this.processAttack(actor, target, action, entry);
        break;
      case 'defend':
        this.applyStatusEffect(actor, 'defended', 1);
        entry.message = `${actor.name} raises their guard!`;
        break;
      case 'dodge':
        entry.message = `${actor.name} prepares to dodge!`;
        break;
      case 'rest':
        entry.message = `${actor.name} catches their breath and recovers stamina.`;
        break;
      case 'taunt':
        if (Math.random() * 100 < 70) {
          this.applyStatusEffect(target, 'enraged', 2);
          entry.message = `${actor.name} taunts ${target.name}, enraging them!`;
          entry.effects = ['Enraged'];
        } else {
          entry.message = `${actor.name} tries to taunt ${target.name}, but they ignore it.`;
        }
        break;
    }
    
    return entry;
  }
  
  // Process attack action
  private processAttack(
    actor: CombatantState,
    target: CombatantState,
    action: ActionType,
    entry: CombatLogEntry
  ): void {
    const actionData = COMBAT_ACTIONS[action];
    entry.target = target.name;
    
    // Calculate hit chance
    let hitChance = calculateHitChance(
      actor.stats.dexterity,
      target.stats.agility,
      actionData.accuracyModifier
    );
    
    // Apply status effect modifiers
    if (this.hasStatusEffect(actor, 'enraged')) {
      hitChance -= 20;
    }
    if (this.hasStatusEffect(target, 'netted')) {
      hitChance += 25;
    }
    
    // Check for miss
    if (Math.random() * 100 > hitChance) {
      entry.missed = true;
      entry.message = `${actor.name}'s ${actionData.name} misses ${target.name}!`;
      return;
    }
    
    // Check for dodge
    const dodgeChance = calculateDodgeChance(
      target.stats.agility,
      (target.maxStamina - target.currentStamina) / target.maxStamina * 100
    );
    
    if (!this.hasStatusEffect(target, 'netted') && Math.random() * 100 < dodgeChance) {
      entry.dodged = true;
      entry.message = `${target.name} dodges ${actor.name}'s ${actionData.name}!`;
      return;
    }
    
    // Calculate damage
    let damage = calculateBaseDamage(actor.stats.strength, 10, actor.level);
    damage *= actionData.damageMultiplier;
    
    // Special ability damage
    if (action === 'special') {
      const special = CLASS_SPECIALS[actor.class];
      damage *= special.damageMultiplier / actionData.damageMultiplier;
    }
    
    // Apply morale modifier
    damage *= (actor.morale / 70);
    
    // Apply enraged modifier
    if (this.hasStatusEffect(actor, 'enraged')) {
      damage *= 1.25;
    }
    
    // Check for critical hit
    const critChance = calculateCritChance(actor.stats.dexterity);
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) {
      damage *= 1.5;
      entry.isCrit = true;
    }
    
    // Apply defend reduction
    if (this.hasStatusEffect(target, 'defended')) {
      damage *= 0.5;
      entry.blocked = true;
    }
    
    // Round damage
    damage = Math.round(damage);
    entry.damage = damage;
    
    // Apply damage
    target.currentHP = Math.max(0, target.currentHP - damage);
    
    // Build message
    const critText = isCrit ? 'CRITICAL ' : '';
    const blockedText = entry.blocked ? ' (partially blocked)' : '';
    entry.message = `${actor.name}'s ${critText}${actionData.name} deals ${damage} damage to ${target.name}${blockedText}!`;
    
    // Apply status effects
    const effects: string[] = [];
    let effectsToApply = actionData.effects || [];
    
    if (action === 'special') {
      const special = CLASS_SPECIALS[actor.class];
      effectsToApply = special.effects || [];
    }
    
    effectsToApply.forEach(effect => {
      if (Math.random() * 100 < effect.chance) {
        this.applyStatusEffect(target, effect.type, effect.duration);
        effects.push(STATUS_EFFECTS[effect.type].name);
      }
    });
    
    if (effects.length > 0) {
      entry.effects = effects;
      entry.message += ` ${target.name} is now ${effects.join(', ')}!`;
    }
  }
  
  // Apply status effect
  private applyStatusEffect(target: CombatantState, effect: StatusEffect, duration: number): void {
    const effectData = STATUS_EFFECTS[effect];
    const existing = target.statusEffects.find(e => e.effect === effect);
    
    if (existing) {
      if (effectData.stackable && (!effectData.maxStacks || existing.stacks < effectData.maxStacks)) {
        existing.stacks++;
        existing.duration = Math.max(existing.duration, duration);
      } else {
        existing.duration = Math.max(existing.duration, duration);
      }
    } else {
      target.statusEffects.push({ effect, duration, stacks: 1 });
    }
  }
  
  // Check if has status effect
  private hasStatusEffect(combatant: CombatantState, effect: StatusEffect): boolean {
    return combatant.statusEffects.some(e => e.effect === effect);
  }
  
  // Process status effects at end of turn
  private processStatusEffects(combatant: CombatantState): CombatLogEntry[] {
    const entries: CombatLogEntry[] = [];
    
    combatant.statusEffects = combatant.statusEffects.filter(status => {
      const effectData = STATUS_EFFECTS[status.effect];
      
      // Apply damage over time
      if (effectData.damagePerTurn) {
        const damage = effectData.damagePerTurn * status.stacks;
        combatant.currentHP = Math.max(0, combatant.currentHP - damage);
        entries.push({
          turn: this.state.turn,
          actor: combatant.name,
          action: effectData.name,
          damage,
          message: `${combatant.name} takes ${damage} damage from ${effectData.name}!`,
        });
      }
      
      // Reduce duration
      status.duration--;
      
      // Remove expired effects
      if (status.duration <= 0) {
        entries.push({
          turn: this.state.turn,
          actor: combatant.name,
          action: effectData.name,
          message: `${combatant.name}'s ${effectData.name} wears off.`,
        });
        return false;
      }
      
      return true;
    });
    
    return entries;
  }
  
  // Reduce cooldowns
  private reduceCooldowns(combatant: CombatantState): void {
    Object.keys(combatant.cooldowns).forEach(action => {
      if (combatant.cooldowns[action] > 0) {
        combatant.cooldowns[action]--;
      }
    });
  }
  
  // AI action selection
  private selectAIAction(ai: CombatantState): ActionType {
    const player = this.state.player;
    
    // If stunned, can't act
    if (this.hasStatusEffect(ai, 'stunned')) {
      return 'rest';
    }
    
    // Low stamina - rest
    if (ai.currentStamina < 20) {
      return 'rest';
    }
    
    // Low HP - be defensive
    if (ai.currentHP < ai.maxHP * 0.3) {
      if (Math.random() < 0.4) return 'defend';
      if (Math.random() < 0.3) return 'dodge';
    }
    
    // Player defending - use heavy attack
    if (this.hasStatusEffect(player, 'defended')) {
      if (ai.currentStamina >= 20 && Math.random() < 0.6) {
        return 'heavy_attack';
      }
    }
    
    // Special ability available and good opportunity
    if (this.canPerformAction(ai, 'special').canPerform && Math.random() < 0.3) {
      return 'special';
    }
    
    // Default weighted random
    const roll = Math.random();
    if (roll < 0.5) return 'attack';
    if (roll < 0.7) return 'heavy_attack';
    if (roll < 0.85) return 'defend';
    return 'taunt';
  }
  
  // Check if combat has ended
  private checkCombatEnd(): boolean {
    const { player, opponent, rules } = this.state;
    
    if (player.currentHP <= 0) {
      this.state.winner = opponent.name;
      return true;
    }
    
    if (opponent.currentHP <= 0) {
      this.state.winner = player.name;
      return true;
    }
    
    // Submission rules - check if low HP and want to surrender
    if (rules === 'submission') {
      if (player.currentHP < player.maxHP * 0.15) {
        // Player might surrender
        if (player.morale < 30) {
          this.state.winner = opponent.name;
          return true;
        }
      }
      if (opponent.currentHP < opponent.maxHP * 0.15) {
        // AI surrenders at low HP
        if (Math.random() < 0.5) {
          this.state.winner = player.name;
          return true;
        }
      }
    }
    
    // First blood - any significant damage
    if (rules === 'first_blood') {
      if (player.currentHP < player.maxHP * 0.8) {
        this.state.winner = opponent.name;
        return true;
      }
      if (opponent.currentHP < opponent.maxHP * 0.8) {
        this.state.winner = player.name;
        return true;
      }
    }
    
    return false;
  }
  
  // Determine winner by points if max rounds reached
  private determineWinnerByPoints(): void {
    const { player, opponent } = this.state;
    
    // Calculate "points" based on remaining HP percentage
    const playerScore = player.currentHP / player.maxHP;
    const opponentScore = opponent.currentHP / opponent.maxHP;
    
    if (playerScore > opponentScore) {
      this.state.winner = player.name;
    } else if (opponentScore > playerScore) {
      this.state.winner = opponent.name;
    } else {
      // Tie goes to higher level
      this.state.winner = player.level >= opponent.level ? player.name : opponent.name;
    }
  }
}
