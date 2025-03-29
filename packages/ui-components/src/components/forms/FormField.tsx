import React, { ReactNode } from 'react';

export interface FormFieldProps {
  /**
   * ID do campo de formulário
   */
  id?: string;

  /**
   * Nome do campo
   */
  name: string;

  /**
   * Rótulo do campo
   */
  label: string;

  /**
   * Mensagem de erro (se houver)
   */
  error?: string;

  /**
   * Texto de ajuda ou descrição
   */
  helpText?: string;

  /**
   * Se o campo é obrigatório
   */
  required?: boolean;

  /**
   * Se o campo está desabilitado
   */
  disabled?: boolean;

  /**
   * Conteúdo do campo (input, select, etc)
   */
  children: ReactNode;

  /**
   * Classes CSS adicionais para o contêiner
   */
  className?: string;
}

/**
 * Componente padronizado para campos de formulário
 * 
 * @example
 * ```tsx
 * <FormField
 *   name="email"
 *   label="E-mail"
 *   required
 *   error={errors.email?.message}
 * >
 *   <Input name="email" placeholder="exemplo@email.com" />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  error,
  helpText,
  required = false,
  disabled = false,
  children,
  className = '',
}) => {
  // Gera um ID automático se não for fornecido
  const fieldId = id || `field-${name}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={fieldId} 
        className={`block text-sm font-medium ${
          disabled ? 'text-gray-400' : 'text-gray-700'
        } mb-1`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Clona o elemento filho para passar o ID e outras props comuns */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            id: fieldId,
            name,
            disabled,
            'aria-invalid': !!error,
            'aria-describedby': error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined,
          });
        }
        return child;
      })}
      
      {helpText && !error && (
        <p id={`${fieldId}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={`${fieldId}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField; 