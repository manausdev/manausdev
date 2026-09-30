import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 24,
          background: 'var(--canvas)',
          color: 'var(--ink)',
          minHeight: '100%',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
