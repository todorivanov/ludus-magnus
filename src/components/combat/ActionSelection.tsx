/**
 * ActionSelection Component
 * 
 * Displays available combat actions (Attack, Skills, Defend, etc.)
 */

import React, { useState } from 'react';
import type { Skill } from '@game/SkillSystem';

export type CombatAction = 'attack' | 'defend' | 'skill' | 'wait';

export interface ActionSelectionProps {
  skills: Skill[];
  currentMana: number;
  onAction: (action: CombatAction, skillId?: string) => void;
  disabled?: boolean;
  isPlayerTurn?: boolean;
}

export const ActionSelection: React.FC<ActionSelectionProps> = ({
  skills,
  currentMana,
  onAction,
  disabled = false,
  isPlayerTurn = true,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showSkillsPanel, setShowSkillsPanel] = useState(false);

  // Check if skill can be used
  const canUseSkill = (skill: Skill): boolean => {
    return (
      skill.currentCooldown === 0 &&
      currentMana >= skill.manaCost
    );
  };

  // Handle action button click
  const handleActionClick = (action: CombatAction) => {
    if (disabled) return;
    
    if (action === 'skill' && !selectedSkill) {
      setShowSkillsPanel(true);
      return;
    }

    onAction(action, action === 'skill' ? selectedSkill || undefined : undefined);
    setSelectedSkill(null);
    setShowSkillsPanel(false);
  };

  // Handle skill selection
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
    setShowSkillsPanel(false);
    onAction('skill', skillId);
  };

  // Get skill icon based on type
  const getSkillIcon = (type: Skill['type']): string => {
    switch (type) {
      case 'offensive':
        return '⚔️';
      case 'defensive':
        return '🛡️';
      case 'utility':
        return '✨';
      case 'movement':
        return '🏃';
      default:
        return '🔮';
    }
  };

  if (!isPlayerTurn) {
    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-100 p-6 text-center shadow-lg">
        <p className="text-lg font-semibold text-gray-600">
          ⏳ Enemy Turn...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Waiting for opponent to act
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="mb-4 border-b-2 border-gray-200 pb-2">
        <h3 className="text-xl font-bold text-gray-800">
          ⚡ Your Turn - Choose Action
        </h3>
      </div>

      {/* Main Action Buttons */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* Attack Button */}
        <button
          onClick={() => handleActionClick('attack')}
          disabled={disabled}
          className={`
            rounded-lg border-2 border-red-500 bg-gradient-to-br from-red-400 to-red-600
            px-6 py-4 font-bold text-white shadow-md transition-all duration-200
            hover:from-red-500 hover:to-red-700 hover:shadow-lg
            disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
          `}
        >
          <div className="text-2xl">⚔️</div>
          <div className="mt-1 text-lg">Attack</div>
          <div className="mt-1 text-xs opacity-90">Basic attack</div>
        </button>

        {/* Defend Button */}
        <button
          onClick={() => handleActionClick('defend')}
          disabled={disabled}
          className={`
            rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-400 to-blue-600
            px-6 py-4 font-bold text-white shadow-md transition-all duration-200
            hover:from-blue-500 hover:to-blue-700 hover:shadow-lg
            disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
          `}
        >
          <div className="text-2xl">🛡️</div>
          <div className="mt-1 text-lg">Defend</div>
          <div className="mt-1 text-xs opacity-90">-50% damage</div>
        </button>

        {/* Skills Button */}
        <button
          onClick={() => setShowSkillsPanel(!showSkillsPanel)}
          disabled={disabled}
          className={`
            rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-400 to-purple-600
            px-6 py-4 font-bold text-white shadow-md transition-all duration-200
            hover:from-purple-500 hover:to-purple-700 hover:shadow-lg
            disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
          `}
        >
          <div className="text-2xl">✨</div>
          <div className="mt-1 text-lg">Skills</div>
          <div className="mt-1 text-xs opacity-90">{skills.length} available</div>
        </button>

        {/* Wait Button */}
        <button
          onClick={() => handleActionClick('wait')}
          disabled={disabled}
          className={`
            rounded-lg border-2 border-gray-400 bg-gradient-to-br from-gray-300 to-gray-500
            px-6 py-4 font-bold text-white shadow-md transition-all duration-200
            hover:from-gray-400 hover:to-gray-600 hover:shadow-lg
            disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale
          `}
        >
          <div className="text-2xl">⏸️</div>
          <div className="mt-1 text-lg">Wait</div>
          <div className="mt-1 text-xs opacity-90">Skip turn</div>
        </button>
      </div>

      {/* Skills Panel */}
      {showSkillsPanel && (
        <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-bold text-purple-900">Available Skills</h4>
            <button
              onClick={() => setShowSkillsPanel(false)}
              className="rounded bg-purple-200 px-3 py-1 text-sm font-semibold text-purple-800 hover:bg-purple-300"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid gap-2">
            {skills.map((skill) => {
              const usable = canUseSkill(skill);
              const onCooldown = skill.currentCooldown > 0;
              const notEnoughMana = currentMana < skill.manaCost;

              return (
                <button
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill.id)}
                  disabled={disabled || !usable}
                  className={`
                    rounded-lg border-2 p-3 text-left transition-all duration-200
                    ${
                      usable
                        ? 'border-purple-400 bg-white hover:bg-purple-100 hover:shadow-md'
                        : 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getSkillIcon(skill.type)}</span>
                        <span className="font-bold text-gray-900">{skill.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{skill.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        {skill.manaCost} 💧
                      </div>
                      {onCooldown && (
                        <div className="mt-1 rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                          CD: {skill.currentCooldown}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Messages */}
                  {!usable && (
                    <div className="mt-2 text-xs font-semibold text-red-600">
                      {onCooldown && '⏱️ On cooldown'}
                      {notEnoughMana && '💧 Not enough mana'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {skills.length === 0 && (
            <div className="py-4 text-center text-gray-600">
              <p>No skills available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
