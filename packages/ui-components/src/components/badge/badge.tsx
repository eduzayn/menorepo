import * as React from "react";
import { cn } from "../../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    // Variantes básicas
    | 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'success' | 'danger' | 'warning'
    // Status de comunicação
    | 'aberto' | 'fechado' | 'pendente' | 'aprovado' | 'rejeitado' | 'em_andamento' | 'arquivado'
    // Tipo de mensagem
    | 'texto' | 'template' | 'media' | 'imagem' | 'arquivo' | 'video' | 'audio' | 'localizacao'
    // Status de matrícula
    | 'aprovada' | 'negada' | 'expirada' | 'ativa' | 'cancelada' | 'trancada' | 'concluida' | 'em_processo' | 'inadimplente' | 'reativada'
    // Status de pagamento
    | 'pending' | 'completed' | 'failed' | 'processing' | 'paid' | 'refunded'
    // Método de pagamento
    | 'cartao' | 'boleto' | 'pix' | 'credit_card' | 'debit_card' | 'cash'
    // Papel do usuário
    | 'aluno' | 'professor' | 'admin'
    // Provedor de autenticação
    | 'email' | 'google' | 'facebook' | 'github';
  size?: 'sm' | 'md' | 'lg';
}

function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        
        // Variantes básicas
        variant === "default" && "bg-neutral-100 text-neutral-800 border-neutral-200",
        variant === "primary" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "secondary" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "destructive" && "bg-destructive border-transparent text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && "text-foreground border-gray-300",
        variant === "success" && "bg-green-100 text-green-800 border-green-200",
        variant === "danger" && "bg-red-100 text-red-800 border-red-200",
        variant === "warning" && "bg-yellow-100 text-yellow-800 border-yellow-200",
        
        // Status de comunicação
        variant === "aberto" && "bg-green-100 text-green-800 border-green-200",
        variant === "fechado" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "pendente" && "bg-yellow-100 text-yellow-800 border-yellow-200",
        variant === "aprovado" && "bg-green-100 text-green-800 border-green-200",
        variant === "rejeitado" && "bg-red-100 text-red-800 border-red-200",
        variant === "em_andamento" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "arquivado" && "bg-gray-100 text-gray-800 border-gray-200",
        
        // Tipo de mensagem
        variant === "texto" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "template" && "bg-purple-100 text-purple-800 border-purple-200",
        variant === "media" && "bg-indigo-100 text-indigo-800 border-indigo-200",
        variant === "imagem" && "bg-sky-100 text-sky-800 border-sky-200",
        variant === "arquivo" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "video" && "bg-rose-100 text-rose-800 border-rose-200",
        variant === "audio" && "bg-amber-100 text-amber-800 border-amber-200",
        variant === "localizacao" && "bg-emerald-100 text-emerald-800 border-emerald-200",
        
        // Status de matrícula
        variant === "ativa" && "bg-green-100 text-green-800 border-green-200",
        variant === "cancelada" && "bg-red-100 text-red-800 border-red-200",
        variant === "trancada" && "bg-amber-100 text-amber-800 border-amber-200",
        variant === "concluida" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "em_processo" && "bg-yellow-100 text-yellow-800 border-yellow-200",
        variant === "inadimplente" && "bg-red-100 text-red-800 border-red-200",
        variant === "reativada" && "bg-emerald-100 text-emerald-800 border-emerald-200",
        variant === "expirada" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "negada" && "bg-red-100 text-red-800 border-red-200",
        variant === "aprovada" && "bg-green-100 text-green-800 border-green-200",
        
        // Status de pagamento
        variant === "pending" && "bg-yellow-100 text-yellow-800 border-yellow-200",
        variant === "processing" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "completed" && "bg-green-100 text-green-800 border-green-200",
        variant === "paid" && "bg-green-100 text-green-800 border-green-200",
        variant === "failed" && "bg-red-100 text-red-800 border-red-200",
        variant === "refunded" && "bg-purple-100 text-purple-800 border-purple-200",
        
        // Método de pagamento
        variant === "cartao" && "bg-indigo-100 text-indigo-800 border-indigo-200",
        variant === "credit_card" && "bg-indigo-100 text-indigo-800 border-indigo-200",
        variant === "debit_card" && "bg-sky-100 text-sky-800 border-sky-200",
        variant === "boleto" && "bg-orange-100 text-orange-800 border-orange-200",
        variant === "pix" && "bg-emerald-100 text-emerald-800 border-emerald-200",
        variant === "cash" && "bg-green-100 text-green-800 border-green-200",
        
        // Papel do usuário
        variant === "aluno" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "professor" && "bg-purple-100 text-purple-800 border-purple-200",
        variant === "admin" && "bg-gray-100 text-gray-800 border-gray-200",
        
        // Provedor de autenticação
        variant === "email" && "bg-gray-100 text-gray-800 border-gray-200",
        variant === "google" && "bg-red-100 text-red-800 border-red-200",
        variant === "facebook" && "bg-blue-100 text-blue-800 border-blue-200",
        variant === "github" && "bg-gray-800 text-white border-gray-700",
        
        // Variantes de tamanho
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-xs px-2.5 py-0.5",
        size === "lg" && "text-sm px-3 py-1",
        className
      )}
      {...props}
    />
  );
}

export { Badge }; 