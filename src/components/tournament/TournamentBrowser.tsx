/**
 * TournamentBrowser Component
 * 
 * Browse and filter available tournaments, view details, and register
 */

import React, { useState } from 'react';
import type { Tournament } from '@/types/tournament.types';
import { formatGold } from '@utils/helpers';

interface TournamentBrowserProps {
  tournaments: Tournament[];
  onSelectTournament: (tournament: Tournament) => void;
  onRegister: (tournamentId: string) => void;
  playerLevel: number;
  currentGold: number;
  disabled?: boolean;
}

type TierFilter = 'all' | 'easy' | 'medium' | 'hard' | 'legendary';
type StatusFilter = 'all' | 'registration_open' | 'in_progress' | 'completed';

const TIER_COLORS: Record<string, string> = {
  easy: 'from-green-500 to-green-700',
  medium: 'from-yellow-500 to-yellow-700',
  hard: 'from-orange-500 to-orange-700',
  legendary: 'from-purple-600 to-purple-900',
};

const TIER_LABELS: Record<string, string> = {
  easy: '⭐ Easy',
  medium: '⭐⭐ Medium',
  hard: '⭐⭐⭐ Hard',
  legendary: '⭐⭐⭐⭐ Legendary',
};

export const TournamentBrowser: React.FC<TournamentBrowserProps> = ({
  tournaments,
  onSelectTournament,
  onRegister,
  playerLevel,
  currentGold,
  disabled = false,
}) => {
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('registration_open');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Filter tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  // Check if player can register
  const canRegister = (tournament: Tournament): { can: boolean; reason?: string } => {
    if (tournament.status !== 'registration_open') {
      return { can: false, reason: 'Tournament not open' };
    }
    if (tournament.registeredGladiators.length >= tournament.maxParticipants) {
      return { can: false, reason: 'Tournament full' };
    }
    if (playerLevel < tournament.minLevel) {
      return { can: false, reason: `Requires level ${tournament.minLevel}` };
    }
    if (currentGold < tournament.entryFee) {
      return { can: false, reason: `Entry fee: ${formatGold(tournament.entryFee)}` };
    }
    return { can: true };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-50 p-8">
      {/* Header */}
      <div className="mb-6 rounded-lg border-2 border-purple-500 bg-gradient-to-r from-purple-700 to-purple-900 p-6 shadow-lg">
        <h1 className="text-4xl font-bold text-white">🏆 Tournament Browser</h1>
        <p className="mt-2 text-lg text-purple-200">
          {filteredTournaments.length} tournaments available
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border-2 border-gray-300 bg-white p-6 shadow-md">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Difficulty Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              🎯 Filter by Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'easy', 'medium', 'hard', 'legendary'] as TierFilter[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    tierFilter === tier
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tier === 'all' ? 'All' : TIER_LABELS[tier]}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              📊 Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'registration_open', 'in_progress', 'completed'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tournament List */}
      {filteredTournaments.length === 0 ? (
        <div className="rounded-lg border-2 border-gray-300 bg-white p-12 text-center shadow-md">
          <div className="text-6xl">🏆</div>
          <p className="mt-4 text-lg font-semibold text-gray-700">No tournaments found</p>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTournaments.map((tournament) => {
            const registration = canRegister(tournament);
            const isSelected = selectedTournament?.id === tournament.id;

            return (
              <div
                key={tournament.id}
                onClick={() => {
                  setSelectedTournament(tournament);
                  onSelectTournament(tournament);
                }}
                className={`cursor-pointer rounded-lg border-2 bg-white p-6 shadow-md transition-all hover:shadow-lg ${
                  isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                }`}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                  </div>
                  <div
                    className={`ml-4 rounded-full bg-gradient-to-r px-4 py-2 text-xs font-bold text-white ${
                      TIER_COLORS[tournament.tier]
                    }`}
                  >
                    {TIER_LABELS[tournament.tier]}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Prize Pool</p>
                    <p className="mt-1 text-lg font-bold text-yellow-700">
                      {formatGold(tournament.goldPrize)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Entry Fee</p>
                    <p className="mt-1 text-lg font-bold text-red-700">
                      {formatGold(tournament.entryFee)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Participants</p>
                    <p className="mt-1 text-lg font-bold text-blue-700">
                      {tournament.registeredGladiators.length}/{tournament.maxParticipants}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Min Level</p>
                    <p className="mt-1 text-lg font-bold text-purple-700">
                      {tournament.minLevel}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4 rounded-lg bg-blue-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-blue-900">Requirements:</p>
                  <div className="space-y-1">
                    <p
                      className={`text-xs ${
                        playerLevel >= tournament.minLevel ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {playerLevel >= tournament.minLevel ? '✅' : '❌'} Level {tournament.minLevel}+
                    </p>
                    <p
                      className={`text-xs ${
                        currentGold >= tournament.entryFee ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {currentGold >= tournament.entryFee ? '✅' : '❌'} Entry Fee:{' '}
                      {formatGold(tournament.entryFee)}
                    </p>
                    <p
                      className={`text-xs ${
                        tournament.registeredGladiators.length < tournament.maxParticipants
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {tournament.registeredGladiators.length < tournament.maxParticipants ? '✅' : '❌'}{' '}
                      Spots Available
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-full px-4 py-1 text-sm font-semibold ${
                      tournament.status === 'registration_open'
                        ? 'bg-green-100 text-green-800'
                        : tournament.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tournament.status === 'registration_open'
                      ? '🟢 Open'
                      : tournament.status === 'in_progress'
                      ? '🟡 In Progress'
                      : '⚫ Completed'}
                  </div>
                  {tournament.startDate && (
                    <p className="text-xs text-gray-500">
                      Starts: {new Date(tournament.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Register Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (registration.can) {
                      onRegister(tournament.id);
                    }
                  }}
                  disabled={disabled || !registration.can}
                  className={`w-full rounded-lg px-6 py-3 font-bold transition-colors ${
                    registration.can && !disabled
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'cursor-not-allowed bg-gray-300 text-gray-600'
                  }`}
                >
                  {registration.can
                    ? '🎫 Register for Tournament'
                    : `🔒 ${registration.reason}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
