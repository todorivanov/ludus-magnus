// tests/setup.ts
// Vitest setup file for global test configuration

import '@testing-library/jest-dom';

// Add any global mocks, polyfills, or setup here
// Example: window.matchMedia mock for React Testing Library

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
