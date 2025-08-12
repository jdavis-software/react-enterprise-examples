import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../src/components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    a11y: { element: '#root' },
    docs: { description: { component: 'Variants with tone matrix.' } }
  }
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {['solid', 'soft'].map(tone => (
        <div key={tone} style={{ display: 'flex', gap: '0.5rem' }}>
          {['info', 'success', 'warning', 'neutral'].map(v => (
            <Badge key={v} variant={v as any} tone={tone as any}>
              {v}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
};
