// __tests__/components/ProductItem.test.tsx
import { render, screen } from '@testing-library/react';
import ProductItem from '../../app/_components/product-item';
import '@testing-library/jest-dom';
import { Prisma } from '@prisma/client';

// ... seus mocks de jest.mock(...) ...

// Dados mockados para os produtos
const mockProductBase = {
  id: 'default-id',
  name: 'Produto Padrão',
  description: 'Descrição padrão',
  imageUrl: '/default.png',
  price: new Prisma.Decimal(50.00), 
  discountPercentage: 0,
  restaurantId: 'rest-id',
  categoryId: 'cat-id',
  createdAt: new Date(), 
  updatedAt: new Date(), 
  restaurant: { name: 'Restaurante Padrão' },
};

const mockProduct = {
  ...mockProductBase,
  id: 'prod1',
  name: 'Pizza Margherita',
  imageUrl: '/images/margherita.png',
  price: new Prisma.Decimal(25.00), 
  discountPercentage: 0,
  restaurant: { name: 'Pizzaria Boa' },
};

const mockProductWithDiscount = {
  ...mockProductBase,
  id: 'prod2',
  name: 'Pizza Promocional',
  imageUrl: '/images/promo-pizza.png',
  price: new Prisma.Decimal(30.00), 
  discountPercentage: 10, 
  restaurant: { name: 'Promo Pizzas' },
};


describe('ProductItem Component', () => {
  const mockedCalculatePrice = require('../../app/_helpers/price').calculateProductTotalPrice as jest.Mock;
  const mockedFormatCurrency = require('../../app/_helpers/price').formatCurrency as jest.Mock;

  beforeEach(() => {
    mockedCalculatePrice.mockClear();
    mockedFormatCurrency.mockClear();

    mockedFormatCurrency.mockImplementation((value: number) => 
      `R$${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    );
    // A implementação do mock para calculateProductTotalPrice já usa Number(product.price),
    // o que converterá o Prisma.Decimal para número para a lógica do mock.
    mockedCalculatePrice.mockImplementation((product) => {
        const productPrice = Number(product.price); // Converte Prisma.Decimal para número
        if (!product.discountPercentage || product.discountPercentage === 0) {
          return productPrice;
        }
        const discount = productPrice * (product.discountPercentage / 100);
        return productPrice - discount;
    });
  });

  // Seus testes 'it(...)' continuam aqui...
  // As asserções como expect(mockedFormatCurrency).toHaveBeenCalledWith(25.00)
  // devem continuar funcionando, pois mockedCalculatePrice retorna um número.

  it('renders product details correctly (no discount)', () => {
    render(<ProductItem product={mockProduct} />);
    
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('Pizzaria Boa')).toBeInTheDocument();
    // ... mais asserções
    // A conversão para número acontece dentro do mock de calculateProductTotalPrice
    // e o resultado (um número) é passado para formatCurrency
    expect(mockedFormatCurrency).toHaveBeenCalledWith(25); // ou 25.00, dependendo da precisão da conversão
    expect(screen.getByText('R$25,00')).toBeInTheDocument();
  });

  it('renders discounted price and badge if discountPercentage is present', () => {
    render(<ProductItem product={mockProductWithDiscount} />);
    
    const discountedPriceValue = 27.00; // 30.00 * (1 - 10 / 100)

    // ... mais asserções
    expect(mockedFormatCurrency).toHaveBeenCalledWith(discountedPriceValue); 
    expect(mockedFormatCurrency).toHaveBeenCalledWith(30.00); 

    expect(screen.getByText('R$27,00')).toBeInTheDocument(); 
    const originalPriceElement = screen.getByText('R$30,00');
    // ...
    expect(originalPriceElement).toHaveClass('line-through');
    expect(screen.getByText(`${mockProductWithDiscount.discountPercentage}%`)).toBeInTheDocument();
  });
  
  
});