import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates label and input', async () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    const field = screen.getByLabelText('Email');
    await userEvent.type(field, 'hi');
    expect((field as HTMLInputElement).value).toBe('hi');
  });

  it('shows error text', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
