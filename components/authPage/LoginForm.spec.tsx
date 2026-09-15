import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';

const mockDispatch = jest.fn();
const mockReplace = jest.fn();
let mockAuthState = { loading: false };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: jest.fn(),
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockAuthState,
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
    mockAuthState = { loading: false };
  });

  it('shows validation errors when fields are empty', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid email and short password', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'not-an-email' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: '123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /signin/i }).closest('form')!);

    expect(await screen.findByText('Email is not valid')).toBeInTheDocument();
    expect(screen.getByText('Password should be more then 6 characters long')).toBeInTheDocument();
  });

  it('clears field errors when values change', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  it('renders the loading button text', () => {
    mockAuthState = { loading: true };

    render(<LoginForm />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
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

  it('shows a toast when login fails with a string error', async () => {
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue('Bad credentials'),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Bad credentials'));
  });

  it('shows a fallback toast when login fails with a non-string error', async () => {
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('Nope')),
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /signin/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Unable to sign in'));
  });
});
