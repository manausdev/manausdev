import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';

function renderField(props: Partial<React.ComponentProps<typeof FormField>> = {}) {
  return render(
    <FormField label="Nome" {...props}>
      {(field) => <input {...field} />}
    </FormField>,
  );
}

describe('FormField', () => {
  it('associa o rotulo ao controle pelo id gerado', () => {
    renderField();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('move o foco para o controle ao clicar no rotulo', async () => {
    renderField();
    await userEvent.click(screen.getByText('Nome'));
    expect(screen.getByLabelText('Nome')).toHaveFocus();
  });

  it('marca aria-required quando required', () => {
    renderField({ required: true });
    expect(screen.getByLabelText(/Nome/)).toHaveAttribute('aria-required', 'true');
  });

  it('nao marca aria-required por padrao', () => {
    renderField();
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-required');
  });

  it('liga a dica ao controle via aria-describedby', () => {
    renderField({ hint: 'Maximo de 40 caracteres' });
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Maximo de 40 caracteres');
  });

  it('marca aria-invalid e anuncia o erro', () => {
    renderField({ error: 'Nome obrigatorio' });
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Nome obrigatorio');
  });

  it('o erro tem precedencia sobre a dica', () => {
    renderField({ hint: 'Maximo de 40 caracteres', error: 'Nome obrigatorio' });
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Nome obrigatorio');
    expect(screen.queryByText('Maximo de 40 caracteres')).not.toBeInTheDocument();
  });

  it('nao usa aria-describedby sem hint nem error', () => {
    renderField();
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-describedby');
  });

  it('gera ids distintos para dois campos no mesmo formulario', () => {
    render(
      <>
        <FormField label="Nome">
          {(field) => <input {...field} />}
        </FormField>
        <FormField label="Bio">
          {(field) => <textarea {...field} />}
        </FormField>
      </>,
    );
    expect(screen.getByLabelText('Nome').id).not.toBe(screen.getByLabelText('Bio').id);
  });

  it('funciona com select, nao apenas input', async () => {
    render(
      <FormField label="Senioridade">
        {(field) => (
          <select {...field}>
            <option value="">Selecione...</option>
            <option value="senior">Sênior</option>
          </select>
        )}
      </FormField>,
    );
    const select = screen.getByLabelText('Senioridade');
    await userEvent.selectOptions(select, 'senior');
    expect(select).toHaveValue('senior');
  });
});
