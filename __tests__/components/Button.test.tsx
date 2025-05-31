// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../../app/_components/ui/button'; // Mantendo sua importação

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<Button>Styled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /Styled Button/i });
    expect(buttonElement).toHaveClass('bg-primary');
  });

  // --- Testes para Variantes ---
  describe('Variants', () => {
    it('applies destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>);
      const buttonElement = screen.getByRole('button', { name: /Delete/i });
      // A variante 'destructive' geralmente tem 'bg-destructive'
      expect(buttonElement).toHaveClass('bg-destructive');
    });

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      const buttonElement = screen.getByRole('button', { name: /Outline/i });
      // A variante 'outline' geralmente tem 'border' e 'border-input'
      expect(buttonElement).toHaveClass('border');
      expect(buttonElement).toHaveClass('border-input');
    });

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const buttonElement = screen.getByRole('button', { name: /Secondary/i });
      // A variante 'secondary' geralmente tem 'bg-secondary'
      expect(buttonElement).toHaveClass('bg-secondary');
    });

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const buttonElement = screen.getByRole('button', { name: /Ghost/i });
      // A variante 'ghost' não deve ter as classes de fundo das outras variantes
      expect(buttonElement).not.toHaveClass('bg-primary');
      expect(buttonElement).not.toHaveClass('bg-destructive');
      // Ghost é mais sobre hover/focus, mas podemos verificar a ausência de fundos sólidos.
      // Pode ter classes como 'hover:bg-accent', mas toHaveClass não testa estados de hover.
    });

    it('applies link variant styles', () => {
      render(<Button variant="link">Link</Button>);
      const buttonElement = screen.getByRole('button', { name: /Link/i });
      // A variante 'link' geralmente tem 'text-primary' e 'underline-offset-4'
      expect(buttonElement).toHaveClass('text-primary');
      expect(buttonElement).toHaveClass('underline-offset-4'); // Ou apenas verificar que é um link e não tem classes de botão tradicionais
    });
  });

  // --- Testes para Tamanhos ---
  describe('Sizes', () => {
    it('applies sm size styles', () => {
      render(<Button size="sm">Small</Button>);
      const buttonElement = screen.getByRole('button', { name: /Small/i });
      // O tamanho 'sm' geralmente tem 'h-9' e 'px-3'
      expect(buttonElement).toHaveClass('h-9');
      expect(buttonElement).toHaveClass('px-3');
    });

    it('applies lg size styles', () => {
      render(<Button size="lg">Large</Button>);
      const buttonElement = screen.getByRole('button', { name: /Large/i });
      // O tamanho 'lg' geralmente tem 'h-11' e 'px-8'
      expect(buttonElement).toHaveClass('h-11');
      expect(buttonElement).toHaveClass('px-8');
    });

    it('applies icon size styles', () => {
      // Para 'icon', o conteúdo geralmente é um ícone, não texto.
      render(<Button size="icon" aria-label="Icon Button"><span>Icon</span></Button>);
      const buttonElement = screen.getByRole('button', { name: /Icon Button/i });
      // O tamanho 'icon' geralmente tem 'h-10' e 'w-10'
      expect(buttonElement).toHaveClass('h-10');
      expect(buttonElement).toHaveClass('w-10');
    });
  });

 // --- Teste para Estado Desabilitado ---
  it('applies disabled styles and attribute', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button', { name: /Disabled/i });
    // Botões desabilitados geralmente têm 'disabled:opacity-50' e 'disabled:pointer-events-none' com Tailwind
    expect(buttonElement).toHaveClass('disabled:opacity-50'); // <--- CORREÇÃO
    expect(buttonElement).toHaveClass('disabled:pointer-events-none'); // <--- CORREÇÃO
    expect(buttonElement).toBeDisabled();
  });

  // --- Teste para a prop asChild ---
  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/">Link as Button</a>
      </Button>
    );
    // Verifica se o elemento é um link (<a>) em vez de um botão (<button>)
    const linkElement = screen.getByRole('link', { name: /Link as Button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A'); // Confirma que é uma tag <a>

    // Verifica se as classes de estilo do botão padrão (ou a variante/tamanho especificado) são aplicadas ao filho
    expect(linkElement).toHaveClass('bg-primary'); // Exemplo para classes padrão
    expect(linkElement).toHaveClass('inline-flex'); // Uma classe base comum de buttonVariants
  });

  // Adicione mais testes para diferentes props, interações, etc.
});