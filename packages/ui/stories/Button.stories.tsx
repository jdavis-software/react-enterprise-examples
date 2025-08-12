import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Click me', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['primary', 'danger', 'subtle', 'ghost'] },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' }
  },
  parameters: {
    a11y: { element: '#root' },
    docs: {
      description: { component: 'Accessible button component.' }
    }
  }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {}
};
