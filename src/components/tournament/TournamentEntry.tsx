/**
 * TournamentEntry Component
 * 
 * Register for a tournament by selecting a gladiator and confirming entry
 */

import React, { useState } from 'react';
import { Fighter } from '@entities/Fighter';
import type { Tournament } from '@/types/tournament.types';
import type { CharacterClass } from '@/types/game.types';
import { formatGold } from '@utils/helpers';

interface TournamentEntryProps {
  tournament: Tournament;
  availableGladiators: Fighter[];
  currentGold: number;
  onConfirmEntry: (tournamentId: string, gladiatorId: string) => void;
  onCancel: () => void;
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

export const TournamentEntry: React.FC<TournamentEntryProps> = ({
  tournament,
  availableGladiators,
  currentGold,
  onConfirmEntry,
  onCancel,
  disabled = false,
}) => {
  const [selectedGladiator, setSelectedGladiator] = useState<Fighter | null>(null);

  // Filter gladiators that meet tournament requirements
  const eligibleGladiators = availableGladiators.filter(
    (g) => g.level >= tournament.minLevel && g.hp > 0
  );

  const canAffordEntry = currentGold >= tournament.entryFee;
  const canEnter = selectedGladiator && canAffordEntry && !disabled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg border-4 border-purple-600 bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b-4 border-purple-600 bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-4">
          <h2 className="text-3xl font-bold text-white">🎫 Tournament Registration</h2>
          <p className="mt-1 text-lg text-purple-200">{tournament.name}</p>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Tournament Info */}
          <div className="mb-6 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
            <h3 className="mb-3 font-bold text-gray-900">Tournament Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-gray-600">Prize Pool:</p>
                <p className="mt-1 text-lg font-bold text-yellow-700">
                  {formatGold(tournament.goldPrize)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Entry Fee:</p>
                <p className={`mt-1 text-lg font-bold ${canAffordEntry ? 'text-green-700' : 'text-red-700'}`}>
                  {formatGold(tournament.entryFee)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Minimum Level:</p>
                <p className="mt-1 text-lg font-bold text-purple-700">{tournament.minLevel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Participants:</p>
                <p className="mt-1 text-lg font-bold text-blue-700">
                  {tournament.registeredGladiators.length}/{tournament.maxParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Warning */}
          {!canAffordEntry && (
            <div className="mb-6 rounded-lg border-2 border-red-500 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-900">Insufficient Gold</h4>
                  <p className="mt-1 text-sm text-red-800">
                    You need {formatGold(tournament.entryFee)} to enter this tournament. You currently have {formatGold(currentGold)}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gladiator Selection */}
          <div>
            <h3 className="mb-3 font-bold text-gray-900">
              Select Your Gladiator ({eligibleGladiators.length} eligible)
            </h3>
            
            {eligibleGladiators.length === 0 ? (
              <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-8 text-center">
                <div className="text-6xl">⚔️</div>
                <p className="mt-4 text-lg font-semibold text-gray-700">No Eligible Gladiators</p>
                <p className="mt-2 text-sm text-gray-500">
                  All gladiators must be level {tournament.minLevel}+ and have HP remaining
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {eligibleGladiators.map((gladiator) => {
                  const hpPercent = (gladiator.hp / gladiator.maxHp) * 100;
                  const isSelected = selectedGladiator?.id === gladiator.id;

                  return (
                    <div
                      key={gladiator.id}
                      onClick={() => setSelectedGladiator(gladiator)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{gladiator.name}</h4>
                          <div
                            className={`mt-1 inline-block rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${
                              CLASS_COLORS[gladiator.class]
                            }`}
                          >
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
                      <div className="mb-3">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-gray-600">HP</span>
                          <span className="text-gray-600">
                            {gladiator.hp}/{gladiator.maxHp}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-300">
                          <div
                            className={`h-full transition-all ${
                              hpPercent > 60
                                ? 'bg-green-500'
                                : hpPercent > 30
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${hpPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded bg-red-100 px-2 py-1 text-center text-xs">
                          <p className="text-gray-600">STR</p>
                          <p className="font-bold text-red-800">{gladiator.strength}</p>
                        </div>
                        <div className="rounded bg-blue-100 px-2 py-1 text-center text-xs">
                          <p className="text-gray-600">DEF</p>
                          <p className="font-bold text-blue-800">{gladiator.defense}</p>
                        </div>
                        <div className="rounded bg-green-100 px-2 py-1 text-center text-xs">
                          <p className="text-gray-600">SPD</p>
                          <p className="font-bold text-green-800">{gladiator.speed}</p>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="mt-3 rounded-lg bg-purple-600 py-2 text-center">
                          <span className="font-bold text-white">✅ SELECTED</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Gladiator Summary */}
          {selectedGladiator && (
            <div className="mt-6 rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
              <h4 className="mb-2 font-bold text-gray-900">✅ Ready to Register</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-600">Gladiator:</p>
                  <p className="font-bold text-gray-900">{selectedGladiator.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Class:</p>
                  <p className="font-bold text-gray-900">{selectedGladiator.class}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Level:</p>
                  <p className="font-bold text-purple-700">{selectedGladiator.level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">HP:</p>
                  <p className={`font-bold ${selectedGladiator.hp === selectedGladiator.maxHp ? 'text-green-700' : 'text-yellow-700'}`}>
                    {selectedGladiator.hp}/{selectedGladiator.maxHp}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t-2 border-gray-300 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Your Gold: <span className="font-bold text-gray-900">{formatGold(currentGold)}</span>
              </p>
              <p className="text-sm text-gray-600">
                After Entry: <span className={`font-bold ${canAffordEntry ? 'text-green-700' : 'text-red-700'}`}>
                  {formatGold(currentGold - tournament.entryFee)}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={disabled}
                className="rounded-lg bg-gray-600 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
              >
                ❌ Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedGladiator) {
                    onConfirmEntry(tournament.id, selectedGladiator.id);
                  }
                }}
                disabled={!canEnter}
                className={`rounded-lg px-6 py-3 font-bold transition-colors ${
                  canEnter
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-600'
                }`}
              >
                {!selectedGladiator
                  ? '🔒 Select Gladiator'
                  : !canAffordEntry
                  ? '🔒 Insufficient Gold'
                  : '✅ Confirm Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
