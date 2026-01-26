import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { saveManager } from '@utils/SaveManager';
import { saveGame } from '@/store';
import type { CharacterOrigin } from '@/types/state.types';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const player = useAppSelector((state) => state.player);
  const stats = useAppSelector((state) => state.stats);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const winRate =
    stats.totalFightsPlayed > 0
      ? ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1)
      : '0.0';

  // Get save info
  const saveInfo = saveManager.getSaveInfo();
  const hasSave = saveManager.hasSave();

  // Manual save
  const handleSave = () => {
    const success = saveGame();
    setSaveStatus(success ? '✅ Game saved!' : '❌ Save failed');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Delete save
  const handleDeleteSave = () => {
    if (window.confirm('⚠️ Delete save data? This cannot be undone!')) {
      const success = saveManager.deleteSave();
      setSaveStatus(success ? '✅ Save deleted' : '❌ Delete failed');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Export save
  const handleExport = () => {
    saveManager.exportSave();
    setSaveStatus('✅ Save exported');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Import save
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await saveManager.importSave(file);
    setSaveStatus(success ? '✅ Save imported! Refresh page.' : '❌ Import failed');
    setTimeout(() => setSaveStatus(''), 5000);
  };

  // Helper to get path name
  const getPathName = (): string => {
    if (!player.storyPath) return 'Not Selected';
    const pathNames: Record<string, string> = {
      gladiator: '⚔️ The Gladiator - Chain Breaker',
      lanista: '🏛️ The Lanista - Architect of Glory',
      explorer: '🗺️ The Explorer - Hunter of Myths',
    };
    return pathNames[player.storyPath] ?? 'Unknown';
  };

  // Helper to get origin name
  const getOriginName = (): string => {
    if (!player.origin) return 'Not Selected';
    
    const originNames: Record<CharacterOrigin, string> = {
      // Gladiator origins
      thracian_veteran: 'The Thracian Veteran (Soldier)',
      disgraced_noble: 'The Disgraced Noble (Politician)',
      barbarian_prisoner: 'The Barbarian Prisoner (Beast)',
      // Lanista origins
      the_heir: 'The Heir (Legacy)',
      the_merchant: 'The Merchant (Investor)',
      the_veteran: 'The Retired Champion (Mentor)',
      // Explorer origins
      the_venator: 'The Venator (Beast Master)',
      the_merchant_prince: 'The Merchant Prince (Trader)',
      the_wandering_lanista: 'The Wandering Lanista (Mobile Trainer)',
    };
    
    return originNames[player.origin];
  };

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
              <p className="text-lg font-bold text-success-400">{player.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-lg font-bold text-blue-400">{player.xp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gold</p>
              <p className="text-lg font-bold text-warning-400">{player.gold.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Story Path Info */}
          {(player.storyPath || player.origin) && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="mb-3 text-lg font-bold text-gray-300">Story Path</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">Your Path</p>
                  <p className="text-base font-bold text-primary-400">{getPathName()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Origin</p>
                  <p className="text-base font-bold text-success-400">{getOriginName()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Combat Statistics */}
        <div className="card mb-6 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Combat Statistics</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-400">Fights Played</p>
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
              <p className="text-lg font-bold text-warning-500">{winRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Win Streak</p>
              <p className="text-lg font-bold text-primary-400">{stats.winStreak}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Best Streak</p>
              <p className="text-lg font-bold text-primary-400">{stats.bestStreak}</p>
            </div>
          </div>
        </div>

        {/* Damage Stats */}
        <div className="card mb-6 p-6">
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

        {/* Save Management */}
        <div className="card p-6">
          <h3 className="mb-4 text-xl font-bold text-white">💾 Save Management</h3>
          
          {/* Save Info */}
          {hasSave && saveInfo && (
            <div className="mb-4 rounded-lg bg-blue-900/30 p-3">
              <p className="text-sm text-gray-400">Last Saved:</p>
              <p className="text-lg font-bold text-blue-400">
                {new Date(saveInfo.timestamp).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">Version: {saveInfo.version}</p>
            </div>
          )}

          {/* Status Message */}
          {saveStatus && (
            <div className="mb-4 rounded-lg bg-green-900/30 p-3 text-center">
              <p className="font-semibold text-green-400">{saveStatus}</p>
            </div>
          )}

          {/* Save Actions */}
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={handleSave}
              className="btn-primary py-3"
            >
              💾 Save Game
            </button>
            
            <button
              onClick={handleExport}
              disabled={!hasSave}
              className="btn-secondary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Export Save
            </button>
            
            <label className="btn-secondary cursor-pointer py-3 text-center">
              📤 Import Save
              <input
                type="file"
                accept=".json"
                onChange={(e) => { void handleImport(e); }}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleDeleteSave}
              disabled={!hasSave}
              className="btn-danger py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ Delete Save
            </button>
          </div>

          {/* Auto-save Info */}
          <div className="mt-4 rounded-lg bg-gray-800/50 p-3">
            <p className="text-center text-xs text-gray-400">
              🔄 Auto-save every 30 seconds • 💾 Saves on page exit
            </p>
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
  );
};

export default ProfileScreen;
