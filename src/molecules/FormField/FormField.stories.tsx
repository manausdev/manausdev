import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from '@/atoms/Input';
import { FormField } from './FormField';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  // `children` e um render prop obrigatorio, entao precisa de um valor padrao
  // para que os args do meta fiquem completos. Toda story abaixo sobrescreve
  //via `render`.
  args: {
    label: 'Cargo / Especialidade',
    children: (field: { id: string }) => <Input placeholder="Ex: Fullstack Engineer" {...field} />,
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      {(field) => <Input placeholder="Ex: Fullstack Engineer" {...field} />}
    </FormField>
  ),
};

export const WithHint: Story = {
  args: { label: 'Username (@)', hint: 'Usado na URL publica do seu perfil.' },
  render: (args) => (
    <FormField {...args}>
      {(field) => <Input placeholder="ana-silva" {...field} />}
    </FormField>
  ),
};

export const WithError: Story = {
  args: { label: 'E-mail', error: 'Informe um e-mail valido' },
  render: (args) => (
    <FormField {...args}>
      {(field) => <Input value="ana@" invalid {...field} />}
    </FormField>
  ),
};

export const Required: Story = {
  args: { label: 'Nome completo', required: true },
  render: (args) => (
    <FormField {...args}>
      {(field) => <Input placeholder="Ana Silva" {...field} />}
    </FormField>
  ),
};

export const WithSelect: Story = {
  args: { label: 'Senioridade' },
  render: (args) => (
    <FormField {...args}>
      {(field) => (
        <select
          {...field}
          style={{
            width: '100%',
            background: 'var(--surface)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 14,
            outline: 'none',
          }}
        >
          <option value="">Selecione...</option>
          <option value="junior">Júnior</option>
          <option value="pleno">Pleno</option>
          <option value="senior">Sênior</option>
          <option value="lead">Lead</option>
        </select>
      )}
    </FormField>
  ),
};

export const Group: Story = {
  args: { label: 'Nome completo' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, maxWidth: 672 }}>
      <FormField label="Nome completo" required>
        {(field) => <Input placeholder="Ana Silva" {...field} />}
      </FormField>
      <FormField label="Username (@)" hint="URL publica do perfil">
        {(field) => <Input placeholder="ana-silva" {...field} />}
      </FormField>
      <FormField label="Cargo / Especialidade">
        {(field) => <Input placeholder="Fullstack Engineer" {...field} />}
      </FormField>
      <FormField label="LinkedIn" error="URL invalida">
        {(field) => <Input value="linkedin.com/ana" invalid {...field} />}
      </FormField>
    </div>
  ),
};
