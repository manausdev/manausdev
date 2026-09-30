import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Buscar devs...', 'aria-label': 'Campo de exemplo' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 384 }}>
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </div>
  ),
};

export const Invalid: Story = {
  args: { invalid: true, value: 'ana@' },
  render: (args) => (
    <div style={{ maxWidth: 384 }}>
      <Input {...args} />
      <p style={{ fontSize: 12, color: 'var(--danger-text)', marginTop: 6 }}>Informe um e-mail valido</p>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
