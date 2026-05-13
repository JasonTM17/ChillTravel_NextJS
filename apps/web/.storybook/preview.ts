import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#EAF7FF' },
        { name: 'dark', value: '#071827' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
