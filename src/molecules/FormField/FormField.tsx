'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  /** Descricao abaixo do controle. Vira `aria-describedby`. */
  hint?: string;
  /** Mensagem de erro. Sobrescreve `hint` e marca `aria-invalid`. */
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: (props: {
    id: string;
    'aria-invalid': true | undefined;
    'aria-describedby': string | undefined;
    'aria-required': true | undefined;
  }) => React.ReactNode;
}

/**
 * Rotulo + controle + mensagem, com o vinculo de acessibilidade resolvido.
 *
 * O dashboard tem `<label>` sem `htmlFor` e `<input>` sem `id`: clicar no
 * rotulo nao move o foco e leitores de tela nao anunciam o campo. Aqui o `id` e
 * os `aria-*` sao gerados, então o consumidor nao tem como esquecer.
 *
 * Usa render prop para poder envolver `input`, `select` ou `textarea` sem
 * duplicar a marcação do campo.
 */
export function FormField({
  label,
  hint,
  error,
  required = false,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasError = Boolean(error);
  const describedBy = error || hint ? messageId : undefined;

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={id}
        className={cn(
          'block text-xs font-semibold mb-1.5',
          hasError ? 'text-danger-text' : 'text-ink',
          labelClassName,
        )}
      >
        {label}
        {required ? (
          <span className="text-danger-text ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children({
        id,
        'aria-invalid': hasError ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required ? true : undefined,
      })}

      {error || hint ? (
        <p id={messageId} className={cn('text-xs mt-1.5', hasError ? 'text-danger-text' : 'text-faint')}>
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}
