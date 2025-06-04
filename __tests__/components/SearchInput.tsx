// __tests__/components/Search.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../../app/_components/search';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush, 
  
  }),

}));

describe('Search Component', () => {
  beforeEach(() => {
 
    mockPush.mockClear();
    
  });

  it('renders correctly with the placeholder and search button', () => {
    render(<Search />);
    
    expect(screen.getByPlaceholderText('Buscar restaurantes')).toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument(); 
  });

  it('does not call router.push if search input is empty and form is submitted', () => {
    render(<Search />);
    const formElement = screen.getByRole('form', { name: /Formulário de busca de restaurantes/i });
                                                

    fireEvent.submit(formElement);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls router.push with the correct query when form is submitted with text', async () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText('Buscar restaurantes');
    const formElement = screen.getByRole('form');

    await userEvent.type(inputElement, 'pizza');
    expect(inputElement).toHaveValue('pizza');

    fireEvent.submit(formElement);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/restaurants?search=pizza');
  });

  it('updates input value on change', async () => {
    render(<Search />);
    const inputElement = screen.getByPlaceholderText('Buscar restaurantes') as HTMLInputElement;
    
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
