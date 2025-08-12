import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { a11y: { element: '#root' } }
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Example: Story = {
  render: () => (
    <Card header="Header" footer={<Button variant="primary">Action</Button>}>
      Body content
    </Card>
  )
};
