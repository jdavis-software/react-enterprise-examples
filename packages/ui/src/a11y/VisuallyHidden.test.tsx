import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

test('renders hidden text', () => {
  render(<VisuallyHidden>hidden</VisuallyHidden>);
  const el = screen.getByText('hidden');
  expect(el).toHaveStyle({ position: 'absolute' });
});
