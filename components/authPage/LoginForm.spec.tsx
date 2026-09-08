import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';

const mockDispatch = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: jest.fn(),
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({ loading: false }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('submits valid credentials and redirects to dashboard', async () => {
    mockDispatch.mockReturnValue({
      unwrap: async () => ({ message: 'Login successful' }),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('Login successful');
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
