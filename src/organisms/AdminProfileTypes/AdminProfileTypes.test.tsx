import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AdminProfileTypes } from './AdminProfileTypes';

/**
 * O componente consome a cadeia completa do postgrest-js
 * (`.from().select().order()` e `.from().update().eq()`), entao o mock precisa
 * devolver um builder encadeavel, e nao uma Promise no meio da cadeia.
 */

interface ProfileRow {
  id: string;
  username: string;
  full_name: string;
  profile_type?: string | null;
  is_admin?: boolean | null;
}

const ROWS: ProfileRow[] = [
  { id: 'u1', username: 'ada', full_name: 'Ada Lovelace', profile_type: 'dev', is_admin: false },
  { id: 'u2', username: 'linus', full_name: 'Linus T', profile_type: 'empresa', is_admin: false },
];

let nextSelect: ProfileRow[] | null = ROWS;
let nextError: { message: string } | null = null;
const updateMock = vi.fn();

vi.mock('@/infrastructure/supabase/client', () => ({
  createClient: () => ({
    from: () => {
      const chain: Record<string, unknown> = {};
      chain.select = () => {
        const c: Record<string, unknown> = {};
        c.order = () => Promise.resolve({ data: nextSelect, error: nextError });
        return c;
      };
      chain.update = (values: unknown) => {
        updateMock(values);
        const c: Record<string, unknown> = {};
        c.eq = () => Promise.resolve({ error: nextError });
        return c;
      };
      return chain;
    },
  }),
}));

const ADMIN = { id: 'u0', profile_type: 'admin' } as never;
const DEV = { id: 'u1', profile_type: 'dev' } as never;

beforeEach(() => {
  nextSelect = ROWS;
  nextError = null;
  updateMock.mockReset();
});

describe('AdminProfileTypes', () => {
  it('nao renderiza nada para quem nao e admin', () => {
    const { container } = render(<AdminProfileTypes viewer={DEV} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lista os membros para admin', async () => {
    render(<AdminProfileTypes viewer={ADMIN} />);

    await waitFor(() => screen.getByText('Ada Lovelace'));
    expect(screen.getByText('Linus T')).toBeInTheDocument();
    expect(screen.getByText(/Tipo de perfil dos membros/i)).toBeInTheDocument();
  });

  it('trata is_admin legado como admin', async () => {
    const legacy = { id: 'u0', profile_type: 'dev', is_admin: true } as never;
    render(<AdminProfileTypes viewer={legacy} />);

    await waitFor(() => screen.getByText('Ada Lovelace'));
  });

  it('seleciona o tipo atual de cada membro', async () => {
    render(<AdminProfileTypes viewer={ADMIN} />);

    expect(await screen.findByLabelText(/Ada Lovelace/)).toHaveValue('dev');
    expect(screen.getByLabelText(/Linus T/)).toHaveValue('empresa');
  });

  it('so grava depois da confirmacao, com o novo valor', async () => {
    render(<AdminProfileTypes viewer={ADMIN} />);

    const ada = await screen.findByLabelText(/Ada Lovelace/);
    fireEvent.change(ada, { target: { value: 'empresa' } });

    expect(updateMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: /salvar/i })[0]);
    await waitFor(() => expect(updateMock).toHaveBeenCalledWith({ profile_type: 'empresa' }));
  });

  it('desabilita a edicao do proprio perfil', async () => {
    const selfIsDev = { id: 'u1', profile_type: 'dev', is_admin: true } as never;
    render(<AdminProfileTypes viewer={selfIsDev} />);

    await waitFor(() => screen.getByText('Ada Lovelace'));
    expect(screen.getByLabelText(/Ada Lovelace/)).toBeDisabled();
    expect(screen.getByLabelText(/Linus T/)).not.toBeDisabled();
  });

  it('avisa com a causa real quando o update falha no banco', async () => {
    render(<AdminProfileTypes viewer={ADMIN} />);

    const ada = await screen.findByLabelText(/Ada Lovelace/);
    fireEvent.change(ada, { target: { value: 'empresa' } });

    // PostgrestError nao e instanceof Error: o texto especifico do RLS precisa
    // chegar ao admin, nao um "algo deu errado" generico.
    nextError = { message: 'new row violates row-level security policy' };
    fireEvent.click(screen.getAllByRole('button', { name: /salvar/i })[0]);

    await waitFor(() => screen.getByText(/row-level security/i));
  });

  it('mantem o valor pendente quando a gravacao falha', async () => {
    render(<AdminProfileTypes viewer={ADMIN} />);

    const ada = await screen.findByLabelText(/Ada Lovelace/);
    fireEvent.change(ada, { target: { value: 'empresa' } });

    nextError = { message: 'permissao negada' };
    fireEvent.click(screen.getAllByRole('button', { name: /salvar/i })[0]);

    await waitFor(() => screen.getByText(/permissao negada/i));
    // Sem isto o select voltaria para 'dev' e o admin perderia o que digitou.
    expect(screen.getByLabelText(/Ada Lovelace/)).toHaveValue('empresa');
  });

  it('nao quebra quando a lista volta vazia', async () => {
    nextSelect = [];
    render(<AdminProfileTypes viewer={ADMIN} />);

    await waitFor(() => screen.getByText(/Nenhum perfil encontrado/i));
  });
});
