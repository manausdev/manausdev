import type { Meta, StoryObj } from '@storybook/nextjs';
import { StatCard } from './StatCard';

const meta = {
  title: 'Molecules/StatCard',
  component: StatCard,
  args: { value: 128, label: 'Devs Cadastrados' },
  argTypes: { tone: { control: 'select', options: ['ink', 'accent'] } },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bar: Story = {
  render: (args) => (
    <div className="glass-card rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-border-strong/30">
      <StatCard {...args} />
      <StatCard {...args} value={42} label="Projetos Tech" tone="accent" href="/projetos" />
      <StatCard {...args} value={7} label="Comunidades Ativas" tone="accent" href="/comunidades" />
      <StatCard {...args} value={12} label="Vagas no Amazonas" href="/vagas" />
    </div>
  ),
};

export const WithoutSuffix: Story = { args: { suffix: '' } };
