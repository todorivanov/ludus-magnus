import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const player = useAppSelector((state) => state.player);
  const stats = useAppSelector((state) => state.stats);

  const winRate =
    stats.totalFightsPlayed > 0
      ? ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-gaming text-4xl font-bold text-primary-400">Profile</h1>
          <button onClick={() => navigate('/title')} className="btn-secondary">
            ← Back
          </button>
        </div>

        {/* Character Info */}
        <div className="card mb-6 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">{player.name}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-400">Class</p>
              <p className="text-lg font-bold text-primary-400">{player.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Level</p>
              <p className="text-lg font-bold text-success-500">{player.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-lg font-bold text-warning-500">{player.xp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gold</p>
              <p className="text-lg font-bold text-warning-500">{player.gold} 💰</p>
            </div>
          </div>
        </div>

        {/* Combat Statistics */}
        <div className="card mb-6 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Combat Statistics</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Total Fights</p>
              <p className="text-lg font-bold text-white">{stats.totalFightsPlayed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Wins</p>
              <p className="text-lg font-bold text-success-500">{stats.totalWins}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Losses</p>
              <p className="text-lg font-bold text-danger-500">{stats.totalLosses}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-lg font-bold text-primary-400">{winRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Streak</p>
              <p className="text-lg font-bold text-warning-500">{stats.winStreak}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Best Streak</p>
              <p className="text-lg font-bold text-primary-400">{stats.bestStreak}</p>
            </div>
          </div>
        </div>

        {/* Damage Stats */}
        <div className="card p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Performance</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Damage Dealt</p>
              <p className="text-lg font-bold text-danger-500">{stats.totalDamageDealt.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Damage Taken</p>
              <p className="text-lg font-bold text-gray-400">{stats.totalDamageTaken.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Critical Hits</p>
              <p className="text-lg font-bold text-warning-500">{stats.criticalHits}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
