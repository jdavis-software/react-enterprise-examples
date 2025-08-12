import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders variants', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('ui-button--danger');
  });

  it('variants snapshot', () => {
    const { container } = render(
      <div>
        <Button variant="primary">One</Button>
        <Button variant="danger">Two</Button>
      </div>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('fires onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });

  it('respects disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    );
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('indicates busy state', () => {
    render(
      <Button isLoading>Save</Button>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
