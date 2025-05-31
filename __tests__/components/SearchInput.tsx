// __tests__/components/Search.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Importa o componente default corretamente
import Search from '../../app/_components/search';// Ajuste o caminho se necessário

// Mock para o next/navigation (useRouter)
const mockPush = jest.fn(); // Criamos uma função mock para router.push

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush, // Usamos a função mockada aqui
    // Adicione outros métodos/propriedades do router se o seu componente os usar
  }),
  // Mock usePathname ou useSearchParams se o seu componente Search os utilizar
  // usePathname: jest.fn(() => '/'),
  // useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('Search Component', () => {
  beforeEach(() => {
    // Limpa o mock de router.push antes de cada teste
    mockPush.mockClear();
    // Se você mockar outras funções do router, limpe-as aqui também
  });

  it('renders correctly with the placeholder and search button', () => {
    render(<Search />);
    
    expect(screen.getByPlaceholderText('Buscar restaurantes')).toBeInTheDocument();
    // O botão agora é um ícone, então podemos procurá-lo pelo tipo ou por um aria-label se tivesse
    // Vamos procurar pelo role 'button' e garantir que existe um.
    // Se o <SearchIcon /> tiver um title ou se o botão tiver um aria-label, seria mais específico.
    expect(screen.getByRole('button')).toBeInTheDocument(); // O botão de submit
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument(); // Verifica se o ícone está dentro do botão
  });

  it('does not call router.push if search input is empty and form is submitted', () => {
    render(<Search />);
    const formElement = screen.getByRole('form', { name: /Formulário de busca de restaurantes/i });
                                                // (Poderia adicionar aria-label="search-form" ao <form> no componente para ser mais específico)

    fireEvent.submit(formElement);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls router.push with the correct query when form is submitted with text', async () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText('Buscar restaurantes');
    const formElement = screen.getByRole('form');

    await userEvent.type(inputElement, 'pizza');
    expect(inputElement).toHaveValue('pizza'); // Para confirmar que o estado do input (controlado pelo React) mudou

    fireEvent.submit(formElement);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/restaurants?search=pizza');
  });

  it('updates input value on change', async () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText('Buscar restaurantes') as HTMLInputElement; // Type assertion
    
    await userEvent.type(inputElement, 'sushi');
    expect(inputElement.value).toBe('sushi');
  });

  it('does not call router.push if search input is typed then cleared and form is submitted', async () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText('Buscar restaurantes');
    const formElement = screen.getByRole('form');

    await userEvent.type(inputElement, 'burguer');
    expect(inputElement).toHaveValue('burguer');

    await userEvent.clear(inputElement);
    expect(inputElement).toHaveValue('');

    fireEvent.submit(formElement);
    expect(mockPush).not.toHaveBeenCalled();
  });
});