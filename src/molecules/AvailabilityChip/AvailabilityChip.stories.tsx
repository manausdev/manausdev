import type { Meta, StoryObj } from '@storybook/nextjs';
import { AVAILABILITY_FILTERS } from '@/lib/devs-meta';
import { AvailabilityChip } from './AvailabilityChip';

const meta = {
  title: 'Molecules/AvailabilityChip',
  component: AvailabilityChip,
  args: { value: 'open' },
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
} satisfies Meta<typeof AvailabilityChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      {AVAILABILITY_FILTERS.map((option) => (
        <AvailabilityChip key={option.param} {...args} value={option.db} />
      ))}
    </div>
  ),
};

export const Fallbacks: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <AvailabilityChip {...args} value="open" />
      <AvailabilityChip {...args} value={null} />
      <AvailabilityChip {...args} value="valor-invalido" />
    </div>
  ),
};
