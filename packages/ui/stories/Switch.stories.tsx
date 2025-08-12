import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../src/components/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  argTypes: { checked: { control: 'boolean' }, disabled: { control: 'boolean' } },
  parameters: {
    a11y: { element: '#root' },
    docs: { description: { component: 'Use space or enter to toggle.' } }
  }
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
  args: { checked: false }
};
