/**
 * FighterCard Component
 * 
 * Displays fighter information, stats, and health/mana bars
 */

import React from 'react';
import type { Fighter } from '@entities/Fighter';

interface FighterCardProps {
  fighter: Fighter;
  isPlayer?: boolean;
  showDetailedStats?: boolean;
}

export const FighterCard: React.FC<FighterCardProps> = ({
  fighter,
  isPlayer = false,
  showDetailedStats = false,
}) => {
  // Calculate health percentage
  const healthPercent = (fighter.hp / fighter.maxHp) * 100;
  const manaPercent = (fighter.mana / fighter.maxMana) * 100;

  // Health bar color based on percentage
  const getHealthColor = (percent: number): string => {
    if (percent > 60) return 'bg-green-500';
    if (percent > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={`
        rounded-lg border-2 p-4 shadow-lg transition-all duration-300
        ${isPlayer ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'}
        hover:shadow-xl
      `}
    >
      {/* Fighter Name & Level */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{fighter.name}</h3>
          <p className="text-sm text-gray-600">
            Level {fighter.level} {fighter.class}
          </p>
        </div>
        {showDetailedStats && (
          <div className="text-right text-sm">
            <p className="text-gray-600">XP: {fighter.xp}</p>
          </div>
        )}
      </div>

      {/* Health Bar */}
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs font-medium">
          <span className="text-gray-700">HP</span>
          <span className="text-gray-700">
            {Math.round(fighter.hp)}/{fighter.maxHp}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className={`h-full transition-all duration-500 ${getHealthColor(healthPercent)}`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Mana Bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs font-medium">
          <span className="text-gray-700">Mana</span>
          <span className="text-gray-700">
            {Math.round(fighter.mana)}/{fighter.maxMana}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${manaPercent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {showDetailedStats && (
        <div className="grid grid-cols-2 gap-2 border-t border-gray-300 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">⚔️ STR:</span>
            <span className="font-semibold text-gray-800">{fighter.strength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">🛡️ DEF:</span>
            <span className="font-semibold text-gray-800">{fighter.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">⚡ SPD:</span>
            <span className="font-semibold text-gray-800">{fighter.speed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">🎯 CRT:</span>
            <span className="font-semibold text-gray-800">{fighter.critChance}%</span>
          </div>
        </div>
      )}

      {/* Status Effects (if any) */}
      {fighter.statusEffects && fighter.statusEffects.length > 0 && (
        <div className="mt-3 border-t border-gray-300 pt-2">
          <p className="mb-1 text-xs font-medium text-gray-700">Status Effects:</p>
          <div className="flex flex-wrap gap-1">
            {fighter.statusEffects.map((effect, index) => (
              <span
                key={index}
                className="rounded bg-purple-200 px-2 py-1 text-xs font-medium text-purple-800"
              >
                {String(effect)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Defeated State */}
      {fighter.hp <= 0 && (
        <div className="mt-3 rounded bg-gray-800 py-2 text-center">
          <span className="text-sm font-bold text-red-400">💀 DEFEATED</span>
        </div>
      )}
    </div>
  );
};
