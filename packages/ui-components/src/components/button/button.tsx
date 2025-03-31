import * as React from "react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  /**
   * URL para navegação (converte o botão em um link <a>)
   */
  href?: string;
  /**
   * Abrir em nova aba (apenas quando href está definido)
   */
  openInNewTab?: boolean;
  /**
   * Componente personalizado para renderizar links 
   * (como Link do react-router-dom ou Next.js)
   */
  LinkComponent?: React.ComponentType<any>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false,
    href,
    openInNewTab,
    LinkComponent,
    ...props 
  }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
      
      // Variantes
      variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
      variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      variant === 'outline' && "border border-input hover:bg-accent hover:text-accent-foreground",
      variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
      variant === 'link' && "underline-offset-4 hover:underline text-primary",
      
      // Tamanhos
      size === 'default' && "h-10 py-2 px-4",
      size === 'sm' && "h-9 px-3 rounded-md text-sm",
      size === 'lg' && "h-11 px-8 rounded-md text-lg",
      size === 'icon' && "h-10 w-10",
      
      className
    );

    // Se href está definido, renderizar como link
    if (href) {
      // Se um componente Link personalizado foi fornecido
      if (LinkComponent) {
        return (
          <LinkComponent
            ref={ref as any}
            to={href} // para react-router
            href={href} // para next.js
            className={buttonClasses}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            {...props}
          />
        );
      }
      
      // Renderizar como link HTML padrão
      return (
        <a
          className={buttonClasses}
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          {...props as any}
        />
      );
    }

    // Renderizar como botão padrão
    return (
      <button
        className={buttonClasses}
        ref={ref}
        type={props.type || 'button'} // definir type="button" como padrão
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 