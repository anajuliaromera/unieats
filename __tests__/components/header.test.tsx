import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../app/_components/header';
import { useSession, signIn, signOut } from 'next-auth/react';



jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string; src?: string; priority?: boolean; [key: string]: any }) => {
    const { priority, ...imgProps } = props;
    
    return <img {...imgProps} />;
  },
}));


jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));


jest.mock('../../app/_components/search', () => ({
  __esModule: true,
  default: () => <div data-testid="search-component-mock">Search Mock</div>,
}));


jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));


jest.mock("../../app/_components/ui/avatar", () => {
  const actual = jest.requireActual("../../app/_components/ui/avatar");
  return {
    ...actual,
    AvatarImage: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      if (!props.src) { 
        return null;    
      }
     
      return <img src={props.src} alt={props.alt || ''} />;
    },
  };
});



const mockedUseSession = useSession as jest.Mock;
const mockedSignIn = signIn as jest.Mock;
const mockedSignOut = signOut as jest.Mock;



describe('Header Component', () => {
  beforeEach(() => {
    mockedUseSession.mockClear();
    mockedSignIn.mockClear();
    mockedSignOut.mockClear();
  });

  const getMenuButton = () => screen.getByRole('button', { name: /abrir menu/i });

  test('renders logo and menu button', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Header haveSearchbar={false} />);
    expect(screen.getByAltText('UniEats Logo')).toBeInTheDocument();
    expect(getMenuButton()).toBeInTheDocument();
  });

  test('renders search bar when haveSearchbar is true', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Header haveSearchbar={true} />);
    expect(screen.getByTestId('search-component-mock')).toBeInTheDocument();
  });

  test('does not render search bar when haveSearchbar is false', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<Header haveSearchbar={false} />);
    expect(screen.queryByTestId('search-component-mock')).not.toBeInTheDocument();
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    });

    test('opens sheet with login message and button', () => {
      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);
      expect(screen.getByText('Entre ou crie sua conta!')).toBeInTheDocument();
      expect(screen.getByText('Acesse seus pedidos, favoritos e aproveite o UniEats ao máximo.')).toBeInTheDocument();
      const loginButton = screen.getByRole('button', { name: /fazer login ou cadastrar/i });
      expect(loginButton).toBeInTheDocument();
    });

    test('calls signIn when login button is clicked', () => {
      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);
      const loginButton = screen.getByRole('button', { name: /fazer login ou cadastrar/i });
      fireEvent.click(loginButton);
      expect(mockedSignIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authenticated User', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://example.com/avatar.jpg',
    };
    const mockUserNoImage = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      
    };

    beforeEach(() => {
     
      mockedUseSession.mockReturnValue({ data: { user: mockUser }, status: 'authenticated' });
    });

    test('opens sheet with user info, links, and logout button', () => {
      
      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);

      const avatarImage = screen.getByAltText(`${mockUser.name}'s avatar`) as HTMLImageElement;
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage.src).toBe(mockUser.image);

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /meus pedidos/i })).toHaveAttribute('href', '/my-orders');
      expect(screen.getByRole('link', { name: /restaurantes favoritos/i })).toHaveAttribute('href', '/favorites-restaurants');
      expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument();
    });

    test('displays avatar fallback when user has no image', () => {
      
      mockedUseSession.mockReturnValue({ data: { user: mockUserNoImage }, status: 'authenticated' });
      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);

      expect(screen.getByText(mockUserNoImage.name)).toBeInTheDocument();
      expect(screen.getByText(mockUserNoImage.email)).toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument(); 
      
      expect(screen.queryByAltText(`${mockUserNoImage.name}'s avatar`)).not.toBeInTheDocument();
    });

    test('calls signOut when logout button is clicked', () => {
     
      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);
      const logoutButton = screen.getByRole('button', { name: /sair da conta/i });
      fireEvent.click(logoutButton);
      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });

    test('navigation links in sheet work correctly', () => {

      render(<Header haveSearchbar={false} />);
      const menuButton = getMenuButton();
      fireEvent.click(menuButton);
      const inicioLink = screen.getByRole('link', { name: /início/i });
      expect(inicioLink).toHaveAttribute('href', '/');
      const pedidosLink = screen.getByRole('link', { name: /meus pedidos/i });
      expect(pedidosLink).toHaveAttribute('href', '/my-orders');
      const favoritosLink = screen.getByRole('link', { name: /restaurantes favoritos/i });
      expect(favoritosLink).toHaveAttribute('href', '/favorites-restaurants');
    });
  });
});
