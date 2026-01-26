/**
 * LudusScreen Component
 * 
 * Main ludus management screen integrating all ludus components
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { LudusDashboard } from '@components/ludus';
import { Fighter } from '@entities/Fighter';
import { facilityManager } from '@game/FacilityManager';
import { addGold, spendGold } from '@/store/slices/playerSlice';
import type { CharacterClass } from '@/types/game.types';
import { FacilityType, LudusFacility } from '@/types/facility.types';

const LudusScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Player state from Redux
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const currentGold = useAppSelector((state) => state?.player?.gold);
  
  // Local state (in full version, this would come from Redux ludus slice)
  const [ludusName, setLudusName] = useState('The Iron Ludus');
  const [prestige, setPrestige] = useState(500);
  const [reputation, setReputation] = useState(45);
  const [gladiators, setGladiators] = useState<Fighter[]>([]);
  const [facilities, setFacilities] = useState<LudusFacility[]>([]);
  const [maxRosterCapacity, setMaxRosterCapacity] = useState(10);
  
  // Financial tracking (simplified)
  const [dailyRevenue, setDailyRevenue] = useState(200);
  const [dailyExpenses, setDailyExpenses] = useState(150);
  const [totalIncome, setTotalIncome] = useState(5000);
  const [totalSpent, setTotalSpent] = useState(3000);

  // Initialize gladiators (sample data)
  useEffect(() => {
    // Create sample gladiators for demo
    const sampleGladiators = [
      new Fighter({ name: 'Spartacus', class: 'WARRIOR', level: 5 }),
      new Fighter({ name: 'Crixus', class: 'BERSERKER', level: 4 }),
      new Fighter({ name: 'Gannicus', class: 'ASSASSIN', level: 6 }),
    ];
    setGladiators(sampleGladiators);

    // Create sample facilities
    const sampleFacilities: LudusFacility[] = [
      {
          id: 'facility_1',
          type: 'barracks',
          level: 2,
          upgrading: false,
          maintenanceCost: 0
      },
      {
          id: 'facility_2',
          type: 'training_ground',
          level: 1,
          upgrading: false,
          maintenanceCost: 0
      },
    ];
    setFacilities(sampleFacilities);
  }, []);

  // Handle building a facility
  const handleBuildFacility = (type: FacilityType) => {
    const buildCost = facilityManager.getBuildCost(type);
    
    if (currentGold >= buildCost) {
      dispatch(spendGold(buildCost));
      setTotalSpent((prev) => prev + buildCost);
      
      const newFacility: LudusFacility = {
          id: `facility_${Date.now()}`,
          type,
          level: 1,
          upgrading: false,
          maintenanceCost: 0
      };
      
      setFacilities((prev) => [...prev, newFacility]);
      
      // Update daily expenses
      const maintenance = facilityManager.getMaintenanceCost(type, 1);
      setDailyExpenses((prev) => prev + maintenance);
      
      alert(`✅ ${type} built successfully!`);
    } else {
      alert(`❌ Not enough gold! Need ${buildCost}g`);
    }
  };

  // Handle upgrading a facility
  const handleUpgradeFacility = (facilityId: string) => {
    const facility = facilities.find((f) => f.id === facilityId);
    if (!facility) return;

    const upgradeCost = facilityManager.getUpgradeCost(facility);
    
    if (currentGold >= upgradeCost) {
      dispatch(spendGold(upgradeCost));
      setTotalSpent((prev) => prev + upgradeCost);
      
      setFacilities((prev) =>
        prev.map((f) =>
          f.id === facilityId
            ? {
                ...f,
                level: f.level + 1,
              }
            : f
        )
      );
      
      // Update daily expenses (difference between old and new maintenance)
      const oldMaintenance = facilityManager.getMaintenanceCost(facility.type, facility.level);
      const newMaintenance = facilityManager.getMaintenanceCost(facility.type, facility.level + 1);
      setDailyExpenses((prev) => prev - oldMaintenance + newMaintenance);
      
      alert(`✅ ${facility.type} upgraded to level ${facility.level + 1}!`);
    } else {
      alert(`❌ Not enough gold! Need ${upgradeCost}g`);
    }
  };

  // Handle recruiting a gladiator
  const handleRecruitGladiator = (gladiatorClass: CharacterClass) => {
    const recruitCost = 500;
    
    if (currentGold >= recruitCost && gladiators.length < maxRosterCapacity) {
      dispatch(spendGold(recruitCost));
      setTotalSpent((prev) => prev + recruitCost);
      
      const gladiatorNames = [
        'Maximus',
        'Brutus',
        'Varro',
        'Agron',
        'Castus',
        'Duro',
        'Oenomaus',
        'Batiatus',
        'Ashur',
        'Numerius',
      ];
      
      const name = gladiatorNames[Math.floor(Math.random() * gladiatorNames.length)]!;
      const newGladiator = new Fighter({
        name,
        class: gladiatorClass,
        level: 1,
      });
      
      setGladiators((prev) => [...prev, newGladiator]);
      alert(`✅ ${name} recruited successfully!`);
    } else if (gladiators.length >= maxRosterCapacity) {
      alert(`❌ Roster full! Maximum capacity: ${maxRosterCapacity}`);
    } else {
      alert(`❌ Not enough gold! Need ${recruitCost}g`);
    }
  };

  // Handle training a gladiator
  const handleTrainGladiator = (gladiatorId: string) => {
    const trainCost = 200;
    
    const gladiator = gladiators.find((g) => g.id === gladiatorId);
    if (!gladiator) return;

    if (currentGold >= trainCost && gladiator.level < 20) {
      dispatch(spendGold(trainCost));
      setTotalSpent((prev) => prev + trainCost);
      
      setGladiators((prev) =>
        prev.map((g) =>
          g.id === gladiatorId
            ? new Fighter({
                id: g.id,
                name: g.name,
                class: g.class,
                level: g.level + 1,
              })
            : g
        )
      );
      
      alert(`✅ ${gladiator.name} trained to level ${gladiator.level + 1}!`);
    } else if (gladiator.level >= 20) {
      alert(`❌ ${gladiator.name} is already max level (20)!`);
    } else {
      alert(`❌ Not enough gold! Need ${trainCost}g`);
    }
  };

  // Handle releasing a gladiator
  const handleReleaseGladiator = (gladiatorId: string) => {
    const gladiator = gladiators.find((g) => g.id === gladiatorId);
    if (!gladiator) return;

    const sellValue = 100 * gladiator.level;
    dispatch(addGold(sellValue));
    setTotalIncome((prev) => prev + sellValue);
    
    setGladiators((prev) => prev.filter((g) => g.id !== gladiatorId));
    alert(`✅ ${gladiator.name} released. Received ${sellValue}g`);
  };

  // Handle selecting a gladiator (for details view)
  const handleSelectGladiator = (gladiator: Fighter) => {
    console.log('Selected gladiator:', gladiator);
    // In full version, this would show detailed gladiator info panel
  };

  return (
    <div className="min-h-screen">
      <LudusDashboard
        ludusName={ludusName}
        prestige={prestige}
        reputation={reputation}
        currentGold={currentGold}
        dailyRevenue={dailyRevenue}
        dailyExpenses={dailyExpenses}
        totalIncome={totalIncome}
        totalSpent={totalSpent}
        gladiators={gladiators}
        maxRosterCapacity={maxRosterCapacity}
        facilities={facilities}
        onBuildFacility={handleBuildFacility}
        onUpgradeFacility={handleUpgradeFacility}
        onRecruitGladiator={handleRecruitGladiator}
        onTrainGladiator={handleTrainGladiator}
        onReleaseGladiator={handleReleaseGladiator}
        onSelectGladiator={handleSelectGladiator}
      />

      {/* Back Button (overlaid) */}
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

export default LudusScreen;
