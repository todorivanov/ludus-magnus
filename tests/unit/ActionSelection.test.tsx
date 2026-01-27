import { render, screen, fireEvent } from '@testing-library/react';
import { ActionSelection } from '@/components/combat/ActionSelection';
import { describe, it, expect, vi } from 'vitest';

describe('ActionSelection', () => {
  const baseSkills = [
    {
      id: 's1',
      name: 'Power Strike',
      description: 'Deal heavy damage.',
      type: 'offensive' as const,
      manaCost: 10,
      currentCooldown: 0,
      cooldown: 2,
      effect: () => (
        {
            id: 'string',
              name: 'Power',
              description: 'Powerful strike dealing damage.',
              type: 'offensive',
              manaCost: 10,
              cooldown: 2,
              currentCooldown: 0,
              effect: {
                damageMultiplier: 2.0,
              }
        }
      )
    },
    {
      id: 's2',
      name: 'Shield Up',
      description: 'Increase defense.',
      type: 'defensive' as const,
      manaCost: 8,
      currentCooldown: 2,
      cooldown: 3,
      effect: () => ({
            id: 'string',
              name: 'Shield',
              description: 'Increase defense.',
              type: 'defensive',
              manaCost: 8,
              cooldown: 3,
              currentCooldown: 2,
              effect: {
                damageMultiplier: 2.0,
              }
        })
    },
  ];

  it('renders all main action buttons', () => {
    render(
      <ActionSelection skills={baseSkills} currentMana={20} onAction={vi.fn()} />
    );
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defend')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Wait')).toBeInTheDocument();
  });

  it('calls onAction when attack button is clicked', () => {
    const onAction = vi.fn();
    render(
      <ActionSelection skills={baseSkills} currentMana={20} onAction={onAction} />
    );
    fireEvent.click(screen.getByText('Attack'));
    // onAction is always called with (action, skillId?)
    expect(onAction).toHaveBeenCalledWith('attack', undefined);
  });

  it('shows skills panel and allows skill selection', () => {
    const onAction = vi.fn();
    render(
      <ActionSelection skills={baseSkills} currentMana={20} onAction={onAction} />
    );
    fireEvent.click(screen.getByText('Skills'));
    expect(screen.getByText('Available Skills')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Power Strike'));
    expect(onAction).toHaveBeenCalledWith('skill', 's1');
  });

  it('disables skill button if not enough mana or on cooldown', () => {
    render(
      <ActionSelection skills={baseSkills} currentMana={5} onAction={vi.fn()} />
    );
    fireEvent.click(screen.getByText('Skills'));
    // The status message may contain both cooldown and mana messages together
    expect(screen.getAllByText((content) => content.includes('💧 Not enough mana')).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content) => content.includes('⏱️ On cooldown')).length).toBeGreaterThan(0);
  });

  it('shows enemy turn state if isPlayerTurn is false', () => {
    render(
      <ActionSelection skills={baseSkills} currentMana={20} onAction={vi.fn()} isPlayerTurn={false} />
    );
    expect(screen.getByText('⏳ Enemy Turn...')).toBeInTheDocument();
    expect(screen.getByText('Waiting for opponent to act')).toBeInTheDocument();
  });

  it('shows no skills available message', () => {
    render(
      <ActionSelection skills={[]} currentMana={20} onAction={vi.fn()} />
    );
    fireEvent.click(screen.getByText('Skills'));
    expect(screen.getByText('No skills available')).toBeInTheDocument();
  });
});
