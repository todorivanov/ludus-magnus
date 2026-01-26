/**
 * LudusDashboard Component
 * 
 * Main ludus management screen integrating all management panels
 */

import React, { useState } from 'react';
import { FinancePanel } from './FinancePanel';
import { FacilityManagement } from './FacilityManagement';
import { RosterManagement } from './RosterManagement';
import { Fighter } from '@entities/Fighter';
import { formatNumber, formatGold } from '@utils/helpers';
import { FacilityType, LudusFacility } from '@/types/facility.types';
import { CharacterClass } from '@/types/game.types';

interface LudusDashboardProps {
  // Ludus info
  ludusName: string;
  prestige: number;
  reputation: number;
  
  // Financial data
  currentGold: number;
  dailyRevenue: number;
  dailyExpenses: number;
  totalIncome: number;
  totalSpent: number;
  
  // Gladiators
  gladiators: Fighter[];
  maxRosterCapacity: number;
  
  // Facilities
  facilities: LudusFacility[];
  
  // Callbacks
  onBuildFacility: (type: FacilityType) => void;
  onUpgradeFacility: (facilityId: string) => void;
  onRecruitGladiator: (gladiatorClass: CharacterClass) => void;
  onTrainGladiator: (gladiatorId: string) => void;
  onReleaseGladiator: (gladiatorId: string) => void;
  onSelectGladiator: (gladiator: Fighter) => void;
}

type TabType = 'overview' | 'roster' | 'facilities' | 'finance';

export const LudusDashboard: React.FC<LudusDashboardProps> = ({
  ludusName,
  prestige,
  reputation,
  currentGold,
  dailyRevenue,
  dailyExpenses,
  totalIncome,
  totalSpent,
  gladiators,
  maxRosterCapacity,
  facilities,
  onBuildFacility,
  onUpgradeFacility,
  onRecruitGladiator,
  onTrainGladiator,
  onReleaseGladiator,
  onSelectGladiator,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Calculate overview stats
  const netDaily = dailyRevenue - dailyExpenses;
  const totalGladiators = gladiators.length;
  const totalFacilities = facilities.length;
  const averageGladiatorLevel =
    totalGladiators > 0
      ? (gladiators.reduce((sum, g) => sum + g.level, 0) / totalGladiators).toFixed(1)
      : '0';
  
  // Prestige calculation (simple for now)
  const prestigeLevel = Math.floor(prestige / 1000) + 1;
  const prestigeProgress = (prestige % 1000) / 10; // 0-100%

  // Reputation status
  const getReputationStatus = (rep: number): { label: string; color: string } => {
    if (rep >= 90) return { label: 'Legendary', color: 'text-yellow-600' };
    if (rep >= 75) return { label: 'Renowned', color: 'text-purple-600' };
    if (rep >= 50) return { label: 'Known', color: 'text-blue-600' };
    if (rep >= 25) return { label: 'Rising', color: 'text-green-600' };
    return { label: 'Unknown', color: 'text-gray-600' };
  };

  const reputationStatus = getReputationStatus(reputation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Header */}
      <div className="border-b-4 border-blue-600 bg-gradient-to-r from-blue-800 to-purple-900 px-8 py-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">{ludusName}</h1>
            <p className="mt-1 text-lg text-blue-200">Ludus Management Dashboard</p>
          </div>
          <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-sm text-blue-200">Current Gold</p>
              <p className="mt-1 text-3xl font-bold text-yellow-400">{formatGold(currentGold)}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4">
          {/* Prestige */}
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Prestige</p>
                <p className="mt-1 text-2xl font-bold text-white">Level {prestigeLevel}</p>
              </div>
              <div className="text-3xl">👑</div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${prestigeProgress}%` }}
              />
            </div>
          </div>

          {/* Reputation */}
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Reputation</p>
                <p className={`mt-1 text-xl font-bold ${reputationStatus.color === 'text-yellow-600' ? 'text-yellow-400' : 'text-white'}`}>
                  {reputationStatus.label}
                </p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all"
                style={{ width: `${reputation}%` }}
              />
            </div>
          </div>

          {/* Gladiators */}
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Gladiators</p>
                <p className="mt-1 text-2xl font-bold text-white">{totalGladiators}/{maxRosterCapacity}</p>
              </div>
              <div className="text-3xl">⚔️</div>
            </div>
            <p className="mt-2 text-xs text-blue-200">Avg Level: {averageGladiatorLevel}</p>
          </div>

          {/* Facilities */}
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Facilities</p>
                <p className="mt-1 text-2xl font-bold text-white">{totalFacilities}</p>
              </div>
              <div className="text-3xl">🏛️</div>
            </div>
            <p className="mt-2 text-xs text-blue-200">
              Total Maintenance: {formatGold(dailyExpenses)}
            </p>
          </div>

          {/* Daily Income */}
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Daily Net</p>
                <p className={`mt-1 text-2xl font-bold ${netDaily >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netDaily >= 0 ? '+' : ''}{formatGold(netDaily)}
                </p>
              </div>
              <div className="text-3xl">{netDaily >= 0 ? '📈' : '📉'}</div>
            </div>
            <p className="mt-2 text-xs text-blue-200">
              {netDaily >= 0 ? 'Profitable' : 'Losing Money'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-300 bg-white shadow-sm">
        <div className="flex gap-2 px-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'roster'
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            ⚔️ Roster ({totalGladiators})
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'facilities'
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            🏛️ Facilities ({totalFacilities})
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-6 py-4 font-semibold transition-colors ${
              activeTab === 'finance'
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            💰 Finance
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-gray-300 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">📋 Ludus Overview</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-700">Ludus Information</h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-bold text-gray-900">{ludusName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prestige Level:</span>
                        <span className="font-bold text-purple-700">{prestigeLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reputation:</span>
                        <span className={`font-bold ${reputationStatus.color}`}>
                          {reputationStatus.label} ({reputation}/100)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-gray-700">Financial Summary</h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Gold:</span>
                        <span className="font-bold text-yellow-700">{formatGold(currentGold)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Revenue:</span>
                        <span className="font-bold text-green-700">+{formatGold(dailyRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Expenses:</span>
                        <span className="font-bold text-red-700">-{formatGold(dailyExpenses)}</span>
                      </div>
                      <div className="flex justify-between border-t-2 border-gray-300 pt-2">
                        <span className="text-gray-700 font-semibold">Net Daily:</span>
                        <span className={`font-bold ${netDaily >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {netDaily >= 0 ? '+' : ''}{formatGold(netDaily)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-700">Roster Status</h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Gladiators:</span>
                        <span className="font-bold text-gray-900">{totalGladiators}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Roster Capacity:</span>
                        <span className="font-bold text-gray-900">{maxRosterCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Slots:</span>
                        <span className={`font-bold ${maxRosterCapacity - totalGladiators === 0 ? 'text-red-700' : 'text-green-700'}`}>
                          {maxRosterCapacity - totalGladiators}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Level:</span>
                        <span className="font-bold text-purple-700">{averageGladiatorLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-gray-700">Facility Status</h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Facilities:</span>
                        <span className="font-bold text-gray-900">{totalFacilities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Maintenance:</span>
                        <span className="font-bold text-red-700">{formatGold(dailyExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available to Build:</span>
                        <span className="font-bold text-blue-700">{12 - totalFacilities}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 border-t-2 border-gray-200 pt-4">
                <h3 className="mb-3 font-semibold text-gray-700">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('roster')}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    ⚔️ Manage Roster
                  </button>
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-700"
                  >
                    🏛️ Build Facilities
                  </button>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    💰 View Finances
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <RosterManagement
            gladiators={gladiators}
            maxCapacity={maxRosterCapacity}
            onRecruitGladiator={onRecruitGladiator}
            onTrainGladiator={onTrainGladiator}
            onReleaseGladiator={onReleaseGladiator}
            onSelectGladiator={onSelectGladiator}
            currentGold={currentGold}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilityManagement
            facilities={facilities}
            currentGold={currentGold}
            onBuildFacility={onBuildFacility}
            onUpgradeFacility={onUpgradeFacility}
          />
        )}

        {activeTab === 'finance' && (
          <FinancePanel
            gold={currentGold}
            dailyRevenue={dailyRevenue}
            dailyExpenses={dailyExpenses}
            totalIncome={totalIncome}
            totalSpent={totalSpent}
            showDetailed
          />
        )}
      </div>
    </div>
  );
};
