import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Ready' },
  parameters: {
    a11y: {
      element: '#root'
    }
  }
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: { variant: 'primary' }
};

export const Danger: Story = {
  args: { variant: 'danger' }
};
