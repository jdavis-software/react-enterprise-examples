import { defineConfig } from 'storybook';

export default defineConfig({
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react',
    options: {}
  }
});
