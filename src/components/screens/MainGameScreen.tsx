/**
 * MainGameScreen Component
 * 
 * Main game screen with combat arena for single battles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { addGold, addXP } from '@store/slices/playerSlice';
import { incrementStat } from '@store/slices/statsSlice';
import { CombatArena } from '@components/combat';
import { Fighter } from '@entities/Fighter';
import type { CharacterClass } from '@/types/game.types';

type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

const MainGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Player state from Redux
  const playerName = useAppSelector((state) => state.player.name);
  const playerClass = useAppSelector((state) => state.player.class as CharacterClass);
  const playerLevel = useAppSelector((state) => state.player.level);
  const equipped = useAppSelector((state) => state.equipped);
  
  // Local state
  const [playerFighter, setPlayerFighter] = useState<Fighter | null>(null);
  const [enemyFighter, setEnemyFighter] = useState<Fighter | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isInBattle, setIsInBattle] = useState(false);

  // Initialize player fighter
  useEffect(() => {
    if (playerName && playerClass) {
      const fighter = new Fighter({
        name: playerName,
        class: playerClass,
        level: playerLevel,
      });
      
      // Apply equipped items (simplified - in full version would use EquipmentManager)
      // For now, just create the fighter
      setPlayerFighter(fighter);
    }
  }, [playerName, playerClass, playerLevel]);

  // Generate enemy fighter based on difficulty
  const generateEnemy = (diff: Difficulty): Fighter => {
    const difficultyLevels: Record<Difficulty, number> = {
      easy: Math.max(1, playerLevel - 2),
      normal: playerLevel,
      hard: playerLevel + 2,
      nightmare: playerLevel + 5,
    };

    const enemyClasses: CharacterClass[] = [
      'WARRIOR',
      'MAGE',
      'TANK',
      'ASSASSIN',
      'BALANCED',
      'GLASS_CANNON',
      'BRUISER',
      'BERSERKER',
      'PALADIN',
      'NECROMANCER',
    ];

    const enemyClass = enemyClasses[Math.floor(Math.random() * enemyClasses.length)] ?? 'BALANCED';
    const enemyNames = [
      'Brutus',
      'Maximus',
      'Spartacus',
      'Crixus',
      'Gannicus',
      'Oenomaus',
      'Varro',
      'Agron',
      'Castus',
      'Duro',
    ];

    return new Fighter({
      name: enemyNames[Math.floor(Math.random() * enemyNames.length)] ?? 'Enemy',
      class: enemyClass,
      level: difficultyLevels[diff],
    });
  };

  // Start battle
  const handleStartBattle = () => {
    if (playerFighter) {
      const enemy = generateEnemy(difficulty);
      setEnemyFighter(enemy);
      setIsInBattle(true);
    }
  };

  // Handle battle end
  const handleBattleEnd = (winner: 'player' | 'enemy') => {
    setIsInBattle(false);

    if (winner === 'player') {
      // Award rewards based on difficulty
      const goldRewards: Record<Difficulty, number> = {
        easy: 50,
        normal: 100,
        hard: 200,
        nightmare: 500,
      };

      const xpRewards: Record<Difficulty, number> = {
        easy: 50,
        normal: 100,
        hard: 200,
        nightmare: 400,
      };

      dispatch(addGold(goldRewards[difficulty]));
      dispatch(addXP(xpRewards[difficulty]));
      dispatch(incrementStat({ stat: 'totalWins' }));
    } else {
      dispatch(incrementStat({ stat: 'totalLosses' }));
    }

    dispatch(incrementStat({ stat: 'totalFightsPlayed' }));
  };

  // Return to title screen
  const handleBackToTitle = () => {
    navigate('/title');
  };

  // Loading state
  if (!playerFighter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse">⚔️</div>
          <p className="mt-4 text-xl text-gray-400">Loading fighter...</p>
        </div>
      </div>
    );
  }

  // Pre-battle setup screen
  if (!isInBattle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-gaming text-5xl font-bold text-primary-400 text-shadow-lg">
              ⚔️ Arena Battle
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              Prepare for combat, {playerName}!
            </p>
          </div>

          {/* Player Info Card */}
          <div className="card mb-8 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Your Fighter</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-xl font-bold text-primary-400">{playerFighter.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Class</p>
                <p className="text-xl font-bold text-primary-400">{playerFighter.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-xl font-bold text-green-400">{playerFighter.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Health</p>
                <p className="text-xl font-bold text-red-400">
                  {playerFighter.hp}/{playerFighter.maxHp}
                </p>
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="card mb-8 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Select Difficulty</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {(['easy', 'normal', 'hard', 'nightmare'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    difficulty === diff
                      ? 'border-primary-500 bg-primary-900/50 shadow-lg'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <p className="mb-2 text-3xl">
                      {diff === 'easy'
                        ? '⭐'
                        : diff === 'normal'
                        ? '⭐⭐'
                        : diff === 'hard'
                        ? '⭐⭐⭐'
                        : '⭐⭐⭐⭐'}
                    </p>
                    <p className="mb-1 font-bold capitalize text-white">{diff}</p>
                    <p className="text-xs text-gray-400">
                      {diff === 'easy'
                        ? '50g, 50 XP'
                        : diff === 'normal'
                        ? '100g, 100 XP'
                        : diff === 'hard'
                        ? '200g, 200 XP'
                        : '500g, 400 XP'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBackToTitle}
              className="btn-secondary flex-1 py-4 text-xl"
            >
              ← Back to Title
            </button>
            <button
              onClick={handleStartBattle}
              className="btn-primary flex-1 py-4 text-xl"
            >
              ⚔️ Enter Battle
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Battle screen (with CombatArena)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-red-900">
      <CombatArena
        playerFighter={playerFighter}
        enemyFighter={enemyFighter!}
        difficulty={difficulty}
        onBattleEnd={handleBattleEnd}
      />
      
      {/* Exit Battle Button (overlaid) */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={handleBackToTitle}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg hover:bg-gray-700"
        >
          🚪 Exit Battle
        </button>
      </div>
    </div>
  );
};

export default MainGameScreen;
