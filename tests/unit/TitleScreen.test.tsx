import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TitleScreen from '@/components/screens/TitleScreen';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
vi.mock('@hooks/useAppSelector', () => ({
  useAppSelector: (fn: any) =>
    fn({ player: { name: 'Maximus', class: 'Warrior' } }),
}));

describe('TitleScreen', () => {
  it('renders title and player info', () => {
    render(<TitleScreen />);
    expect(screen.getByText('Ludus Magnus: Reborn')).toBeInTheDocument();
    expect(screen.getByText('Maximus')).toBeInTheDocument();
    expect(screen.getByText('Class: Warrior')).toBeInTheDocument();
  });

  it('renders all main navigation buttons', () => {
    render(<TitleScreen />);
    expect(screen.getByText('⚔️ Enter Arena')).toBeInTheDocument();
    expect(screen.getByText('🏛️ Manage Ludus')).toBeInTheDocument();
    expect(screen.getByText('🏆 Enter Tournament')).toBeInTheDocument();
    expect(screen.getByText('📊 View Profile')).toBeInTheDocument();
    expect(screen.getByText('🗺️ Explore World (Coming Soon)')).toBeInTheDocument();
  });
});
