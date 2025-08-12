import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge variant="info">OK</Badge>);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});
