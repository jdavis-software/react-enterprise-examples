import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Click me' },
  parameters: {
    a11y: {
      element: '#root'
    }
  }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' }
};

export const Danger: Story = {
  args: { variant: 'danger' }
};
