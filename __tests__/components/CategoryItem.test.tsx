// __tests__/components/CategoryItem.test.tsx
import { render, screen } from '@testing-library/react';
import  CategoryItem  from '../../app/_components/category-item'; // Ajuste o caminho
import '@testing-library/jest-dom'; // Para matchers como toBeInTheDocument

// Mock do Next.js Link se não tiver mock global de next/navigation
// Ou se o mock global não cobrir <Link> diretamente para atributos como href
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});
// Mock do Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
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
    const image = screen.getByAltText('Pizzas');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/pizzas.png');
  });

  it('renders a link with the correct href', () => {
    render(<CategoryItem category={mockCategory} />);
    
    // O Link foi mockado para uma tag <a>, então podemos procurar por role 'link'
    const linkElement = screen.getByTestId('category-link-1'); // Usando o data-testid do exemplo
    // Ou se o Link renderizar um 'a' diretamente ou for mockado para 'a'
    // const linkElement = screen.getByRole('link', { name: /Pizzas/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/categories/1/products');
  });
});