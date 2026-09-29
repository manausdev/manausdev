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
    <div className="flex flex-col gap-4 max-w-sm">
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </div>
  ),
};

export const Invalid: Story = {
  args: { invalid: true, value: 'ana@' },
  render: (args) => (
    <div className="max-w-sm">
      <Input {...args} />
      <p className="text-xs text-danger-text mt-1.5">Informe um e-mail valido</p>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
