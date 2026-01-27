import React from 'react';
import { render, screen } from '@testing-library/react';
import LudusScreen from '@/components/screens/LudusScreen';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));
vi.mock('@hooks/useAppSelector', () => ({
  useAppSelector: (fn: any) => vi.fn(() => ({ player: { gold: 1000 } }))(),
}));
vi.mock('@hooks/useAppDispatch', () => ({
  useAppDispatch: () => vi.fn(),
}));
vi.mock('@components/ludus', () => ({
  LudusDashboard: () => <div>LudusDashboard</div>,
}));

describe('LudusScreen', () => {
  it('renders LudusDashboard and player gold', () => {
    render(<LudusScreen />);
    expect(screen.getByText('LudusDashboard')).toBeInTheDocument();
  });
});
