import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Opções do select
   */
  options: SelectOption[];
  
  /**
   * Tamanho do campo
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante de estilo do campo
   */
  variant?: 'default' | 'outlined' | 'filled';
  
  /**
   * Se o campo tem erro
   */
  hasError?: boolean;
  
  /**
   * Texto para opção vazia (opcional)
   */
  placeholder?: string;
  
  /**
   * Ícone à direita do campo
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente de seleção padronizado
 * 
 * @example
 * ```tsx
 * <Select
 *   name="estado"
 *   placeholder="Selecione um estado"
 *   options={[
 *     { value: 'sp', label: 'São Paulo' },
 *     { value: 'rj', label: 'Rio de Janeiro' },
 *     { value: 'mg', label: 'Minas Gerais' }
 *   ]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      size = 'md',
      variant = 'default',
      hasError = false,
      placeholder,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Classes base para todos os selects
    const baseClasses = 'w-full rounded-md focus:outline-none focus:ring-2 transition-colors appearance-none';
    
    // Classes específicas para cada tamanho
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };
    
    // Classes para cada variante
    const variantClasses = {
      default: `border ${
        hasError 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
          : 'border-gray-300 focus:border-primary focus:ring-primary-200'
      }`,
      outlined: `border-2 ${
        hasError 
          ? 'border-red-500 focus:ring-red-200' 
          : 'border-gray-300 focus:border-primary focus:ring-primary-200'
      }`,
      filled: `bg-gray-100 border border-transparent ${
        hasError 
          ? 'focus:bg-white focus:ring-red-200' 
          : 'focus:bg-white focus:ring-primary-200'
      }`,
    };
    
    // Classes para estado disabled
    const disabledClasses = disabled 
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
      : '';
    
    const selectClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${disabledClasses}
      pr-10 ${className}
    `;
    
    return (
      <div className="relative">
        <select
          className={selectClasses}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {rightIcon || (
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

 