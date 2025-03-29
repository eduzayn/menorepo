import * as React from "react";
import { cn } from "../../utils";

/**
 * Componente Card básico para exibição de conteúdo agrupado
 * Suporta header, content, footer e outros elementos aninhados
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Título do Card</CardTitle>
 *     <CardDescription>Descrição opcional do Card</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Conteúdo principal do Card
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Ação</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Componente para o cabeçalho do Card
 * Geralmente contém CardTitle e CardDescription
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  CardHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Componente para o título do Card
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  CardTitleProps
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Componente para a descrição do Card
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Componente para o conteúdo principal do Card
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<
  HTMLDivElement,
  CardContentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Componente para o rodapé do Card
 * Geralmente contém botões ou ações
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<
  HTMLDivElement,
  CardFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 