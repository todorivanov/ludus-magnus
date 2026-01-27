
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CharacterCreation from '@/components/screens/CharacterCreation';

vi.mock('react-router-dom', async () => ({
  ...((await import('react-router-dom'))),
  useNavigate: () => vi.fn(),
}));
vi.mock('@hooks/useAppDispatch', () => ({
  useAppDispatch: () => vi.fn(),
}));

describe('CharacterCreation', () => {
  it('renders intro step by default', () => {
    render(<CharacterCreation />);
    expect(screen.getByText('Ludus Magnus: Reborn')).toBeInTheDocument();
    expect(screen.getByText('The Chronicle of the Iron Year')).toBeInTheDocument();
    expect(screen.getByText('193 AD - The Year of the Five Emperors')).toBeInTheDocument();
  });

  it('progresses to path selection on continue', () => {
    render(<CharacterCreation />);
    fireEvent.click(screen.getByText('Begin Your Chronicle'));
    expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
  });

  // Additional step tests can be added for full coverage
});
