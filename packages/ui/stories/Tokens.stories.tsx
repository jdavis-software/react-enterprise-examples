import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design/Tokens',
  parameters: { controls: { hideNoControlsWarning: true } }
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => <Tokens />
};

function Tokens() {
  const style = getComputedStyle(document.documentElement);
  const colors = ['bg', 'fg', 'accent', 'danger', 'info', 'success', 'warning', 'neutral', 'surface', 'surface-muted'];
  const spacing = [1, 2, 3, 4, 5, 6];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Colors</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {colors.map(name => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{ width: '3rem', height: '3rem', background: style.getPropertyValue(`--${name}`) }}
            />
            <code>--{name}</code>
          </div>
        ))}
      </div>
      <h3>Spacing</h3>
      <table>
        <tbody>
          {spacing.map(s => (
            <tr key={s}>
              <td>
                <code>--space-{s}</code>
              </td>
              <td>{style.getPropertyValue(`--space-${s}`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
