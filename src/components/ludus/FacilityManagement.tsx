/**
 * FacilityManagement Component
 * 
 * Manage ludus facilities - build, upgrade, and view facility information
 */

import React, { useState } from 'react';
import { facilityManager } from '@game/FacilityManager';
import { formatGold } from '@utils/helpers';
import { FACILITY_ICONS } from '@data/facilityIcons';
import { FacilityType, LudusFacility } from '@/types/facility.types';

interface FacilityManagementProps {
  facilities: LudusFacility[];
  currentGold: number;
  onBuildFacility: (type: FacilityType) => void;
  onUpgradeFacility: (facilityId: string) => void;
  disabled?: boolean;
}

export const FacilityManagement: React.FC<FacilityManagementProps> = ({
  facilities,
  currentGold,
  onBuildFacility,
  onUpgradeFacility,
  disabled = false,
}) => {
  const [selectedTab, setSelectedTab] = useState<'owned' | 'available'>('owned');
  const [selectedFacility, setSelectedFacility] = useState<LudusFacility | null>(null);

  // Get available facilities to build
  const ownedTypes = new Set(facilities.map((f) => f.type));
  const availableToBuild: FacilityType[] = (Object.keys(FACILITY_ICONS) as FacilityType[]).filter(
    (type) => !ownedTypes.has(type)
  );

  // Check if can afford facility
  const canAfford = (cost: number) => currentGold >= cost;

  // Check if can upgrade
  const canUpgrade = (facility: LudusFacility) => {
    if (facility.level >= 5) return false;
    const upgradeCost = facilityManager.getUpgradeCost(facility);
    return canAfford(upgradeCost);
  };

  return (
    <div className="rounded-lg border-2 border-purple-500 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-purple-300 bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">🏗️ Facility Management</h2>
        <p className="mt-1 text-sm text-purple-200">
          {facilities.length} facilities | {availableToBuild.length} available to build
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => setSelectedTab('owned')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'owned'
              ? 'border-b-4 border-purple-600 bg-purple-50 text-purple-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          My Facilities ({facilities.length})
        </button>
        <button
          onClick={() => setSelectedTab('available')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'available'
              ? 'border-b-4 border-purple-600 bg-purple-50 text-purple-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Build New ({availableToBuild.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'owned' ? (
          /* Owned Facilities */
          <>
            {facilities.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">🏗️ No facilities built yet</p>
                <p className="mt-2 text-sm">Start by building your first facility!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {facilities.map((facility) => {
                  const upgradeCost = facilityManager.getUpgradeCost(facility);
                  const maintenanceCost = facilityManager.getMaintenanceCost(facility.type, facility.level);
                  const bonus = facilityManager.getFacilityBonus(facility.type, facility.level);

                  return (
                    <div
                      key={facility.id}
                      className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 transition-all hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{FACILITY_ICONS[facility.type]}</div>
                          <div>
                            <h3 className="font-bold text-purple-900">
                              {facilityManager.getFacilityName(facility.type)}
                            </h3>
                            <p className="text-sm text-purple-700">Level {facility.level}</p>
                          </div>
                        </div>
                        <div className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                          {facility.level === 5 ? 'MAX' : `${facility.level}/5`}
                        </div>
                      </div>

                      <p className="mb-3 text-sm text-gray-700">
                        {facilityManager.getFacilityDescription(facility.type)}
                      </p>

                      {/* Stats */}
                      <div className="mb-3 grid grid-cols-2 gap-2 rounded bg-white p-2 text-xs">
                        <div>
                          <p className="text-gray-600">Maintenance</p>
                          <p className="font-semibold text-red-700">-{formatGold(maintenanceCost)}/day</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bonus</p>
                          <p className="font-semibold text-green-700">+{bonus}%</p>
                        </div>
                      </div>

                      {/* Upgrade Button */}
                      {facility.level < 5 && (
                        <button
                          onClick={() => onUpgradeFacility(facility.id)}
                          disabled={disabled || !canUpgrade(facility)}
                          className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
                            canUpgrade(facility) && !disabled
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'cursor-not-allowed bg-gray-300 text-gray-600'
                          }`}
                        >
                          {canUpgrade(facility) && !disabled
                            ? `⬆️ Upgrade (${formatGold(upgradeCost)})`
                            : `🔒 Need ${formatGold(upgradeCost)}`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Available to Build */
          <>
            {availableToBuild.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">🎉 All facilities built!</p>
                <p className="mt-2 text-sm">Focus on upgrading existing facilities</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableToBuild.map((type) => {
                  const buildCost = facilityManager.getBuildCost(type);
                  const affordable = canAfford(buildCost);
                  const maintenanceCost = facilityManager.getMaintenanceCost(type, 1);
                  const bonus = facilityManager.getFacilityBonus(type, 1);

                  return (
                    <div
                      key={type}
                      className="rounded-lg border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white p-4"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl opacity-50">{FACILITY_ICONS[type]}</div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {facilityManager.getFacilityName(type)}
                            </h3>
                            <p className="text-sm text-gray-600">Level 1 (Starting)</p>
                          </div>
                        </div>
                      </div>

                      <p className="mb-3 text-sm text-gray-700">
                        {facilityManager.getFacilityDescription(type)}
                      </p>

                      {/* Stats Preview */}
                      <div className="mb-3 grid grid-cols-2 gap-2 rounded bg-white p-2 text-xs">
                        <div>
                          <p className="text-gray-600">Maintenance</p>
                          <p className="font-semibold text-red-700">-{formatGold(maintenanceCost)}/day</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Starting Bonus</p>
                          <p className="font-semibold text-green-700">+{bonus}%</p>
                        </div>
                      </div>

                      {/* Build Button */}
                      <button
                        onClick={() => onBuildFacility(type)}
                        disabled={disabled || !affordable}
                        className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
                          affordable && !disabled
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'cursor-not-allowed bg-gray-300 text-gray-600'
                        }`}
                      >
                        {affordable && !disabled
                          ? `🏗️ Build (${formatGold(buildCost)})`
                          : `🔒 Need ${formatGold(buildCost)}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
