import { describe, it, expect } from 'vitest';
import { render, screen } from '../setupTests';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../components/card';

describe('Card Components', () => {
  // Testes para o componente Card principal
  describe('Card', () => {
    it('renderiza o Card corretamente', () => {
      render(<Card>Conteúdo do card</Card>);
      expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
    });

    it('aplica classes padrão', () => {
      render(<Card data-testid="card-test">Conteúdo</Card>);
      const cardElement = screen.getByTestId('card-test');
      expect(cardElement).toHaveClass('rounded-lg');
      expect(cardElement).toHaveClass('border');
      expect(cardElement).toHaveClass('bg-card');
    });

    it('aceita classes personalizadas', () => {
      render(<Card className="test-custom-class" data-testid="card-test">Conteúdo</Card>);
      const cardElement = screen.getByTestId('card-test');
      expect(cardElement).toHaveClass('test-custom-class');
    });
  });

  // Testes para CardHeader
  describe('CardHeader', () => {
    it('renderiza com classes padrão', () => {
      render(<CardHeader data-testid="header-test">Cabeçalho</CardHeader>);
      const headerElement = screen.getByTestId('header-test');
      expect(headerElement).toHaveClass('flex');
      expect(headerElement).toHaveClass('flex-col');
      expect(headerElement).toHaveClass('p-6');
    });
  });

  // Testes para CardTitle
  describe('CardTitle', () => {
    it('renderiza como um elemento h3', () => {
      render(<CardTitle>Título do Card</CardTitle>);
      const titleElement = screen.getByText('Título do Card');
      expect(titleElement.tagName).toBe('H3');
    });

    it('aplica classes de estilo corretas', () => {
      render(<CardTitle data-testid="title-test">Título</CardTitle>);
      const titleElement = screen.getByTestId('title-test');
      expect(titleElement).toHaveClass('text-lg');
      expect(titleElement).toHaveClass('font-semibold');
    });
  });

  // Testes para CardDescription
  describe('CardDescription', () => {
    it('renderiza como um elemento p', () => {
      render(<CardDescription>Descrição do card</CardDescription>);
      const descElement = screen.getByText('Descrição do card');
      expect(descElement.tagName).toBe('P');
    });

    it('aplica classes de estilo corretas', () => {
      render(<CardDescription data-testid="desc-test">Descrição</CardDescription>);
      const descElement = screen.getByTestId('desc-test');
      expect(descElement).toHaveClass('text-sm');
      expect(descElement).toHaveClass('text-muted-foreground');
    });
  });

  // Testes para CardContent
  describe('CardContent', () => {
    it('renderiza com padding adequado', () => {
      render(<CardContent data-testid="content-test">Conteúdo</CardContent>);
      const contentElement = screen.getByTestId('content-test');
      expect(contentElement).toHaveClass('p-6');
      expect(contentElement).toHaveClass('pt-0');
    });
  });

  // Testes para CardFooter
  describe('CardFooter', () => {
    it('renderiza com alinhamento de itens', () => {
      render(<CardFooter data-testid="footer-test">Rodapé</CardFooter>);
      const footerElement = screen.getByTestId('footer-test');
      expect(footerElement).toHaveClass('flex');
      expect(footerElement).toHaveClass('items-center');
    });
  });

  // Teste de integração dos componentes
  it('funciona corretamente quando todos os componentes são combinados', () => {
    render(
      <Card data-testid="card-complete">
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
          <CardDescription>Descrição do card</CardDescription>
        </CardHeader>
        <CardContent>Este é o conteúdo principal do card</CardContent>
        <CardFooter>Rodapé do card</CardFooter>
      </Card>
    );

    expect(screen.getByText('Título do Card')).toBeInTheDocument();
    expect(screen.getByText('Descrição do card')).toBeInTheDocument();
    expect(screen.getByText('Este é o conteúdo principal do card')).toBeInTheDocument();
    expect(screen.getByText('Rodapé do card')).toBeInTheDocument();
    
    const cardElement = screen.getByTestId('card-complete');
    expect(cardElement).toBeInTheDocument();
  });
}); 