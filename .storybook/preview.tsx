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
      <div className="p-6 bg-canvas text-ink min-h-full">
        <Story />
      </div>
    ),
  ],
};

export default preview;
