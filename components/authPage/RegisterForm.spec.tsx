import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegisterForm from '../authPage/RegisterForm';
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

describe('RegisterForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ message: 'Registered successfully' }) });
  });

  it('renders all required form fields and sign-in link', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/^User Name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Address$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('shows validation when required inputs are blank', async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getAllByText(/password is required/i)).toHaveLength(2);
  });

  it('submits valid data and redirects to dashboard', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/^User Name$/i), { target: { name: 'username', value: 'John' } });
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Age$/i), { target: { name: 'age', value: '30' } });
    fireEvent.change(screen.getByLabelText(/^Address$/i), { target: { name: 'address', value: 'Delhi' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { name: 'password', value: '123456' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), { target: { name: 'confirmPassword', value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    expect(toast.success).toHaveBeenCalledWith('Registered successfully');
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows a toast when registration fails', async () => {
    mockDispatch.mockReturnValue({ unwrap: jest.fn().mockRejectedValue(new Error('Registration failed')) });
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/^User Name$/i), { target: { name: 'username', value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { name: 'email', value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Age$/i), { target: { name: 'age', value: '25' } });
    fireEvent.change(screen.getByLabelText(/^Address$/i), { target: { name: 'address', value: 'Mumbai' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { name: 'password', value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), { target: { name: 'confirmPassword', value: 'abcdef' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unable to create your account');
    });
  });
});
