import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@app/hooks';
import { formatGameDate } from '@features/game/gameSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui';
import { MainLayout } from '@components/layout';

export const StatisticsScreen: React.FC = () => {
  const gameState = useAppSelector(state => state.game);
  const playerState = useAppSelector(state => state.player);
  const gladiatorsState = useAppSelector(state => state.gladiators);
  const ludusState = useAppSelector(state => state.ludus);
  const staffState = useAppSelector(state => state.staff);
  const fameState = useAppSelector(state => state.fame);
  const tournamentsState = useAppSelector(state => state.tournaments);

  const roster = gladiatorsState?.roster || [];
  const fallen = gladiatorsState?.deadGladiators || [];
  const buildings = ludusState?.buildings || [];
  const employees = staffState?.employees || [];

  const totalWins = roster.reduce((sum, g) => sum + (g.wins || 0), 0) + fallen.reduce((sum, g) => sum + (g.wins || 0), 0);
  const totalLosses = roster.reduce((sum, g) => sum + (g.losses || 0), 0) + fallen.reduce((sum, g) => sum + (g.losses || 0), 0);
  const totalKills = roster.reduce((sum, g) => sum + (g.kills || 0), 0) + fallen.reduce((sum, g) => sum + (g.kills || 0), 0);
  const totalFights = totalWins + totalLosses;
  const winRate = totalFights > 0 ? Math.round((totalWins / totalFights) * 100) : 0;

  const bestGladiator = [...roster, ...fallen].sort((a, b) => (b.wins || 0) - (a.wins || 0))[0];
  const highestLevel = Math.max(0, ...roster.map(g => g.level || 1));
  const highestFame = Math.max(0, ...roster.map(g => g.fame || 0));

  const tournamentWins = tournamentsState?.tournamentHistory?.filter(t => t.playerResults?.some(p => p.won))?.length || 0;
  const tournamentTotal = tournamentsState?.tournamentHistory?.length || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const StatBox: React.FC<{ label: string; value: string | number; icon: string; color?: string }> = ({ label, value, icon, color = 'text-roman-gold-400' }) => (
    <div className="bg-roman-marble-800 p-4 rounded-lg text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-roman text-xl ${color}`}>{value}</div>
      <div className="text-xs text-roman-marble-500">{label}</div>
    </div>
  );

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-2xl sm:text-3xl text-roman-gold-500">Statistics</h1>
            <p className="text-sm text-roman-marble-400">
              {playerState?.ludusName || 'Your Ludus'} — {formatGameDate(gameState.currentYear, gameState.currentMonth)}
            </p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox icon="📅" label="Months Played" value={gameState.totalMonthsPlayed} />
                <StatBox icon="🏟️" label="Total Fights" value={totalFights} />
                <StatBox icon="🏆" label="Victories" value={totalWins} color="text-health-high" />
                <StatBox icon="📊" label="Win Rate" value={`${winRate}%`} color={winRate >= 60 ? 'text-health-high' : winRate >= 40 ? 'text-yellow-400' : 'text-roman-crimson-400'} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Economy */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Economy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox icon="💰" label="Current Gold" value={`${playerState?.gold || 0}g`} />
                <StatBox icon="📈" label="Total Earned" value={`${gameState.totalGoldEarned}g`} color="text-health-high" />
                <StatBox icon="📉" label="Total Spent" value={`${gameState.totalGoldSpent}g`} color="text-roman-crimson-400" />
                <StatBox icon="⚖️" label="Net Profit" value={`${gameState.totalGoldEarned - gameState.totalGoldSpent}g`} color={gameState.totalGoldEarned >= gameState.totalGoldSpent ? 'text-health-high' : 'text-roman-crimson-400'} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Combat */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Combat Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <StatBox icon="⚔️" label="Total Kills" value={totalKills} color="text-roman-crimson-400" />
                <StatBox icon="💀" label="Gladiators Lost" value={fallen.length} color="text-roman-marble-400" />
                <StatBox icon="🏆" label="Tournaments Won" value={tournamentWins} />
                <StatBox icon="🏟️" label="Tournaments Entered" value={tournamentTotal} />
              </div>
              {bestGladiator && (
                <div className="bg-roman-marble-800 p-3 rounded-lg">
                  <div className="text-xs text-roman-marble-500 mb-1">Most Victorious Gladiator</div>
                  <div className="flex items-center justify-between">
                    <span className="font-roman text-roman-gold-400">{bestGladiator.name}</span>
                    <span className="text-sm text-roman-marble-300">{bestGladiator.wins || 0}W / {bestGladiator.losses || 0}L / {bestGladiator.kills || 0}K</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ludus */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Ludus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox icon="👤" label="Active Gladiators" value={roster.length} />
                <StatBox icon="🏗️" label="Buildings" value={buildings.length} />
                <StatBox icon="👥" label="Staff Members" value={employees.length} />
                <StatBox icon="⭐" label="Ludus Fame" value={fameState?.ludusFame || 0} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                <StatBox icon="📊" label="Highest Level" value={highestLevel} />
                <StatBox icon="🌟" label="Highest Fame" value={highestFame} />
                <StatBox icon="💪" label="Total Trained" value={roster.length + fallen.length} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};
