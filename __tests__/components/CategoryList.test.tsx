// __tests__/components/CategoryList.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import CategoryList from "../../app/_components/category-list";
import "@testing-library/jest-dom";


const mockCategoriesData = [
  { id: "1", name: "Pizzas Mock", imageUrl: "url1.png", products: [] },
  { id: "2", name: "Lanches Mock", imageUrl: "url2.png", products: [] },
];




jest.mock("../../app/_components/category-item", () => ({
  __esModule: true,
  // Definimos jest.fn() diretamente aqui para o default export
  default: jest.fn(({ category }) => (
    <div data-testid={`mock-category-item-${category.id}`}>{category.name}</div>
  )),
}));

// Mock para o módulo Prisma (db)
jest.mock("../../app/_lib/prisma", () => ({
  db: {
    category: {
      findMany: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockCategoriesData)),
    },
  },
}));

// --- Test Suite ---
describe("CategoryList Component (Server Component with Prisma)", () => {
  // Referências aos mocks para uso nos testes
  // Importante: require() é usado aqui para garantir que pegamos a versão mockada pelo Jest.
  const MockedCategoryItem = require("../../app/_components/category-item")
    .default as jest.Mock;
  const { db } = require("../../app/_lib/prisma");
  const mockedPrismaFindManyFromMock = db.category.findMany as jest.Mock;

  beforeEach(() => {
    mockedPrismaFindManyFromMock.mockClear();
    MockedCategoryItem.mockClear(); // Usa a referência correta
  });

  it('renders a list of category items fetched from "database"', async () => {
    // Garante que o mock do Prisma use o mockCategoriesData padrão
    mockedPrismaFindManyFromMock.mockImplementation(() =>
      Promise.resolve(mockCategoriesData),
    );

    const ResolvedCategoryList = await CategoryList();
    render(ResolvedCategoryList);

    expect(mockedPrismaFindManyFromMock).toHaveBeenCalledTimes(1);

    // Verifica se os itens (mockados) são renderizados com os dados corretos
    expect(screen.getByText("Pizzas Mock")).toBeInTheDocument();
    expect(screen.getByTestId("mock-category-item-1")).toBeInTheDocument();
    expect(screen.getByText("Lanches Mock")).toBeInTheDocument();
    expect(screen.getByTestId("mock-category-item-2")).toBeInTheDocument();

    // Opcional: verificar se o CategoryItem mockado foi chamado com as props corretas
    expect(MockedCategoryItem).toHaveBeenCalledWith(
      expect.objectContaining({ category: mockCategoriesData[0] }),
      expect.anything(), 
    );
    expect(MockedCategoryItem).toHaveBeenCalledWith(
      expect.objectContaining({ category: mockCategoriesData[1] }),
      expect.anything(),
    );
  });

  it("renders no category items if an empty array is returned from database", async () => {
    mockedPrismaFindManyFromMock.mockImplementationOnce(() =>
      Promise.resolve([]),
    );

    const ResolvedCategoryList = await CategoryList();
    render(ResolvedCategoryList);

    expect(mockedPrismaFindManyFromMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId(/mock-category-item-/)).not.toBeInTheDocument();
  });
});
