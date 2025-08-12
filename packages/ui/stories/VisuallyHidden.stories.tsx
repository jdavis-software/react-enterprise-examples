import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from '../src/a11y/VisuallyHidden';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'A11y/VisuallyHidden',
  component: VisuallyHidden
};

export default meta;
export const Basic: StoryObj<typeof VisuallyHidden> = {
  render: () => (
    <div>
      Visible<VisuallyHidden>Hidden</VisuallyHidden>
    </div>
  )
};
