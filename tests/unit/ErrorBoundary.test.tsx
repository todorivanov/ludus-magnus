import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { describe, it, expect, vi } from 'vitest';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    // Component that throws
    const ProblemChild = () => {
      throw new Error('Test error!');
    };
    // Suppress error output for test
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error!')).toBeInTheDocument();
  });
});
