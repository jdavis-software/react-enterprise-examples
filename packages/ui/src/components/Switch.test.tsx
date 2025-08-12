import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('has switch role and toggles via click', async () => {
    render(<Switch />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('role', 'switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles via keyboard', async () => {
    render(<Switch />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard('{Enter}');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });
});
