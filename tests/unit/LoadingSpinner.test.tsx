import React from 'react';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { describe, it, expect } from 'vitest';

describe('LoadingSpinner', () => {
  it('renders a spinner div', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('border-primary-500');
  });
});
