import type { Meta, StoryObj } from '@storybook/nextjs';
import { Card } from './Card';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  args: { children: 'Conteudo do card' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'glass', 'dark', 'flush'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(['default', 'glass', 'dark', 'flush'] as const).map((variant) => (
        <Card key={variant} {...args} variant={variant}>
          <h3 className="font-display font-bold text-base">variant={variant}</h3>
        </Card>
      ))}
    </div>
  ),
};

export const Paddings: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          <h3 className="font-display font-bold text-base">padding={padding}</h3>
        </Card>
      ))}
    </div>
  ),
};
