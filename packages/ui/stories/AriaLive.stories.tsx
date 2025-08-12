import type { Meta, StoryObj } from '@storybook/react';
import { AriaLive } from '../src/a11y/AriaLive';
import { useState } from 'react';

const meta: Meta<typeof AriaLive> = {
  title: 'A11y/AriaLive',
  component: AriaLive
};
export default meta;

export const Basic: StoryObj<typeof AriaLive> = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount(c => c + 1)}>Announce</button>
        <AriaLive mode="polite">Count {count}</AriaLive>
      </div>
    );
  }
};
