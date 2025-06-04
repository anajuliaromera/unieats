// __tests__/components/CategoryItem.test.tsx
import React from 'react'; // PASSO 1: Importar React para React.ReactNode
import { render, screen } from '@testing-library/react';
import CategoryItem from '../../app/_components/category-item'; // Ajuste o caminho se necessário
import '@testing-library/jest-dom'; // Para matchers como toBeInTheDocument

// PASSO 2: Corrigir o mock para next/link
jest.mock('next/link', () => {
  // Definir os tipos das props para o seu componente Link mockado
  type MockLinkProps = {
    children: React.ReactNode;
    href: string;
    [key: string]: any; // Para aceitar outras props que <Link> possa ter (ex: className, etc.)
  };

  // O componente mockado em si
  const MockedLinkComponent = ({ children, href, ...rest }: MockLinkProps) => {
    // No seu teste, você procura por um link com o nome "Pizzas" ou um data-testid.
    // O mock aqui retorna uma tag <a>. Se o <Link> original passasse outras props (como data-testid),
    // o "...rest" as pegaria e aplicaria na tag <a>.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={href} {...rest}>{children}</a>;
  };

  MockedLinkComponent.displayName = 'MockedLink'; // Opcional: para melhor depuração

  // Para módulos com default export (como o next/link), o factory do mock deve retornar um objeto assim:
  return {
    __esModule: true, // Indica que é um módulo ES
    default: MockedLinkComponent, // O mock para o default export
  };
});

// Mock do Next.js Image (o seu mock parece correto)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />; // Removi o spread desnecessário e adicionei jsx-a11y/alt-text se o alt não vier nas props
  },
}));

const mockCategory = {
  id: '1',
  name: 'Pizzas',
  imageUrl: '/images/pizzas.png',
};

describe('CategoryItem Component', () => {
  it('renders category name and image correctly', () => {
    render(<CategoryItem category={mockCategory} />);

    expect(screen.getByText('Pizzas')).toBeInTheDocument();
    const image = screen.getByAltText('Pizzas'); // O mock do Image precisa receber 'alt'
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/pizzas.png');
  });

  it('renders a link with the correct href', () => {
    render(<CategoryItem category={mockCategory} />);

    // O Link foi mockado para uma tag <a>.
    // Se o seu CategoryItem renderiza o nome da categoria DENTRO do Link,
    // então getByRole('link', { name: /Pizzas/i }) deve funcionar.
    // Se o CategoryItem aplica um data-testid ao componente Link,
    // certifique-se que seu mock do Link (acima) propaga essa prop (o `...rest` faz isso).
    // Exemplo: Se seu CategoryItem faz <Link data-testid={`category-link-${category.id}`} ... >
    // const linkElement = screen.getByTestId('category-link-1');
    // OU, de forma mais genérica, se o texto "Pizzas" está dentro do link:
    const linkElement = screen.getByRole('link', { name: /Pizzas/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/categories/${mockCategory.id}/products`);
  });
});