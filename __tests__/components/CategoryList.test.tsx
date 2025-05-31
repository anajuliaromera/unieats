// __tests__/components/CategoryList.test.tsx
import { render, screen } from '@testing-library/react';
import CategoryList from '../../app/_components/category-list'; // Ajuste o caminho se necessário
import '@testing-library/jest-dom';

// 1. DEFINA mockCategoriesData PRIMEIRO
const mockCategoriesData = [
  { id: '1', name: 'Pizzas Mock', imageUrl: 'url1.png', products: [] },
  { id: '2', name: 'Lanches Mock', imageUrl: 'url2.png', products: [] },
];

// 2. Mock para o CategoryItem (corrigido para default export)
jest.mock('../../app/_components/category-item', () => ({
  __esModule: true, // Importante para mocks de módulos com default export
  default: jest.fn(({ category }) => ( // Agora mockando o 'default'
    <div data-testid={`mock-category-item-${category.id}`}>{category.name}</div>
  )),
}));

// 3. Mock para o módulo Prisma (db) - já estava correto em ordem
jest.mock('../../app/_lib/prisma', () => ({
  db: {
    category: {
      findMany: jest.fn().mockResolvedValue(mockCategoriesData),
    },
  },
}));

describe('CategoryList Component (Server Component with Prisma)', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    (require('../../app/_lib/prisma').db.category.findMany as jest.Mock).mockClear();
    // Limpa o mock do CategoryItem (corrigido para default export)
    (require('../../app/_components/category-item').default as jest.Mock).mockClear();
  });

  it('renders a list of category items fetched from "database"', async () => {
    // Como CategoryList é um async component, precisamos usar await ao renderizar
    const ResolvedCategoryList = await CategoryList();
    render(ResolvedCategoryList);
    
    expect(require('../../app/_lib/prisma').db.category.findMany).toHaveBeenCalledTimes(1);

    expect(screen.getByText('Pizzas Mock')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-item-1')).toBeInTheDocument();
    expect(screen.getByText('Lanches Mock')).toBeInTheDocument();
    expect(screen.getByTestId('mock-category-item-2')).toBeInTheDocument();
  });

  it('renders message if no categories are fetched (or an empty array is returned)', async () => {
    (require('../../app/_lib/prisma').db.category.findMany as jest.Mock).mockResolvedValueOnce([]);
    
    const ResolvedCategoryList = await CategoryList();
    render(ResolvedCategoryList);

    // O código atual do seu CategoryList (que você compartilhou) não tem tratamento explícito
    // para uma lista vazia (ele apenas faria .map em um array vazio).
    // Se você quiser testar uma mensagem específica, adicione a lógica ao componente:
    // if (categories.length === 0) return <p>Nenhuma categoria encontrada.</p>;
    // E então descomente a linha abaixo:
    // expect(screen.getByText('Nenhuma categoria encontrada.')).toBeInTheDocument();
    
    // Por enquanto, verificamos que nenhum item de categoria mockado é renderizado:
    expect(screen.queryByTestId(/mock-category-item-/)).not.toBeInTheDocument();
  });
});