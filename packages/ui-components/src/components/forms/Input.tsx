import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
   * Ícone à esquerda do campo
   */
  leftIcon?: React.ReactNode;
  
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
 * Componente de entrada de texto padronizado
 * 
 * @example
 * ```tsx
 * <Input name="email" placeholder="exemplo@email.com" />
 * <Input name="password" type="password" placeholder="Sua senha" />
 * <Input name="search" leftIcon={<SearchIcon />} placeholder="Pesquisar..." />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      hasError = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Classes base para todos os inputs
    const baseClasses = 'w-full rounded-md focus:outline-none focus:ring-2 transition-colors';
    
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
    
    // Se tiver ícones, adiciona padding extra
    const withIconsClasses = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : '',
    };
    
    const inputClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${disabledClasses}
      ${withIconsClasses.left}
      ${withIconsClasses.right}
      ${className}
    `;
    
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 