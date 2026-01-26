/**
 * TournamentScreen Component
 * 
 * Tournament management screen with browser, bracket, and entry components
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { TournamentBrowser, TournamentBracket, TournamentEntry } from '@components/tournament';
import { Fighter } from '@entities/Fighter';
import { tournamentManager, TournamentManager } from '@game/TournamentManager';
import { spendGold } from '@/store/slices/playerSlice';
import type { Tournament, TournamentBracket as BracketType, TournamentMatch } from '@/types/tournament.types';
import type { CharacterClass } from '@/types/game.types';

type ViewMode = 'browser' | 'bracket' | 'entry';

const TournamentScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Player state from Redux
  const playerLevel = useAppSelector((state) => state.player.level);
  const currentGold = useAppSelector((state) => state.player.gold);
  
  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>('browser');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [currentBracket, setCurrentBracket] = useState<BracketType | null>(null);
  const [availableGladiators, setAvailableGladiators] = useState<Fighter[]>([]);

  // Initialize tournaments
  useEffect(() => {
    // Create sample tournaments
    const sampleTournaments: Tournament[] = [
      {
          id: 'tournament_1',
          name: 'Rookie Arena Challenge',
          status: 'registration_open',
          goldPrize: 1000,
          entryFee: 100,
          minLevel: 1,
          maxParticipants: 8,
          startDate: Date.now() + 86400000,
          type: 'single_elimination',
          location: 'rome',
          tier: 'local',
          reputationReward: 0,
          endDate: 0,
          registrationDeadline: 0,
          registeredGladiators: []
      },
      {
          id: 'tournament_2',
          name: 'Champion\'s Gauntlet',
          status: 'registration_open',
          goldPrize: 5000,
          entryFee: 500,
          minLevel: 5,
          maxParticipants: 16,
          startDate: Date.now() + 172800000,
          type: 'single_elimination',
          location: 'rome',
          tier: 'local',
          reputationReward: 0,
          endDate: 0,
          registrationDeadline: 0,
          registeredGladiators: []
      },
      {
          id: 'tournament_3',
          name: 'Gladiator\'s Inferno',
          status: 'in_progress',
          goldPrize: 10000,
          entryFee: 1000,
          minLevel: 10,
          maxParticipants: 16,
          startDate: Date.now() - 3600000,
          type: 'single_elimination',
          location: 'rome',
          tier: 'local',
          reputationReward: 0,
          endDate: 0,
          registrationDeadline: 0,
          registeredGladiators: []
      },
      {
          id: 'tournament_4',
          name: 'Legendary Grand Colosseum',
          status: 'registration_open',
          goldPrize: 50000,
          entryFee: 5000,
          minLevel: 15,
          maxParticipants: 32,
          startDate: Date.now() + 259200000,
          type: 'single_elimination',
          location: 'rome',
          tier: 'local',
          reputationReward: 0,
          endDate: 0,
          registrationDeadline: 0,
          registeredGladiators: []
      },
      {
          id: 'tournament_5',
          name: 'Veteran\'s Honor Cup',
          status: 'completed',
          goldPrize: 15000,
          entryFee: 1500,
          minLevel: 12,
          maxParticipants: 16,
          startDate: Date.now() - 86400000,
          type: 'single_elimination',
          location: 'rome',
          tier: 'local',
          reputationReward: 0,
          endDate: 0,
          registrationDeadline: 0,
          registeredGladiators: []
      },
    ];
    
    setTournaments(sampleTournaments);

    // Create sample gladiators
    const sampleGladiators = [
      new Fighter({ name: 'Spartacus', class: 'WARRIOR', level: 8 }),
      new Fighter({ name: 'Crixus', class: 'BERSERKER', level: 6 }),
      new Fighter({ name: 'Gannicus', class: 'ASSASSIN', level: 10 }),
      new Fighter({ name: 'Oenomaus', class: 'TANK', level: 7 }),
    ];
    setAvailableGladiators(sampleGladiators);
  }, []);

  // Handle tournament selection
  const handleSelectTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
  };

  // Handle registration button click
  const handleRegister = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (tournament) {
      setSelectedTournament(tournament);
      setViewMode('entry');
    }
  };

  // Handle confirm entry
  const handleConfirmEntry = (tournamentId: string, gladiatorId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;

    dispatch(spendGold(tournament.entryFee));
    
    // Update tournament participants
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournamentId
          ? { ...t, registeredGladiators: [...t.registeredGladiators, gladiatorId] }
          : t
      )
    );

    alert(`✅ Successfully registered for ${tournament.name}!`);
    setViewMode('browser');
  };

  // Handle viewing bracket
  const handleViewBracket = () => {
    if (selectedTournament && selectedTournament.status !== 'registration_open') {
      // Generate sample bracket
      const bracket = tournamentManager.generateBracket(
        selectedTournament.id
      );
      // Only set if bracket is valid
      if (bracket && !('success' in bracket)) {
        setCurrentBracket(bracket);
        setViewMode('bracket');
      } else {
        alert('Bracket could not be generated.');
      }
    }
  };

  // Handle match selection in bracket
  const handleSelectMatch = (match: TournamentMatch) => {
    console.log('Selected match:', match);
    // In full version, this could show match details or allow spectating
  };

  return (
    <div className="min-h-screen">
      {/* Browser View */}
      {viewMode === 'browser' && (
        <>
          <TournamentBrowser
            tournaments={tournaments}
            onSelectTournament={handleSelectTournament}
            onRegister={handleRegister}
            playerLevel={playerLevel}
            currentGold={currentGold}
          />

          {/* View Bracket Button (if tournament selected and not open) */}
          {selectedTournament && selectedTournament.status !== 'registration_open' && (
            <div className="fixed bottom-20 right-4">
              <button
                onClick={handleViewBracket}
                className="rounded-lg bg-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-purple-700"
              >
                📊 View Bracket
              </button>
            </div>
          )}
        </>
      )}

      {/* Bracket View */}
      {viewMode === 'bracket' && currentBracket && (
        <div className="p-8">
          <div className="mb-6">
            <button
              onClick={() => setViewMode('browser')}
              className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            >
              ← Back to Tournaments
            </button>
          </div>
          
          <TournamentBracket
            bracket={currentBracket}
            onSelectMatch={handleSelectMatch}
            highlightedFighterId={availableGladiators[0]?.id} // Highlight first gladiator
          />
        </div>
      )}

      {/* Entry View */}
      {viewMode === 'entry' && selectedTournament && (
        <TournamentEntry
          tournament={selectedTournament}
          availableGladiators={availableGladiators}
          currentGold={currentGold}
          onConfirmEntry={handleConfirmEntry}
          onCancel={() => setViewMode('browser')}
        />
      )}

      {/* Back to Title Button */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={() => navigate('/title')}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg hover:bg-gray-700"
        >
          ← Back to Title
        </button>
      </div>
    </div>
  );
};

export default TournamentScreen;
