import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthTemplate } from './AuthTemplate';
import styles from './AuthTemplate.module.css';

describe('AuthTemplate', () => {
  it('renderiza cartao com icone, titulo e subtitulo', () => {
    render(
      <AuthTemplate icon={<span>🌿</span>} title="Bem-vindo de volta" subtitle="Acesse sua conta">
        <form data-testid="form" />
      </AuthTemplate>
    );
    expect(screen.getByText('🌿').parentElement).toHaveClass(styles.iconBox);
    expect(screen.getByRole('heading', { level: 1, name: 'Bem-vindo de volta' })).toHaveClass(styles.title);
    expect(screen.getByText('Acesse sua conta')).toHaveClass(styles.subtitle);
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });
});