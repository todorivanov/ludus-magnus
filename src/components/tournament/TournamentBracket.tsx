/**
 * TournamentBracket Component
 * 
 * Visualize tournament bracket structure with matches and progression
 */

import React, { useState } from 'react';
import type { TournamentBracket as BracketType, TournamentMatch } from '@/types/tournament.types';

interface TournamentBracketProps {
  bracket: BracketType;
  onSelectMatch: (match: TournamentMatch) => void;
  highlightedFighterId?: string;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  bracket,
  onSelectMatch,
  highlightedFighterId,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);

  // Get rounds from bracket
  const rounds = bracket.rounds;
  const roundCount = rounds.length;

  // Determine if a fighter is highlighted
  const isHighlighted = (fighterId: string | null): boolean => {
    return !!fighterId && fighterId === highlightedFighterId;
  };

  // Get fighter name display
  const getFighterName = (fighterId: string | null): string => {
    if (!fighterId) return 'TBD';
    // In a real implementation, this would look up the fighter name
    // For now, just show ID
    return fighterId.substring(0, 8);
  };

  // Get match status color
  const getMatchStatusColor = (match: TournamentMatch): string => {
    if (match.winnerId) return 'bg-gray-200';
    if (match.fighter1Id && match.fighter2Id) return 'bg-blue-100';
    return 'bg-gray-100';
  };

  return (
    <div className="rounded-lg border-2 border-purple-500 bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 border-b-2 border-purple-300 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">🏆 Tournament Bracket</h2>
        <p className="mt-1 text-sm text-gray-600">
          {roundCount} rounds • {Math.pow(2, roundCount)} fighters
        </p>
      </div>

      {/* Bracket Visualization */}
      <div className="overflow-x-auto">
        <div className="flex gap-8 pb-4">
          {rounds.map((round, roundIndex) => (
            <div key={round.roundNumber} className="flex min-w-[240px] flex-col">
              {/* Round Header */}
              <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 px-4 py-2 text-center">
                <h3 className="font-bold text-white">
                  {roundIndex === roundCount - 1
                    ? '🏆 Finals'
                    : roundIndex === roundCount - 2
                    ? '⚔️ Semi-Finals'
                    : `Round ${round.roundNumber}`}
                </h3>
                <p className="text-xs text-purple-200">{round.matches.length} matches</p>
              </div>

              {/* Matches */}
              <div className="flex flex-1 flex-col justify-around space-y-8">
                {round.matches.map((match) => {
                  const isSelected = selectedMatch?.id === match.id;
                  const statusColor = getMatchStatusColor(match);
                  const fighter1Highlighted = isHighlighted(match.fighter1Id);
                  const fighter2Highlighted = isHighlighted(match.fighter2Id);

                  return (
                    <div
                      key={match.id}
                      onClick={() => {
                        setSelectedMatch(match);
                        onSelectMatch(match);
                      }}
                      className={`cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-300'
                      } ${statusColor}`}
                    >
                      {/* Match Number */}
                      <div className="border-b border-gray-300 bg-gray-50 px-3 py-1 text-center">
                        <span className="text-xs font-semibold text-gray-700">
                          Match {match.id}
                        </span>
                      </div>

                      {/* Fighter 1 */}
                      <div
                        className={`border-b px-3 py-2 ${
                          fighter1Highlighted
                            ? 'bg-blue-200'
                            : match.winnerId === match.fighter1Id
                            ? 'bg-green-100'
                            : ''
                        } ${match.fighter1Id ? '' : 'italic text-gray-400'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {getFighterName(match.fighter1Id)}
                          </span>
                          {match.winnerId === match.fighter1Id && (
                            <span className="text-lg">✅</span>
                          )}
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="bg-gray-200 py-1 text-center">
                        <span className="text-xs font-bold text-gray-600">VS</span>
                      </div>

                      {/* Fighter 2 */}
                      <div
                        className={`px-3 py-2 ${
                          fighter2Highlighted
                            ? 'bg-blue-200'
                            : match.winnerId === match.fighter2Id
                            ? 'bg-green-100'
                            : ''
                        } ${match.fighter2Id ? '' : 'italic text-gray-400'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {getFighterName(match.fighter2Id)}
                          </span>
                          {match.winnerId === match.fighter2Id && (
                            <span className="text-lg">✅</span>
                          )}
                        </div>
                      </div>

                      {/* Match Status */}
                      {match.winnerId ? (
                        <div className="bg-green-600 px-3 py-1 text-center">
                          <span className="text-xs font-bold text-white">COMPLETED</span>
                        </div>
                      ) : match.fighter1Id && match.fighter2Id ? (
                        <div className="bg-blue-600 px-3 py-1 text-center">
                          <span className="text-xs font-bold text-white">READY</span>
                        </div>
                      ) : (
                        <div className="bg-gray-400 px-3 py-1 text-center">
                          <span className="text-xs font-bold text-white">PENDING</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Match Details */}
      {selectedMatch && (
        <div className="mt-6 rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
          <h3 className="mb-3 font-bold text-gray-900">
            📋 Match {selectedMatch.id} Details
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-600">Fighter 1:</p>
              <p className="text-sm font-bold text-gray-900">
                {getFighterName(selectedMatch.fighter1Id)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-600">Fighter 2:</p>
              <p className="text-sm font-bold text-gray-900">
                {getFighterName(selectedMatch.fighter2Id)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-600">Status:</p>
              <p className="text-sm font-bold text-gray-900">
                {selectedMatch.winnerId
                  ? 'Completed'
                  : selectedMatch.fighter1Id && selectedMatch.fighter2Id
                  ? 'Ready to Fight'
                  : 'Awaiting Fighters'}
              </p>
            </div>
          </div>
          {selectedMatch.winnerId && (
            <div className="mt-3 rounded bg-green-100 px-3 py-2">
              <p className="text-sm font-semibold text-green-900">
                🏆 Winner: {getFighterName(selectedMatch.winnerId)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 border-t-2 border-gray-200 pt-4">
        <p className="mb-2 text-xs font-semibold text-gray-700">Legend:</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-100 border-2 border-gray-300" />
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blue-100 border-2 border-gray-300" />
            <span className="text-xs text-gray-600">Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 border-2 border-gray-300" />
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blue-200 border-2 border-blue-500" />
            <span className="text-xs text-gray-600">Your Fighter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
