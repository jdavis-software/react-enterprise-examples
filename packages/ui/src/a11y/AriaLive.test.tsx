import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { AriaLive } from './AriaLive';

test('applies aria live attributes', () => {
  render(<AriaLive mode="assertive">hi</AriaLive>);
  const el = screen.getByText('hi');
  expect(el).toHaveAttribute('aria-live', 'assertive');
  expect(el).toHaveAttribute('aria-atomic', 'true');
});
