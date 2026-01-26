/**
 * RosterManagement Component
 * 
 * Manage gladiator roster - view, train, assign, and recruit gladiators
 */

import React, { useState } from 'react';
import { Fighter } from '@entities/Fighter';
import type { CharacterClass } from '@/types/game.types';
import { formatNumber } from '@utils/helpers';

interface RosterManagementProps {
  gladiators: Fighter[];
  maxCapacity: number;
  onRecruitGladiator: (gladiatorClass: CharacterClass) => void;
  onTrainGladiator: (gladiatorId: string) => void;
  onReleaseGladiator: (gladiatorId: string) => void;
  onSelectGladiator: (gladiator: Fighter) => void;
  currentGold: number;
  disabled?: boolean;
}

const CLASS_COLORS: Record<CharacterClass, string> = {
  WARRIOR: 'from-red-500 to-red-700',
  TANK: 'from-gray-600 to-gray-800',
  MAGE: 'from-blue-500 to-blue-700',
  ASSASSIN: 'from-purple-500 to-purple-700',
  BALANCED: 'from-green-500 to-green-700',
  GLASS_CANNON: 'from-orange-500 to-orange-700',
  BRUISER: 'from-yellow-600 to-yellow-800',
  BERSERKER: 'from-red-700 to-red-900',
  PALADIN: 'from-yellow-400 to-yellow-600',
  NECROMANCER: 'from-indigo-600 to-indigo-900',
};

const RECRUITMENT_COST = 500;
const TRAINING_COST = 200;

export const RosterManagement: React.FC<RosterManagementProps> = ({
  gladiators,
  maxCapacity,
  onRecruitGladiator,
  onTrainGladiator,
  onReleaseGladiator,
  onSelectGladiator,
  currentGold,
  disabled = false,
}) => {
  const [selectedGladiator, setSelectedGladiator] = useState<Fighter | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const canRecruit = gladiators.length < maxCapacity && currentGold >= RECRUITMENT_COST;
  const canTrain = (gladiator: Fighter) => currentGold >= TRAINING_COST && gladiator.level < 20;

  // Get roster stats
  const totalLevels = gladiators.reduce((sum, g) => sum + g.level, 0);
  const averageLevel = gladiators.length > 0 ? (totalLevels / gladiators.length).toFixed(1) : '0';
  const highestLevel = gladiators.length > 0 ? Math.max(...gladiators.map((g) => g.level)) : 0;

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-blue-300 bg-gradient-to-r from-blue-700 to-blue-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">⚔️ Gladiator Roster</h2>
            <p className="mt-1 text-sm text-blue-200">
              {gladiators.length}/{maxCapacity} gladiators | Avg Level: {averageLevel}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded px-3 py-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'
              }`}
            >
              📊 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded px-3 py-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'
              }`}
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 border-b-2 border-gray-200 bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Gladiators</p>
          <p className="mt-1 text-2xl font-bold text-blue-900">{gladiators.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average Level</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{averageLevel}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Highest Level</p>
          <p className="mt-1 text-2xl font-bold text-purple-700">{highestLevel}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Capacity</p>
          <p className={`mt-1 text-2xl font-bold ${gladiators.length >= maxCapacity ? 'text-red-700' : 'text-gray-700'}`}>
            {maxCapacity - gladiators.length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {gladiators.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center text-gray-500">
            <div className="text-6xl">⚔️</div>
            <p className="mt-4 text-lg font-semibold">No Gladiators Recruited</p>
            <p className="mt-2 text-sm">Start building your roster by recruiting fighters!</p>
            <button
              onClick={() => {}}
              disabled={disabled || !canRecruit}
              className={`mt-6 rounded-lg px-6 py-3 font-semibold transition-colors ${
                canRecruit && !disabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-600'
              }`}
            >
              {canRecruit ? `⭐ Recruit Gladiator (${RECRUITMENT_COST} gold)` : '🔒 Not Enough Gold'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gladiators.map((gladiator) => {
              const hpPercent = (gladiator.hp / gladiator.maxHp) * 100;
              const canTrainThis = canTrain(gladiator);

              return (
                <div
                  key={gladiator.id}
                  onClick={() => {
                    setSelectedGladiator(gladiator);
                    onSelectGladiator(gladiator);
                  }}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                    selectedGladiator?.id === gladiator.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{gladiator.name}</h3>
                      <div className={`mt-1 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${CLASS_COLORS[gladiator.class]}`}>
                        {gladiator.class}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="rounded-full bg-purple-600 px-2 py-1 text-xs font-bold text-white">
                        Lv {gladiator.level}
                      </div>
                    </div>
                  </div>

                  {/* HP Bar */}
                  <div className="mb-2">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-600">HP</span>
                      <span className="text-gray-600">{gladiator.hp}/{gladiator.maxHp}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-300">
                      <div
                        className={`h-full transition-all ${hpPercent > 60 ? 'bg-green-500' : hpPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded bg-red-100 px-2 py-1 text-center">
                      <p className="text-gray-600">STR</p>
                      <p className="font-bold text-red-800">{gladiator.strength}</p>
                    </div>
                    <div className="rounded bg-blue-100 px-2 py-1 text-center">
                      <p className="text-gray-600">DEF</p>
                      <p className="font-bold text-blue-800">{gladiator.defense}</p>
                    </div>
                    <div className="rounded bg-green-100 px-2 py-1 text-center">
                      <p className="text-gray-600">SPD</p>
                      <p className="font-bold text-green-800">{gladiator.speed}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrainGladiator(gladiator.id);
                      }}
                      disabled={disabled || !canTrainThis}
                      className={`flex-1 rounded px-3 py-2 text-xs font-semibold transition-colors ${
                        canTrainThis && !disabled
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'cursor-not-allowed bg-gray-300 text-gray-600'
                      }`}
                    >
                      📈 Train
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Release ${gladiator.name}?`)) {
                          onReleaseGladiator(gladiator.id);
                        }
                      }}
                      disabled={disabled}
                      className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Gladiator Card */}
            {gladiators.length < maxCapacity && (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-6">
                <div className="text-center">
                  <div className="text-4xl">➕</div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">Recruit New</p>
                  <button
                    onClick={() => {}}
                    disabled={disabled || !canRecruit}
                    className={`mt-3 rounded px-4 py-2 text-sm font-semibold transition-colors ${
                      canRecruit && !disabled
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'cursor-not-allowed bg-gray-300 text-gray-600'
                    }`}
                  >
                    {RECRUITMENT_COST} gold
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {gladiators.map((gladiator) => {
              const hpPercent = (gladiator.hp / gladiator.maxHp) * 100;
              const canTrainThis = canTrain(gladiator);

              return (
                <div
                  key={gladiator.id}
                  onClick={() => {
                    setSelectedGladiator(gladiator);
                    onSelectGladiator(gladiator);
                  }}
                  className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                    selectedGladiator?.id === gladiator.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Name & Class */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{gladiator.name}</h3>
                    <span className={`mt-1 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${CLASS_COLORS[gladiator.class]}`}>
                      {gladiator.class}
                    </span>
                  </div>

                  {/* Level */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Level</p>
                    <p className="text-lg font-bold text-purple-700">{gladiator.level}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">STR</p>
                      <p className="font-bold text-red-700">{gladiator.strength}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">DEF</p>
                      <p className="font-bold text-blue-700">{gladiator.defense}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">SPD</p>
                      <p className="font-bold text-green-700">{gladiator.speed}</p>
                    </div>
                  </div>

                  {/* HP */}
                  <div className="w-32">
                    <p className="mb-1 text-xs text-gray-600">HP: {gladiator.hp}/{gladiator.maxHp}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-300">
                      <div
                        className={`h-full ${hpPercent > 60 ? 'bg-green-500' : hpPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrainGladiator(gladiator.id);
                      }}
                      disabled={disabled || !canTrainThis}
                      className={`rounded px-4 py-2 text-sm font-semibold transition-colors ${
                        canTrainThis && !disabled
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'cursor-not-allowed bg-gray-300 text-gray-600'
                      }`}
                    >
                      📈 Train
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Release ${gladiator.name}?`)) {
                          onReleaseGladiator(gladiator.id);
                        }
                      }}
                      disabled={disabled}
                      className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      ❌ Release
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
