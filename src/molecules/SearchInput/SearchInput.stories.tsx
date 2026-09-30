import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  args: { label: 'Buscar devs', placeholder: 'Buscar por nome, @username, cargo ou bio...' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 576 }}>
      <SearchInput {...args} size="sm" />
      <SearchInput {...args} size="md" />
      <SearchInput {...args} size="lg" />
    </div>
  ),
};

export const WithClear: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('ana');
    return (
      <div style={{ maxWidth: 576 }}>
        <SearchInput {...args} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />
      </div>
    );
  },
};
