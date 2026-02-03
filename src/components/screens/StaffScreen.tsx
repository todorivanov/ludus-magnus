import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@app/hooks';
import { 
  hireStaff, 
  fireStaff,
  learnStaffSkill,
  setStaffMarket,
} from '@features/staff/staffSlice';
import { spendGold } from '@features/player/playerSlice';
import { MainLayout } from '@components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar, Modal } from '@components/ui';
import { 
  STAFF_ROLES, 
  calculateDailyWageCost,
  generateStaffMarket,
} from '@data/staff';
import type { Staff, StaffRole } from '@/types';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

export const StaffScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const staffState = useAppSelector(state => state.staff);
  const employees = staffState?.employees || [];
  const staffMarket = staffState?.staffMarket || [];
  const { gold } = useAppSelector(state => state.player);
  const { buildings } = useAppSelector(state => state.ludus);
  const { currentDay } = useAppSelector(state => state.game);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showFireModal, setShowFireModal] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<StaffRole | 'all'>('all');

  // Initialize staff market if empty
  useEffect(() => {
    if (!staffMarket || staffMarket.length === 0) {
      dispatch(setStaffMarket(generateStaffMarket()));
    }
  }, [dispatch, staffMarket]);

  // Calculate totals
  const totalDailyWage = calculateDailyWageCost(employees);
  const totalMonthlyWage = totalDailyWage * 30;

  // Get count of each role
  const getRoleCount = (role: StaffRole) => {
    return employees.filter(e => e.role === role).length;
  };

  // Check if can hire more of a role
  const canHireMore = (role: StaffRole) => {
    const current = getRoleCount(role);
    const max = STAFF_ROLES[role].maxCount;
    return current < max;
  };

  // Handle hiring
  const handleHire = (marketStaff: typeof staffMarket[0]) => {
    if (gold < marketStaff.hireCost) return;
    if (!canHireMore(marketStaff.role)) return;

    const newStaff: Staff = {
      id: uuidv4(),
      name: marketStaff.name,
      role: marketStaff.role,
      level: 1,
      experience: 0,
      satisfaction: 70,
      skills: [],
      dailyWage: marketStaff.dailyWage,
      daysEmployed: 0,
      daysUnpaid: 0,
    };

    dispatch(spendGold({
      amount: marketStaff.hireCost,
      description: `Hired ${marketStaff.name} (${STAFF_ROLES[marketStaff.role].name})`,
      category: 'staff',
      day: currentDay,
    }));
    dispatch(hireStaff(newStaff));
    
    // Remove from market and potentially regenerate
    const newMarket = staffMarket.filter(s => s !== marketStaff);
    if (newMarket.length < 3) {
      dispatch(setStaffMarket([...newMarket, ...generateStaffMarket().slice(0, 2)]));
    } else {
      dispatch(setStaffMarket(newMarket));
    }
    
    setShowHireModal(false);
  };

  // Handle firing
  const handleFire = () => {
    if (!selectedStaff) return;
    dispatch(fireStaff(selectedStaff.id));
    setSelectedStaff(null);
    setShowFireModal(false);
  };

  // Filter employees
  const filteredEmployees = selectedRoleFilter === 'all'
    ? employees
    : employees.filter(e => e.role === selectedRoleFilter);

  const roleFilters: { id: StaffRole | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '👥' },
    { id: 'doctore', label: 'Doctore', icon: '🎓' },
    { id: 'medicus', label: 'Medicus', icon: '⚕️' },
    { id: 'lanista', label: 'Lanista', icon: '📜' },
    { id: 'faber', label: 'Faber', icon: '🔨' },
    { id: 'coquus', label: 'Coquus', icon: '👨‍🍳' },
    { id: 'guard', label: 'Guard', icon: '💂' },
    { id: 'lorarius', label: 'Lorarius', icon: '⛓️' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-roman text-3xl text-roman-gold-500 mb-2">
              Staff & Personnel
            </h1>
            <p className="text-roman-marble-400">
              {employees.length} staff members employed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-roman-marble-800 px-4 py-2 rounded-lg border border-roman-marble-600">
              <span className="text-roman-marble-400 text-sm">Daily Wages:</span>
              <span className="ml-2 font-roman text-roman-gold-400">{totalDailyWage}g</span>
            </div>
            <div className="bg-roman-marble-800 px-4 py-2 rounded-lg border border-roman-marble-600">
              <span className="text-roman-marble-400 text-sm">Monthly:</span>
              <span className="ml-2 font-roman text-roman-gold-400">{totalMonthlyWage}g</span>
            </div>
            <Button variant="gold" onClick={() => setShowHireModal(true)}>
              + Hire Staff
            </Button>
          </div>
        </div>

        {/* Role Summary Cards */}
        <div className="grid grid-cols-7 gap-3">
          {Object.values(STAFF_ROLES).map(role => {
            const count = getRoleCount(role.id);
            const hasBuilding = role.synergyBuilding 
              ? buildings.some(b => b.type === role.synergyBuilding)
              : true;

            return (
              <Card 
                key={role.id}
                className={clsx(
                  'cursor-pointer transition-all',
                  selectedRoleFilter === role.id && 'ring-2 ring-roman-gold-500'
                )}
                onClick={() => setSelectedRoleFilter(
                  selectedRoleFilter === role.id ? 'all' : role.id
                )}
              >
                <CardContent className="text-center py-3">
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="font-roman text-sm text-roman-marble-200">{role.name}</div>
                  <div className="text-xs text-roman-marble-500">
                    {count}/{role.maxCount}
                  </div>
                  {!hasBuilding && role.synergyBuilding && (
                    <div className="text-xs text-roman-crimson-400 mt-1">
                      No {role.synergyBuilding}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Staff List */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Staff</CardTitle>
                  <div className="flex gap-2">
                    {roleFilters.slice(0, 4).map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedRoleFilter(filter.id)}
                        className={clsx(
                          'px-2 py-1 rounded text-xs transition-all',
                          selectedRoleFilter === filter.id
                            ? 'bg-roman-gold-600 text-roman-marble-900'
                            : 'bg-roman-marble-700 text-roman-marble-300 hover:bg-roman-marble-600'
                        )}
                      >
                        {filter.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-roman-marble-400">
                      {employees.length === 0
                        ? 'No staff hired yet. Hire staff to improve your ludus operations.'
                        : 'No staff of this type.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmployees.map(staff => (
                      <StaffCard
                        key={staff.id}
                        staff={staff}
                        isSelected={selectedStaff?.id === staff.id}
                        onClick={() => setSelectedStaff(staff)}
                        buildings={buildings}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Staff Detail Panel */}
          <div className="col-span-1">
            {selectedStaff ? (
              <StaffDetailPanel
                staff={selectedStaff}
                buildings={buildings}
                onFire={() => setShowFireModal(true)}
                onLearnSkill={(skillId) => {
                  dispatch(learnStaffSkill({ staffId: selectedStaff.id, skillId }));
                }}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-4xl mb-3">👤</div>
                  <p className="text-roman-marble-400">
                    Select a staff member to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Hire Modal */}
        <Modal
          isOpen={showHireModal}
          onClose={() => setShowHireModal(false)}
          title="Hire Staff"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-roman-marble-400 text-sm">
              Available candidates for hire. Staff market refreshes daily.
            </p>

            <div className="space-y-3">
              {staffMarket.map((candidate, index) => {
                const roleData = STAFF_ROLES[candidate.role];
                const canHire = canHireMore(candidate.role);
                const canAfford = gold >= candidate.hireCost;

                return (
                  <div
                    key={index}
                    className={clsx(
                      'p-4 rounded-lg border',
                      canHire && canAfford
                        ? 'border-roman-marble-600 bg-roman-marble-800'
                        : 'border-roman-marble-700 bg-roman-marble-900 opacity-60'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{roleData.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-roman text-roman-marble-100">
                            {candidate.name}
                          </span>
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            candidate.quality === 'excellent' && 'bg-roman-gold-600 text-roman-marble-900',
                            candidate.quality === 'good' && 'bg-health-high text-roman-marble-900',
                            candidate.quality === 'average' && 'bg-roman-marble-600 text-roman-marble-200',
                            candidate.quality === 'poor' && 'bg-roman-crimson-600 text-roman-marble-100'
                          )}>
                            {candidate.quality}
                          </span>
                        </div>
                        <div className="text-sm text-roman-marble-400">
                          {roleData.name} • {roleData.primaryBonus}
                        </div>
                        <div className="text-xs text-roman-marble-500 mt-1">
                          Hire: {candidate.hireCost}g • Wage: {candidate.dailyWage}g/day
                        </div>
                        {!canHire && (
                          <div className="text-xs text-roman-crimson-400 mt-1">
                            Maximum {roleData.name}s reached ({roleData.maxCount})
                          </div>
                        )}
                      </div>
                      <Button
                        variant={canHire && canAfford ? 'gold' : 'ghost'}
                        size="sm"
                        onClick={() => handleHire(candidate)}
                        disabled={!canHire || !canAfford}
                      >
                        {canAfford ? 'Hire' : 'Cannot Afford'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-roman-marble-700 pt-4">
              <h4 className="font-roman text-roman-marble-200 mb-3">Role Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.values(STAFF_ROLES).map(role => (
                  <div key={role.id} className="flex items-center gap-2 text-roman-marble-400">
                    <span>{role.icon}</span>
                    <span>{role.name}:</span>
                    <span className="text-roman-gold-400">{role.primaryBonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* Fire Confirmation Modal */}
        <Modal
          isOpen={showFireModal}
          onClose={() => setShowFireModal(false)}
          title="Dismiss Staff"
          size="sm"
        >
          {selectedStaff && (
            <div className="space-y-4">
              <p className="text-roman-marble-300">
                Are you sure you want to dismiss <span className="text-roman-gold-400">{selectedStaff.name}</span>?
              </p>
              <p className="text-sm text-roman-marble-500">
                This action cannot be undone. You will lose all their experience and skills.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowFireModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-roman-crimson-600 hover:bg-roman-crimson-500"
                  onClick={handleFire}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

// Staff Card Component
interface StaffCardProps {
  staff: Staff;
  isSelected: boolean;
  onClick: () => void;
  buildings: { type: string; level: number }[];
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, isSelected, onClick, buildings }) => {
  const roleData = STAFF_ROLES[staff.role];
  
  // Check synergy building
  const hasSynergy = roleData.synergyBuilding
    ? buildings.some(b => b.type === roleData.synergyBuilding)
    : false;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 rounded-lg border cursor-pointer transition-all',
        isSelected
          ? 'border-roman-gold-500 bg-roman-gold-500/10'
          : 'border-roman-marble-600 bg-roman-marble-800 hover:border-roman-marble-500'
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{roleData.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-roman text-roman-marble-100">{staff.name}</span>
            <span className="text-xs text-roman-marble-500">Lv.{staff.level}</span>
            {hasSynergy && (
              <span className="text-xs text-health-high">✓ Synergy</span>
            )}
          </div>
          <div className="text-sm text-roman-marble-400">{roleData.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-roman-gold-400">{staff.dailyWage}g/day</div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-roman-marble-500">Satisfaction:</span>
            <span className={clsx(
              'text-xs',
              staff.satisfaction >= 70 ? 'text-health-high' :
              staff.satisfaction >= 40 ? 'text-health-medium' : 'text-health-low'
            )}>
              {staff.satisfaction}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff Detail Panel
interface StaffDetailPanelProps {
  staff: Staff;
  buildings: { type: string; level: number }[];
  onFire: () => void;
  onLearnSkill: (skillId: string) => void;
}

const StaffDetailPanel: React.FC<StaffDetailPanelProps> = ({
  staff,
  buildings,
  onFire,
  onLearnSkill,
}) => {
  const roleData = STAFF_ROLES[staff.role];
  const xpForNextLevel = staff.level * 50;
  const xpProgress = (staff.experience / xpForNextLevel) * 100;

  // Check synergy building
  const synergyBuilding = roleData.synergyBuilding
    ? buildings.find(b => b.type === roleData.synergyBuilding)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{roleData.icon}</span>
          <div>
            <CardTitle>{staff.name}</CardTitle>
            <div className="text-sm text-roman-marble-400">{roleData.name}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-roman-marble-400">Level {staff.level}</span>
            <span className="text-roman-gold-400">{staff.experience}/{xpForNextLevel} XP</span>
          </div>
          <ProgressBar value={xpProgress} max={100} variant="gold" size="sm" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-roman-marble-800 p-3 rounded">
            <div className="text-xs text-roman-marble-500">Satisfaction</div>
            <div className={clsx(
              'font-roman text-lg',
              staff.satisfaction >= 70 ? 'text-health-high' :
              staff.satisfaction >= 40 ? 'text-health-medium' : 'text-health-low'
            )}>
              {staff.satisfaction}%
            </div>
          </div>
          <div className="bg-roman-marble-800 p-3 rounded">
            <div className="text-xs text-roman-marble-500">Daily Wage</div>
            <div className="font-roman text-lg text-roman-gold-400">{staff.dailyWage}g</div>
          </div>
          <div className="bg-roman-marble-800 p-3 rounded">
            <div className="text-xs text-roman-marble-500">Days Employed</div>
            <div className="font-roman text-lg text-roman-marble-200">{staff.daysEmployed}</div>
          </div>
          <div className="bg-roman-marble-800 p-3 rounded">
            <div className="text-xs text-roman-marble-500">Days Unpaid</div>
            <div className={clsx(
              'font-roman text-lg',
              staff.daysUnpaid > 0 ? 'text-roman-crimson-400' : 'text-health-high'
            )}>
              {staff.daysUnpaid}
            </div>
          </div>
        </div>

        {/* Synergy Building */}
        {roleData.synergyBuilding && (
          <div className={clsx(
            'p-3 rounded border',
            synergyBuilding
              ? 'border-health-high bg-health-high/10'
              : 'border-roman-marble-600 bg-roman-marble-800'
          )}>
            <div className="text-xs text-roman-marble-500 mb-1">Building Synergy</div>
            <div className="flex items-center justify-between">
              <span className="text-roman-marble-200">{roleData.synergyBuilding}</span>
              {synergyBuilding ? (
                <span className="text-health-high text-sm">
                  +{synergyBuilding.level * 15}% bonus
                </span>
              ) : (
                <span className="text-roman-marble-500 text-sm">Not built</span>
              )}
            </div>
          </div>
        )}

        {/* Primary Bonus */}
        <div className="bg-roman-gold-500/10 border border-roman-gold-600 p-3 rounded">
          <div className="text-xs text-roman-gold-400 mb-1">Primary Bonus</div>
          <div className="text-roman-marble-100">{roleData.primaryBonus}</div>
        </div>

        {/* Skills */}
        <div>
          <div className="text-sm text-roman-marble-400 mb-2">Skills</div>
          <div className="space-y-2">
            {roleData.skills.map(skill => {
              const isLearned = staff.skills.includes(skill.id);
              const prerequisiteMet = !skill.prerequisite || staff.skills.includes(skill.prerequisite);
              const canLearn = !isLearned && prerequisiteMet && staff.level >= skill.tier;

              return (
                <div
                  key={skill.id}
                  onClick={() => canLearn && onLearnSkill(skill.id)}
                  className={clsx(
                    'p-2 rounded border transition-all',
                    isLearned
                      ? 'border-roman-gold-500 bg-roman-gold-500/20'
                      : canLearn
                        ? 'border-roman-marble-600 bg-roman-marble-800 cursor-pointer hover:border-roman-gold-600'
                        : 'border-roman-marble-700 bg-roman-marble-900 opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      'text-sm',
                      isLearned ? 'text-roman-gold-400' : 'text-roman-marble-200'
                    )}>
                      {skill.name}
                      {isLearned && <span className="ml-2 text-xs">✓</span>}
                    </span>
                    <span className="text-xs text-roman-marble-500">Tier {skill.tier}</span>
                  </div>
                  <div className="text-xs text-roman-marble-400 mt-1">{skill.description}</div>
                  {!canLearn && !isLearned && (
                    <div className="text-xs text-roman-crimson-400 mt-1">
                      {!prerequisiteMet ? 'Requires previous skill' : `Requires level ${skill.tier}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fire Button */}
        <Button
          variant="ghost"
          className="w-full text-roman-crimson-400 hover:bg-roman-crimson-600/20"
          onClick={onFire}
        >
          Dismiss Staff Member
        </Button>
      </CardContent>
    </Card>
  );
};
