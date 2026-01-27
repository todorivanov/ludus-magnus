import React from 'react';
import { render, screen } from '@testing-library/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { describe, it, expect } from 'vitest';

describe('MainLayout', () => {
  it('renders children inside layout', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
