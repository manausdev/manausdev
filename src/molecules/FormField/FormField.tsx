import { useId } from 'react';
import { cn } from '@/lib/utils';
import styles from './FormField.module.css';

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
    <div className={cn(styles.base, className)}>
      <label
        htmlFor={id}
        className={cn(styles.label, hasError ? styles.labelError : undefined, labelClassName)}
      >
        {label}
        {required ? (
          <span className={styles.requiredAsterisk} aria-hidden="true">
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
        <p id={messageId} className={cn(styles.message, hasError ? styles.messageError : styles.messageHint)}>
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}
