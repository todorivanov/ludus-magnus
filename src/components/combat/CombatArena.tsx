/**
 * CombatArena Component
 * 
 * Main combat screen that orchestrates the battle between fighters
 */

import React, { useState, useEffect } from 'react';
import { Fighter } from '@entities/Fighter';
import { FighterCard } from './FighterCard';
import { CombatLog, CombatLogEntry } from './CombatLog';
import { ActionSelection, CombatAction } from './ActionSelection';
import { getClassSkills, canUseSkill, useSkill as executeSkill, type Skill, type SkillResult } from '@game/SkillSystem';
import { performAttack, isDefeated } from '@game/CombatEngine';
import { makeAIDecision } from '@ai/AISystem';
import { logger, LogCategory } from '@utils/Logger';
import { generateId } from '@utils/helpers';

type BattlePhase = 'preparation' | 'player-turn' | 'enemy-turn' | 'victory' | 'defeat';

interface CombatArenaProps {
  playerFighter: Fighter;
  enemyFighter: Fighter;
  onBattleEnd: (winner: 'player' | 'enemy') => void;
  difficulty?: 'easy' | 'normal' | 'hard' | 'nightmare';
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  playerFighter: initialPlayer,
  enemyFighter: initialEnemy,
  onBattleEnd,
  difficulty = 'normal',
}) => {
  // Combat state
  const [player, setPlayer] = useState<Fighter>(initialPlayer);
  const [enemy, setEnemy] = useState<Fighter>(initialEnemy);
  const [phase, setPhase] = useState<BattlePhase>('preparation');
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get player skills
  const playerSkills = getClassSkills(player.class);

  // Add log entry
  const addLog = (message: string, type: CombatLogEntry['type']) => {
    const entry: CombatLogEntry = {
      id: generateId(),
      message,
      type,
      timestamp: Date.now(),
    };
    setCombatLog((prev) => [...prev, entry]);
    logger.info(LogCategory.COMBAT, message.replace(/<[^>]*>/g, ''));
  };

  // Initialize battle
  useEffect(() => {
    if (phase === 'preparation') {
      addLog(
        `<strong>${player.name}</strong> vs <strong>${enemy.name}</strong> - Battle begins!`,
        'system'
      );
      
      // Determine who goes first based on speed
      setTimeout(() => {
        if (player.speed >= enemy.speed) {
          setPhase('player-turn');
          addLog(`<strong>${player.name}</strong> goes first!`, 'system');
        } else {
          setPhase('enemy-turn');
          addLog(`<strong>${enemy.name}</strong> goes first!`, 'system');
        }
        setTurnCount(1);
      }, 1000);
    }
  }, [phase, player.name, player.speed, enemy.name, enemy.speed]);

  // Handle player action
  const handlePlayerAction = (action: CombatAction, skillId?: string) => {
    if (isProcessing || phase !== 'player-turn') return;
    
    setIsProcessing(true);

    switch (action) {
      case 'attack':
        handleAttack(player, enemy, 'player');
        break;
      case 'defend':
        handleDefend(player, 'player');
        break;
      case 'skill':
        if (skillId) {
          handleSkillUse(player, enemy, skillId, 'player');
        }
        break;
      case 'wait':
        addLog(`<strong>${player.name}</strong> waits.`, 'system');
        endTurn('player');
        break;
    }
  };

  // Handle attack
  const handleAttack = (attacker: Fighter, defender: Fighter, side: 'player' | 'enemy') => {
    const result = performAttack(attacker, defender);
    
    if (!result.hit) {
      addLog(`<strong>${attacker.name}</strong> attacks but <strong>MISSES</strong>!`, 'attack');
    } else {
      const critText = result.result?.isCritical ? ' <strong>CRITICAL HIT!</strong>' : '';
      addLog(
        `<strong>${attacker.name}</strong> attacks for <strong>${result.damage}</strong> damage!${critText}`,
        result.result?.isCritical ? 'damage' : 'attack'
      );
    }

    // Update defender HP
    if (side === 'player') {
      setEnemy(defender);
      checkBattleEnd(defender, 'enemy');
    } else {
      setPlayer(defender);
      checkBattleEnd(defender, 'player');
    }

    endTurn(side);
  };

  // Handle defend
  const handleDefend = (fighter: Fighter, side: 'player' | 'enemy') => {
    addLog(`<strong>${fighter.name}</strong> takes a <strong>defensive stance</strong>!`, 'status');
    // Defending reduces next incoming damage by 50% (would be implemented in combat engine)
    endTurn(side);
  };

  // Handle skill use
  const handleSkillUse = (
    caster: Fighter,
    target: Fighter,
    skillId: string,
    side: 'player' | 'enemy'
  ) => {
    const skill = playerSkills.find((s) => s.id === skillId);
    if (!skill) {
      addLog(`Skill not found!`, 'system');
      setIsProcessing(false);
      return;
    }

    if (!canUseSkill(caster, skill)) {
      addLog(`<strong>${caster.name}</strong> cannot use <strong>${skill.name}</strong>!`, 'system');
      setIsProcessing(false);
      return;
    }

    // Use skill
    const result: SkillResult = executeSkill(caster, skill, target);
    
    if (result.success) {
      addLog(
        `<strong>${caster.name}</strong> uses <strong>${skill.name}</strong>!`,
        'skill'
      );

      if (result.damage && result.damage > 0) {
        addLog(`Deals <strong>${result.damage}</strong> damage!`, 'damage');
      }

      if (result.healing && result.healing > 0) {
        addLog(`Heals for <strong>${result.healing}</strong> HP!`, 'heal');
      }

      // Update fighters
      if (side === 'player') {
        setPlayer(caster);
        setEnemy(target);
        checkBattleEnd(target, 'enemy');
      } else {
        setEnemy(caster);
        setPlayer(target);
        checkBattleEnd(target, 'player');
      }
    } else {
      addLog(`<strong>${skill.name}</strong> failed!`, 'system');
    }

    endTurn(side);
  };

  // End turn
  const endTurn = (currentSide: 'player' | 'enemy') => {
    setTimeout(() => {
      // Tick cooldowns (skills are managed separately)
      playerSkills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown--;
        }
      });
      
      const enemySkills = getClassSkills(enemy.class);
      enemySkills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown--;
        }
      });

      // Switch turn
      if (currentSide === 'player') {
        setPhase('enemy-turn');
        setTimeout(() => executeEnemyTurn(), 1000);
      } else {
        setPhase('player-turn');
        setTurnCount((prev) => prev + 1);
        addLog(`<strong>Turn ${turnCount + 1}</strong>`, 'system');
      }
      
      setIsProcessing(false);
    }, 800);
  };

  // Execute enemy turn (AI)
  const executeEnemyTurn = () => {
    if (phase !== 'enemy-turn') return;

    setIsProcessing(true);
    
    const enemySkills = getClassSkills(enemy.class);
    const aiDecision = makeAIDecision(enemy, player, enemySkills, difficulty);

    addLog(`<strong>${enemy.name}</strong> is thinking...`, 'system');

    setTimeout(() => {
      switch (aiDecision.type) {
        case 'attack':
          handleAttack(enemy, player, 'enemy');
          break;
        case 'defend':
          handleDefend(enemy, 'enemy');
          break;
        case 'skill':
          if (aiDecision.skillId) {
            handleSkillUse(enemy, player, aiDecision.skillId, 'enemy');
          } else {
            handleAttack(enemy, player, 'enemy');
          }
          break;
        default:
          handleAttack(enemy, player, 'enemy');
      }
    }, 800);
  };

  // Check if battle has ended
  const checkBattleEnd = (fighter: Fighter, side: 'player' | 'enemy') => {
    if (isDefeated(fighter)) {
      setTimeout(() => {
        if (side === 'player') {
          setPhase('defeat');
          addLog(`<strong>${player.name}</strong> has been defeated!`, 'defeat');
          onBattleEnd('enemy');
        } else {
          setPhase('victory');
          addLog(`<strong>${enemy.name}</strong> has been defeated!`, 'victory');
          addLog(`<strong>🏆 VICTORY! 🏆</strong>`, 'victory');
          onBattleEnd('player');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white">⚔️ Combat Arena ⚔️</h1>
          <p className="mt-2 text-lg text-gray-300">Turn {turnCount}</p>
        </div>

        {/* Main Combat Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Player Fighter */}
          <div>
            <FighterCard
              fighter={player}
              isPlayer={true}
              showDetailedStats={true}
            />
          </div>

          {/* Combat Log (Center) */}
          <div>
            <CombatLog
              entries={combatLog}
              maxHeight="500px"
              autoScroll={true}
            />
          </div>

          {/* Enemy Fighter */}
          <div>
            <FighterCard
              fighter={enemy}
              isPlayer={false}
              showDetailedStats={true}
            />
          </div>
        </div>

        {/* Action Selection (Bottom) */}
        <div className="mt-6">
          <ActionSelection
            skills={playerSkills}
            currentMana={player.mana}
            onAction={handlePlayerAction}
            disabled={isProcessing || phase !== 'player-turn' || ['victory', 'defeat'].includes(phase)}
            isPlayerTurn={phase === 'player-turn'}
          />
        </div>

        {/* Battle End Screen */}
        {(phase === 'victory' || phase === 'defeat') && (
          <div className="mt-6 rounded-lg border-4 border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-yellow-900">
              {phase === 'victory' ? '🏆 VICTORY! 🏆' : '💀 DEFEAT 💀'}
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              {phase === 'victory'
                ? `${player.name} has triumphed!`
                : `${player.name} has fallen in battle...`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-lg hover:bg-blue-700"
            >
              Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
