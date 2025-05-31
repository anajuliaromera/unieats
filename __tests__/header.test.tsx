import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@components/ui/header';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

const mockUseSession = useSession as jest.Mock;

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente quando não está logado', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header haveSearchbar={false} />);

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    expect(await screen.findByText(/faça seu login/i)).toBeInTheDocument();
  });
});
