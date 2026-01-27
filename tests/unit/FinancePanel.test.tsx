import React from 'react';
import { render, screen } from '@testing-library/react';
import { FinancePanel } from '@/components/ludus/FinancePanel';
import { describe, expect, it } from 'vitest';

describe('FinancePanel', () => {
  it('renders gold, revenue, and expenses', () => {
    render(
      <FinancePanel
        gold={1000}
        dailyRevenue={200}
        dailyExpenses={150}
        totalIncome={5000}
        totalSpent={3000}
      />
    );
    expect(screen.getByText('💰 Finance Overview')).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    // Match revenue (e.g., '+200 🪙' or '+200g' with possible whitespace)
    expect(
      screen.getByText((content, node) =>
        node?.textContent?.replace(/\s/g, '') === '+200🪙' ||
        node?.textContent?.replace(/\s/g, '') === '+200g'
      )
    ).toBeInTheDocument();
    // Match expenses (e.g., '-150 🪙' or '-150g' with possible whitespace)
    expect(
      screen.getByText((content, node) =>
        node?.textContent?.replace(/\s/g, '') === '-150🪙' ||
        node?.textContent?.replace(/\s/g, '') === '-150g'
      )
    ).toBeInTheDocument();
  });
});
