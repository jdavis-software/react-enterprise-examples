import '../src/tokens.scss';

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#000000' }
    ]
  },
  controls: { expanded: true },
  options: { storySort: { order: ['Components', ['Button', 'Switch', 'Table']] } }
};
