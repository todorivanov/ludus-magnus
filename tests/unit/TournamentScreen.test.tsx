
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TournamentScreen from '@/components/screens/TournamentScreen';

vi.mock('react-router-dom', async () => ({
  ...((await import('react-router-dom'))),
  useNavigate: () => vi.fn(),
}));
type MockState = { player: { level: number; gold: number } };
vi.mock('@hooks/useAppSelector', () => ({
  useAppSelector: (fn: (state: MockState) => unknown) => fn({ player: { level: 5, gold: 1000 } }),
}));
vi.mock('@hooks/useAppDispatch', () => ({
  useAppDispatch: () => vi.fn(),
}));
vi.mock('@components/tournament', () => ({
  TournamentBrowser: () => <div>TournamentBrowser</div>,
  TournamentBracket: () => <div>TournamentBracket</div>,
  TournamentEntry: () => <div>TournamentEntry</div>,
}));

describe('TournamentScreen', () => {
  it('renders TournamentBrowser by default', () => {
    render(<TournamentScreen />);
    expect(screen.getByText('TournamentBrowser')).toBeInTheDocument();
  });
});
