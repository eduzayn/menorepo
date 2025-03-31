import React from 'react';

// Mock para o componente Card
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-md shadow ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Mock para o componente Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    link: 'bg-transparent text-blue-600 hover:underline p-0 h-auto'
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
};

// Mock para o componente Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  className = '',
  options = [],
  placeholder,
  label,
  error,
  children,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {placeholder && !props.value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children || (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Mock para o componente Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Mock para o componente Label
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <label
      className={`text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Mock para o componente Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className = '',
  label,
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Mock para o componente Container
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`container mx-auto px-4 py-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Mock para PageHeader
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  subtitle?: string;
  backUrl?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  backUrl,
  actions,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-6 ${className}`}
      {...props}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        {backUrl && (
          <a href={backUrl} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            &larr; Voltar
          </a>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

// Mock para Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };
  
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Mock para Dialog componentes
export const Dialog: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    {children}
  </div>
);

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className = '',
  children,
  ...props
}) => (
  <div 
    className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className = '',
  children,
  ...props
}) => (
  <div 
    className={`mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className = '',
  children,
  ...props
}) => (
  <h2 
    className={`text-lg font-medium ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const NotificationCard: React.FC<{
  title: string;
  content: string;
  date: string;
  unread?: boolean;
  onClose: () => void;
  className?: string;
}> = ({
  title,
  content,
  date,
  unread = false,
  onClose,
  className = '',
}) => (
  <div className={`p-4 rounded-lg border ${unread ? 'bg-white border-l-4 border-l-blue-500' : 'bg-gray-50'} ${className}`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{content}</p>
        <p className="text-xs text-gray-400 mt-2">{date}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
); 