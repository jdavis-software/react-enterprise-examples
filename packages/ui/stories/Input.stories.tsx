import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/components/Input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  args: { label: 'Label', placeholder: 'Type here' },
  argTypes: { error: { control: 'text' } },
  parameters: {
    a11y: { element: '#root' }
  }
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  args: {}
};
